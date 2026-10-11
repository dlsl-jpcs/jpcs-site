-- Projects & events listing (components/ProjectsEvents.tsx).
-- project_date stays free text on purpose: the admin form takes labels such as "November 2023".
CREATE TABLE public.projects_and_events (
    id                 INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_name       TEXT        NOT NULL CHECK (char_length(btrim(project_name)) BETWEEN 1 AND 255),
    project_description TEXT        NOT NULL CHECK (char_length(btrim(project_description)) BETWEEN 1 AND 5000),
    project_date       TEXT        NOT NULL CHECK (char_length(btrim(project_date)) BETWEEN 1 AND 255),
    organization_names TEXT        NOT NULL DEFAULT 'JPCS' CHECK (char_length(btrim(organization_names)) BETWEEN 1 AND 255),
    facebook_link      TEXT        CHECK (facebook_link IS NULL OR facebook_link ~* '^https?://\S+$'),
    instagram_link     TEXT        CHECK (instagram_link IS NULL OR instagram_link ~* '^https?://\S+$'),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX projects_and_events_created_at_idx ON public.projects_and_events (created_at DESC);
