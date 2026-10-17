import { NextResponse } from "next/server";

import { EMAIL_ERROR, isValidEmail } from "@/lib/validation";

/**
 * Newsletter sign-up endpoint. It validates the address and acknowledges it;
 * forward `email` to your provider (Resend, Loops, Mailchimp, ...) where marked.
 */
export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a JSON body with an email field." }, { status: 400 });
  }

  const email =
    typeof payload === "object" && payload !== null && "email" in payload && typeof payload.email === "string"
      ? payload.email.trim()
      : "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: EMAIL_ERROR }, { status: 422 });
  }

  // Forward `email` to your email provider here.

  return NextResponse.json({ ok: true }, { status: 201 });
}
