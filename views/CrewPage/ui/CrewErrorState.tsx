"use client";

import { ArrowLeft, TriangleExclamationFill } from "@gravity-ui/icons";
import { Button, Card, CardContent } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface CrewErrorStateProps {
  onRetry?: () => void;
}

export function CrewErrorState({ onRetry }: CrewErrorStateProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="w-(--page-width) max-w-full flex flex-col px-4 sm:px-6 md:px-0 py-12 gap-6 items-center">
      <Card className="border border-danger/30 bg-danger/5 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-center max-w-lg w-full">
        <CardContent className="flex flex-col items-center gap-4 p-0">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 text-danger flex items-center justify-center border border-danger/20">
            <TriangleExclamationFill className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-bold text-foreground">
              {t("crew_page.not_found_title")}
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              {t("crew_page.not_found_desc")}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button
              variant="outline"
              onPress={() => router.push("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("crew_page.back_to_home")}</span>
            </Button>

            {onRetry && (
              <Button
                variant="primary"
                onPress={onRetry}
                className="cursor-pointer"
              >
                {t("home.retry_btn")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
