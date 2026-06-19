"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NewsArticleView from "@/components/news/NewsArticleView";

function SectionLoader() {
  return (
    <div className="w-full py-8 flex justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

function NewsDetailInner() {
  const sp = useSearchParams();
  const id = sp.get("id") || "";
  return <NewsArticleView id={id} />;
}

export default function NewsDetailPage() {
  // useSearchParams must be under a Suspense boundary for static export.
  return (
    <Suspense fallback={<SectionLoader />}>
      <NewsDetailInner />
    </Suspense>
  );
}
