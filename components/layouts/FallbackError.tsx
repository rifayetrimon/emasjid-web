"use client";

export default function FallbackError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Ralat Memuatkan Halaman
        </h1>
        <p className="text-gray-600 mb-6">
          Tidak dapat mengambil data konfigurasi. Sila cuba sebentar lagi.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Cuba Semula
        </button>
      </div>
    </div>
  );
}
