import type { ProjectRow } from "@/types/database";

/** The cover (card photo) plus up to MAX_GALLERY_IMAGES more photos for the details modal. */
export const MAX_GALLERY_IMAGES = 4;

function sortedImages(row: ProjectRow) {
  return [...(row.projects_and_events_images ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
}

/** Cover image = the project's image with the lowest display_order. */
export function coverImage(row: ProjectRow): string {
  return sortedImages(row)[0]?.image_url ?? "";
}

export function galleryImages(row: ProjectRow): string[] {
  return sortedImages(row)
    .slice(1, 1 + MAX_GALLERY_IMAGES)
    .map((i) => i.image_url);
}

/** Database row -> the shape the frontend (types/projects.ts) already consumes. */
export function toProject(row: ProjectRow) {
  return {
    id: row.id,
    name: row.project_name,
    description: row.project_description,
    org: row.organization_names,
    date: row.project_date,
    facebook: row.facebook_link ?? "",
    instagram: row.instagram_link ?? "",
    image: coverImage(row),
    gallery: galleryImages(row),
  };
}
