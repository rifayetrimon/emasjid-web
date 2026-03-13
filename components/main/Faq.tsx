import { getFaqData } from "@/services/faqService";
import FaqClient from "./FaqClient";
import InlineError from "@/components/ui/InlineError";

export default async function Faq() {
  const faq = await getFaqData();

  if (!faq) return <InlineError componentName="Soalan Lazim" />;

  return <FaqClient faq={faq} />;
}
