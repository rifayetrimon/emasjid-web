"use client";

import { useEffect } from "react";
import { getCachedConfig } from "@/services/apiCache";
import { getImageUrl } from "@/services/utils";
import { useCmsData } from "@/lib/useCmsData";
import { MaintenancePage } from "@/components/MaintenancePage";
import { ComingSoonPage } from "@/components/ComingSoonPage";
import { isPreviewActive } from "@/lib/previewContext";

// Treats anything that means "on" — string "1", number 1, boolean true,
// "true"/"on" — as enabled. Empty / missing / "0" / false → disabled.
function isModeOn(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "boolean") return value;
  const s = String(value).trim().toLowerCase();
  return s === "1" || s === "true" || s === "on";
}

// True when rendered inside the CMS live preview. The iframe HOME url carries
// `?preview=1`; sub-pages reached by clicking a menu drop that param, so we
// also honor the persisted preview context (bundled preview only). In preview
// we always show the real site so admins can configure it while watching —
// even with maintenance/coming-soon toggled on.
function isPreviewMode(): boolean {
  return isPreviewActive();
}

// Pull the first non-empty string from a set of possible field names.
function firstNonEmpty(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (v == null) continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return undefined;
}

/**
 * Client-side runtime gate. In the static export there is no server to
 * decide maintenance/coming-soon per request, so this fetches the live CMS
 * config in the browser on every load and renders the right overlay (or the
 * site). It also keeps the document title in sync with the tenant config,
 * since static metadata is baked at build time.
 */
export default function RuntimeGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: config, loading } = useCmsData<Record<string, unknown>>(
    () => getCachedConfig(),
    [],
  );

  useEffect(() => {
    if (!config) return;
    const g = (config.generalSettings as Record<string, unknown>) || {};
    const title = firstNonEmpty(
      g.title as string,
      (config.title as string) || undefined,
    );
    // DEBUG: see whether a site title is present and which field carries it.
    console.log("🏷️ [TITLE] config.generalSettings.title:", g.title,
      "| config.title:", config.title,
      "| resolved title:", title,
      "| will show:", title || window.location.hostname);
    // Fall back to the site's own domain (hostname) when the tenant hasn't
    // set a title — never leave the baked "Title" placeholder in the tab.
    document.title = title || window.location.hostname;
    const logoUrl = getImageUrl(
      (config.logoCMS as string) || (g.logoCMS as string),
    );
    if (logoUrl) {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = logoUrl;
    }
  }, [config]);

  // While the first config load is in flight we render nothing for the gate
  // decision but keep children mounted underneath would flash the site, so
  // hold a blank frame. The data layer caches, so this is a single brief tick.
  if (loading) return null;

  // Live preview: never gate behind maintenance/coming-soon — render the actual
  // site so it can be configured while those modes are enabled.
  if (isPreviewMode()) return <>{children}</>;

  const g = ((config?.generalSettings as Record<string, unknown>) ||
    {}) as Record<string, unknown>;
  const c = (config || {}) as Record<string, unknown>;

  // ── Maintenance ──────────────────────────────────────────────────────
  const isMaintenance = isModeOn(
    g.maintenanceMode ??
      c.maintenanceMode ??
      g.maintenance ??
      g.maintainance ??
      c.maintenance ??
      c.maintainance,
  );
  if (isMaintenance) {
    return (
      <MaintenancePage
        design={
          firstNonEmpty(
            g.maintenanceTemplate,
            c.maintenanceTemplate,
            g.maintenanceDesign,
            c.maintenanceDesign,
          ) || "1"
        }
        title={firstNonEmpty(
          g.maintenanceTitle,
          c.maintenanceTitle,
          g.maintenanceHeadline,
        )}
        message={firstNonEmpty(
          g.maintenanceDescription,
          c.maintenanceDescription,
          g.maintenanceMessage,
          c.maintenanceMessage,
        )}
      />
    );
  }

  // ── Coming Soon ──────────────────────────────────────────────────────
  const isComingSoon = isModeOn(
    g.comingSoonMode ?? c.comingSoonMode ?? g.comingSoon ?? c.comingSoon,
  );
  if (isComingSoon) {
    return (
      <ComingSoonPage
        design={
          firstNonEmpty(
            g.comingSoonTemplate,
            c.comingSoonTemplate,
            g.comingSoonDesign,
            c.comingSoonDesign,
          ) || "1"
        }
        title={firstNonEmpty(
          g.comingSoonTitle,
          c.comingSoonTitle,
          g.comingSoonHeadline,
        )}
        message={firstNonEmpty(
          g.comingSoonDescription,
          c.comingSoonDescription,
          g.comingSoonMessage,
          c.comingSoonMessage,
        )}
        launchDate={firstNonEmpty(
          g.commingSoonLaunchDate,
          g.comingSoonLaunchDate,
          c.commingSoonLaunchDate,
          c.comingSoonLaunchDate,
        )}
      />
    );
  }

  return <>{children}</>;
}
