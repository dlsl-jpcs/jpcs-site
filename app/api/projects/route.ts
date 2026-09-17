import { NextResponse } from "next/server";
import { listRecords } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(
    { data: listRecords("ProjectsAndEvents") },
    { status: 200 },
  );
}
