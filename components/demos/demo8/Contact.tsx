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

export default function Demo8Contact({ email, phone, address, state }: Props) {
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
    <section className="relative py-24 px-6 bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs uppercase tracking-[0.25em] font-semibold text-amber-400 mb-5">
            Hubungi
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Mari{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent italic">
              berhubung.
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            {[
              { icon: Phone, label: "Telefon", value: phone, href: `tel:${phone}` },
              { icon: Mail, label: "E-mel", value: email, href: `mailto:${email}` },
              { icon: MapPin, label: "Lokasi", value: address || "-" },
            ]
              .filter((c) => c.value)
              .map((c, i) => (
                <a
                  key={i}
                  href={c.href || "#"}
                  className="flex items-start gap-4 p-5 rounded-xl bg-zinc-900 border border-white/5 hover:border-amber-400/40 transition-all group"
                >
                  <div className="w-11 h-11 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:bg-amber-400 group-hover:text-black transition-all">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold mb-1.5">
                      {c.label}
                    </p>
                    <p className="text-sm text-white break-words">{c.value}</p>
                  </div>
                </a>
              ))}
          </div>

          <form
            onSubmit={submit}
            className="lg:col-span-3 rounded-2xl bg-zinc-900 border border-white/10 p-8 md:p-10"
          >
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nama" value={data.nama} onChange={(v) => setData({ ...data, nama: v })} />
                <Input label="Telefon" type="tel" value={data.telefon} onChange={(v) => setData({ ...data, telefon: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Emel" type="email" value={data.emel} onChange={(v) => setData({ ...data, emel: v })} />
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-2">
                    Negeri
                  </label>
                  <select
                    required
                    value={data.negeri}
                    onChange={(e) => setData({ ...data, negeri: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-white text-sm focus:border-amber-400 outline-none transition-all"
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
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-2">
                  Penerangan
                </label>
                <textarea
                  required
                  rows={4}
                  value={data.penerangan}
                  onChange={(e) => setData({ ...data, penerangan: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-white text-sm focus:border-amber-400 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-sm font-bold transition-all disabled:opacity-50"
              >
                {status === "sending"
                  ? "Menghantar..."
                  : status === "sent"
                  ? "Berjaya"
                  : "Hantar Mesej"}
                <Send className="w-4 h-4" />
              </button>
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
      <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-2">
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-white text-sm focus:border-amber-400 outline-none transition-all"
      />
    </div>
  );
}
