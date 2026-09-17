import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import {
  deleteRecord,
  insertRecord,
  listRecords,
  updateRecord,
} from "@/lib/mock-data";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;
  const decoded = await verifyJwt(token);
  return !!decoded;
}

export async function GET() {
  if (!(await verifyAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = listRecords("UpcomingEvents", "date", false);
  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: Request) {
  if (!(await verifyAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = insertRecord("UpcomingEvents", body);
  return NextResponse.json({ data: [data] }, { status: 201 });
}

export async function PUT(req: Request) {
  if (!(await verifyAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...updateData } = body;
  const data = updateRecord("UpcomingEvents", id, updateData);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: [data] }, { status: 200 });
}

export async function DELETE(req: Request) {
  if (!(await verifyAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  if (!deleteRecord("UpcomingEvents", id))
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(
    { message: "Deleted successfully" },
    { status: 200 },
  );
}
