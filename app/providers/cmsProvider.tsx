"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/lib/cartContext";
import { DonationCartProvider } from "@/lib/donationCartContext";

export function CMSProvider({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <DonationCartProvider>{children}</DonationCartProvider>
    </CartProvider>
  );
}
