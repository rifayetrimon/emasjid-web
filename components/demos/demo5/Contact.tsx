"use client";

import { useState, FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

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

export default function Demo5Contact({ email, phone, address, state }: Props) {
  const [data, setData] = useState({
    nama: "",
    telefon: "",
    emel: "",
    negeri: state?.toUpperCase() || "",
    tajuk: "",
    penerangan: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const subject = encodeURIComponent(data.tajuk || "Pertanyaan");
    const body = encodeURIComponent(
      `Nama: ${data.nama}\nTelefon: ${data.telefon}\nEmel: ${data.emel}\nNegeri: ${data.negeri}\n\n${data.penerangan}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 3000);
    }, 500);
  };

  return (
    <section className="py-20 px-6 bg-[var(--secondary)] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 5 L50 30 L75 35 L55 55 L60 80 L40 65 L20 80 L25 55 L5 35 L30 30 Z' fill='none' stroke='%23e8d5a8' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-16 bg-[#e8d5a8]/60" />
            <svg width="22" height="22" viewBox="0 0 20 20" className="text-[#e8d5a8]">
              <path
                d="M10 1 L13 7 L19 8 L14.5 12.5 L16 19 L10 16 L4 19 L5.5 12.5 L1 8 L7 7 Z"
                fill="currentColor"
              />
            </svg>
            <div className="h-[1px] w-16 bg-[#e8d5a8]/60" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#e8d5a8]/80 font-bold mb-3">
            Hubungi Kami
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#fdfaf3]"
            style={{ fontFamily: "'Times New Roman', serif" }}
          >
            Pertanyaan
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: MapPin, label: "Alamat", value: address || "-" },
              { icon: Phone, label: "Telefon", value: phone || "-" },
              { icon: Mail, label: "E-mel", value: email || "-" },
            ].map((c, i) => (
              <div
                key={i}
                className="border-2 border-[#e8d5a8]/30 bg-[var(--secondary)]/40 backdrop-blur-sm p-5 flex items-start gap-4"
                style={{
                  clipPath:
                    "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
                }}
              >
                <div className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-[#fdfaf3] flex-shrink-0">
                  <c.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#e8d5a8]/70 font-semibold mb-1">
                    {c.label}
                  </p>
                  <p
                    className="text-sm text-[#fdfaf3] break-words"
                    style={{ fontFamily: "'Times New Roman', serif" }}
                  >
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={submit}
            className="lg:col-span-3 bg-[#fdfaf3] border-4 border-[var(--primary)] p-8 md:p-10 relative"
            style={{
              clipPath:
                "polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)",
            }}
          >
            <h3
              className="text-2xl font-bold text-[var(--secondary)] mb-6 text-center"
              style={{ fontFamily: "'Times New Roman', serif" }}
            >
              Borang Hubungi
            </h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nama" value={data.nama} onChange={(v) => setData({ ...data, nama: v })} />
                <Input label="Telefon" type="tel" value={data.telefon} onChange={(v) => setData({ ...data, telefon: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Emel" type="email" value={data.emel} onChange={(v) => setData({ ...data, emel: v })} />
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] mb-1.5 font-bold">
                    Negeri
                  </label>
                  <select
                    required
                    value={data.negeri}
                    onChange={(e) => setData({ ...data, negeri: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-[#fdfaf3] border-2 border-[#d4b88a] focus:border-[var(--primary)] outline-none transition-colors text-[var(--secondary)]"
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
              <Input label="Tajuk" value={data.tajuk} onChange={(v) => setData({ ...data, tajuk: v })} />
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] mb-1.5 font-bold">
                  Penerangan
                </label>
                <textarea
                  required
                  rows={4}
                  value={data.penerangan}
                  onChange={(e) => setData({ ...data, penerangan: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm bg-[#fdfaf3] border-2 border-[#d4b88a] focus:border-[var(--primary)] outline-none transition-colors text-[var(--secondary)] resize-none"
                />
              </div>
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-3 px-10 py-3 bg-[var(--primary)] hover:bg-[var(--secondary)] text-[#fdfaf3] text-sm font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
                  style={{ fontFamily: "'Times New Roman', serif" }}
                >
                  {status === "sending"
                    ? "Menghantar..."
                    : status === "sent"
                    ? "Berjaya"
                    : "Hantar"}
                  <Send className="w-4 h-4" />
                </button>
              </div>
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
      <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] mb-1.5 font-bold">
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-sm bg-[#fdfaf3] border-2 border-[#d4b88a] focus:border-[var(--primary)] outline-none transition-colors text-[var(--secondary)]"
      />
    </div>
  );
}
