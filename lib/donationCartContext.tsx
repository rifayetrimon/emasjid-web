"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface DonationCartItem {
  id: number;
  name: string;
  /** Amount per unit. For donations the donor picks this via the amount
   *  picker (preset chips + custom input). */
  price: number;
  quantity: number;
}

interface DonationCartValue {
  items: DonationCartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<DonationCartItem, "quantity">, quantity?: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  hydrated: boolean;
}

const STORAGE_KEY = "emasjid-donation-cart-v1";

const DonationCartContext = createContext<DonationCartValue | null>(null);

export function DonationCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<DonationCartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DonationCartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Ignore corrupt storage.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage quota / private mode — skip.
    }
  }, [items, hydrated]);

  // Donations are amount-driven, so we merge by id + price: picking a
  // different amount for the same item creates a new line rather than
  // collapsing it.
  const addItem = useCallback(
    (item: Omit<DonationCartItem, "quantity">, quantity: number = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.id === item.id && i.price === item.price
        );
        if (existing) {
          return prev.map((i) =>
            i.id === existing.id && i.price === existing.price
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    []
  );

  const setQuantity = useCallback((id: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  }, []);

  const increment = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }, []);

  const decrement = useCallback((id: number) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (!target) return prev;
      if (target.quantity <= 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );
  const totalPrice = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );

  const value: DonationCartValue = {
    items,
    totalItems,
    totalPrice,
    addItem,
    setQuantity,
    increment,
    decrement,
    removeItem,
    clearCart,
    hydrated,
  };

  return (
    <DonationCartContext.Provider value={value}>
      {children}
    </DonationCartContext.Provider>
  );
}

export function useDonationCart(): DonationCartValue {
  const ctx = useContext(DonationCartContext);
  if (!ctx) {
    throw new Error(
      "useDonationCart must be used inside a <DonationCartProvider>"
    );
  }
  return ctx;
}

export const DONATION_CURRENCY = "RM";

export function formatDonation(value: number): string {
  return `${DONATION_CURRENCY} ${value.toFixed(2)}`;
}
