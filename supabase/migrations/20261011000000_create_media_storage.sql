-- Public-read bucket for event/project/gallery images; only admins can write.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 5242880,
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
ON CONFLICT (id) DO UPDATE
    SET public = EXCLUDED.public,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public buckets serve objects by URL without a SELECT policy, so anonymous users cannot list files.
CREATE POLICY media_admin_select ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY media_admin_insert ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY media_admin_update ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin())
    WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY media_admin_delete ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
