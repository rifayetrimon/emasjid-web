import { DEMO_INSTITUTIONS, type DemoInstitution } from "@/lib/demoContent";

export type Institution = DemoInstitution;

/**
 * Returns institutions eligible to receive donations. Currently backed by
 * the demo catalog — when the CMS API exposes a real `/institutions`
 * endpoint, swap this for a `myAxios.get(...)` call.
 */
export async function getInstitutions(): Promise<Institution[]> {
  return DEMO_INSTITUTIONS;
}
