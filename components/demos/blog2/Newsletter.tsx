"use client";

import { useState, FormEvent } from "react";

interface Props {
  email: string;
}

export default function Blog2Newsletter({ email }: Props) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    const subject = encodeURIComponent("Newsletter Subscription");
    const body = encodeURIComponent(
      `Please subscribe me to the newsletter.\n\nEmail: ${value}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        setStatus("idle");
        setValue("");
      }, 3000);
    }, 500);
  };

  return (
    <section id="newsletter" className="bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 uppercase tracking-tight">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-sm text-gray-600 mb-6 max-w-xl mx-auto">
          Get the latest news, articles, and updates delivered straight to your
          inbox.
        </p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--primary)] outline-none transition"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-7 py-3 bg-[var(--primary)] hover:bg-yellow-500 text-gray-900 text-xs font-bold uppercase tracking-[0.15em] whitespace-nowrap transition disabled:opacity-50"
          >
            {status === "sending"
              ? "..."
              : status === "sent"
              ? "Subscribed"
              : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
