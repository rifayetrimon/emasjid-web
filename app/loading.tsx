// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#78C841]"></div>
        <p className="mt-4 text-gray-600 text-lg">Memuatkan...</p>
      </div>
    </div>
  );
}
