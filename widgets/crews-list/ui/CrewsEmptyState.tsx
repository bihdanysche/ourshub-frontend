"use client";

import { Persons, Plus } from "@gravity-ui/icons";
import { Button, Card, CardContent } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface CrewsEmptyStateProps {
  onCreateCrew: () => void;
}

export function CrewsEmptyState({ onCreateCrew }: CrewsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <Card className="border border-border/60 bg-surface/30 backdrop-blur-md rounded-2xl p-8 sm:p-12 text-center">
      <CardContent className="flex flex-col items-center gap-4 max-w-md mx-auto p-0">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/20">
          <Persons className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-bold text-foreground">
            {t("home.empty_title")}
          </h3>
          <p className="text-sm text-foreground/60 leading-relaxed">
            {t("home.empty_desc")}
          </p>
        </div>
        <Button
          variant="primary"
          onPress={onCreateCrew}
          className="flex items-center gap-2 mt-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("home.create_first_crew")}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
