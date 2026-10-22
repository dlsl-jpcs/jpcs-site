// Row shapes of the tables created in supabase/migrations (hand-maintained).
export interface UpcomingEventRow {
  id: number;
  event_name: string;
  starts_at: string;
  ends_at: string | null;
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
  /** Position in the Projects carousel; lower shows first. */
  display_order: number;
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

export interface OfficerRow {
  id: number;
  full_name: string;
  position: string;
  category: "executive" | "project_head" | "officer" | "rep";
  year_level: string;
  course: "BSCS" | "BSIT" | "ACT";
  image_url: string | null;
  /** Position on the website; lower shows first within its category. */
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ChatFaqRow {
  id: number;
  question: string;
  answer: string;
  keywords: string | null;
  is_active: boolean;
  /** Position in the admin list and the fallback tie-break; lower first. */
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ChatQuestionRow {
  id: number;
  question: string;
  source: "llm" | "search" | "none";
  /** The bot said it couldn't answer — these are the FAQ gaps. */
  unanswered: boolean;
  created_at: string;
}
