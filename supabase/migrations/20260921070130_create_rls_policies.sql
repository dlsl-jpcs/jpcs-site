-- Helper functions, triggers, grants and Row Level Security.
-- Model: the public can read site content and submit the contact form; only users whose
-- profiles.role = 'admin' can write content or read/manage messages.

-- ---------------------------------------------------------------- helpers
CREATE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    );
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

CREATE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER upcoming_events_set_updated_at
    BEFORE UPDATE ON public.upcoming_events
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER projects_and_events_set_updated_at
    BEFORE UPDATE ON public.projects_and_events
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- New auth users always get a plain 'user' profile; promotion to admin is manual.
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role) VALUES (NEW.id, NEW.email, 'user');
    RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Contact form abuse limits (database-level, so they also apply to direct API calls).
CREATE FUNCTION public.contact_form_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF (SELECT count(*) FROM public.contact_form
        WHERE lower(email) = lower(NEW.email) AND created_at > now() - interval '1 hour') >= 3 THEN
        RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
    END IF;

    IF NEW.ip_hash IS NOT NULL AND
       (SELECT count(*) FROM public.contact_form
        WHERE ip_hash = NEW.ip_hash AND created_at > now() - interval '1 hour') >= 5 THEN
        RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.contact_form_rate_limit() FROM PUBLIC;

CREATE TRIGGER contact_form_rate_limit_trg
    BEFORE INSERT ON public.contact_form
    FOR EACH ROW EXECUTE FUNCTION public.contact_form_rate_limit();

-- ---------------------------------------------------------------- privileges
-- Start from nothing, then grant only what each role needs. RLS below narrows it further.
REVOKE ALL ON public.upcoming_events, public.projects_and_events, public.projects_and_events_images,
              public.gallery_main, public.gallery, public.contact_form, public.profiles
    FROM anon, authenticated;

GRANT SELECT ON public.upcoming_events, public.projects_and_events, public.projects_and_events_images,
                public.gallery_main, public.gallery TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.upcoming_events, public.projects_and_events,
                public.projects_and_events_images, public.gallery_main, public.gallery TO authenticated;

-- Public can only submit the user-typed columns (is_read / created_at keep their defaults).
GRANT INSERT (fullname, email, subject, message, ip_hash) ON public.contact_form TO anon, authenticated;
-- Admins read everything except ip_hash and may flip is_read / delete.
GRANT SELECT (id, fullname, email, subject, message, is_read, created_at) ON public.contact_form TO authenticated;
GRANT UPDATE (is_read) ON public.contact_form TO authenticated;
GRANT DELETE ON public.contact_form TO authenticated;

GRANT SELECT ON public.profiles TO authenticated;

-- ---------------------------------------------------------------- RLS
ALTER TABLE public.upcoming_events            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects_and_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects_and_events_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_main               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_form               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles                   ENABLE ROW LEVEL SECURITY;

-- Public content: anyone reads, admins write.
DO $$
DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['upcoming_events', 'projects_and_events', 'projects_and_events_images',
                             'gallery_main', 'gallery']
    LOOP
        EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)',
                       t || '_public_read', t);
        EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_admin())',
                       t || '_admin_insert', t);
        EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
                       t || '_admin_update', t);
        EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (public.is_admin())',
                       t || '_admin_delete', t);
    END LOOP;
END $$;

-- Contact form: anyone may submit (never as "already read"); only admins read/update/delete.
CREATE POLICY contact_form_public_insert ON public.contact_form
    FOR INSERT TO anon, authenticated WITH CHECK (is_read = false);
CREATE POLICY contact_form_admin_select ON public.contact_form
    FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY contact_form_admin_update ON public.contact_form
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY contact_form_admin_delete ON public.contact_form
    FOR DELETE TO authenticated USING (public.is_admin());

-- Profiles: read your own (or all, as admin). No client-side writes: roles can't be self-assigned.
CREATE POLICY profiles_select_own_or_admin ON public.profiles
    FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin());
