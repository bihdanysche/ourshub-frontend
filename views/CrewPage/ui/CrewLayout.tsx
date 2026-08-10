"use client";

import { useCrew } from "@/entities/crew";
import { useParams } from "next/navigation";
import { CrewErrorState } from "./CrewErrorState";
import { CrewHeader } from "./CrewHeader";
import { CrewLoadingState } from "./CrewLoadingState";
import { CrewTabs } from "./CrewTabs";

interface CrewLayoutProps {
  children: React.ReactNode;
}

export function CrewLayout({ children }: CrewLayoutProps) {
  const params = useParams();
  const crewId = Number(params?.id);

  const { data: crew, isPending, isError, refetch } = useCrew(crewId);

  if (isPending) {
    return <CrewLoadingState />;
  }

  if (isError || !crew) {
    return <CrewErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="w-(--page-width) max-w-full flex flex-col px-4 sm:px-6 md:px-0 py-6 gap-6">
      <CrewHeader crew={crew} />

      <CrewTabs crewId={crew.id} membersCount={crew.membersCount} />

      <div className="w-full">{children}</div>
    </div>
  );
}
