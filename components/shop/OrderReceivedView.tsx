"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { formatPrice, type CartItem } from "@/lib/cartContext";
import { withBasePath } from "@/lib/withBasePath";

interface OrderAddress {
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

interface OrderSnapshot {
  orderId: string;
  placedAt: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  address: OrderAddress;
}

const ORDER_STORAGE_KEY = "emasjid-last-order-v1";

export default function OrderReceivedView() {
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as OrderSnapshot;
        if (parsed && parsed.orderId) setOrder(parsed);
      }
    } catch {
      // sessionStorage unavailable — show generic confirmation.
    }
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <GenericThankYou />;
  }

  const placedAt = new Date(order.placedAt);
  const placedAtLabel = placedAt.toLocaleString("ms-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
          Pesanan Diterima
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Terima kasih, <strong className="text-gray-700">{order.address.fullName}</strong>.
          Kami akan menghubungi anda untuk pengesahan pembayaran dan penghantaran.
        </p>
        <div className="mt-5 inline-flex flex-col sm:flex-row items-center gap-3 px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm">
          <span className="text-gray-500">No. pesanan:</span>
          <span className="font-mono font-bold text-gray-900 tabular-nums">
            {order.orderId}
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="text-gray-500 text-xs">{placedAtLabel}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Customer details */}
        <section className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">
            Maklumat Pelanggan
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-800 break-all">
                {order.address.email}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-800">{order.address.phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-800 leading-relaxed">
                {order.address.address1}
                {order.address.address2 && <>, {order.address.address2}</>}
                <br />
                {order.address.postcode} {order.address.city},{" "}
                {order.address.state}
              </span>
            </li>
            {order.address.notes && (
              <li className="pt-3 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Nota
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {order.address.notes}
                </p>
              </li>
            )}
          </ul>
        </section>

        {/* Order details */}
        <section className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">
            Pesanan Anda
          </h2>
          <ul className="space-y-3 mb-4 pb-4 border-b border-gray-100">
            {order.items.map((line) => (
              <li
                key={line.id}
                className="flex justify-between items-start gap-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 leading-snug">
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
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-gray-900">Jumlah</span>
            <span className="text-2xl font-bold text-[var(--primary)] tabular-nums">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </section>
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 mb-8 text-sm text-amber-900">
        <p className="font-bold mb-1">Langkah seterusnya</p>
        <p className="leading-relaxed text-amber-800">
          Pasukan kami akan menghubungi anda dalam masa 1–2 hari bekerja untuk
          mengesahkan butiran pesanan dan kaedah pembayaran. Sila simpan no.
          pesanan untuk rujukan.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={withBasePath("/shop")}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:opacity-90 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Sambung Membeli
        </Link>
        <Link
          href={withBasePath("/")}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Kembali ke Utama
        </Link>
      </div>
    </div>
  );
}

function GenericThankYou() {
  return (
    <div className="text-center py-10">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-5">
        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
        Terima Kasih
      </h1>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
        Tiada butiran pesanan ditemui dalam sesi semasa. Jika anda baru sahaja
        membuat pesanan, kami akan menghubungi anda tidak lama lagi.
      </p>
      <Link
        href={withBasePath("/shop")}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--primary)] text-white text-sm font-bold hover:opacity-90 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Pergi ke Kedai
      </Link>
    </div>
  );
}
