-- Chatbot (components/chat/* -> /api/chat).
-- chat_faq: admin-written answers for things the site pages don't cover; also the no-LLM fallback.
-- chat_questions: what visitors asked, so admins can spot gaps. ip_hash is only for rate limiting.
CREATE TABLE public.chat_faq (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    question      TEXT        NOT NULL CHECK (char_length(btrim(question)) BETWEEN 1 AND 300),
    answer        TEXT        NOT NULL CHECK (char_length(btrim(answer)) BETWEEN 1 AND 2000),
    keywords      TEXT        CHECK (keywords IS NULL OR char_length(keywords) <= 300),
    is_active     BOOLEAN     NOT NULL DEFAULT true,
    display_order INTEGER     NOT NULL DEFAULT 0,
    search        TSVECTOR    GENERATED ALWAYS AS (
                      setweight(to_tsvector('english', question), 'A') ||
                      setweight(to_tsvector('english', coalesce(keywords, '')), 'A') ||
                      setweight(to_tsvector('english', answer), 'B')
                  ) STORED,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX chat_faq_display_order_idx ON public.chat_faq (display_order, id);
CREATE INDEX chat_faq_search_idx ON public.chat_faq USING GIN (search);

CREATE TRIGGER chat_faq_set_updated_at
    BEFORE UPDATE ON public.chat_faq
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.chat_questions (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    question   TEXT        NOT NULL CHECK (char_length(btrim(question)) BETWEEN 1 AND 500),
    source     TEXT        NOT NULL CHECK (source IN ('llm', 'search', 'none')),
    unanswered BOOLEAN     NOT NULL DEFAULT false,
    ip_hash    TEXT        CHECK (ip_hash IS NULL OR char_length(ip_hash) <= 128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX chat_questions_created_at_idx ON public.chat_questions (created_at DESC);
CREATE INDEX chat_questions_ip_created_idx ON public.chat_questions (ip_hash, created_at DESC) WHERE ip_hash IS NOT NULL;

-- Per-IP limit. /api/chat calls chat_rate_ok() before spending LLM quota; the trigger is the
-- backstop for direct API calls. Keep the two numbers in sync.
CREATE FUNCTION public.chat_rate_ok(p_ip_hash TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT p_ip_hash IS NULL OR (
        SELECT count(*) FROM public.chat_questions
         WHERE ip_hash = p_ip_hash AND created_at > now() - interval '10 minutes'
    ) < 20;
$$;
REVOKE ALL ON FUNCTION public.chat_rate_ok(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.chat_rate_ok(TEXT) TO anon, authenticated;

CREATE FUNCTION public.chat_questions_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NOT public.chat_rate_ok(NEW.ip_hash) THEN
        RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
    END IF;
    RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.chat_questions_rate_limit() FROM PUBLIC;

CREATE TRIGGER chat_questions_rate_limit_trg
    BEFORE INSERT ON public.chat_questions
    FOR EACH ROW EXECUTE FUNCTION public.chat_questions_rate_limit();

-- Fallback search: any matching word counts (OR), best rank first. Runs as the caller, so RLS
-- hides inactive entries from the public.
CREATE FUNCTION public.search_chat_faq(q TEXT)
RETURNS TABLE (id INTEGER, question TEXT, answer TEXT, rank REAL)
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
    WITH query AS (
        SELECT nullif(replace(plainto_tsquery('english', left(q, 500))::text, '&', '|'), '')::tsquery AS tsq
    )
    SELECT f.id, f.question, f.answer, ts_rank(f.search, query.tsq) AS rank
      FROM public.chat_faq f, query
     WHERE query.tsq IS NOT NULL AND f.is_active AND f.search @@ query.tsq
     ORDER BY rank DESC, f.display_order, f.id
     LIMIT 3;
$$;
REVOKE ALL ON FUNCTION public.search_chat_faq(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_chat_faq(TEXT) TO anon, authenticated;

-- Saves a whole new FAQ order in one statement (same contract as reorder_officers).
CREATE FUNCTION public.reorder_chat_faq(ids INTEGER[])
RETURNS VOID
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can reorder FAQs' USING ERRCODE = '42501';
    END IF;

    WITH wanted AS (
        SELECT DISTINCT ON (t.id) t.id, t.ord
          FROM unnest(ids) WITH ORDINALITY AS t(id, ord)
         ORDER BY t.id, t.ord
    ),
    ranked AS (
        SELECT f.id,
               row_number() OVER (ORDER BY (w.ord IS NULL), w.ord, f.display_order, f.id) AS pos
          FROM public.chat_faq f
          LEFT JOIN wanted w ON w.id = f.id
    )
    UPDATE public.chat_faq f
       SET display_order = r.pos
      FROM ranked r
     WHERE f.id = r.id AND f.display_order IS DISTINCT FROM r.pos;
END;
$$;
REVOKE ALL ON FUNCTION public.reorder_chat_faq(INTEGER[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reorder_chat_faq(INTEGER[]) TO authenticated;

-- Grants: the public reads active FAQs and may only insert questions (never read them back).
REVOKE ALL ON public.chat_faq, public.chat_questions FROM anon, authenticated;
GRANT SELECT ON public.chat_faq TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.chat_faq TO authenticated;
GRANT INSERT (question, source, unanswered, ip_hash) ON public.chat_questions TO anon, authenticated;
GRANT SELECT (id, question, source, unanswered, created_at) ON public.chat_questions TO authenticated;
GRANT DELETE ON public.chat_questions TO authenticated;

ALTER TABLE public.chat_faq       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_faq_public_read ON public.chat_faq
    FOR SELECT TO anon, authenticated USING (is_active OR public.is_admin());
CREATE POLICY chat_faq_admin_insert ON public.chat_faq
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY chat_faq_admin_update ON public.chat_faq
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY chat_faq_admin_delete ON public.chat_faq
    FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY chat_questions_public_insert ON public.chat_questions
    FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY chat_questions_admin_select ON public.chat_questions
    FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY chat_questions_admin_delete ON public.chat_questions
    FOR DELETE TO authenticated USING (public.is_admin());
