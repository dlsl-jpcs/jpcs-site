import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    const body = (await req.json()) as ContactPayload;

    const fullname = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const subject = body.subject?.trim() || "";
    const message = body.message?.trim() || "";
    // Validation
    if (!fullname || !email || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 },
      );
    }
    // Save the contact form data to Supabase

    const { error: dberror } = await supabase.from("ContactForm").insert([
      {
        fullname,
        email,
        subject,
        message,
      },
    ]);

    if (dberror) {
      console.log("Error saving contact form data:", dberror);
      return NextResponse.json(
        { message: "Message could not be saved. Please try again later." },
        { status: 502 },
      );
    }

    // NEED DOMAIN TO SEND EMAILS TO OTHER RECIPIENTS, FOR NOW, USE YOUR OWN EMAIL IN env.local
    const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
    const to = process.env.CONTACT_TO_EMAIL || "jpcs@dlsl.edu.ph";

    // Send the email using Resend API
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[JPCS Contact] ${subject}`,
      text: `Name: ${fullname}
Email: ${email}

Message:
${message}`,
    });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { message: "Message could not be sent. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: "Message sent." }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 },
    );
  }
}
