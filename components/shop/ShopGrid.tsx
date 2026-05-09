"use client";

import { useState, useMemo } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  ArrowRight,
  Trash2,
  Check,
} from "lucide-react";
import type { ShopItem } from "@/services/shopService";

interface CartLine {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CURRENCY = "RM";

function formatPrice(value: number) {
  return `${CURRENCY} ${value.toFixed(2)}`;
}

interface Props {
  items: ShopItem[];
  ownerEmail: string;
}

export default function ShopGrid({ items, ownerEmail }: Props) {
  const [cart, setCart] = useState<Record<number, CartLine>>({});
  const [showMobileCart, setShowMobileCart] = useState(false);

  const cartArray = useMemo(() => Object.values(cart), [cart]);
  const totalItems = cartArray.reduce((s, l) => s + l.quantity, 0);
  const totalPrice = cartArray.reduce((s, l) => s + l.price * l.quantity, 0);

  const adjust = (item: Pick<ShopItem, "id" | "name" | "price">, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[item.id]?.quantity || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) {
        delete next[item.id];
      } else {
        next[item.id] = {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: newQty,
        };
      }
      return next;
    });
  };

  const remove = (id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleOrder = () => {
    if (cartArray.length === 0 || !ownerEmail) return;
    const subject = `Pesanan Baharu — ${formatPrice(totalPrice)}`;
    const lines = cartArray
      .map(
        (l) =>
          `• ${l.name}  ×${l.quantity}  =  ${formatPrice(l.price * l.quantity)}`
      )
      .join("\n");
    const body =
      `Assalamualaikum,\n\nSaya ingin membuat pesanan berikut:\n\n${lines}\n\n` +
      `─────────────────\nJumlah keseluruhan: ${formatPrice(totalPrice)}\n` +
      `Bilangan item: ${totalItems}\n─────────────────\n\n` +
      `Sila lengkapkan maklumat anda:\nNama penuh: \nNo. telefon: \nAlamat penghantaran: \n\nTerima kasih.`;
    window.location.href = `mailto:${ownerEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  if (items.length === 0) {
    return <EmptyCatalog />;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
      {/* Product list */}
      <ul className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            quantity={cart[item.id]?.quantity || 0}
            onAdd={() => adjust(item, 1)}
            onIncrement={() => adjust(item, 1)}
            onDecrement={() => adjust(item, -1)}
          />
        ))}
      </ul>

      {/* Desktop cart - sticky */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <CartPanel
            cart={cartArray}
            totalItems={totalItems}
            totalPrice={totalPrice}
            canOrder={!!ownerEmail}
            onOrder={handleOrder}
            onIncrement={(id, name, price) => adjust({ id, name, price }, 1)}
            onDecrement={(id, name, price) => adjust({ id, name, price }, -1)}
            onRemove={remove}
          />
        </div>
      </aside>

      {/* Mobile floating action */}
      {totalItems > 0 && (
        <button
          type="button"
          onClick={() => setShowMobileCart(true)}
          className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between gap-3 px-5 py-4 rounded-full bg-[var(--primary)] text-white font-bold shadow-2xl shadow-[var(--primary)]/30"
        >
          <span className="flex items-center gap-2">
            <span className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[var(--primary)] text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            </span>
            <span>Lihat Pesanan</span>
          </span>
          <span className="flex items-center gap-2">
            {formatPrice(totalPrice)}
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      )}

      {/* Mobile drawer */}
      {showMobileCart && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end"
          onClick={() => setShowMobileCart(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-h-[85vh] overflow-y-auto bg-white rounded-t-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="font-bold text-lg text-gray-900">
                  Pesanan Anda
                </h3>
              </div>
              <button
                onClick={() => setShowMobileCart(false)}
                aria-label="Tutup"
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <CartPanel
                cart={cartArray}
                totalItems={totalItems}
                totalPrice={totalPrice}
                canOrder={!!ownerEmail}
                onOrder={handleOrder}
                onIncrement={(id, name, price) =>
                  adjust({ id, name, price }, 1)
                }
                onDecrement={(id, name, price) =>
                  adjust({ id, name, price }, -1)
                }
                onRemove={remove}
                noShadow
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function ProductCard({
  item,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}: {
  item: ShopItem;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const inCart = quantity > 0;
  const lineSubtotal = item.price * quantity;

  return (
    <li
      className={`group flex flex-col rounded-2xl bg-white border transition-all p-5 md:p-6 ${
        inCart
          ? "border-[var(--primary)]/40 shadow-md"
          : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
      } ${!item.inStock ? "opacity-60" : ""}`}
    >
      <div className="flex-1 mb-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
            {item.name}
          </h3>
          {!item.inStock && (
            <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600">
              Habis
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xl font-bold text-[var(--primary)] tabular-nums leading-none">
            {formatPrice(item.price)}
          </p>
          {inCart && (
            <p className="text-[11px] text-gray-500 mt-1 tabular-nums">
              Subtotal: {formatPrice(lineSubtotal)}
            </p>
          )}
        </div>

        {!item.inStock ? (
          <button
            type="button"
            disabled
            className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Habis stok
          </button>
        ) : inCart ? (
          <div className="flex items-center gap-1 rounded-full bg-[var(--primary)]/10 p-1 border border-[var(--primary)]/30">
            <button
              type="button"
              onClick={onDecrement}
              aria-label="Kurang"
              className="w-8 h-8 rounded-full bg-white border border-[var(--primary)]/30 text-[var(--primary)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="min-w-[28px] text-center font-bold text-sm text-[var(--primary)] tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              aria-label="Tambah"
              className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:opacity-90 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah
          </button>
        )}
      </div>
    </li>
  );
}

/* ─────────────────────────────────────────────────────────── */

function CartPanel({
  cart,
  totalItems,
  totalPrice,
  canOrder,
  onOrder,
  onIncrement,
  onDecrement,
  onRemove,
  noShadow = false,
}: {
  cart: CartLine[];
  totalItems: number;
  totalPrice: number;
  canOrder: boolean;
  onOrder: () => void;
  onIncrement: (id: number, name: string, price: number) => void;
  onDecrement: (id: number, name: string, price: number) => void;
  onRemove: (id: number) => void;
  noShadow?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl bg-white border border-gray-100 overflow-hidden ${
        noShadow ? "" : "shadow-sm"
      }`}
    >
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[var(--primary)]" />
            Pesanan Anda
          </h2>
          <span className="text-xs font-bold text-gray-500 tabular-nums">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Bakul kosong</p>
          <p className="text-xs text-gray-500">
            Tambah item dari senarai untuk mula membuat pesanan.
          </p>
        </div>
      ) : (
        <>
          <ul className="max-h-[360px] overflow-y-auto divide-y divide-gray-100">
            {cart.map((line) => (
              <li key={line.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 leading-snug truncate">
                      {line.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 tabular-nums">
                      {formatPrice(line.price)} setiap satu
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(line.id)}
                    aria-label="Buang"
                    className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full bg-gray-50 p-0.5 border border-gray-200">
                    <button
                      type="button"
                      onClick={() => onDecrement(line.id, line.name, line.price)}
                      aria-label="Kurang"
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="min-w-[24px] text-center font-bold text-sm text-gray-900 tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onIncrement(line.id, line.name, line.price)}
                      aria-label="Tambah"
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-700">
                Jumlah keseluruhan
              </span>
              <span className="text-xl font-bold text-[var(--primary)] tabular-nums">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <button
              type="button"
              onClick={onOrder}
              disabled={!canOrder}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Pesan Sekarang
            </button>
            {!canOrder && (
              <p className="text-[11px] text-gray-500 text-center mt-2">
                Maklumat e-mel pemilik tidak dikonfigurasi
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function EmptyCatalog() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-16 text-center">
      <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-gray-700 mb-1">
        Tiada barangan buat masa ini
      </h2>
      <p className="text-sm text-gray-500">
        Pentadbir akan menambah barangan tidak lama lagi.
      </p>
    </div>
  );
}
