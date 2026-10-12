// toggle once gallery ready

// Temporary stub while the gallery is off; remove when restoring the code below.
const off = () => Response.json({ error: "Gallery is disabled" }, { status: 404 });
export const GET = off;

// import { NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";
// import type { GalleryRow } from "@/types/database";

// export async function GET() {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from("gallery")
//     .select("id, image_url, alt_text")
//     .order("display_order", { ascending: true })
//     .order("id", { ascending: false })
//     .returns<Pick<GalleryRow, "id" | "image_url" | "alt_text">[]>();

//   if (error) {
//     console.error("gallery query failed:", error.message);
//     return NextResponse.json({ data: [], error: "Failed to load gallery." }, { status: 500 });
//   }

//   // GalleryContainer / GalleryModal expect { id, src, alt }.
//   const images = data.map((row) => ({
//     id: row.id,
//     src: row.image_url,
//     alt: row.alt_text || "JPCS gallery photo",
//   }));

//   return NextResponse.json({ data: images }, { status: 200 });
// }
