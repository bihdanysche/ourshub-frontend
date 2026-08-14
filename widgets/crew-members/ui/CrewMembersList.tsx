"use client";

import { useMe } from "@/entities/auth";
import { CrewMember, useCrew, useCrewMembers } from "@/entities/crew";
import { KickMemberModal } from "@/features/kick-member";
import { UpdateMemberAliasModal } from "@/features/update-member-alias";
import { useState } from "react";
import { CrewMemberItem } from "./CrewMemberItem";
import { CrewMembersEmptyState } from "./CrewMembersEmptyState";
import { CrewMembersErrorState } from "./CrewMembersErrorState";
import { CrewMembersLoadingState } from "./CrewMembersLoadingState";

interface CrewMembersListProps {
  crewId: number;
}

export function CrewMembersList({ crewId }: CrewMembersListProps) {
  const { data: me } = useMe();
  const { data: crew } = useCrew(crewId);
  const { data: membersData, isPending, isError, refetch } = useCrewMembers(crewId);

  const [aliasMember, setAliasMember] = useState<CrewMember | null>(null);
  const [kickMember, setKickMember] = useState<CrewMember | null>(null);

  const isCurrentOwner = crew?.role === "OWNER";
  const members = membersData?.items ?? [];

  if (isPending) {
    return <CrewMembersLoadingState />;
  }

  if (isError) {
    return <CrewMembersErrorState onRetry={() => refetch()} />;
  }

  if (members.length === 0) {
    return <CrewMembersEmptyState />;
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {members.map((member) => (
          <CrewMemberItem
            key={member.id}
            member={member}
            isCurrentOwner={isCurrentOwner}
            isSelf={member.userId === me?.id}
            onUpdateAlias={setAliasMember}
            onKick={setKickMember}
          />
        ))}
      </div>

      <UpdateMemberAliasModal
        crewId={crewId}
        member={aliasMember}
        isOpen={Boolean(aliasMember)}
        onClose={() => setAliasMember(null)}
      />

      <KickMemberModal
        crewId={crewId}
        member={kickMember}
        isOpen={Boolean(kickMember)}
        onClose={() => setKickMember(null)}
      />
    </>
  );
}
