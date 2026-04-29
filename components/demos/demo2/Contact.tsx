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

export default function Demo2Contact({ email, phone, address, state }: Props) {
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
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--secondary)] mb-3 font-bold">
            Hubungi Kami
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Pertanyaan
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: MapPin, label: "Alamat", value: address || "-" },
            { icon: Phone, label: "Telefon", value: phone || "-" },
            { icon: Mail, label: "E-mel", value: email || "-" },
          ].map((c, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 p-6 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center border-2 border-[var(--secondary)] text-[var(--secondary)] rounded-full">
                <c.icon className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
                {c.label}
              </p>
              <p className="text-sm text-gray-900 font-medium break-words">
                {c.value}
              </p>
            </div>
          ))}
        </div>

        <form
          onSubmit={submit}
          className="bg-white border border-gray-200 p-8 md:p-12 max-w-3xl mx-auto"
        >
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <Input label="Nama" value={data.nama} onChange={(v) => setData({ ...data, nama: v })} />
            <Input label="No. Telefon" type="tel" value={data.telefon} onChange={(v) => setData({ ...data, telefon: v })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <Input label="Emel" type="email" value={data.emel} onChange={(v) => setData({ ...data, emel: v })} />
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-bold">
                Negeri
              </label>
              <select
                required
                value={data.negeri}
                onChange={(e) => setData({ ...data, negeri: e.target.value })}
                className="w-full px-0 py-2 text-sm bg-transparent border-0 border-b-2 border-gray-300 focus:border-[var(--secondary)] focus:ring-0 outline-none transition-colors"
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
          <div className="mb-5">
            <Input label="Tajuk" value={data.tajuk} onChange={(v) => setData({ ...data, tajuk: v })} />
          </div>
          <div className="mb-8">
            <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-bold">
              Penerangan
            </label>
            <textarea
              required
              rows={5}
              value={data.penerangan}
              onChange={(e) => setData({ ...data, penerangan: e.target.value })}
              className="w-full px-0 py-2 text-sm bg-transparent border-0 border-b-2 border-gray-300 focus:border-[var(--secondary)] focus:ring-0 outline-none transition-colors resize-none"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-3 px-10 py-3.5 bg-gray-900 text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[var(--secondary)] transition-colors disabled:opacity-50"
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
      <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-bold">
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-0 py-2 text-sm bg-transparent border-0 border-b-2 border-gray-300 focus:border-[var(--secondary)] focus:ring-0 outline-none transition-colors"
      />
    </div>
  );
}
