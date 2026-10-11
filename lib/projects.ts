import type { ProjectRow } from "@/types/database";

/** Cover image = the project's image with the lowest display_order. */
export function coverImage(row: ProjectRow): string {
  const images = [...(row.projects_and_events_images ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  return images[0]?.image_url ?? "";
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
  };
}
