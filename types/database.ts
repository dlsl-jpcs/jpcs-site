// Row shapes of the tables created in supabase/migrations (hand-maintained).
export interface UpcomingEventRow {
  id: number;
  event_name: string;
  starts_at: string;
  event_location: string | null;
  event_description: string;
  registration_link: string | null;
  organization_names: string;
  facebook_link: string | null;
  instagram_link: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectImageRow {
  id: number;
  project_id: number;
  image_url: string;
  alt_text: string;
  display_order: number;
  created_at: string;
}

export interface ProjectRow {
  id: number;
  project_name: string;
  project_description: string;
  project_date: string;
  organization_names: string;
  facebook_link: string | null;
  instagram_link: string | null;
  created_at: string;
  updated_at: string;
  projects_and_events_images?: Pick<ProjectImageRow, "id" | "image_url" | "display_order">[];
}

export interface GalleryRow {
  id: number;
  image_url: string;
  alt_text: string;
  display_order: number;
  created_at: string;
}

export interface ContactRow {
  id: number;
  fullname: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
