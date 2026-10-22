"use client";
import { useState } from "react";

type State = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Could not send your message.");
      form.reset();
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message.");
      setState("error");
    }
  }

  if (state === "success") {
    return <p role="status" className="form-ok">Message sent. Check your inbox for a confirmation email.</p>;
  }

  return (
    <form className="contact" onSubmit={onSubmit} noValidate>
      <label>
        Name
        <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required maxLength={200} />
      </label>
      <label>
        Message
        <textarea name="message" rows={6} required minLength={10} maxLength={3000} />
      </label>
      {/* Honeypot, hidden from people */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
      {state === "error" && <p role="alert" className="form-err">{error}</p>}
    </form>
  );
}
