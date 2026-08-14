"use client";

import { CrewListItem, useCrews } from "@/entities/crew";
import { DeleteCrewModal } from "@/features/delete-crew";
import { EditCrewModal } from "@/features/edit-crew";
import { LeaveCrewModal } from "@/features/leave-crew";
import { Plus } from "@gravity-ui/icons";
import { Card } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CrewCard } from "./CrewCard";
import { CrewsEmptyState } from "./CrewsEmptyState";
import { CrewsErrorState } from "./CrewsErrorState";
import { CrewsLoadingState } from "./CrewsLoadingState";
import { CrewsPagination } from "./CrewsPagination";

interface CrewsListProps {
  onCreateCrew: () => void;
}

export function CrewsList({ onCreateCrew }: CrewsListProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const [editingCrew, setEditingCrew] = useState<CrewListItem | null>(null);
  const [deletingCrew, setDeletingCrew] = useState<CrewListItem | null>(null);
  const [leavingCrew, setLeavingCrew] = useState<CrewListItem | null>(null);

  const { data, isPending, isError, refetch } = useCrews({
    page,
    limit: 6,
  });

  const crews = data?.items ?? [];
  const meta = data?.meta;
  const hasAnyCrews = (meta?.total ?? 0) > 0 || crews.length > 0;
  const shouldShowCreateCard =
    !meta || meta.totalPages <= 1 || !meta.hasNextPage;

  if (isPending) {
    return <CrewsLoadingState />;
  }

  if (isError) {
    return <CrewsErrorState onRetry={() => refetch()} />;
  }

  if (!hasAnyCrews) {
    return <CrewsEmptyState onCreateCrew={onCreateCrew} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {crews.map((crew) => (
          <CrewCard
            key={crew.id}
            crew={crew}
            onEdit={setEditingCrew}
            onDelete={setDeletingCrew}
            onLeave={setLeavingCrew}
          />
        ))}

        {shouldShowCreateCard && (
          <Card
            className="flex flex-col items-center justify-center min-h-[140px] border-2 border-dashed border-border/70 hover:border-accent/60 bg-surface/20 hover:bg-surface/40 backdrop-blur-md rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer group shadow-none"
            onClick={onCreateCrew}
          >
            <div className="w-12 h-12 rounded-2xl bg-surface-secondary group-hover:bg-accent/10 border border-border/50 group-hover:border-accent/30 flex items-center justify-center text-foreground/70 group-hover:text-accent transition-colors mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
              {t("home.create_card_title")}
            </h4>
            <p className="text-xs text-foreground/50 mt-1 max-w-[200px]">
              {t("home.create_card_desc")}
            </p>
          </Card>
        )}
      </div>

      {meta && (
        <CrewsPagination
          page={meta.page}
          totalPages={meta.totalPages}
          hasPrevPage={meta.hasPrevPage}
          hasNextPage={meta.hasNextPage}
          onPageChange={setPage}
        />
      )}

      <EditCrewModal
        crew={editingCrew}
        isOpen={Boolean(editingCrew)}
        onClose={() => setEditingCrew(null)}
      />

      <DeleteCrewModal
        crew={deletingCrew}
        isOpen={Boolean(deletingCrew)}
        onClose={() => setDeletingCrew(null)}
      />

      <LeaveCrewModal
        crew={leavingCrew}
        isOpen={Boolean(leavingCrew)}
        onClose={() => setLeavingCrew(null)}
      />
    </>
  );
}
