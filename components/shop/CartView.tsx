"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCart, formatPrice } from "@/lib/cartContext";
import { withBasePath } from "@/lib/withBasePath";

export default function CartView() {
  const {
    items,
    totalItems,
    totalPrice,
    increment,
    decrement,
    removeItem,
    hydrated,
  } = useCart();

  if (!hydrated) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

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
          <span className="text-gray-800">Bakul</span>
        </nav>
        <div className="flex items-end justify-between gap-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Bakul Anda
          </h1>
          <span className="text-sm text-gray-500 tabular-nums">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Item list */}
        <ul className="rounded-2xl bg-white border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {items.map((line) => (
            <li
              key={line.id}
              className="px-5 py-5 md:px-6 md:py-6 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-base md:text-lg font-bold text-gray-900 leading-snug">
                  {line.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 tabular-nums">
                  {formatPrice(line.price)} setiap satu
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="flex items-center gap-1 rounded-full bg-gray-50 p-0.5 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => decrement(line.id)}
                    aria-label="Kurang"
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="min-w-[32px] text-center font-bold text-sm text-gray-900 tabular-nums">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increment(line.id)}
                    aria-label="Tambah"
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-base font-bold text-gray-900 tabular-nums min-w-[80px] text-right">
                  {formatPrice(line.price * line.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(line.id)}
                  aria-label="Buang"
                  className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary card */}
        <aside className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-5">
            Ringkasan Pesanan
          </h2>
          <div className="space-y-2 text-sm mb-5 pb-5 border-b border-gray-100">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Penghantaran</span>
              <span className="text-gray-500 italic text-xs">
                Dikira semasa daftar keluar
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-base font-bold text-gray-900">
              Jumlah keseluruhan
            </span>
            <span className="text-2xl font-bold text-[var(--primary)] tabular-nums">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <Link
            href={withBasePath("/shop/checkout")}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:opacity-90 transition"
          >
            Teruskan ke Daftar Keluar
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={withBasePath("/shop")}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Sambung Membeli
          </Link>
        </aside>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-5">
          <ShoppingBag className="w-7 h-7 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bakul anda kosong
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Belum ada item dalam bakul. Lihat kedai untuk mula menambah barangan.
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
