// Preview-context resolution for the bundled CMS live preview.
//
// When this static export is embedded as the CMS configuration-page preview,
// the host iframe loads the HOME page with `?preview=1&sid=<branch>&previewKey=
// <x-encrypted-key>&template=<id>`. But the nav/menu and content links inside
// the site are plain directory URLs (e.g. /preview-site/static/?slug=…) that do
// NOT carry those params — so a full-page navigation to a sub-page would lose
// the preview context and fall back to the baked DEMO tenant in config.json.
//
// To keep every sub-page rendering the SAME tenant/branch the admin is editing,
// we persist the context to sessionStorage on the first preview load and read
// it back as a fallback on pages whose URL lacks the params. sessionStorage is
// per-origin and the bundled preview is same-origin with the CMS, so it carries
// across in-iframe navigations for the life of the tab.
//
// Scoped to the bundled preview build only (NEXT_PUBLIC_BASE_PATH ===
// "/preview-site"); the standalone production cmsdisplay has an empty basePath,
// so none of this runs there and its behavior is unchanged.

const SS_KEY = "cmsdisplay-preview-ctx";

const IS_BUNDLED_PREVIEW =
  (process.env.NEXT_PUBLIC_BASE_PATH || "") === "/preview-site";

export type PreviewContext = {
  sid?: string;
  key?: string;
  template?: string;
};

function orUndef(v: string | null): string | undefined {
  return v != null && v !== "" ? v : undefined;
}

// Resolve the active preview context, or null when not in preview mode.
// URL params win; on a URL without them we fall back to the persisted context
// from the initial preview load (bundled preview only).
export function resolvePreviewContext(): PreviewContext | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "1") {
      const ctx: PreviewContext = {
        sid: orUndef(params.get("sid")),
        key: orUndef(params.get("previewKey")),
        template: orUndef(params.get("template")),
      };
      if (IS_BUNDLED_PREVIEW) {
        window.sessionStorage.setItem(SS_KEY, JSON.stringify(ctx));
      }
      return ctx;
    }
    // No preview param on this URL → use the persisted context so sub-page
    // navigations stay in preview mode for THIS tenant/branch.
    if (IS_BUNDLED_PREVIEW) {
      const raw = window.sessionStorage.getItem(SS_KEY);
      if (raw) return JSON.parse(raw) as PreviewContext;
    }
    return null;
  } catch {
    return null;
  }
}

export function isPreviewActive(): boolean {
  return resolvePreviewContext() !== null;
}

// Pin an internal navigation href to the current preview branch/tenant.
//
// In preview, a content link like /preview-site/static/?slug=5 is identical
// across branches, so the browser's HTTP/back-forward cache can serve another
// branch's already-rendered page (wrong logo, wrong content). Appending the
// active sid/previewKey/template makes each branch's URL distinct (no cache
// collision) AND lets the target page read the branch straight from its own
// URL instead of the tab-global sessionStorage. No-op outside preview, and for
// external links / anchors / mailto: etc.
export function withPreviewParams(href: string): string {
  if (typeof window === "undefined") return href;
  if (!href || href.startsWith("#")) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith("/")) return href;
  const ctx = resolvePreviewContext();
  if (!ctx) return href;
  try {
    const url = new URL(href, window.location.origin);
    // Only annotate same-origin internal links.
    if (url.origin !== window.location.origin) return href;
    url.searchParams.set("preview", "1");
    if (ctx.sid) url.searchParams.set("sid", ctx.sid);
    if (ctx.key) url.searchParams.set("previewKey", ctx.key);
    if (ctx.template) url.searchParams.set("template", ctx.template);
    return url.pathname + url.search + url.hash;
  } catch {
    return href;
  }
}
