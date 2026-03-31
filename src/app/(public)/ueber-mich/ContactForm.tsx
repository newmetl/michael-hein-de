"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-12 text-center">
        <p className="font-headline text-2xl mb-4">Vielen Dank!</p>
        <p className="font-body text-on-surface-variant">
          Ihre Nachricht wurde gesendet. Ich melde mich in Kürze bei Ihnen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Name */}
      <div className="relative">
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder=" "
          className="floating-input peer"
        />
        <label htmlFor="name" className="floating-label">
          Vollständiger Name
        </label>
      </div>

      {/* Email */}
      <div className="relative">
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder=" "
          className="floating-input peer"
        />
        <label htmlFor="email" className="floating-label">
          E-Mail-Adresse
        </label>
      </div>

      {/* Subject */}
      <div className="relative">
        <select
          id="subject"
          name="subject"
          required
          defaultValue=""
          className="floating-input peer appearance-none text-on-surface-variant"
        >
          <option disabled value="">Art der Anfrage</option>
          <option value="artwork">Kunstwerk-Anfrage</option>
          <option value="commission">Auftragsarbeit</option>
          <option value="exhibition">Ausstellung</option>
          <option value="other">Sonstiges</option>
        </select>
        <svg
          className="pointer-events-none absolute right-0 top-3 w-4 h-4 text-on-surface-variant"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {/* Message */}
      <div className="relative">
        <textarea
          id="message"
          name="message"
          required
          placeholder=" "
          rows={4}
          className="floating-input peer resize-none"
        />
        <label htmlFor="message" className="floating-label">
          Nachricht
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary inline-flex items-center gap-3 disabled:opacity-60"
      >
        {status === "sending" ? "Wird gesendet..." : "Nachricht senden"}
        {status !== "sending" && (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        )}
      </button>

      {status === "error" && (
        <p className="font-body text-error text-sm">
          Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
        </p>
      )}
    </form>
  );
}
