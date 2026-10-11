-- Upcoming events shown in the hero carousel (components/events/*).
-- starts_at is a timestamptz; the app interprets/prints it in Asia/Manila (lib/site.ts).
CREATE TABLE public.upcoming_events (
    id                 INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_name         TEXT        NOT NULL CHECK (char_length(btrim(event_name)) BETWEEN 1 AND 255),
    starts_at          TIMESTAMPTZ NOT NULL,
    event_location     TEXT        CHECK (event_location IS NULL OR char_length(event_location) <= 255),
    event_description  TEXT        NOT NULL CHECK (char_length(btrim(event_description)) BETWEEN 1 AND 5000),
    registration_link  TEXT        CHECK (registration_link IS NULL OR registration_link ~* '^https?://\S+$'),
    organization_names TEXT        NOT NULL DEFAULT 'JPCS' CHECK (char_length(btrim(organization_names)) BETWEEN 1 AND 255),
    facebook_link      TEXT        CHECK (facebook_link IS NULL OR facebook_link ~* '^https?://\S+$'),
    instagram_link     TEXT        CHECK (instagram_link IS NULL OR instagram_link ~* '^https?://\S+$'),
    image_url          TEXT        CHECK (image_url IS NULL OR char_length(image_url) <= 2048),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX upcoming_events_starts_at_idx ON public.upcoming_events (starts_at);
