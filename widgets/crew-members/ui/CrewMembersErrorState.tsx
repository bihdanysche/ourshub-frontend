"use client";

import { ArrowRotateRight, TriangleExclamationFill } from "@gravity-ui/icons";
import { Button, Card, CardContent } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface CrewMembersErrorStateProps {
  onRetry: () => void;
}

export function CrewMembersErrorState({ onRetry }: CrewMembersErrorStateProps) {
  const { t } = useTranslation();

  return (
    <Card className="border border-danger/30 bg-danger/5 backdrop-blur-md rounded-2xl p-8 text-center">
      <CardContent className="flex flex-col items-center gap-3 p-0">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center border border-danger/20">
          <TriangleExclamationFill className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-bold text-foreground">
            {t("crew_page.members_list.error_title")}
          </h4>
          <p className="text-xs text-foreground/60">
            {t("crew_page.members_list.error_desc")}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onPress={onRetry}
          className="flex items-center gap-1.5 mt-1 cursor-pointer"
        >
          <ArrowRotateRight className="w-3.5 h-3.5" />
          <span>{t("home.retry_btn")}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
