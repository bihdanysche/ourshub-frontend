"use client";

import { Persons } from "@gravity-ui/icons";
import { Card, CardContent } from "@heroui/react";
import { useTranslation } from "react-i18next";

export function CrewMembersEmptyState() {
  const { t } = useTranslation();

  return (
    <Card className="border border-border/50 bg-surface/30 backdrop-blur-md rounded-2xl p-8 text-center">
      <CardContent className="flex flex-col items-center gap-3 p-0">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/20">
          <Persons className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-bold text-foreground">
            {t("crew_page.members_list.empty_title")}
          </h4>
          <p className="text-xs text-foreground/60">
            {t("crew_page.members_list.empty_desc")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
