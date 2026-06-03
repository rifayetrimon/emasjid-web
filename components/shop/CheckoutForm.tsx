"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ShoppingBag, Lock } from "lucide-react";
import { useCart, formatPrice } from "@/lib/cartContext";
import { withBasePath } from "@/lib/withBasePath";

// Malaysian states. The select dropdown uses this list; admin tenants in
// other regions can swap it freely.
const MY_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "W.P. Kuala Lumpur",
  "W.P. Labuan",
  "W.P. Putrajaya",
];

interface AddressForm {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  notes: string;
}

const ORDER_STORAGE_KEY = "emasjid-last-order-v1";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart, hydrated } = useCart();
  const [form, setForm] = useState<AddressForm>({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (hydrated && items.length === 0) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-5">
            <ShoppingBag className="w-7 h-7 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bakul kosong
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Tambah item dahulu sebelum meneruskan ke daftar keluar.
          </p>
          <Link
            href={withBasePath("/shop")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--primary)] text-white text-sm font-bold hover:opacity-90 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Pergi ke Kedai
          </Link>
        </div>
      </div>
    );
  }

  const update = (key: keyof AddressForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    // Build a snapshot of the order to show on the thank-you page.
    // sessionStorage scopes this to the current tab, exactly what we want
    // for a single completed-checkout flow.
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const snapshot = {
      orderId,
      placedAt: new Date().toISOString(),
      items,
      totalItems,
      totalPrice,
      address: form,
    };
    try {
      window.sessionStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify(snapshot)
      );
    } catch {
      // Storage unavailable — proceed anyway, the thank-you page will
      // gracefully fall back to a generic confirmation.
    }
    clearCart();
    router.push(withBasePath("/shop/order-received"));
  };

  return (
    <div>
      <header className="mb-8 md:mb-10">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Link
            href={withBasePath("/")}
            className="hover:text-[var(--primary)] transition"
          >
            Utama
          </Link>
          <span>›</span>
          <Link
            href={withBasePath("/shop")}
            className="hover:text-[var(--primary)] transition"
          >
            Kedai
          </Link>
          <span>›</span>
          <Link
            href={withBasePath("/shop/cart")}
            className="hover:text-[var(--primary)] transition"
          >
            Bakul
          </Link>
          <span>›</span>
          <span className="text-gray-800">Daftar Keluar</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Daftar Keluar
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Lengkapkan maklumat penghantaran anda untuk melengkapkan pesanan.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-[1fr_400px] gap-8 items-start"
      >
        {/* Address fields */}
        <section className="rounded-2xl bg-white border border-gray-100 p-6 md:p-8 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
            Maklumat Penghantaran
          </h2>

          <Field label="Nama penuh" required>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="E-mel" required>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="No. telefon" required>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="01x-xxx xxxx"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Alamat baris 1" required>
            <input
              type="text"
              required
              value={form.address1}
              onChange={(e) => update("address1", e.target.value)}
              placeholder="No. rumah, jalan"
              className={inputClass}
            />
          </Field>

          <Field label="Alamat baris 2">
            <input
              type="text"
              value={form.address2}
              onChange={(e) => update("address2", e.target.value)}
              placeholder="Taman, kawasan (pilihan)"
              className={inputClass}
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Bandar" required>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Negeri" required>
              <select
                required
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className={inputClass}
              >
                <option value="">Pilih</option>
                {MY_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Poskod" required>
              <input
                type="text"
                required
                pattern="[0-9]{5}"
                title="5 digit poskod"
                value={form.postcode}
                onChange={(e) => update("postcode", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Nota tambahan">
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              placeholder="Arahan khas untuk penghantaran (pilihan)"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </section>

        {/* Order summary + submit */}
        <aside className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-5">
            Ringkasan Pesanan
          </h2>

          {hydrated && (
            <ul className="space-y-3 mb-5 pb-5 border-b border-gray-100 max-h-64 overflow-y-auto">
              {items.map((line) => (
                <li
                  key={line.id}
                  className="flex justify-between items-start gap-3 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 leading-snug truncate">
                      {line.name}
                    </p>
                    <p className="text-xs text-gray-500 tabular-nums">
                      {formatPrice(line.price)} × {line.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900 tabular-nums whitespace-nowrap">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-2 text-sm mb-5 pb-5 border-b border-gray-100">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Penghantaran</span>
              <span className="text-gray-500 italic text-xs">
                Akan disahkan kemudian
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-base font-bold text-gray-900">Jumlah</span>
            <span className="text-2xl font-bold text-[var(--primary)] tabular-nums">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            {submitting ? "Memproses..." : "Sahkan Pesanan"}
          </button>
          <p className="text-[11px] text-gray-500 text-center mt-3">
            Dengan menghantar pesanan, anda bersetuju untuk dihubungi oleh
            pentadbir untuk pengesahan pembayaran.
          </p>

          <Link
            href={withBasePath("/shop/cart")}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Bakul
          </Link>
        </aside>
      </form>
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition";

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-700 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
