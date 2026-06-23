"use client";

import { useState, FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { sendContactMessage } from "@/services/contactService";

interface Props {
  email: string;
  phone: string;
  address: string;
  state: string;
}

const NEGERI_LIST = [
  "JOHOR", "KEDAH", "KELANTAN", "MELAKA", "NEGERI SEMBILAN", "PAHANG",
  "PERAK", "PERLIS", "PULAU PINANG", "SABAH", "SARAWAK", "SELANGOR",
  "TERENGGANU", "W.P. KUALA LUMPUR", "W.P. LABUAN", "W.P. PUTRAJAYA",
];

export default function Blog2Contact({ email, phone, address, state }: Props) {
  const [data, setData] = useState({
    nama: "",
    telefon: "",
    emel: "",
    negeri: state?.toUpperCase() || "",
    tajuk: "",
    penerangan: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  // Open the visitor's mail client as a last resort, so a message is never
  // lost if the backend send can't go through.
  const openMailto = () => {
    const subject = encodeURIComponent(data.tajuk || "Pertanyaan");
    const body = encodeURIComponent(
      `Nama: ${data.nama}\nTelefon: ${data.telefon}\nEmel: ${data.emel}\nNegeri: ${data.negeri}\n\n${data.penerangan}`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      // Send the message to the company email configured in the CMS.
      await sendContactMessage(email, {
        name: data.nama,
        phone: data.telefon,
        email: data.emel,
        state: data.negeri,
        subject: data.tajuk,
        description: data.penerangan,
      });
      setStatus("sent");
      // Clear the form so it's ready for the next message.
      setData({
        nama: "",
        telefon: "",
        emel: "",
        negeri: state?.toUpperCase() || "",
        tajuk: "",
        penerangan: "",
      });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      // Backend send failed (e.g. email key not provisioned, network) — fall
      // back to the mail client so the visitor can still reach the company.
      openMailto();
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="py-16 px-6 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="inline-block text-xl md:text-2xl font-extrabold text-gray-900 uppercase tracking-wider border-b-4 border-[var(--primary)] pb-1">
            Contact Us
          </h2>
          <p className="mt-3 text-sm text-gray-500">Hantar pertanyaan anda melalui borang di bawah</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="space-y-3">
            {[
              { icon: Phone, label: "Telefon", value: phone, href: phone ? `tel:${phone}` : undefined },
              { icon: Mail, label: "E-mel", value: email, href: email ? `mailto:${email}` : undefined },
              { icon: MapPin, label: "Lokasi", value: address || "-" },
            ]
              .filter((c) => c.value)
              .map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  className="flex items-start gap-4 p-5 bg-gray-50 hover:bg-white border border-gray-200 hover:border-[var(--primary)] hover:shadow-sm transition"
                >
                  <div className="w-10 h-10 text-[var(--primary)] flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">
                      {c.label}
                    </p>
                    <p className="text-sm text-gray-900 font-medium break-words">{c.value}</p>
                  </div>
                </a>
              ))}
          </div>

          <form
            onSubmit={submit}
            className="lg:col-span-2 bg-gray-50 border border-gray-200 p-6 md:p-8"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Nama" value={data.nama} onChange={(v) => setData({ ...data, nama: v })} />
              <Input label="Telefon" type="tel" value={data.telefon} onChange={(v) => setData({ ...data, telefon: v })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Input label="Emel" type="email" value={data.emel} onChange={(v) => setData({ ...data, emel: v })} />
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-1.5">
                  Negeri
                </label>
                <select
                  required
                  value={data.negeri}
                  onChange={(e) => setData({ ...data, negeri: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 text-sm focus:border-[var(--primary)] outline-none transition"
                >
                  <option value="">Pilih Negeri</option>
                  {NEGERI_LIST.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <Input label="Tajuk" value={data.tajuk} onChange={(v) => setData({ ...data, tajuk: v })} />
            </div>
            <div className="mt-4">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-1.5">
                Penerangan
              </label>
              <textarea
                required
                rows={4}
                value={data.penerangan}
                onChange={(e) => setData({ ...data, penerangan: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 text-sm focus:border-[var(--primary)] outline-none transition resize-none"
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 px-7 py-3 bg-gray-900 hover:bg-[var(--primary)] hover:text-gray-900 text-white text-xs font-bold uppercase tracking-[0.15em] transition disabled:opacity-50"
              >
                {status === "sending"
                  ? "Menghantar..."
                  : status === "sent"
                  ? "Terima Kasih"
                  : "Hantar Mesej"}
                <Send className="w-3.5 h-3.5" />
              </button>
              {status === "sent" && (
                <span className="text-sm font-medium text-green-600">
                  Mesej anda telah dihantar. Terima kasih!
                </span>
              )}
              {status === "error" && (
                <span className="text-sm font-medium text-gray-500">
                  Membuka aplikasi e-mel anda…
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-1.5">
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 text-sm focus:border-[var(--primary)] outline-none transition"
      />
    </div>
  );
}
