"use client";

import { Comment } from "@gravity-ui/icons";
import { Card, CardContent } from "@heroui/react";
import { useTranslation } from "react-i18next";

export function CrewPostsSection() {
  const { t } = useTranslation();

  return (
    <Card className="border border-border/60 bg-surface/30 backdrop-blur-md rounded-3xl p-10 sm:p-14 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <CardContent className="flex flex-col items-center gap-4 max-w-md mx-auto p-0">
        <div className="w-14 h-14 rounded-2xl bg-surface-secondary text-foreground/60 flex items-center justify-center border border-border/50">
          <Comment className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-bold text-foreground">
            {t("crew_page.placeholders.posts_title")}
          </h3>
          <p className="text-sm text-foreground/60 leading-relaxed">
            {t("crew_page.placeholders.posts_desc")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
