import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { str } from "@/lib/validation";

// Admin sign-in through Supabase Auth. Only accounts with profiles.role = 'admin' get in.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const email = str(body.email);
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // A valid account that is not an admin must not keep a session.
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ message: "Authenticated" }, { status: 200 });
}

export async function DELETE() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}
