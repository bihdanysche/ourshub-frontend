"use client";

import { useCrew } from "@/entities/crew";
import { CreatePostForm } from "@/features/create-post";
import { CrewPostsList } from "@/widgets/crew-posts";
import { useParams } from "next/navigation";

export function CrewPostsSection() {
  const params = useParams();
  const crewId = Number(params?.id);

  const { data: crew } = useCrew(crewId);
  const isOwner = crew?.role === "OWNER";

  if (!crewId || isNaN(crewId)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <CreatePostForm crewId={crewId} />
      <CrewPostsList crewId={crewId} isOwner={isOwner} />
    </div>
  );
}
