"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="wrap">
      <h1>Contact us</h1>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <label>
            First name
            <input name="firstName" type="text" required autoComplete="given-name" />
          </label>
          <label>
            Last name
            <input name="lastName" type="text" required autoComplete="family-name" />
          </label>
        </div>

        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>

        <label>
          Company
          <input name="company" type="text" autoComplete="organization" />
        </label>

        <label>
          Message
          <textarea name="message" rows={6} required />
        </label>

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send message"}
        </button>

        {status === "sent" && <p role="status">Message sent. We'll get back to you soon.</p>}
        {status === "error" && (
          <p role="alert" className="error">
            Message not sent. Check your connection and try again.
          </p>
        )}
      </form>

      <style>{`
        .wrap { max-width: 520px; margin: 4rem auto; padding: 0 1.25rem; font-family: system-ui, sans-serif; }
        h1 { font-size: 2rem; margin: 0 0 1.5rem; }
        form { display: flex; flex-direction: column; gap: 1rem; }
        .row { display: flex; gap: 1rem; }
        .row label { flex: 1; }
        label { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.9rem; font-weight: 500; }
        input, textarea { font: inherit; padding: 0.6rem 0.7rem; border: 1px solid #bbb; border-radius: 6px; }
        input:focus, textarea:focus { outline: 2px solid #2563eb; outline-offset: 1px; border-color: #2563eb; }
        textarea { resize: vertical; }
        button { font: inherit; font-weight: 600; padding: 0.7rem 1rem; border: 0; border-radius: 6px; background: #111; color: #fff; cursor: pointer; }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        .error { color: #b91c1c; }
        @media (max-width: 480px) { .row { flex-direction: column; } }
      `}</style>
    </main>
  );
}