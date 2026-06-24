"use client";
import { useEffect } from "react";
import { useContentReady } from "@/lib/contentReady";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useContentReady(); // complete the progress bar once the error UI is shown
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 max-w-md">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          Sesuatu Tidak Kena
        </h2>
        <p className="text-gray-600 mb-6">
          Maaf, berlaku ralat semasa memuatkan halaman ini.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#78C841] text-white rounded-lg hover:bg-[#6ab535] transition font-medium"
        >
          Cuba Semula
        </button>
      </div>
    </div>
  );
}
