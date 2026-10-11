-- Contact form submissions (components/Contact.tsx -> /api/contact).
-- is_read backs the admin inbox toggle. ip_hash is a salted hash used only for rate limiting.
CREATE TABLE public.contact_form (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fullname   TEXT        NOT NULL CHECK (char_length(btrim(fullname)) BETWEEN 1 AND 255),
    email      TEXT        NOT NULL CHECK (char_length(email) <= 255 AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
    subject    TEXT        NOT NULL CHECK (char_length(btrim(subject)) BETWEEN 1 AND 255),
    message    TEXT        NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 5000),
    is_read    BOOLEAN     NOT NULL DEFAULT false,
    ip_hash    TEXT        CHECK (ip_hash IS NULL OR char_length(ip_hash) <= 128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX contact_form_created_at_idx ON public.contact_form (created_at DESC);
CREATE INDEX contact_form_email_created_idx ON public.contact_form (lower(email), created_at DESC);
CREATE INDEX contact_form_ip_created_idx ON public.contact_form (ip_hash, created_at DESC) WHERE ip_hash IS NOT NULL;
