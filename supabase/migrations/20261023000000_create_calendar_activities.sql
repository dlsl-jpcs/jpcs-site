-- Calendar of activities (/calendar, components/calendar/*): lightweight all-day entries such as
-- exam weeks, deadlines, meetings and holidays that don't need a full event card. Full events
-- still live in upcoming_events and are merged in by /api/calendar.
-- Dates are DATE (site-local calendar days), not timestamptz, so they never shift by time zone.
CREATE TABLE public.calendar_activities (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title      TEXT        NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 150),
    kind       TEXT        NOT NULL DEFAULT 'activity'
                           CHECK (kind IN ('activity', 'deadline', 'meeting', 'exam', 'holiday')),
    starts_on  DATE        NOT NULL,
    ends_on    DATE        CHECK (ends_on IS NULL OR ends_on >= starts_on),
    note       TEXT        CHECK (note IS NULL OR char_length(note) <= 500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX calendar_activities_starts_on_idx ON public.calendar_activities (starts_on);

CREATE TRIGGER calendar_activities_set_updated_at
    BEFORE UPDATE ON public.calendar_activities
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Grants: everyone reads the calendar; only admins write it.
REVOKE ALL ON public.calendar_activities FROM anon, authenticated;
GRANT SELECT ON public.calendar_activities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.calendar_activities TO authenticated;

ALTER TABLE public.calendar_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY calendar_activities_public_read ON public.calendar_activities
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY calendar_activities_admin_insert ON public.calendar_activities
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY calendar_activities_admin_update ON public.calendar_activities
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY calendar_activities_admin_delete ON public.calendar_activities
    FOR DELETE TO authenticated USING (public.is_admin());
