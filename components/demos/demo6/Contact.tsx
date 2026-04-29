"use client";

import { useState, FormEvent } from "react";

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

export default function Demo6Contact({ email, phone, address, state }: Props) {
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
    <section className="bg-white border-y-[3px] border-black">
      <div className="grid lg:grid-cols-12">
        <div className="lg:col-span-5 border-r-0 lg:border-r-[3px] border-black p-8 md:p-14 bg-black text-white">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] mb-4 font-bold text-yellow-400">
            §06 / Hubungi
          </p>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-10">
            Hantar
            <br />
            <span className="text-yellow-400">Mesej.</span>
          </h2>

          <div className="space-y-5 font-mono text-sm">
            {[
              { k: "Tel", v: phone },
              { k: "Eml", v: email },
              { k: "Adr", v: address },
            ]
              .filter((c) => c.v)
              .map((c, i) => (
                <div key={i} className="flex gap-5 border-t border-white/20 pt-4">
                  <span className="text-yellow-400 uppercase tracking-wider font-bold w-12 flex-shrink-0">
                    {c.k}
                  </span>
                  <span className="break-words flex-1">{c.v}</span>
                </div>
              ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="lg:col-span-7 p-8 md:p-14"
        >
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <Input label="Nama" value={data.nama} onChange={(v) => setData({ ...data, nama: v })} index="01" />
            <Input label="Telefon" type="tel" value={data.telefon} onChange={(v) => setData({ ...data, telefon: v })} index="02" />
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <Input label="Emel" type="email" value={data.emel} onChange={(v) => setData({ ...data, emel: v })} index="03" />
            <div>
              <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-2">
                <span className="text-gray-400">04</span>
                Negeri
              </label>
              <select
                required
                value={data.negeri}
                onChange={(e) => setData({ ...data, negeri: e.target.value })}
                className="w-full px-0 py-3 text-base bg-transparent border-0 border-b-[3px] border-black focus:border-yellow-400 outline-none transition-colors font-mono uppercase"
              >
                <option value="">— Pilih —</option>
                {NEGERI_LIST.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <Input label="Tajuk" value={data.tajuk} onChange={(v) => setData({ ...data, tajuk: v })} index="05" />
          </div>
          <div className="mb-8">
            <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-2">
              <span className="text-gray-400">06</span>
              Penerangan
            </label>
            <textarea
              required
              rows={4}
              value={data.penerangan}
              onChange={(e) => setData({ ...data, penerangan: e.target.value })}
              className="w-full px-0 py-3 text-base bg-transparent border-0 border-b-[3px] border-black focus:border-yellow-400 outline-none transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full md:w-auto inline-flex items-center justify-between gap-6 px-8 py-5 bg-yellow-400 hover:bg-black hover:text-yellow-400 text-black border-[3px] border-black font-black uppercase tracking-wider text-sm transition-colors disabled:opacity-50"
          >
            <span>
              {status === "sending"
                ? "Menghantar..."
                : status === "sent"
                ? "Berjaya ✓"
                : "Hantar Mesej"}
            </span>
            <span className="text-2xl">→</span>
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
  index,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  index: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-2">
        <span className="text-gray-400">{index}</span>
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-0 py-3 text-base bg-transparent border-0 border-b-[3px] border-black focus:border-yellow-400 outline-none transition-colors"
      />
    </div>
  );
}
