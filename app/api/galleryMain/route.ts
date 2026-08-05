import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: dbdata, error: dberror } = await supabase
    .from("GalleryMain")
    .select("*");

  if (dberror) {
    return NextResponse.json({ error: dberror.message }, { status: 500 });
  }

  return NextResponse.json({ data: dbdata }, { status: 200 });
}
