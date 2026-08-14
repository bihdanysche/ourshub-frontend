"use client";

import { ArrowRotateRight, TriangleExclamationFill } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface SessionsErrorProps {
  onRetry: () => void;
}

export function SessionsError({ onRetry }: SessionsErrorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-bold text-foreground">
          {t("settings.sessions.title")}
        </h1>
        <p className="text-sm text-foreground/60 mt-1">
          {t("settings.sessions.description")}
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-danger/20 bg-danger/5 flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center text-danger">
          <TriangleExclamationFill className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-foreground">
            {t("settings.sessions.error_title")}
          </p>
          <p className="text-sm text-foreground/60">
            {t("settings.sessions.error_desc")}
          </p>
        </div>
        <Button
          variant="primary"
          onPress={onRetry}
          className="flex items-center gap-2 mt-2"
        >
          <ArrowRotateRight className="w-4 h-4" />
          <span>{t("settings.sessions.retry_btn")}</span>
        </Button>
      </div>
    </div>
  );
}
