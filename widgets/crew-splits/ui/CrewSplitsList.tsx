"use client";

import { useSplits } from "@/entities/split";
import { ArrowRotateRight, Receipt, TriangleExclamationFill } from "@gravity-ui/icons";
import { Button, Card, CardContent, Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { SplitCard } from "./SplitCard";

interface CrewSplitsListProps {
  crewId: number;
  isArchived: boolean;
}

export function CrewSplitsList({ crewId, isArchived }: CrewSplitsListProps) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch } = useSplits(crewId, { isArchived });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border border-border/60 bg-surface/30 backdrop-blur-md rounded-3xl p-8 text-center">
        <CardContent className="flex flex-col items-center gap-4 p-0">
          <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center border border-danger/20">
            <TriangleExclamationFill className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-foreground">
              {t("common.error")}
            </h3>
          </div>
          <Button
            variant="outline"
            onPress={() => refetch()}
            className="flex items-center gap-2 mt-2"
          >
            <ArrowRotateRight className="w-4 h-4" />
            <span>{t("auth_guard.retry_btn")}</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const splits = data?.items ?? [];

  if (splits.length === 0) {
    return (
      <Card className="border border-border/60 bg-surface/30 backdrop-blur-md rounded-3xl p-10 sm:p-14 text-center animate-in fade-in-0 duration-300">
        <CardContent className="flex flex-col items-center gap-4 max-w-md mx-auto p-0">
          <div className="w-14 h-14 rounded-2xl bg-surface-secondary text-foreground/60 flex items-center justify-center border border-border/50">
            <Receipt className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-bold text-foreground">
              {isArchived
                ? t("splits.empty.archived_title")
                : t("splits.empty.title")}
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              {isArchived
                ? t("splits.empty.archived_desc")
                : t("splits.empty.desc")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {splits.map((split) => (
        <SplitCard key={split.id} split={split} crewId={crewId} />
      ))}
    </div>
  );
}
