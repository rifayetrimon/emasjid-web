"use client";

import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { useCmsData } from "@/lib/useCmsData";
import Template1Website from "@/components/templates/Template1Website";
import Template2Donation from "@/components/templates/Template2Donation";
import Template3Marketplace from "@/components/templates/Template3Marketplace";
import Template4Corporate from "@/components/templates/Template4Corporate";
import Template5Portfolio from "@/components/templates/Template5Portfolio";
import Template6Blog from "@/components/templates/Template6Blog";

export default function HomePage() {
  // Template choice comes from the live CMS config, resolved in the browser
  // so swapping templates (or tenants via config.json) needs no rebuild.
  const { data: templateId, loading } = useCmsData(
    () => getActiveTemplateId(),
    [],
  );

  if (loading || !templateId) return null;

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
      return <Template6Blog />;
    case "1":
    default:
      return <Template1Website />;
  }
}
