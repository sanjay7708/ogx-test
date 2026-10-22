import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sendThankYou } from "@/lib/mail";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid request.");
  }

  // Honeypot: bots fill the hidden field. Pretend success.
  if (body.website) return NextResponse.json({ ok: true });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const message = String(body.message ?? "").trim();

  if (name.length < 2 || name.length > 100) return bad("Enter your name (2 to 100 characters).");
  if (!EMAIL_RE.test(email) || email.length > 200) return bad("Enter a valid email address.");
  if (message.length < 10 || message.length > 3000) return bad("Message must be 10 to 3000 characters.");

  try {
    const col = (await getDb()).collection("contacts");

    // Basic throttle: one submission per email per minute.
    const recent = await col.findOne({ email, createdAt: { $gt: new Date(Date.now() - 60_000) } });
    if (recent) return bad("You just sent a message. Please wait a minute and try again.", 429);

    const { insertedId } = await col.insertOne({
      name,
      email,
      message,
      emailSent: false,
      createdAt: new Date(),
      userAgent: req.headers.get("user-agent") ?? null,
    });

    // The message is saved at this point. An email failure must not fail the request.
    try {
      await sendThankYou(email, name, message);
      await col.updateOne({ _id: insertedId }, { $set: { emailSent: true } });
    } catch (err) {
      console.error("Thank-you email failed:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact submit failed:", err);
    return bad("Something went wrong. Please try again later.", 500);
  }
}
