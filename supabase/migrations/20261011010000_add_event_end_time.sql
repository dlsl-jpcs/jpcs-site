-- Optional end of an event, so multi-day events can show their full duration.
-- NULL keeps the previous behaviour (a single start date and time).
ALTER TABLE public.upcoming_events
    ADD COLUMN ends_at TIMESTAMPTZ,
    ADD CONSTRAINT upcoming_events_ends_after_start CHECK (ends_at IS NULL OR ends_at >= starts_at);
