// services/featuresService.ts
import { getCachedConfig } from "./apiCache";
import { FeaturesProps } from "@/types/cms";

export async function getFeaturesData(): Promise<
  FeaturesProps["fetures"] | null
> {
  try {
    const configData = await getCachedConfig();

    // Features are not provided by the current API endpoints.
    // Return the section title from config so the CMS controls it.
    const bannerConfig = configData.bannerConfig || {};
    return {
      title: bannerConfig.banneTitle || "",
      items: [],
    };
  } catch (error) {
    console.error("❌ Error fetching features data:", error);
    return null;
  }
}
