import { getCachedConfig } from "@/services/apiCache";
import type { TemplateId } from "@/components/TemplateLayout";

const VALID: TemplateId[] = ["1", "2", "3", "4", "5", "6"];

export async function getActiveTemplateId(): Promise<TemplateId> {
  try {
    const config = await getCachedConfig();
    const raw = String(config?.generalSettings?.template || "1");
    return (VALID.includes(raw as TemplateId) ? raw : "1") as TemplateId;
  } catch {
    return "1";
  }
}
