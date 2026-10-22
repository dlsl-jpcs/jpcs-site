-- ======================================================================
-- SAMPLE DATA FOR LOCAL DEVELOPMENT ONLY
-- Runs on `supabase db reset`. It is NOT applied by `supabase db push`,
-- so it never reaches a hosted project. All rows below are placeholders.
-- ======================================================================

INSERT INTO public.upcoming_events
    (event_name, starts_at, event_location, event_description, registration_link, organization_names,
     facebook_link, instagram_link)
VALUES
    ('[SAMPLE] General Assembly', now() + interval '14 days', 'DLSL Auditorium',
     'Sample event used to preview the upcoming events carousel.',
     'https://example.com/register', 'JPCS',
     'https://facebook.com/', 'https://instagram.com/'),
    ('[SAMPLE] Hackathon Kickoff', now() + interval '30 days', 'Computer Lab 3',
     'Another sample event. Replace or delete it from the admin dashboard.',
     NULL, 'JPCS', NULL, NULL);

WITH p AS (
    INSERT INTO public.projects_and_events
        (project_name, project_description, project_date, organization_names, facebook_link, instagram_link,
         display_order)
    VALUES
        ('[SAMPLE] Tech Talk Series', 'Sample project used to preview the projects carousel.',
         'November 2025', 'JPCS', 'https://facebook.com/', 'https://instagram.com/', 1),
        ('[SAMPLE] Coding Bootcamp', 'Another sample project with no cover image.',
         'February 2026', 'JPCS', NULL, NULL, 2)
    RETURNING id, project_name
)
INSERT INTO public.projects_and_events_images (project_id, image_url, alt_text, display_order)
SELECT id, '/jpcslogo.png', project_name, 1 FROM p WHERE project_name = '[SAMPLE] Tech Talk Series';

INSERT INTO public.gallery_main (image_url, alt_text, display_order)
VALUES ('/jpcslogo.png', 'Sample homepage gallery image', 1);

INSERT INTO public.gallery (image_url, alt_text, display_order)
VALUES ('/jpcslogo.png', 'Sample gallery image 1', 1),
       ('/jpcslogo.png', 'Sample gallery image 2', 2);

INSERT INTO public.chat_faq (question, answer, keywords, display_order)
VALUES ('[SAMPLE] How do I join JPCS?',
        'Sample answer: membership opens at the start of each semester. Watch our Facebook page or message the officers through the Contact section.',
        'join member membership sign up register apply', 1),
       ('[SAMPLE] How do I contact the officers?',
        'Use the Contact form at the bottom of the home page and an officer will get back to you.',
        'contact email message reach officers', 2);
