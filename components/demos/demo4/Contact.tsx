"use client";

import { useState, FormEvent } from "react";
import { Mail, MapPin, Phone, Send, MessageCircle } from "lucide-react";

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

export default function Demo4Contact({ email, phone, address, state }: Props) {
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
    <section className="py-20 px-6 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-md bg-gray-900 text-white text-xs font-bold uppercase tracking-wider mb-4">
            Hubungi
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Mari Berhubung
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          {/* Quick contact tiles */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {[
              {
                icon: Phone,
                label: "Telefon",
                value: phone,
                href: phone ? `tel:${phone}` : "#",
                bg: "bg-emerald-50",
                color: "text-emerald-600",
              },
              {
                icon: Mail,
                label: "E-mel",
                value: email,
                href: email ? `mailto:${email}` : "#",
                bg: "bg-blue-50",
                color: "text-blue-600",
              },
              {
                icon: MapPin,
                label: "Lokasi",
                value: address || "-",
                href: "#",
                bg: "bg-amber-50",
                color: "text-amber-600",
              },
              {
                icon: MessageCircle,
                label: "Sokongan",
                value: "Khidmat Pelanggan 24/7",
                href: "#",
                bg: "bg-purple-50",
                color: "text-purple-600",
              },
            ]
              .filter((c) => c.value)
              .map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  className="block p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all group"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${c.bg} ${c.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <c.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                    {c.label}
                  </p>
                  <p className="text-sm text-gray-900 font-medium break-words">
                    {c.value}
                  </p>
                </a>
              ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-8 rounded-2xl border border-gray-100 bg-white p-6 md:p-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Hantar Pertanyaan
            </h3>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nama" value={data.nama} onChange={(v) => setData({ ...data, nama: v })} />
                <Input label="Telefon" type="tel" value={data.telefon} onChange={(v) => setData({ ...data, telefon: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Emel" type="email" value={data.emel} onChange={(v) => setData({ ...data, emel: v })} />
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Negeri
                  </label>
                  <select
                    required
                    value={data.negeri}
                    onChange={(e) => setData({ ...data, negeri: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 outline-none transition-all"
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
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Penerangan
                </label>
                <textarea
                  required
                  rows={4}
                  value={data.penerangan}
                  onChange={(e) => setData({ ...data, penerangan: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-[var(--primary)] text-white text-sm font-semibold transition-all disabled:opacity-50"
              >
                {status === "sending"
                  ? "Menghantar..."
                  : status === "sent"
                  ? "Terima Kasih"
                  : "Hantar"}
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
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 outline-none transition-all"
      />
    </div>
  );
}
