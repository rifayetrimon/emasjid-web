"use client";

import { useMemo, useState, useEffect, type FormEvent } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Sparkles,
  X,
  ChevronDown,
} from "lucide-react";
import type {
  DonationGroup,
  DonationItem,
} from "@/services/donationService";
import {
  useDonationCart,
  formatDonation,
  type DonationCartItem,
} from "@/lib/donationCartContext";

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

const EMPTY_FORM: AddressForm = {
  fullName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postcode: "",
  notes: "",
};

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

const PRESET_AMOUNTS = [5, 10, 20, 50];

type Step = "cart" | "address" | "done";

interface Props {
  groups: DonationGroup[];
  logoUrl: string;
  tenantTitle: string;
}

const ALL = "__all__";

function deriveCategory(groupName: string): string {
  const trimmed = groupName.trim();
  const beforeSep = trimmed.split(/\s*[-:·/]\s*/)[0] || trimmed;
  const words = beforeSep.split(/\s+/).slice(0, 2);
  const cat = words.join(" ");
  return cat.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

const TINTS = [
  "from-sky-100/95 to-sky-50/80 text-sky-950",
  "from-rose-100/95 to-rose-50/80 text-rose-950",
  "from-violet-100/95 to-violet-50/80 text-violet-950",
  "from-amber-100/95 to-amber-50/80 text-amber-950",
  "from-emerald-100/95 to-emerald-50/80 text-emerald-950",
  "from-orange-100/95 to-orange-50/80 text-orange-950",
  "from-fuchsia-100/95 to-fuchsia-50/80 text-fuchsia-950",
  "from-teal-100/95 to-teal-50/80 text-teal-950",
];

function tintFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return TINTS[h % TINTS.length];
}

export default function DonateGrid({
  groups,
  logoUrl,
  tenantTitle,
}: Props) {
  const {
    items: cart,
    totalItems,
    totalPrice,
    addItem,
    increment,
    decrement,
    removeItem,
    clearCart,
    hydrated,
  } = useDonationCart();

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of groups) {
      const c = deriveCategory(g.name);
      const itemCount = g.items.length || g.totalItem || 0;
      map.set(c, (map.get(c) || 0) + itemCount);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [groups]);

  const totalCatalog = useMemo(
    () => categories.reduce((s, c) => s + c.count, 0),
    [categories]
  );

  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [pickerItem, setPickerItem] = useState<DonationItem | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    address: AddressForm;
    items: DonationCartItem[];
    totalPrice: number;
  } | null>(null);

  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  useEffect(() => {
    if (cart.length > 0 && !hasAutoOpened) {
      setHasAutoOpened(true);
    } else if (cart.length === 0) {
      setHasAutoOpened(false);
    }
  }, [cart.length, hasAutoOpened]);

  const qtyById = useMemo(() => {
    const m = new Map<number, number>();
    for (const c of cart) m.set(c.id, (m.get(c.id) || 0) + c.quantity);
    return m;
  }, [cart]);

  // Donations always go through the amount picker so the donor sets the
  // amount (preset 5/10/20/50 or custom). Shop adds directly because each
  // product has a fixed price.
  const openPicker = (item: DonationItem) => setPickerItem(item);

  const confirmPick = (amount: number) => {
    if (!pickerItem) return;
    addItem(
      { id: pickerItem.id, name: pickerItem.name, price: amount },
      1
    );
    setPickerItem(null);
  };

  const proceedToAddress = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };
  const backToCart = () => {
    setCheckoutOpen(false);
    setCartOpen(true);
    setStep("cart");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    setConfirmedOrder({
      orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
      address: form,
      items: [...cart],
      totalPrice,
    });
    setTimeout(() => {
      clearCart();
      setForm(EMPTY_FORM);
      setSubmitting(false);
      setCheckoutOpen(false);
      setStep("done");
      setCartOpen(true);
    }, 400);
  };

  const startNewOrder = () => {
    setConfirmedOrder(null);
    setStep("cart");
  };

  const visibleGroups = useMemo(() => {
    return groups
      .filter((g) => g.items.length > 0)
      .filter(
        (g) =>
          activeCategory === ALL || deriveCategory(g.name) === activeCategory
      );
  }, [groups, activeCategory]);

  return (
    <>
      {/* ━━━━━━ Hero ━━━━━━ */}
      <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold uppercase tracking-[0.18em] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Boleh Sumbang
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] mb-3">
            Kedai
            <span className="text-[var(--primary)] italic font-light">
              {" "}
              pilihan.
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-md leading-relaxed">
            Item terpilih untuk anda. Hantar pesanan dalam satu tap.
          </p>
        </div>

        <CartPill
          totalItems={totalItems}
          totalPrice={totalPrice}
          hydrated={hydrated}
          onClick={() => setCartOpen(true)}
        />
      </header>

      {/* ━━━━━━ Category pills ━━━━━━ */}
      <div className="mb-10 -mx-1 overflow-x-auto">
        <div className="flex items-center gap-2 px-1 min-w-max">
          <CategoryPill
            label="Semua"
            count={totalCatalog}
            active={activeCategory === ALL}
            onClick={() => setActiveCategory(ALL)}
          />
          {categories.map((c) => (
            <CategoryPill
              key={c.name}
              label={c.name}
              count={c.count}
              active={activeCategory === c.name}
              onClick={() => setActiveCategory(c.name)}
            />
          ))}
        </div>
      </div>

      {/* ━━━━━━ Group cards ━━━━━━ */}
      {visibleGroups.length === 0 ? (
        <EmptyCatalog />
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {visibleGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              qtyById={qtyById}
              onAdd={openPicker}
              onIncrement={increment}
              onDecrement={decrement}
            />
          ))}
        </ul>
      )}

      {/* ━━━━━━ Cart drawer ━━━━━━ */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        step={step}
        hydrated={hydrated}
        cart={cart}
        totalItems={totalItems}
        totalPrice={totalPrice}
        confirmedOrder={confirmedOrder}
        onIncrement={increment}
        onDecrement={decrement}
        onRemove={removeItem}
        onProceed={proceedToAddress}
        onStartNewOrder={startNewOrder}
      />

      {/* ━━━━━━ Checkout / payment modal ━━━━━━ */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onBack={backToCart}
        cart={cart}
        totalPrice={totalPrice}
        form={form}
        setForm={setForm}
        submitting={submitting}
        onSubmit={handleSubmit}
        logoUrl={logoUrl}
        tenantTitle={tenantTitle}
      />

      {/* ━━━━━━ Amount picker modal ━━━━━━ */}
      {pickerItem && (
        <AmountPicker
          item={pickerItem}
          onCancel={() => setPickerItem(null)}
          onConfirm={confirmPick}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* Cart pill + category pill                                   */
/* ═══════════════════════════════════════════════════════════ */

function CartPill({
  totalItems,
  totalPrice,
  hydrated,
  onClick,
}: {
  totalItems: number;
  totalPrice: number;
  hydrated: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur px-4 py-3">
      <div className="text-right pr-3 border-r border-gray-800">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Jumlah
        </p>
        <p className="text-sm font-semibold tabular-nums">
          <span className="text-gray-500 text-[10px] font-medium mr-0.5">
            RM
          </span>
          {(hydrated ? totalPrice : 0).toFixed(2)}
        </p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-900 text-xs font-semibold hover:bg-white transition"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        Bakul
        {hydrated && totalItems > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
}

function CategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 pl-4 pr-3 py-2 rounded-full text-[13px] font-medium transition whitespace-nowrap border ${
        active
          ? "bg-white text-gray-900 border-white"
          : "bg-transparent text-gray-300 border-gray-800 hover:border-gray-700 hover:text-white"
      }`}
    >
      <span>{label}</span>
      <span className="text-[10px] font-semibold tabular-nums text-gray-500">
        {count}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* Group card — one card per donation group, listing item names      */
/* ═══════════════════════════════════════════════════════════════════ */

function GroupCard({
  group,
  qtyById,
  onAdd,
  onIncrement,
  onDecrement,
}: {
  group: DonationGroup;
  qtyById: Map<number, number>;
  onAdd: (item: DonationItem) => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
}) {
  const tint = tintFor(group.code || group.name);
  const anyInCart = group.items.some((it) => (qtyById.get(it.id) || 0) > 0);

  return (
    <li
      className={`flex flex-col rounded-2xl bg-gray-900/70 border overflow-hidden transition-all duration-200 ${
        anyInCart
          ? "border-[var(--primary)]/50 shadow-lg shadow-[var(--primary)]/10"
          : "border-gray-800 hover:border-gray-700"
      }`}
    >
      {/* Group name header */}
      <div
        className={`relative px-5 py-6 bg-gradient-to-br ${tint}`}
      >
        <h3 className="text-base md:text-lg font-bold tracking-tight leading-tight">
          {group.name}
        </h3>
      </div>

      {/* Items inside the group */}
      <ul className="divide-y divide-gray-800">
        {group.items.map((item) => {
          const qty = qtyById.get(item.id) || 0;
          const inCart = qty > 0;
          return (
            <li
              key={item.id}
              className={`flex items-center justify-between gap-3 px-4 py-3 ${
                !item.active ? "opacity-60" : ""
              }`}
            >
              <p className="text-sm font-medium text-gray-100 leading-snug flex-1 min-w-0">
                {item.name}
              </p>

              {!item.active ? (
                <button
                  type="button"
                  disabled
                  aria-label="Tidak aktif"
                  className="w-7 h-7 rounded-md bg-gray-800 text-gray-600 cursor-not-allowed flex items-center justify-center flex-shrink-0"
                >
                  ×
                </button>
              ) : inCart ? (
                <div className="flex items-center gap-0.5 rounded-md bg-gray-800 p-0.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onDecrement(item.id)}
                    aria-label="Kurang"
                    className="w-6 h-6 rounded-sm text-gray-300 hover:bg-gray-700 flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="min-w-[20px] text-center font-semibold text-[11px] text-gray-100 tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onIncrement(item.id)}
                    aria-label="Tambah"
                    className="w-6 h-6 rounded-sm bg-[var(--primary)] text-white flex items-center justify-center hover:opacity-90"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onAdd(item)}
                  aria-label="Sumbang"
                  className="w-8 h-8 rounded-md border border-gray-700 text-gray-300 hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition flex items-center justify-center flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* Amount picker — donation-specific. Donors set RM amount     */
/* via preset chips (5/10/20/50) or a custom input.            */
/* ═══════════════════════════════════════════════════════════ */

function AmountPicker({
  item,
  onCancel,
  onConfirm,
}: {
  item: DonationItem;
  onCancel: () => void;
  onConfirm: (amount: number) => void;
}) {
  const initial =
    item.price > 0 && PRESET_AMOUNTS.includes(item.price)
      ? item.price
      : PRESET_AMOUNTS[1];
  const [selected, setSelected] = useState<number | "custom">(initial);
  const [custom, setCustom] = useState<string>(
    item.price > 0 && !PRESET_AMOUNTS.includes(item.price)
      ? item.price.toFixed(2)
      : ""
  );

  const amount =
    selected === "custom" ? Number(custom) || 0 : (selected as number);
  const canConfirm = amount > 0;

  return (
    <div className="fixed top-[var(--shop-nav-h,96px)] right-0 bottom-0 left-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Tutup"
        onClick={onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl text-gray-900 overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-6">
          <div className="min-w-0 pr-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)] mb-1">
              Pilih jumlah
            </p>
            <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
              {item.name}
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">{item.code}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Tutup"
            className="p-1.5 rounded-full hover:bg-gray-100 transition flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 pt-5 pb-6">
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            {PRESET_AMOUNTS.map((p) => {
              const active = selected === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelected(p)}
                  className={`px-3 py-3 rounded-xl text-sm font-semibold transition border tabular-nums ${
                    active
                      ? "bg-[var(--primary)]/8 border-[var(--primary)]/60 text-[var(--primary)]"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="text-[10px] font-medium text-gray-500 mr-0.5">
                    RM
                  </span>
                  {p}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setSelected("custom")}
            className={`w-full flex items-center gap-2 px-3.5 py-3 rounded-xl text-sm transition border ${
              selected === "custom"
                ? "bg-[var(--primary)]/8 border-[var(--primary)]/60"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                selected === "custom" ? "text-[var(--primary)]" : "text-gray-500"
              }`}
            >
              RM
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              step="0.01"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setSelected("custom");
              }}
              onFocus={() => setSelected("custom")}
              placeholder="Jumlah lain"
              className="flex-1 bg-transparent outline-none text-sm font-semibold tabular-nums text-gray-900 placeholder:text-gray-400"
            />
          </button>

          <button
            type="button"
            onClick={() => onConfirm(amount)}
            disabled={!canConfirm}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah RM {amount.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* Cart drawer                                                 */
/* ═══════════════════════════════════════════════════════════ */

function CartDrawer({
  open,
  onClose,
  step,
  hydrated,
  cart,
  totalItems,
  totalPrice,
  confirmedOrder,
  onIncrement,
  onDecrement,
  onRemove,
  onProceed,
  onStartNewOrder,
}: {
  open: boolean;
  onClose: () => void;
  step: Step;
  hydrated: boolean;
  cart: DonationCartItem[];
  totalItems: number;
  totalPrice: number;
  confirmedOrder: {
    orderId: string;
    address: AddressForm;
    items: DonationCartItem[];
    totalPrice: number;
  } | null;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
  onProceed: () => void;
  onStartNewOrder: () => void;
}) {
  if (!open) return null;
  const showTotalHero = step !== "done";
  return (
    <div className="fixed top-[var(--shop-nav-h,96px)] right-0 bottom-0 left-0 z-40 flex">
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className="flex-1 bg-black/60 backdrop-blur-sm"
      />
      <div className="w-full max-w-md bg-white text-gray-900 shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="font-semibold text-gray-900">Bakul Anda</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Stepper step={step} />

          {showTotalHero && (
            <div className="px-5 pb-4 pt-0 text-center bg-gradient-to-b from-[var(--primary)]/5 to-transparent">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.18em] mb-1.5">
                Jumlah Bayaran
              </p>
              <p className="text-3xl md:text-4xl font-semibold text-[var(--primary)] tabular-nums leading-none mb-2">
                <span className="text-xs font-medium text-[var(--primary)]/60 align-top mr-1">
                  RM
                </span>
                {totalPrice.toFixed(2).split(".")[0]}
                <span className="text-lg md:text-xl text-[var(--primary)]/60 font-medium">
                  .{totalPrice.toFixed(2).split(".")[1]}
                </span>
              </p>
              <p className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
                <Lock className="w-3 h-3" />
                Selamat &amp; Peribadi
              </p>
            </div>
          )}

          {step === "cart" && (
            <CartStep
              hydrated={hydrated}
              cart={cart}
              totalItems={totalItems}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
              onProceed={onProceed}
            />
          )}

          {step === "done" && confirmedOrder && (
            <DoneStep
              order={confirmedOrder}
              onStartNewOrder={onStartNewOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const stages: { key: Step; label: string }[] = [
    { key: "cart", label: "Bakul" },
    { key: "address", label: "Maklumat" },
    { key: "done", label: "Selesai" },
  ];
  const activeIdx = stages.findIndex((s) => s.key === step);
  return (
    <div className="px-5 pt-5 pb-3">
      <ol className="flex items-center gap-2">
        {stages.map((s, idx) => {
          const isDone = idx < activeIdx;
          const isActive = idx === activeIdx;
          return (
            <li key={s.key} className="flex-1 flex items-center gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition ${
                    isDone
                      ? "bg-[var(--primary)] text-white"
                      : isActive
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </span>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
                    isActive
                      ? "text-gray-900"
                      : isDone
                      ? "text-[var(--primary)]"
                      : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < stages.length - 1 && (
                <span
                  className={`flex-1 h-px ${
                    idx < activeIdx ? "bg-[var(--primary)]" : "bg-gray-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CartStep({
  hydrated,
  cart,
  totalItems,
  onIncrement,
  onDecrement,
  onRemove,
  onProceed,
}: {
  hydrated: boolean;
  cart: DonationCartItem[];
  totalItems: number;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
  onProceed: () => void;
}) {
  return (
    <>
      <div className="px-5 pb-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[var(--primary)]" />
          Item dalam bakul
        </h2>
        <span className="text-xs font-semibold text-gray-500 tabular-nums">
          {hydrated ? totalItems : 0} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>
      {!hydrated ? (
        <div className="px-5 py-12 text-center">
          <div className="w-7 h-7 mx-auto border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-500">Memuat bakul...</p>
        </div>
      ) : cart.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 mb-4">
            <ShoppingBag className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Bakul kosong
          </p>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Tambah item dari senarai untuk mula membuat pesanan.
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-100">
            {cart.map((line) => (
              <li key={`${line.id}-${line.price}`} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 leading-snug truncate">
                      {line.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 tabular-nums">
                      {formatDonation(line.price)} setiap satu
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
                      onClick={() => onDecrement(line.id)}
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
                      onClick={() => onIncrement(line.id)}
                      aria-label="Tambah"
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 tabular-nums">
                    {formatDonation(line.price * line.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
            <button
              type="button"
              onClick={onProceed}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-[var(--primary)] transition"
            >
              Teruskan ke Bayaran
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-gray-500 text-center mt-2.5 inline-flex items-center justify-center gap-1.5 w-full">
              <ShieldCheck className="w-3 h-3" />
              Selamat &amp; peribadi
            </p>
          </div>
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* Checkout modal — pixel-matched to the shop CheckoutModal    */
/* ═══════════════════════════════════════════════════════════ */

const MY_BANKS = [
  "Maybank2u",
  "CIMB Clicks",
  "Public Bank",
  "RHB Now",
  "Hong Leong Connect",
  "AmBank",
  "Bank Islam",
  "Bank Rakyat",
];

function CheckoutModal({
  open,
  onClose,
  onBack,
  cart,
  totalPrice,
  form,
  setForm,
  submitting,
  onSubmit,
  logoUrl,
  tenantTitle,
}: {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  cart: DonationCartItem[];
  totalPrice: number;
  form: AddressForm;
  setForm: (f: AddressForm) => void;
  submitting: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  logoUrl: string;
  tenantTitle: string;
}) {
  const [payMethod, setPayMethod] = useState<"transfer" | "online">("transfer");
  const [bank, setBank] = useState<string>(MY_BANKS[0]);
  const [bankPickerOpen, setBankPickerOpen] = useState(false);

  if (!open) return null;
  const update = (key: keyof AddressForm, value: string) =>
    setForm({ ...form, [key]: value });

  const subtotal = totalPrice;
  const totalIntStr = totalPrice.toFixed(2).split(".")[0];
  const totalDecStr = totalPrice.toFixed(2).split(".")[1];

  return (
    <div className="fixed top-[var(--shop-nav-h,96px)] right-0 bottom-0 left-0 z-40 flex items-center justify-center p-3 md:p-6">
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-5xl max-h-[94vh] rounded-3xl bg-white shadow-2xl overflow-hidden text-gray-900 grid md:grid-cols-[1fr_360px]">
        <form
          onSubmit={onSubmit}
          className="overflow-y-auto p-6 md:p-9 flex flex-col"
        >
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={tenantTitle}
                  className="w-7 h-7 rounded-full object-cover bg-[var(--primary)]/10"
                />
              ) : (
                <span
                  className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center"
                  aria-hidden
                >
                  <span className="block w-2.5 h-2.5 rounded-full border-2 border-white" />
                </span>
              )}
              <span className="text-base font-medium tracking-tight text-gray-900">
                {tenantTitle}
              </span>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-700 transition"
            >
              <ArrowLeft className="w-3 h-3" />
              Kembali
            </button>
          </div>

          <p className="text-[13px] text-gray-500 mb-2.5">Customer Information</p>
          <div className="rounded-xl border border-gray-200 overflow-hidden mb-7">
            <div className="px-4 py-3">
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Nama penuh"
                className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
              />
            </div>
            <div className="border-t border-gray-200" />

            <div className="grid grid-cols-[80px_1fr_1.4fr] divide-x divide-gray-200">
              <div className="px-4 py-3 flex items-center gap-1 text-[13px] text-gray-700">
                <span className="font-medium">+60</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
              <div className="px-4 py-3">
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="12 345 6789"
                  className="w-full text-[13px] text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                />
              </div>
              <div className="px-4 py-3">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="emel@contoh.com"
                  className="w-full text-[13px] text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="border-t border-gray-200" />

            <div className="px-4 py-3 flex items-center justify-between">
              <span className="flex items-center gap-2.5 text-[13px] text-gray-800">
                <span className="text-sm leading-none">🇲🇾</span>
                Malaysia
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="border-t border-gray-200" />

            <div className="grid grid-cols-[1fr_130px] divide-x divide-gray-200">
              <div className="px-4 py-3">
                <select
                  required
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className="w-full text-[13px] text-gray-900 outline-none bg-transparent appearance-none cursor-pointer"
                >
                  <option value="">Pilih Negeri</option>
                  {MY_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="px-4 py-3">
                <input
                  type="text"
                  required
                  pattern="[0-9]{5}"
                  title="5 digit poskod"
                  value={form.postcode}
                  onChange={(e) => update("postcode", e.target.value)}
                  placeholder="00000"
                  className="w-full text-[13px] text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="border-t border-gray-200" />

            <div className="px-4 py-3">
              <input
                type="text"
                required
                value={form.address1}
                onChange={(e) => update("address1", e.target.value)}
                placeholder="Alamat penghantaran"
                className="w-full text-[13px] text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
              />
            </div>
          </div>

          <p className="text-[13px] text-gray-500 mb-2.5">Payment method</p>
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <PaymentMethodButton
              icon="bank"
              label="e-Transfer"
              active={payMethod === "transfer"}
              onClick={() => setPayMethod("transfer")}
            />
            <PaymentMethodButton
              icon="card"
              label="OnLine"
              active={payMethod === "online"}
              onClick={() => setPayMethod("online")}
            />
          </div>

          {payMethod === "transfer" && (
            <>
              <p className="text-[13px] text-gray-500 mb-1.5">Bank</p>
              <button
                type="button"
                onClick={() => setBankPickerOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3 mb-6 border-b border-gray-200 text-left hover:bg-gray-50/50 transition"
              >
                <span className="text-[13px] font-medium text-gray-900">
                  {bank}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </>
          )}

          <button
            type="submit"
            disabled={submitting || cart.length === 0}
            className="mt-auto w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--primary)] text-white text-[13px] font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Memproses…" : "Make payment"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <aside className="bg-gray-100/60 p-6 md:p-7 flex flex-col">
          <div className="text-center mb-6 mt-1">
            <p className="text-[13px] text-gray-500 mb-1.5">Total amount</p>
            <p className="font-medium text-[var(--primary)] tabular-nums leading-none">
              <span className="text-sm align-top mr-0.5">RM</span>
              <span className="text-4xl md:text-5xl">{totalIntStr}</span>
              <span className="text-2xl text-[var(--primary)]/55">
                .{totalDecStr}
              </span>
            </p>
            <p className="inline-flex items-center gap-1.5 mt-2.5 text-[11px] font-medium text-emerald-600">
              <ShieldCheck className="w-3 h-3" />
              Secure Payment
            </p>
          </div>

          <div className="border-t border-gray-300/60 pt-5">
            <p className="text-[13px] text-gray-500 mb-4">Order Summary</p>
            <ul className="space-y-3 mb-4 pb-4 border-b border-gray-300/60 max-h-[200px] overflow-y-auto">
              {cart.length === 0 ? (
                <li className="text-xs text-gray-400 italic">
                  Tiada item dalam bakul.
                </li>
              ) : (
                cart.map((line) => (
                  <li
                    key={`${line.id}-${line.price}`}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-gray-900 leading-snug line-clamp-2">
                        {line.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Kuantiti × {line.quantity}
                      </p>
                    </div>
                    <span className="text-[13px] font-medium text-gray-900 tabular-nums whitespace-nowrap">
                      {formatDonation(line.price * line.quantity)}
                    </span>
                  </li>
                ))
              )}
            </ul>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 tabular-nums">
                  {formatDonation(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-500 italic text-xs">
                  Disahkan kemudian
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-4 border-t border-gray-300/60">
              <span className="text-sm font-medium text-gray-900">Total</span>
              <span className="text-base font-medium text-[var(--primary)] tabular-nums">
                {formatDonation(totalPrice)}
              </span>
            </div>
          </div>
        </aside>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-gray-200 transition items-center justify-center text-gray-600 hidden md:flex"
        >
          <X className="w-4 h-4" />
        </button>

        {bankPickerOpen && (
          <BankPicker
            value={bank}
            onChange={(b) => {
              setBank(b);
              setBankPickerOpen(false);
            }}
            onClose={() => setBankPickerOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

function PaymentMethodButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: "bank" | "card";
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium transition border ${
        active
          ? "bg-[var(--primary)]/8 border-[var(--primary)]/60 text-[var(--primary)]"
          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
      }`}
    >
      {icon === "bank" ? (
        <BankIcon active={active} />
      ) : (
        <CardIcon active={active} />
      )}
      <span>{label}</span>
    </button>
  );
}

function BankIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-[var(--primary)]" : "text-gray-500"}
      aria-hidden
    >
      <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-7h6v7" />
    </svg>
  );
}

function CardIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-[var(--primary)]" : "text-gray-500"}
      aria-hidden
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </svg>
  );
}

function BankPicker({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (b: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-4 right-4 left-4 md:left-auto md:w-[280px] rounded-2xl bg-gray-900 text-white shadow-2xl z-10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-[13px] font-medium">Choose Bank</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="p-1 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <ul className="divide-y divide-white/10 max-h-[240px] overflow-y-auto">
        {MY_BANKS.map((b) => {
          const selected = b === value;
          return (
            <li key={b}>
              <button
                type="button"
                onClick={() => onChange(b)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[13px] hover:bg-white/5 transition ${
                  selected ? "text-white" : "text-gray-200"
                }`}
              >
                <span className="w-7 h-7 rounded bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0">
                  {b.slice(0, 3).toUpperCase()}
                </span>
                <span className="flex-1 truncate">{b}</span>
                {selected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DoneStep({
  order,
  onStartNewOrder,
}: {
  order: {
    orderId: string;
    address: AddressForm;
    items: DonationCartItem[];
    totalPrice: number;
  };
  onStartNewOrder: () => void;
}) {
  return (
    <div className="px-5 py-6 text-center">
      <div className="relative inline-flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full bg-emerald-100 blur-md opacity-70" />
        <div className="relative w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Pesanan Diterima!
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Terima kasih,{" "}
        <strong className="text-gray-700">{order.address.fullName}</strong>.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-xs mb-5">
        <Sparkles className="w-3 h-3 text-[var(--primary)]" />
        <span className="text-gray-500">No. pesanan:</span>
        <span className="font-mono font-bold text-gray-900 tabular-nums">
          {order.orderId}
        </span>
      </div>
      <div className="text-left rounded-2xl bg-gray-50 border border-gray-100 p-4 mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Ringkasan
        </p>
        <ul className="space-y-1.5 mb-3 pb-3 border-b border-gray-200">
          {order.items.map((line) => (
            <li
              key={`${line.id}-${line.price}`}
              className="flex justify-between text-xs text-gray-700"
            >
              <span className="truncate pr-3">
                {line.name} × {line.quantity}
              </span>
              <span className="tabular-nums font-semibold whitespace-nowrap">
                {formatDonation(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-700">Jumlah</span>
          <span className="text-lg font-semibold text-[var(--primary)] tabular-nums">
            {formatDonation(order.totalPrice)}
          </span>
        </div>
      </div>
      <div className="text-left rounded-2xl bg-amber-50 border border-amber-200 p-3.5 mb-5 text-xs text-amber-900">
        <p className="font-semibold mb-0.5">Langkah seterusnya</p>
        <p className="text-amber-800 leading-relaxed">
          Pasukan kami akan menghubungi anda di{" "}
          <strong>{order.address.phone}</strong> untuk pengesahan pembayaran.
        </p>
      </div>
      <button
        type="button"
        onClick={onStartNewOrder}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-[var(--primary)] transition"
      >
        Buat Pesanan Baharu
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* Empty state                                                 */
/* ═══════════════════════════════════════════════════════════ */

function EmptyCatalog() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
        <ShoppingBag className="w-7 h-7 text-gray-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-200 mb-1">
        Tiada barangan buat masa ini
      </h2>
      <p className="text-sm text-gray-500">
        Pentadbir akan menambah barangan tidak lama lagi.
      </p>
    </div>
  );
}
