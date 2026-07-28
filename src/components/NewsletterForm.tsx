"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="newsletter-form" onSubmit={onSubmit}>
      <input
        type="email"
        required
        placeholder="Your email for updates"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-label="Newsletter email"
      />
      <button className="button" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "..." : "Subscribe"}
      </button>
      {status === "success" ? <span className="status-success">Subscribed. Thank you!</span> : null}
      {status === "error" ? <span className="status-error">Could not subscribe. Try again.</span> : null}
    </form>
  );
}
