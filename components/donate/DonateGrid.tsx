"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  HandHeart,
  Heart,
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
} from "lucide-react";
import type { Institution } from "@/services/donateService";

const PRESET_AMOUNTS = [5, 10, 20] as const;
const CURRENCY = "RM";

function formatAmount(n: number): string {
  return `${CURRENCY} ${n.toFixed(2)}`;
}

interface AddressForm {
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  anonymous: boolean;
}

const EMPTY_FORM: AddressForm = {
  fullName: "",
  email: "",
  phone: "",
  notes: "",
  anonymous: false,
};

interface Selection {
  institutionId: number;
  institutionName: string;
  amount: number;
}

type Step = "select" | "details" | "done";

interface Props {
  institutions: Institution[];
}

export default function DonateGrid({ institutions }: Props) {
  /**
   * selections keyed by institutionId for fast lookups by the cards
   * (each card needs to know its own selected amount + custom-mode state).
   */
  const [selections, setSelections] = useState<Map<number, number>>(new Map());
  const [customMode, setCustomMode] = useState<Set<number>>(new Set());
  const [customInputs, setCustomInputs] = useState<Map<number, string>>(
    new Map()
  );

  const [step, setStep] = useState<Step>("select");
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{
    orderId: string;
    selections: Selection[];
    total: number;
    address: AddressForm;
  } | null>(null);

  const selectionList: Selection[] = useMemo(() => {
    return institutions
      .filter((i) => (selections.get(i.id) ?? 0) > 0)
      .map((i) => ({
        institutionId: i.id,
        institutionName: i.name,
        amount: selections.get(i.id) || 0,
      }));
  }, [institutions, selections]);

  const total = selectionList.reduce((s, x) => s + x.amount, 0);

  const setAmount = (id: number, amount: number) => {
    setSelections((prev) => {
      const next = new Map(prev);
      if (amount <= 0) next.delete(id);
      else next.set(id, amount);
      return next;
    });
  };

  const removeSelection = (id: number) => setAmount(id, 0);

  const toggleCustom = (id: number) => {
    setCustomMode((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setCustomInput = (id: number, value: string) => {
    setCustomInputs((prev) => {
      const next = new Map(prev);
      next.set(id, value);
      return next;
    });
    const parsed = parseFloat(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      setAmount(id, parsed);
    } else {
      setAmount(id, 0);
    }
  };

  const proceedToDetails = () => setStep("details");
  const backToSelect = () => setStep("details" === "details" ? "select" : "select");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectionList.length === 0) return;
    setSubmitting(true);
    setConfirmed({
      orderId: `DON-${Date.now().toString(36).toUpperCase()}`,
      selections: selectionList,
      total,
      address: form,
    });
    setTimeout(() => {
      setSelections(new Map());
      setCustomMode(new Set());
      setCustomInputs(new Map());
      setForm(EMPTY_FORM);
      setSubmitting(false);
      setStep("done");
    }, 400);
  };

  const startNew = () => {
    setConfirmed(null);
    setStep("select");
  };

  if (institutions.length === 0) {
    return <EmptyCatalog />;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-10 items-start">
      {/* Institution list */}
      <ul className="grid sm:grid-cols-2 gap-5">
        {institutions.map((inst) => {
          const amount = selections.get(inst.id) || 0;
          const isCustom = customMode.has(inst.id);
          return (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              amount={amount}
              isCustom={isCustom}
              customValue={customInputs.get(inst.id) || ""}
              onPreset={(v) => {
                if (isCustom) toggleCustom(inst.id);
                // Tapping the same chip again clears the selection.
                setAmount(inst.id, amount === v ? 0 : v);
              }}
              onClear={() => {
                if (isCustom) toggleCustom(inst.id);
                setAmount(inst.id, 0);
              }}
              onToggleCustom={() => toggleCustom(inst.id)}
              onCustomInput={(v) => setCustomInput(inst.id, v)}
            />
          );
        })}
      </ul>

      {/* Stateful side panel */}
      <aside className="lg:sticky lg:top-24">
        <SidePanel
          step={step}
          selectionList={selectionList}
          total={total}
          form={form}
          setForm={setForm}
          submitting={submitting}
          confirmed={confirmed}
          onRemove={removeSelection}
          onProceed={proceedToDetails}
          onBack={backToSelect}
          onSubmit={handleSubmit}
          onStartNew={startNew}
        />
      </aside>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* Institution card                                              */
/* ═══════════════════════════════════════════════════════════ */

function InstitutionCard({
  institution,
  amount,
  isCustom,
  customValue,
  onPreset,
  onClear,
  onToggleCustom,
  onCustomInput,
}: {
  institution: Institution;
  amount: number;
  isCustom: boolean;
  customValue: string;
  onPreset: (v: number) => void;
  onClear: () => void;
  onToggleCustom: () => void;
  onCustomInput: (v: string) => void;
}) {
  const isSelected = amount > 0;

  return (
    <li
      className={`group relative flex flex-col rounded-2xl bg-white p-5 md:p-6 border transition-all ${
        isSelected
          ? "border-[var(--primary)]/40 shadow-lg shadow-[var(--primary)]/10"
          : "border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
          {institution.category}
        </span>
        {isSelected && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
            <Check className="w-3 h-3" />
            Dipilih
          </span>
        )}
      </div>

      <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug mb-1">
        {institution.name}
      </h3>
      {institution.description && (
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {institution.description}
        </p>
      )}

      {/* Amount picker */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
          Jumlah Sumbangan
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_AMOUNTS.map((v) => {
            const active = !isCustom && amount === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onPreset(v)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border ${
                  active
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                {CURRENCY} {v}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onToggleCustom}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border ${
              isCustom
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
            }`}
          >
            Lain
          </button>
          {isSelected && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Buang pilihan"
              className="ml-auto p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isCustom && (
          <div className="mt-3 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
              {CURRENCY}
            </span>
            <input
              type="number"
              min="1"
              step="0.5"
              inputMode="decimal"
              value={customValue}
              onChange={(e) => onCustomInput(e.target.value)}
              placeholder="Masukkan jumlah"
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition"
              autoFocus
            />
          </div>
        )}

        {isSelected && (
          <p className="mt-3 text-sm font-bold text-[var(--primary)] tabular-nums">
            {formatAmount(amount)}
          </p>
        )}
      </div>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* Side panel: select → details → done                          */
/* ═══════════════════════════════════════════════════════════ */

function SidePanel({
  step,
  selectionList,
  total,
  form,
  setForm,
  submitting,
  confirmed,
  onRemove,
  onProceed,
  onBack,
  onSubmit,
  onStartNew,
}: {
  step: Step;
  selectionList: Selection[];
  total: number;
  form: AddressForm;
  setForm: (f: AddressForm) => void;
  submitting: boolean;
  confirmed: {
    orderId: string;
    selections: Selection[];
    total: number;
    address: AddressForm;
  } | null;
  onRemove: (id: number) => void;
  onProceed: () => void;
  onBack: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onStartNew: () => void;
}) {
  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
      <Stepper step={step} />

      {step === "select" && (
        <SelectStep
          selectionList={selectionList}
          total={total}
          onRemove={onRemove}
          onProceed={onProceed}
        />
      )}

      {step === "details" && (
        <DetailsStep
          form={form}
          setForm={setForm}
          total={total}
          itemCount={selectionList.length}
          submitting={submitting}
          canSubmit={selectionList.length > 0}
          onBack={onBack}
          onSubmit={onSubmit}
        />
      )}

      {step === "done" && confirmed && (
        <DoneStep order={confirmed} onStartNew={onStartNew} />
      )}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const stages: { key: Step; label: string }[] = [
    { key: "select", label: "Pilihan" },
    { key: "details", label: "Maklumat" },
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

/* ───── Step 1: Selection summary ───── */

function SelectStep({
  selectionList,
  total,
  onRemove,
  onProceed,
}: {
  selectionList: Selection[];
  total: number;
  onRemove: (id: number) => void;
  onProceed: () => void;
}) {
  return (
    <>
      <div className="px-5 pb-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <HandHeart className="w-4 h-4 text-[var(--primary)]" />
          Sumbangan Anda
        </h2>
        <span className="text-xs font-bold text-gray-500 tabular-nums">
          {selectionList.length}{" "}
          {selectionList.length === 1 ? "institusi" : "institusi"}
        </span>
      </div>

      {selectionList.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 mb-4">
            <Heart className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Belum ada pilihan
          </p>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Pilih institusi dan jumlah sumbangan dari senarai untuk meneruskan.
          </p>
        </div>
      ) : (
        <>
          <ul className="max-h-[360px] overflow-y-auto divide-y divide-gray-100">
            {selectionList.map((s) => (
              <li
                key={s.institutionId}
                className="px-5 py-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 leading-snug truncate">
                    {s.institutionName}
                  </p>
                  <p className="text-xs text-[var(--primary)] mt-0.5 tabular-nums font-bold">
                    {formatAmount(s.amount)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(s.institutionId)}
                  aria-label="Buang"
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-700">
                Jumlah
              </span>
              <span className="text-2xl font-bold text-[var(--primary)] tabular-nums">
                {formatAmount(total)}
              </span>
            </div>
            <button
              type="button"
              onClick={onProceed}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-[var(--primary)] transition"
            >
              Teruskan ke Bayaran
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-gray-500 text-center mt-2.5 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              Selamat &amp; peribadi
            </p>
          </div>
        </>
      )}
    </>
  );
}

/* ───── Step 2: Donor details ───── */

function DetailsStep({
  form,
  setForm,
  total,
  itemCount,
  submitting,
  canSubmit,
  onBack,
  onSubmit,
}: {
  form: AddressForm;
  setForm: (f: AddressForm) => void;
  total: number;
  itemCount: number;
  submitting: boolean;
  canSubmit: boolean;
  onBack: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const update = <K extends keyof AddressForm>(key: K, value: AddressForm[K]) =>
    setForm({ ...form, [key]: value });

  return (
    <form onSubmit={onSubmit}>
      <div className="px-5 pb-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[var(--primary)]" />
          Maklumat &amp; Bayaran
        </h2>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-3 h-3" />
          Kembali
        </button>
      </div>

      <div className="px-5 py-4 space-y-3 max-h-[460px] overflow-y-auto">
        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
          <input
            type="checkbox"
            checked={form.anonymous}
            onChange={(e) => update("anonymous", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span className="text-xs font-semibold text-gray-700">
            Sumbang sebagai tanpa nama
          </span>
        </label>

        <Field label="Nama penuh" required={!form.anonymous}>
          <input
            type="text"
            required={!form.anonymous}
            disabled={form.anonymous}
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder={form.anonymous ? "Tanpa nama" : ""}
            className={inputClass}
          />
        </Field>

        <Field label="E-mel" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Untuk resit"
            className={inputClass}
          />
        </Field>

        <Field label="Telefon" required>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="01x-xxx xxxx"
            className={inputClass}
          />
        </Field>

        <Field label="Nota / Doa">
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            placeholder="Tinggalkan doa atau ucapan (pilihan)"
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
          <span>
            {itemCount} institusi
          </span>
          <span className="tabular-nums">{formatAmount(total)}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-700">
            Jumlah Sumbangan
          </span>
          <span className="text-2xl font-bold text-[var(--primary)] tabular-nums">
            {formatAmount(total)}
          </span>
        </div>
        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--primary)] text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lock className="w-4 h-4" />
          {submitting ? "Memproses..." : "Sahkan Sumbangan"}
        </button>
        <p className="text-[10px] text-gray-500 text-center mt-2.5">
          Pasukan kami akan menghubungi anda untuk mengesahkan bayaran.
        </p>
      </div>
    </form>
  );
}

/* ───── Step 3: Done ───── */

function DoneStep({
  order,
  onStartNew,
}: {
  order: {
    orderId: string;
    selections: Selection[];
    total: number;
    address: AddressForm;
  };
  onStartNew: () => void;
}) {
  const donorName = order.address.anonymous
    ? "Penyumbang tanpa nama"
    : order.address.fullName || "Penyumbang";

  return (
    <div className="px-5 py-6 text-center">
      <div className="relative inline-flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full bg-emerald-100 blur-md opacity-70" />
        <div className="relative w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        Terima Kasih!
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Sumbangan daripada{" "}
        <strong className="text-gray-700">{donorName}</strong> telah diterima.
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-xs mb-5">
        <Sparkles className="w-3 h-3 text-[var(--primary)]" />
        <span className="text-gray-500">No. rujukan:</span>
        <span className="font-mono font-bold text-gray-900 tabular-nums">
          {order.orderId}
        </span>
      </div>

      <div className="text-left rounded-2xl bg-gray-50 border border-gray-100 p-4 mb-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
          Ringkasan
        </p>
        <ul className="space-y-1.5 mb-3 pb-3 border-b border-gray-200">
          {order.selections.map((s) => (
            <li
              key={s.institutionId}
              className="flex justify-between text-xs text-gray-700"
            >
              <span className="truncate pr-3">{s.institutionName}</span>
              <span className="tabular-nums font-semibold whitespace-nowrap">
                {formatAmount(s.amount)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-700">Jumlah</span>
          <span className="text-lg font-bold text-[var(--primary)] tabular-nums">
            {formatAmount(order.total)}
          </span>
        </div>
      </div>

      <div className="text-left rounded-2xl bg-amber-50 border border-amber-200 p-3.5 mb-5 text-xs text-amber-900">
        <p className="font-bold mb-0.5">Langkah seterusnya</p>
        <p className="text-amber-800 leading-relaxed">
          Pasukan kami akan menghubungi anda di{" "}
          <strong>{order.address.phone}</strong> untuk mengesahkan bayaran dan
          menghantar resit.
        </p>
      </div>

      <button
        type="button"
        onClick={onStartNew}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-[var(--primary)] transition"
      >
        Sumbang Lagi
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* Empty state                                                  */
/* ═══════════════════════════════════════════════════════════ */

function EmptyCatalog() {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white p-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <HandHeart className="w-7 h-7 text-gray-300" />
      </div>
      <h2 className="text-lg font-semibold text-gray-700 mb-1">
        Tiada institusi buat masa ini
      </h2>
      <p className="text-sm text-gray-500">
        Pentadbir akan menambah institusi tidak lama lagi.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* Form bits                                                    */
/* ═══════════════════════════════════════════════════════════ */

const inputClass =
  "w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition disabled:bg-gray-50 disabled:text-gray-400";

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
      <span className="text-[11px] font-semibold text-gray-700 mb-1 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
