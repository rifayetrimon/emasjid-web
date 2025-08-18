import { useContext } from "react";
import { CMSContext } from "@/app/providers/cmsProvider"; // adjust import path

export function useCMS() {
  const ctx = useContext(CMSContext);
  if (!ctx) {
    throw new Error("useCMS must be used inside CMSProvider");
  }
  return ctx;
}
