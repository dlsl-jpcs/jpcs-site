-- One profile per Supabase Auth user. role = 'admin' grants dashboard/content access.
-- Roles are only ever changed from the SQL editor / service role (see RLS migration).
CREATE TABLE public.profiles (
    id         UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    email      TEXT,
    role       TEXT        NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
