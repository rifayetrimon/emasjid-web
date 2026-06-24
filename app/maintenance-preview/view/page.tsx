"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MaintenancePage,
  type MaintenanceDesignId,
} from "@/components/MaintenancePage";
import { getCachedConfig } from "@/services/apiCache";
import { useCmsData } from "@/lib/useCmsData";
import ContentReadyBeacon from "@/components/ContentReadyBeacon";

const VALID: MaintenanceDesignId[] = ["1", "2", "3", "4"];

function MaintenancePreviewInner() {
  const sp = useSearchParams();
  const id = (sp.get("id") || "") as MaintenanceDesignId;

  const { data, loading } = useCmsData(() => getCachedConfig(), []);

  if (!VALID.includes(id)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700 px-6">
        <ContentReadyBeacon />
        <p className="text-sm">Unknown maintenance design id.</p>
      </main>
    );
  }

  if (loading) return <div className="min-h-screen bg-white" />;

  const config = (data || {}) as Record<string, unknown>;
  const general = (config?.generalSettings as Record<string, unknown>) || {};

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

export default function MaintenancePreviewPage() {
  // useSearchParams must be under a Suspense boundary for static export.
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <MaintenancePreviewInner />
    </Suspense>
  );
}
