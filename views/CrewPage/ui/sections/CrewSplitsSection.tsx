"use client";

import { CrewSplitsList } from "@/widgets/crew-splits";
import { Plus } from "@gravity-ui/icons";
import { Switch } from "@heroui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function CrewSplitsSection() {
  const { t } = useTranslation();
  const params = useParams();
  const crewId = Number(params?.id);

  const [isArchived, setIsArchived] = useState(false);

  if (!crewId || isNaN(crewId)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-page-slide-in-left">
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-3xl border border-border/60 bg-surface/30 backdrop-blur-md">
        <Link
          href={`/crews/${crewId}/splits/create`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t("splits.create_btn")}</span>
        </Link>

        <Switch
          isSelected={isArchived}
          onChange={(checked: boolean) => setIsArchived(checked)}
        >
          <Switch.Content className="flex items-center gap-2 cursor-pointer select-none">
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <span className="text-xs font-semibold text-foreground/80">
              {t("splits.show_archived")}
            </span>
          </Switch.Content>
        </Switch>
      </div>

      <CrewSplitsList crewId={crewId} isArchived={isArchived} />
    </div>
  );
}
