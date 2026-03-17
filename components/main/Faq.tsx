import { getFaqData } from "@/services/faqService";
import FaqClient from "./FaqClient";
import InlineError from "@/components/ui/InlineError";

export default async function Faq() {
  try {
    const faq = await getFaqData();
    if (!faq) return <InlineError componentName="Soalan Lazim" />;
    return <FaqClient faq={faq} />;
  } catch (error) {
    console.error("❌ Faq component error:", error);
    return <InlineError componentName="Soalan Lazim" />;
  }
}
