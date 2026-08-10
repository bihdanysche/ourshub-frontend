"use client";

import { ArrowRotateRight, TriangleExclamationFill } from "@gravity-ui/icons";
import { Button, Card, CardContent } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface CrewsErrorStateProps {
  onRetry: () => void;
}

export function CrewsErrorState({ onRetry }: CrewsErrorStateProps) {
  const { t } = useTranslation();

  return (
    <Card className="border border-danger/30 bg-danger/5 backdrop-blur-md rounded-2xl p-8 sm:p-12 text-center">
      <CardContent className="flex flex-col items-center gap-4 max-w-md mx-auto p-0">
        <div className="w-14 h-14 rounded-2xl bg-danger/10 text-danger flex items-center justify-center border border-danger/20">
          <TriangleExclamationFill className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-foreground">
            {t("home.error_title")}
          </h3>
          <p className="text-sm text-foreground/60">
            {t("home.error_desc")}
          </p>
        </div>
        <Button
          variant="outline"
          onPress={onRetry}
          className="flex items-center gap-2 mt-2 cursor-pointer"
        >
          <ArrowRotateRight className="w-4 h-4" />
          <span>{t("home.retry_btn")}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
