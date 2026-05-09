import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import Template1Website from "@/components/templates/Template1Website";
import Template2Donation from "@/components/templates/Template2Donation";
import Template3Marketplace from "@/components/templates/Template3Marketplace";
import Template4Corporate from "@/components/templates/Template4Corporate";
import Template5Portfolio from "@/components/templates/Template5Portfolio";
import Template6Classic from "@/components/templates/Template6Classic";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const templateId = await getActiveTemplateId();

  switch (templateId) {
    case "2":
      return <Template2Donation />;
    case "3":
      return <Template3Marketplace />;
    case "4":
      return <Template4Corporate />;
    case "5":
      return <Template5Portfolio />;
    case "6":
      return <Template6Classic />;
    case "1":
    default:
      return <Template1Website />;
  }
}
