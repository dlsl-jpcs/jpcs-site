import type { OfficerRow } from "@/types/database";

/** Groups on the home page, in display order. `value` is what the database stores. */
export const OFFICER_CATEGORIES = [
  { value: "executive", label: "Executive Officers", short: "Executive", description: "Leading the organization" },
  { value: "project_head", label: "Project Heads", short: "Proj. Heads", description: "Driving our initiatives" },
  { value: "officer", label: "Officers", short: "Officers", description: "Supporting our operations" },
  { value: "rep", label: "Representatives", short: "Reps", description: "Representing our members" },
] as const;

export type OfficerCategory = (typeof OFFICER_CATEGORIES)[number]["value"];

export const OFFICER_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"] as const;

/** `value` is stored and shown on the officer card. */
export const OFFICER_COURSES = [
  { value: "BSCS", label: "BS Computer Science" },
  { value: "BSIT", label: "BS Information Technology" },
  { value: "ACT", label: "Associate in Computer Technology" },
] as const;

export const categoryLabel = (value: string) =>
  OFFICER_CATEGORIES.find((c) => c.value === value)?.label ?? value;

/** Database row -> the shape the website and admin use. */
export function toOfficer(row: OfficerRow) {
  return {
    id: row.id,
    name: row.full_name,
    position: row.position,
    category: row.category as OfficerCategory,
    year: row.year_level,
    course: row.course,
    image: row.image_url ?? "",
  };
}

export type Officer = ReturnType<typeof toOfficer>;
