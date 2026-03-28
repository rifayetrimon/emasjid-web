import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Halaman Tidak Dijumpai
        </h2>
        <p className="text-gray-500 mb-8">
          Halaman yang anda cari tidak wujud atau telah dialihkan.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Kembali ke Utama
        </Link>
      </div>
    </div>
  );
}
