"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { type ContactTopic, contactTopics } from "@/content/contact";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-2 block w-full rounded-[var(--radius-control)] border border-line-strong bg-canvas/60 px-4 py-3 text-text placeholder:text-muted/70 transition-colors focus:border-signal focus:outline-none focus-visible:outline-2 focus-visible:outline-signal";

export function ContactForm({ email }: { email: string }) {
  const [topic, setTopic] = useState<ContactTopic>("pilot");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const started = useRef(0);
  const result = useRef<HTMLDivElement>(null);

  useEffect(() => {
    started.current = Date.now();
    // Other pages link here as /contact?intent=… or /contact#…; preselect that topic.
    const wanted = new URLSearchParams(window.location.search).get("intent") || window.location.hash.slice(1);
    const match = contactTopics.find((t) => t.id === wanted);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setTopic(match.id);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setErrors([]);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, topic, started: started.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 422) {
        setErrors(json.fields ?? []);
        setStatus("idle");
        return;
      }
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
    requestAnimationFrame(() => result.current?.focus());
  }

  if (status === "sent") {
    return (
      <div ref={result} tabIndex={-1} role="status" className="flex min-h-[420px] flex-col items-start justify-center focus:outline-none">
        <span className="grid size-14 place-items-center rounded-full bg-signal/15 text-signal">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="mt-6 text-3xl font-semibold">Thank you. Your message is with us.</h2>
        <p className="mt-3 text-muted">We will reply to the address you gave.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <fieldset>
        <legend className="text-sm font-medium">What is it about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {contactTopics.map((t) => (
            <label
              key={t.id}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal ${
                topic === t.id ? "border-signal bg-signal/10 text-text" : "border-line-strong text-muted hover:border-signal hover:text-text"
              }`}
            >
              <input type="radio" name="topic-choice" value={t.id} checked={topic === t.id} onChange={() => setTopic(t.id)} className="sr-only" />
              {t.title}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Name
          <input name="name" required autoComplete="name" className={field} aria-invalid={errors.includes("name") || undefined} />
          {errors.includes("name") && <span className="mt-1 block text-alert">Please add your name.</span>}
        </label>
        <label className="block text-sm font-medium">
          Work email
          <input name="email" type="email" required autoComplete="email" className={field} aria-invalid={errors.includes("email") || undefined} />
          {errors.includes("email") && <span className="mt-1 block text-alert">Please check the email address.</span>}
        </label>
      </div>
      <label className="block text-sm font-medium">
        Organisation <span className="font-normal text-muted">(optional)</span>
        <input name="organisation" autoComplete="organization" className={field} />
      </label>
      <label className="block text-sm font-medium">
        Message
        <textarea
          name="message"
          required
          rows={6}
          placeholder="The candidate, the resistance context, and the decision you face."
          className={`${field} resize-y`}
          aria-invalid={errors.includes("message") || undefined}
        />
        {errors.includes("message") && <span className="mt-1 block text-alert">Please write a short message.</span>}
      </label>
      {/* Spam trap: people never see or fill this. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary min-w-40 disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-sm text-muted">No patient-identifiable data or confidential structures, please.</p>
      </div>
      {status === "error" && (
        <div ref={result} tabIndex={-1} role="alert" className="rounded-[var(--radius-control)] border border-alert/60 p-4 text-sm focus:outline-none">
          The message could not be sent. Please email{" "}
          <a href={`mailto:${email}`} className="text-signal underline underline-offset-4">
            {email}
          </a>{" "}
          instead.
        </div>
      )}
    </form>
  );
}
