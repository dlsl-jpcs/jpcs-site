-- Officers shown in "The Officers" section, editable from the admin dashboard.
-- Replaces data/officers.json. The current roster is loaded below so a hosted project
-- gets it too (seed.sql only runs locally). Photos are the files already in /public/officers.
CREATE TABLE public.officers (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name     TEXT        NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 1 AND 255),
    position      TEXT        NOT NULL CHECK (char_length(btrim(position)) BETWEEN 1 AND 255),
    category      TEXT        NOT NULL CHECK (category IN ('executive', 'project_head', 'officer', 'rep')),
    year_level    TEXT        NOT NULL CHECK (year_level IN ('1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year')),
    course        TEXT        NOT NULL CHECK (course IN ('BSCS', 'BSIT', 'ACT')),
    image_url     TEXT        CHECK (image_url IS NULL OR char_length(image_url) BETWEEN 1 AND 2048),
    display_order INTEGER     NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX officers_display_order_idx ON public.officers (display_order, id);

CREATE TRIGGER officers_set_updated_at
    BEFORE UPDATE ON public.officers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Same model as the other content tables: anyone reads, admins write.
REVOKE ALL ON public.officers FROM anon, authenticated;
GRANT SELECT ON public.officers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.officers TO authenticated;

ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
CREATE POLICY officers_public_read ON public.officers
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY officers_admin_insert ON public.officers
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY officers_admin_update ON public.officers
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY officers_admin_delete ON public.officers
    FOR DELETE TO authenticated USING (public.is_admin());

-- Saves a whole new order in one statement (see reorder_projects). `ids` lists officer ids in
-- the wanted order; any officer missing from the list keeps its relative order after them.
CREATE FUNCTION public.reorder_officers(ids INTEGER[])
RETURNS VOID
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can reorder officers' USING ERRCODE = '42501';
    END IF;

    WITH wanted AS (
        SELECT DISTINCT ON (t.id) t.id, t.ord
          FROM unnest(ids) WITH ORDINALITY AS t(id, ord)
         ORDER BY t.id, t.ord
    ),
    ranked AS (
        SELECT o.id,
               row_number() OVER (ORDER BY (w.ord IS NULL), w.ord, o.display_order, o.id) AS pos
          FROM public.officers o
          LEFT JOIN wanted w ON w.id = o.id
    )
    UPDATE public.officers o
       SET display_order = r.pos
      FROM ranked r
     WHERE o.id = r.id
       AND o.display_order IS DISTINCT FROM r.pos;
END;
$$;

REVOKE ALL ON FUNCTION public.reorder_officers(INTEGER[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reorder_officers(INTEGER[]) TO authenticated;

-- Current roster; display_order follows the order shown on the website.
INSERT INTO public.officers (full_name, position, category, year_level, course, image_url, display_order)
VALUES
    ('Josiah Lamuel Rosell', 'Executive President', 'executive', '3rd Year', 'BSCS', '/officers/Rosell_ExecutivePresident.png', 1),
    ('Regina Angeli Cadeliña', 'Executive Vice President', 'executive', '4th Year', 'BSIT', '/officers/Cadeliña_ExecutiveVicePresident.png', 2),
    ('Althea Claire Quiatchon', 'Vice President for IT', 'executive', '3rd Year', 'BSIT', '/officers/Quiatchon_VPforIT.jpg', 3),
    ('Lance Derick De Villa', 'Vice President for CS', 'executive', '4th Year', 'BSCS', '/officers/DeVilla_VPforCS.png', 4),
    ('Justine Margaret Candelaria', 'Executive Secretary', 'executive', '3rd Year', 'BSIT', '/officers/Candelaria_ExecSecretary.png', 5),
    ('Neil Ivan Atienza', 'Assistant Secretary', 'executive', '4th Year', 'BSIT', '/officers/Atienza_Assistant-Secretary.png', 6),
    ('Arianna Nicole Garcia', 'Executive Finance Manager', 'executive', '3rd Year', 'BSCS', '/officers/Garcia_ExecFinanceManager.png', 7),
    ('Jon Francis Kiehl Alvarez', 'Assistant Finance Manager', 'executive', '3rd Year', 'BSIT', '/officers/Alvarez_AsstFinanceManager.png', 8),
    ('Georgina Ramos', 'Auditor', 'executive', '4th Year', 'BSCS', '/officers/Ramos_Auditor.jpg', 9),
    ('Theo Junel Garabiles', 'P.R.O', 'executive', '3rd Year', 'BSIT', '/officers/Garabiles_PRO.jpg', 10),
    ('Moises Ceazar Del Mundo', 'Project Head for Internal Affairs for IT', 'project_head', '4th Year', 'BSIT', '/officers/DELMUNDO.ProjecctHeadofInternalAffairsforIT.jpg', 11),
    ('Raymond Laurence Cabauatan', 'Project Head for Internal Affairs for CS', 'project_head', '3rd Year', 'BSCS', '/officers/Cabauatan_ProjectHeadofInternalAffairsforCS.jpg', 12),
    ('Jashia Eimonah Deveza', 'Project Head for External Affairs for IT', 'project_head', '4th Year', 'BSIT', '/officers/Deveza_ProjectHeadforExternalAffairsforIT.PNG', 13),
    ('Mark Jester Guce', 'Project Head for External Affairs for CS', 'project_head', '3rd Year', 'BSCS', '/officers/Guce_ProjectHeadForExternalAffairsForCS.png', 14),
    ('Marcus Ireneo Lantin', 'Digital Media Officer', 'officer', '3rd Year', 'BSCS', '/officers/Lantin_DIGITALMEDIAOFFICER.jpg', 15),
    ('Marielle Anne Collera', 'Digital Media Officer', 'officer', '3rd Year', 'BSCS', '/officers/Collera_DigitalMediaOfficer.PNG', 16),
    ('Timothy Raquintan', 'Digital Media Officer', 'officer', '2nd Year', 'BSIT', '/officers/Raquintan_2ndYearRepforIT.png', 17),
    ('CJ Nicko Rosales', 'ITEQS Manager', 'officer', '3rd Year', 'BSCS', '/officers/Rosales_ITEQSManager.jpg', 18),
    ('Daniel Luis Sahagun', 'ITEQS Manager', 'officer', '4th Year', 'BSIT', '/officers/Sahagun_ITEQS-Manager.JPG', 19),
    ('Aryl Ross Manalo', 'ITEQS Manager', 'officer', '3rd Year', 'BSIT', '/officers/Manalo_ITEQSManager.png', 20),
    ('Jane Allyson Paray', '4th Year Rep for IT', 'rep', '4th Year', 'BSIT', '/officers/Paray_4thYearRepforIT.jpg', 21),
    ('Mikaela Shane Estrellanes', '4th Year Rep for CS', 'rep', '4th Year', 'BSCS', '/officers/Estrellanes_4thYearRepforCS.jpg', 22),
    ('Rafael Rebancos', '3rd Year Rep for IT', 'rep', '3rd Year', 'BSIT', '/officers/Rebancos_3rdYearRepforIT.JPG', 23),
    ('Zachary Scott Ruiz', '3rd Year Rep for CS', 'rep', '3rd Year', 'BSCS', '/officers/Ruiz_3rdYearRepForCS.png', 24),
    ('Joanna Mae Veneracion', '2nd Year Rep for IT', 'rep', '2nd Year', 'BSIT', '/officers/VENERACION_2ndYearRepforIT.png', 25),
    ('Allen Edeline Mari Lanto', '2nd Year Rep for CS', 'rep', '2nd Year', 'BSCS', '/officers/Lanto_2ndYearRepforCS.jpg', 26),
    ('Jan Mariviene Enriquez', '1st Year Rep for IT', 'rep', '1st Year', 'BSIT', '/officers/Enriquez_1stYearRepforIT.png', 27),
    ('Elijah Patrick Panique', '1st Year Rep for CS', 'rep', '1st Year', 'BSCS', '/officers/Panique_1stYearRepForCS.jpg', 28);
