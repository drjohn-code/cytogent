import { NextResponse } from "next/server";
import { credentials } from "@/content/credentials";
import { contactTopics } from "@/content/contact";

/**
 * POST /api/contact: the contact form. Emails the message to MAIL_TO through Resend (https://resend.com).
 *   RESEND_API_KEY  required (the sending domain must be verified in Resend)
 *   MAIL_TO         optional, default: the verified contact address in credentials.ts
 *   MAIL_FROM       optional, default "Cytogent website <noreply@cytogent.com>"
 * Spam: a filled hidden field, or a send within 3 s of the page loading, is accepted and silently dropped.
 */
export const runtime = "nodejs";

const MAX = 5000;
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const clean = (v: unknown, max = MAX) => String(v ?? "").replace(/\r\n?/g, "\n").trim().slice(0, max);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }

  if (clean(body.website) || Date.now() - Number(body.started ?? 0) < 3000) return NextResponse.json({ ok: true });

  const name = oneLine(clean(body.name, 200));
  const email = oneLine(clean(body.email, 320));
  const organisation = oneLine(clean(body.organisation, 200));
  const topic = contactTopics.find((t) => t.id === body.topic) ?? contactTopics[contactTopics.length - 1];
  const message = clean(body.message);

  const missing = [!name && "name", !EMAIL_RE.test(email) && "email", !message && "message"].filter(Boolean);
  if (missing.length) return NextResponse.json({ error: "invalid", fields: missing }, { status: 422 });

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "not-configured" }, { status: 503 });

  const rows: [string, string][] = [
    ["Topic", topic.title],
    ["Name", name],
    ["Email", email],
    ["Organisation", organisation || "—"],
  ];
  const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:gray">${k}</td><td>${esc(v)}</td></tr>`)
    .join("")}</table><p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${esc(message)}</p>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "Cytogent website <noreply@cytogent.com>",
      to: [process.env.MAIL_TO || credentials.email.value],
      reply_to: email,
      subject: `[${topic.subject}] ${name}${organisation ? `, ${organisation}` : ""}`,
      html,
      text,
    }),
  }).catch(() => null);

  if (!res?.ok) return NextResponse.json({ error: "send-failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
