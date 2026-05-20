import { Sparkles, ArrowUpRight } from "lucide-react";
import type { PluginItem } from "@/types/cms";

interface Props {
  plugins: PluginItem[];
  title?: string;
}

/**
 * Demo7-styled plugin widgets. Each admin-placed plugin (via
 * /plugin?cate=sidebar) renders as a soft rounded card. Template1Website
 * doesn't have a true sidebar so we lay them out as a horizontal grid.
 * Returns null when no plugins exist.
 */
export default function Demo7SidebarPlugins({
  plugins,
  title = "Lain-lain",
}: Props) {
  if (plugins.length === 0) return null;
  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--primary)]/20 text-xs uppercase tracking-[0.2em] font-bold text-[var(--primary)] mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {title}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Lihat Juga
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plugins.map((p) => (
            <a
              key={p.pluginId}
              href={p.urlLink || "#"}
              target={p.urlLink ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group block p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[var(--primary)]/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                  {p.title}
                </p>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition flex-shrink-0" />
              </div>
              <div
                className="text-xs text-gray-600 leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ __html: p.message }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
