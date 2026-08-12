"use client";

import { CreateSplitWizard } from "@/features/create-split";
import { useParams } from "next/navigation";

export function CreateSplitView() {
  const params = useParams();
  const crewId = Number(params?.id);

  if (!crewId || isNaN(crewId)) {
    return null;
  }

  return (
    <div className="w-full animate-page-slide-in-right">
      <CreateSplitWizard crewId={crewId} />
    </div>
  );
}
