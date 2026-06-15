import { getCachedConfig } from "@/services/apiCache";
import type { TemplateId } from "@/components/TemplateLayout";
import { resolvePreviewContext } from "./previewContext";

const VALID: TemplateId[] = ["1", "2", "3", "4", "5", "6"];

// In the CMS live preview the iframe URL carries `?preview=1&template=<id>`
// (or a persisted preview context on sub-pages). The admin's just-picked
// template hasn't been saved yet, so the API config still reports the OLD
// template — without this override the preview only updates after Save +
// refresh. Reading it here lets the template switch the moment the admin
// clicks it (the host remounts the iframe with the new URL).
function getPreviewTemplateOverride(): TemplateId | null {
  const t = resolvePreviewContext()?.template;
  return t && VALID.includes(t as TemplateId) ? (t as TemplateId) : null;
}

export async function getActiveTemplateId(): Promise<TemplateId> {
  // Preview override wins over the saved config so template changes show live.
  const override = getPreviewTemplateOverride();
  if (override) {
    console.log("🧩 [getActiveTemplateId] preview override templateId:", override);
    return override;
  }
  try {
    const config = await getCachedConfig();
    console.log("🧩 [getActiveTemplateId] config:", JSON.stringify(config, null, 2));
    // Default to template "6" (blog) when the tenant config doesn't specify
    // a template, or specifies an unrecognized one.
    const raw = String(config?.generalSettings?.template || "6");
    console.log("🧩 [getActiveTemplateId] resolved templateId:", raw);
    return (VALID.includes(raw as TemplateId) ? raw : "6") as TemplateId;
  } catch (err) {
    console.error("🧩 [getActiveTemplateId] failed:", err);
    return "6";
  }
}
