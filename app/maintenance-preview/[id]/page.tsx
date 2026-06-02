import { notFound } from "next/navigation";
import { MaintenancePage, type MaintenanceDesignId } from "@/components/MaintenancePage";
import { getCachedConfig } from "@/services/apiCache";

export const dynamic = "force-dynamic";

const VALID: MaintenanceDesignId[] = ["1", "2", "3", "4"];

export default async function MaintenancePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!VALID.includes(id as MaintenanceDesignId)) notFound();

  const config = await getCachedConfig();
  const general = config?.generalSettings || {};

  return (
    <MaintenancePage
      design={id}
      title={
        (general.maintenanceTitle as string) ||
        (general.maintenanceHeadline as string) ||
        undefined
      }
      message={
        (general.maintenanceMessage as string) ||
        (config?.maintenanceMessage as string) ||
        undefined
      }
    />
  );
}
