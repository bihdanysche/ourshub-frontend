"use client";

import { Plus } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface HomeHeaderProps {
  onCreateCrew: () => void;
}

export function HomeHeader({ onCreateCrew }: HomeHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {t("home.title")}
        </h1>
        <p className="text-sm text-foreground/60">
          {t("home.subtitle")}
        </p>
      </div>

      <Button
        variant="primary"
        onPress={onCreateCrew}
        className="flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm hover:shadow-md transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>{t("home.create_crew_btn")}</span>
      </Button>
    </div>
  );
}
