"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus("error");
      setMessage(result.error || "Your message could not be sent.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage("Your message has been sent. Thank you.");
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <h2>Quick Contact</h2>
      <label>
        Name: <span className="required">*</span>
        <input className="input" name="name" required />
      </label>
      <label>
        Email Address: <span className="required">*</span>
        <input className="input" type="email" name="email" required />
      </label>
      <label>
        Telephone:
        <input className="input" name="telephone" />
      </label>
      <label>
        Comment:
        <textarea className="textarea" name="message" required />
      </label>
      <button className="button" disabled={status === "sending"} type="submit">
        {status === "sending" ? "Submitting..." : "Submit"}
      </button>
      {message ? <p className={status === "success" ? "status-success" : "status-error"}>{message}</p> : null}
    </form>
  );
}
