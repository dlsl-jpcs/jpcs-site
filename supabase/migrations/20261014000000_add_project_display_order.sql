-- Admin-controlled order of the Projects carousel. Lower numbers show first.
-- Existing rows keep today's order (newest first); the admin dashboard reorders from there.
ALTER TABLE public.projects_and_events
    ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;

UPDATE public.projects_and_events p
   SET display_order = r.pos
  FROM (
      SELECT id, row_number() OVER (ORDER BY created_at DESC, id DESC) AS pos
        FROM public.projects_and_events
  ) r
 WHERE p.id = r.id;

CREATE INDEX projects_and_events_display_order_idx
    ON public.projects_and_events (display_order, created_at DESC);

-- Saves a whole new order in one statement, so two admins (or a double click) can't leave a
-- half-applied order. `ids` lists project ids in the wanted order; any project missing from the
-- list (e.g. added by someone else meanwhile) keeps its relative order after the listed ones.
-- Runs as the caller, so row level security still applies; the explicit check just gives a
-- clear error instead of silently updating nothing.
CREATE FUNCTION public.reorder_projects(ids INTEGER[])
RETURNS VOID
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can reorder projects' USING ERRCODE = '42501';
    END IF;

    WITH wanted AS (
        SELECT DISTINCT ON (t.id) t.id, t.ord
          FROM unnest(ids) WITH ORDINALITY AS t(id, ord)
         ORDER BY t.id, t.ord
    ),
    ranked AS (
        SELECT p.id,
               row_number() OVER (
                   ORDER BY (w.ord IS NULL), w.ord, p.display_order, p.created_at DESC, p.id DESC
               ) AS pos
          FROM public.projects_and_events p
          LEFT JOIN wanted w ON w.id = p.id
    )
    UPDATE public.projects_and_events p
       SET display_order = r.pos
      FROM ranked r
     WHERE p.id = r.id
       AND p.display_order IS DISTINCT FROM r.pos;
END;
$$;

REVOKE ALL ON FUNCTION public.reorder_projects(INTEGER[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reorder_projects(INTEGER[]) TO authenticated;
