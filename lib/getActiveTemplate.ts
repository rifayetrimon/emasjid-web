import { getCachedConfig } from "@/services/apiCache";
import type { TemplateId } from "@/components/TemplateLayout";

const VALID: TemplateId[] = ["1", "2", "3", "4", "5", "6"];

export async function getActiveTemplateId(): Promise<TemplateId> {
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
