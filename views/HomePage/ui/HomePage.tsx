"use client";

import { CreateCrewModal } from "@/features/create-crew";
import { CrewsList } from "@/widgets/crews-list";
import { useState } from "react";
import { HomeHeader } from "./HomeHeader";

export function HomePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="w-(--page-width) max-w-full flex flex-col px-4 sm:px-6 md:px-0 py-6 gap-6">
      <HomeHeader onCreateCrew={() => setIsCreateModalOpen(true)} />

      <CrewsList onCreateCrew={() => setIsCreateModalOpen(true)} />

      <CreateCrewModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
