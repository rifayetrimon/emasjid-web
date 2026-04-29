"use client";

import { useState, FormEvent } from "react";
import { Mail, MapPin, Phone, Send, ArrowRight } from "lucide-react";

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

export default function Demo3Contact({ email, phone, address, state }: Props) {
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
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-[var(--secondary)] via-gray-900 to-black">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--primary)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Info Panel */}
          <div className="text-white">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs uppercase tracking-wider font-semibold mb-6">
              Hubungi Kami
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
              Mari Berhubung &<br />
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
                Bekerjasama
              </span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md">
              Hantarkan pertanyaan anda dan kami akan kembali kepada anda
              secepat mungkin.
            </p>

            <div className="space-y-5">
              {[
                { icon: MapPin, label: "Alamat", value: address },
                { icon: Phone, label: "Telefon", value: phone, href: `tel:${phone}` },
                { icon: Mail, label: "E-mel", value: email, href: `mailto:${email}` },
              ]
                .filter((c) => c.value)
                .map((c, i) => (
                  <a
                    key={i}
                    href={c.href || "#"}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/25 border border-[var(--primary)]/50 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary)]/40 transition-colors">
                      <c.icon className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--primary)] font-bold mb-1.5">
                        {c.label}
                      </p>
                      <p className="text-base text-white font-medium break-words leading-snug">
                        {c.value}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all mt-1" />
                  </a>
                ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl bg-white p-8 md:p-10 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Borang Pertanyaan
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Isi maklumat di bawah dan kami akan menghubungi anda.
            </p>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nama" value={data.nama} onChange={(v) => setData({ ...data, nama: v })} />
                <Input label="Telefon" type="tel" value={data.telefon} onChange={(v) => setData({ ...data, telefon: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Emel" type="email" value={data.emel} onChange={(v) => setData({ ...data, emel: v })} />
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Negeri
                  </label>
                  <select
                    required
                    value={data.negeri}
                    onChange={(e) => setData({ ...data, negeri: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
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
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Penerangan
                </label>
                <textarea
                  required
                  rows={4}
                  value={data.penerangan}
                  onChange={(e) => setData({ ...data, penerangan: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-sm font-bold transition-all shadow-lg disabled:opacity-50"
              >
                {status === "sending"
                  ? "Menghantar..."
                  : status === "sent"
                  ? "Terima Kasih"
                  : "Hantar Mesej"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
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
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
      />
    </div>
  );
}
