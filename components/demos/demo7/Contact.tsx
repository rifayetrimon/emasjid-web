"use client";

import { useState, FormEvent } from "react";
import { Mail, MapPin, Phone, Send, Heart } from "lucide-react";

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

export default function Demo7Contact({ email, phone, address, state }: Props) {
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
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-amber-50 -z-10" />
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-100 text-xs uppercase tracking-wider font-semibold text-pink-500 mb-5 shadow-sm">
            <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
            Hubungi Kami
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Mari Berbual{" "}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              bersama.
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            {[
              {
                icon: Phone,
                label: "Telefon",
                value: phone,
                href: phone ? `tel:${phone}` : undefined,
                grad: "from-rose-400 to-pink-500",
              },
              {
                icon: Mail,
                label: "E-mel",
                value: email,
                href: email ? `mailto:${email}` : undefined,
                grad: "from-sky-400 to-indigo-500",
              },
              {
                icon: MapPin,
                label: "Lokasi",
                value: address || "-",
                grad: "from-amber-400 to-orange-500",
              },
            ]
              .filter((c) => c.value)
              .map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  className="block p-5 rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.grad} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                        {c.label}
                      </p>
                      <p className="text-sm text-gray-900 font-medium break-words">
                        {c.value}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
          </div>

          <form
            onSubmit={submit}
            className="lg:col-span-3 rounded-3xl bg-white shadow-xl border border-gray-100 p-8 md:p-10"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Borang Pertanyaan
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Sila isi maklumat di bawah dan kami akan menghubungi anda.
            </p>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nama" value={data.nama} onChange={(v) => setData({ ...data, nama: v })} />
                <Input label="Telefon" type="tel" value={data.telefon} onChange={(v) => setData({ ...data, telefon: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Emel" type="email" value={data.emel} onChange={(v) => setData({ ...data, emel: v })} />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Negeri
                  </label>
                  <select
                    required
                    value={data.negeri}
                    onChange={(e) => setData({ ...data, negeri: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-sm focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
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
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Penerangan
                </label>
                <textarea
                  required
                  rows={4}
                  value={data.penerangan}
                  onChange={(e) => setData({ ...data, penerangan: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-sm focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white text-sm font-bold shadow-lg shadow-rose-200/60 hover:shadow-xl hover:shadow-rose-300/70 transition-all disabled:opacity-50"
              >
                {status === "sending"
                  ? "Menghantar..."
                  : status === "sent"
                  ? "Berjaya 💝"
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
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-sm focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
      />
    </div>
  );
}
