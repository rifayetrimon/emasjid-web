"use client";

import { useState, FormEvent } from "react";

interface ContactFormProps {
  email: string;
  address: string;
  state: string;
}

const NEGERI_LIST = [
  "JOHOR",
  "KEDAH",
  "KELANTAN",
  "MELAKA",
  "NEGERI SEMBILAN",
  "PAHANG",
  "PERAK",
  "PERLIS",
  "PULAU PINANG",
  "SABAH",
  "SARAWAK",
  "SELANGOR",
  "TERENGGANU",
  "W.P. KUALA LUMPUR",
  "W.P. LABUAN",
  "W.P. PUTRAJAYA",
];

export default function ContactForm({ email, address, state }: ContactFormProps) {
  const [formData, setFormData] = useState({
    nama: "",
    telefon: "",
    emel: "",
    negeri: state?.toUpperCase() || "",
    tajuk: "",
    penerangan: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const subject = encodeURIComponent(formData.tajuk || "Pertanyaan");
    const body = encodeURIComponent(
      `Nama: ${formData.nama}\nNo. Telefon: ${formData.telefon}\nEmel: ${formData.emel}\nNegeri: ${formData.negeri}\n\n${formData.penerangan}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setStatus("sent");
      setFormData({ nama: "", telefon: "", emel: "", negeri: state?.toUpperCase() || "", tajuk: "", penerangan: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
      {/* Left: Lokasi */}
      <div className="bg-white p-8 md:p-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Lokasi</h2>
        <div className="w-full h-[350px] md:h-[420px] bg-gray-100 rounded overflow-hidden">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=101.5,2.8,101.9,3.2&layer=mapnik`}
            className="w-full h-full border-0"
            loading="lazy"
            title="Lokasi"
          />
        </div>
        {address && (
          <p className="mt-4 text-sm text-gray-500">{address}</p>
        )}
      </div>

      {/* Right: Pertanyaan Form */}
      <div className="bg-white p-8 md:p-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Pertanyaan</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Nama + No.Telefon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="c-nama" className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                id="c-nama"
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-4 py-2.5 rounded border border-gray-300 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all text-gray-900 text-sm"
                placeholder="Nama"
              />
            </div>
            <div>
              <label htmlFor="c-telefon" className="block text-sm font-medium text-gray-700 mb-1">
                No.Telefon
              </label>
              <input
                id="c-telefon"
                type="tel"
                required
                value={formData.telefon}
                onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                className="w-full px-4 py-2.5 rounded border border-gray-300 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all text-gray-900 text-sm"
                placeholder="No.Telefon"
              />
            </div>
          </div>

          {/* Row 2: Emel + Negeri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="c-emel" className="block text-sm font-medium text-gray-700 mb-1">
                Emel
              </label>
              <input
                id="c-emel"
                type="email"
                required
                value={formData.emel}
                onChange={(e) => setFormData({ ...formData, emel: e.target.value })}
                className="w-full px-4 py-2.5 rounded border border-gray-300 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all text-gray-900 text-sm"
                placeholder="Emel"
              />
            </div>
            <div>
              <label htmlFor="c-negeri" className="block text-sm font-medium text-gray-700 mb-1">
                Negeri
              </label>
              <select
                id="c-negeri"
                required
                value={formData.negeri}
                onChange={(e) => setFormData({ ...formData, negeri: e.target.value })}
                className="w-full px-4 py-2.5 rounded border border-gray-300 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all text-gray-900 text-sm bg-white"
              >
                <option value="">Pilih Negeri</option>
                {NEGERI_LIST.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Tajuk */}
          <div>
            <label htmlFor="c-tajuk" className="block text-sm font-medium text-gray-700 mb-1">
              Tajuk
            </label>
            <input
              id="c-tajuk"
              type="text"
              required
              value={formData.tajuk}
              onChange={(e) => setFormData({ ...formData, tajuk: e.target.value })}
              className="w-full px-4 py-2.5 rounded border border-gray-300 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all text-gray-900 text-sm"
              placeholder="Tajuk"
            />
          </div>

          {/* Row 4: Penerangan */}
          <div>
            <label htmlFor="c-penerangan" className="block text-sm font-medium text-gray-700 mb-1">
              Penerangan
            </label>
            <textarea
              id="c-penerangan"
              required
              rows={4}
              value={formData.penerangan}
              onChange={(e) => setFormData({ ...formData, penerangan: e.target.value })}
              className="w-full px-4 py-2.5 rounded border border-gray-300 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all text-gray-900 text-sm resize-vertical"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="px-12 py-3 rounded font-semibold text-sm tracking-wider uppercase transition-all duration-200
                         bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "MENGHANTAR..." : status === "sent" ? "BERJAYA!" : "HANTAR"}
            </button>
          </div>

          {status === "sent" && (
            <p className="text-center text-sm text-green-600 font-medium">
              Terima kasih! Mesej anda telah dihantar.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
