-- Homepage gallery carousel (components/Gallery.tsx).
CREATE TABLE public.gallery_main (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    image_url     TEXT        NOT NULL CHECK (char_length(image_url) BETWEEN 1 AND 2048),
    alt_text      TEXT        NOT NULL DEFAULT '' CHECK (char_length(alt_text) <= 255),
    display_order INTEGER     NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX gallery_main_order_idx ON public.gallery_main (display_order, id);
