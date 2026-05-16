"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/lib/cartContext";

export function CMSProvider({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
