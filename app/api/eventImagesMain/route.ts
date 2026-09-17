import { NextResponse } from "next/server";
import { listRecords } from "@/lib/mock-data";

export async function GET() {
  const data = listRecords("EventsImages").filter(
    (item) => item.display_order === 1,
  );
  return NextResponse.json({ data }, { status: 200 });
}
