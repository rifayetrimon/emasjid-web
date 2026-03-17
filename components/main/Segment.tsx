import Image from "next/image";
import { getSegmentsData } from "@/services/segmentService";
import InlineError from "@/components/ui/InlineError";
import { getNewsData } from "@/services/newsService";

export default async function Segment() {
  let segments;
  try {
    segments = await getSegmentsData();
    await getNewsData(); // prefetch
  } catch (error) {
    console.error("❌ Segment component error:", error);
    return <InlineError componentName="Makluman/Segmen" />;
  }

  if (!segments || segments.length === 0) {
    console.warn("⚠️ SEGMENT: No segment items provided");
    return <InlineError componentName="Makluman/Segmen" />;
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {segments.map((segment, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 items-stretch gap-8"
          >
            {/* Left: Image (4 cols) */}
            <div className="col-span-12 md:col-span-4 flex justify-center md:justify-start">
              <div className="relative w-full max-w-[350px] h-[250px]">
                <Image
                  src={segment.image}
                  alt={segment.button?.label || `Segment ${idx + 1}`}
                  fill
                  className="rounded-lg shadow-md object-cover"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              </div>
            </div>

            {/* Right: Text + Button (8 cols) */}
            <div className="col-span-12 md:col-span-8 flex flex-col justify-between text-center md:text-left">
              {/* Top: Text */}
              {segment.text && (
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {segment.text}
                </p>
              )}

              {/* Bottom: Button Section (if exists) */}
              {segment.button && (
                <div className="mt-6 mb-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  {/* Left: Button */}
                  <a
                    href={segment.button.link}
                    className="px-6 py-3 border-2 border-[var(--primary)] rounded-lg text-[var(--primary)] 
                               font-medium transition-all duration-200 ease-in-out 
                               hover:bg-[var(--primary)] hover:text-white 
                               focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2
                               active:scale-95"
                  >
                    {segment.button.label}
                  </a>

                  {/* Right: See More Link */}
                  <a
                    href="#faq"
                    className="text-[var(--secondary)] font-medium hover:underline 
                               transition-all duration-200 hover:text-[var(--primary)]"
                  >
                    Lihat Lagi →
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
