// services/faqService.ts
import { getCachedFaq, getCachedConfig } from "./apiCache";
import { FAQProps } from "@/types/cms";

export async function getFaqData(): Promise<FAQProps["faq"] | null> {
  try {
    const faqData = await getCachedFaq();
    const configData = await getCachedConfig();

    const faqItems = Array.isArray(faqData) ? faqData : [];

    // No FAQ configured for this tenant → hide the section. Returning null
    // lets every template's `{faq && faq.items.length > 0 && ...}` guard skip
    // it, rather than padding the page with demo content that isn't theirs.
    if (faqItems.length === 0) return null;

    const faqConfig = configData.faqConfig || {};
    const items = faqItems.map(
      (item: { title: string; description: string; message: string }) => ({
        question: item.title || "",
        text: item.description || "",
        answer: item.message || "",
      })
    );

    return {
      title: faqConfig.faqTitle || "Soalan Lazim",
      background_image: "",
      items,
    };
  } catch (error) {
    console.error("❌ Error fetching FAQ data:", error);
    // On error, hide the section rather than show demo content.
    return null;
  }
}
