"use client";

import Link from "next/link";
import { MAINTENANCE_DESIGN_OPTIONS } from "@/components/MaintenancePage";
import { getCachedConfig } from "@/services/apiCache";
import { useCmsData } from "@/lib/useCmsData";
import { useContentReady } from "@/lib/contentReady";

export default function MaintenancePreviewIndex() {
  useContentReady(); // this page renders immediately — complete the progress bar
  const { data } = useCmsData(() => getCachedConfig(), []);
  const config = (data || {}) as Record<string, unknown>;
  const general = (config?.generalSettings as Record<string, unknown>) || {};
  const tenantTitle =
    (general.title as string) || (config?.title as string) || "Tenant";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500 mb-2">
            Admin Preview
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Maintenance page designs
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl">
            Pick the design that fits <strong>{tenantTitle}</strong>. The
            chosen ID goes into the CMS field <code className="text-xs px-1.5 py-0.5 rounded bg-gray-100">maintenanceDesign</code>;
            flip <code className="text-xs px-1.5 py-0.5 rounded bg-gray-100">maintenance</code> to <code>1</code> to put the whole site into that state.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 gap-5">
          {MAINTENANCE_DESIGN_OPTIONS.map((opt) => (
            <li
              key={opt.id}
              className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <Link
                href={`/maintenance-preview/view/?id=${opt.id}`}
                className="block"
                target="_blank"
                rel="noopener"
              >
                <div className="aspect-[16/10] relative">
                  <iframe
                    src={`/maintenance-preview/view/?id=${opt.id}`}
                    title={`Design ${opt.id} — ${opt.label}`}
                    className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                    sandbox="allow-same-origin"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h2 className="text-lg font-semibold tracking-tight">
                      Design {opt.id} — {opt.label}
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Open ↗
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
