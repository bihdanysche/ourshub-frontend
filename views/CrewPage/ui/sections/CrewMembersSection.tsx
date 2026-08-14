"use client";

import { CrewMembersList } from "@/widgets/crew-members";
import { useParams } from "next/navigation";

export function CrewMembersSection() {
  const params = useParams();
  const crewId = Number(params?.id);

  return (
    <div className="w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <CrewMembersList crewId={crewId} />
    </div>
  );
}
