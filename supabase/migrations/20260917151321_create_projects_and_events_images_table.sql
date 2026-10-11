-- Images of a project. The image with the lowest display_order is the cover.
CREATE TABLE public.projects_and_events_images (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id    INTEGER     NOT NULL REFERENCES public.projects_and_events (id) ON DELETE CASCADE,
    image_url     TEXT        NOT NULL CHECK (char_length(image_url) BETWEEN 1 AND 2048),
    alt_text      TEXT        NOT NULL DEFAULT '' CHECK (char_length(alt_text) <= 255),
    display_order INTEGER     NOT NULL DEFAULT 1,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (project_id, display_order)
);

CREATE INDEX projects_and_events_images_project_idx
    ON public.projects_and_events_images (project_id, display_order);
