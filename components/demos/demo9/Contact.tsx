"use client";

import { useState, FormEvent } from "react";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";

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

export default function Demo9Contact({ email, phone, address, state }: Props) {
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
    <section className="py-16 border-t border-gray-100">
      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2">
        §04
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
        Hubungi Kami
      </h2>
      <p className="text-gray-500 text-base mb-10 max-w-xl">
        Hantarkan pertanyaan anda dan kami akan kembali kepada anda secepat
        mungkin.
      </p>

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-1">
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
                className="flex items-center gap-4 py-3 border-b border-gray-100 hover:border-gray-300 transition group"
              >
                <c.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    {c.label}
                  </p>
                  <p className="text-sm text-gray-900 mt-0.5 break-words">
                    {c.value}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}
        </div>

        <form onSubmit={submit} className="lg:col-span-3 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Nama" value={data.nama} onChange={(v) => setData({ ...data, nama: v })} />
            <Input label="Telefon" type="tel" value={data.telefon} onChange={(v) => setData({ ...data, telefon: v })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Emel" type="email" value={data.emel} onChange={(v) => setData({ ...data, emel: v })} />
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">
                Negeri
              </label>
              <select
                required
                value={data.negeri}
                onChange={(e) => setData({ ...data, negeri: e.target.value })}
                className="w-full px-0 py-2 text-sm bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 outline-none transition"
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
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">
              Penerangan
            </label>
            <textarea
              required
              rows={4}
              value={data.penerangan}
              onChange={(e) => setData({ ...data, penerangan: e.target.value })}
              className="w-full px-0 py-2 text-sm bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 outline-none transition resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gray-900 hover:bg-black text-white text-sm font-semibold transition disabled:opacity-50"
          >
            {status === "sending"
              ? "Menghantar..."
              : status === "sent"
              ? "Berjaya ✓"
              : "Hantar"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
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
      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-0 py-2 text-sm bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 outline-none transition"
      />
    </div>
  );
}
