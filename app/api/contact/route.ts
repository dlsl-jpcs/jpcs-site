import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@/utils/supabase/server";
import { EMAIL_PATTERN, str } from "@/lib/validation";

const LIMITS = { name: 255, email: 255, subject: 255, message: 5000 };

function hashIp(req: Request): string | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
  if (!ip) return null;
  const salt = process.env.CONTACT_IP_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field (see Contact.tsx). Pretend success to bots.
  if (str(body.website) !== "") {
    return NextResponse.json({ message: "Message sent." }, { status: 200 });
  }

  const fullname = str(body.name);
  const email = str(body.email);
  const subject = str(body.subject);
  const message = str(body.message);

  if (!fullname || !email || !subject || !message) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
  }
  if (
    fullname.length > LIMITS.name ||
    email.length > LIMITS.email ||
    subject.length > LIMITS.subject ||
    message.length > LIMITS.message
  ) {
    return NextResponse.json({ message: "One of the fields is too long." }, { status: 400 });
  }

  // Anonymous insert under RLS: the policy and column grants only allow these five columns.
  // No .select() afterwards: the public role is not allowed to read messages back.
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_form")
    .insert({ fullname, email, subject, message, ip_hash: hashIp(req) });

  if (error) {
    if (error.message.includes("rate_limited")) {
      return NextResponse.json(
        { message: "You've sent several messages recently. Please try again later." },
        { status: 429 },
      );
    }
    console.error("contact_form insert failed:", error.message);
    return NextResponse.json({ message: "Unable to send your message right now." }, { status: 500 });
  }

  return NextResponse.json({ message: "Message sent." }, { status: 200 });
}
