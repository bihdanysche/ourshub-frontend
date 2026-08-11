"use client";

import { getApiErrorCode } from "@/shared/api";
import {
  ArrowRotateRight,
  CircleExclamationFill,
  House,
  Persons,
  TriangleExclamationFill,
} from "@gravity-ui/icons";
import { Button, Card, CardContent } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface JoinCrewErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

export function JoinCrewErrorState({ error, onRetry }: JoinCrewErrorStateProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const errorCode = getApiErrorCode(error);

  const getErrorContent = () => {
    switch (errorCode) {
      case "INVITATION_NOT_FOUND":
        return {
          title: t("join_crew.not_found_title"),
          description: t("join_crew.not_found_desc"),
          icon: <TriangleExclamationFill className="w-8 h-8 text-danger" />,
          isRetryable: false,
        };
      case "CREW_IS_FULL":
        return {
          title: t("join_crew.crew_full_title"),
          description: t("join_crew.crew_full_desc"),
          icon: <Persons className="w-8 h-8 text-warning" />,
          isRetryable: false,
        };
      case "USER_CREWS_LIMIT_REACHED":
        return {
          title: t("join_crew.limit_reached_title"),
          description: t("join_crew.limit_reached_desc"),
          icon: <TriangleExclamationFill className="w-8 h-8 text-warning" />,
          isRetryable: false,
        };
      default:
        return {
          title: t("join_crew.error_title"),
          description: t("join_crew.error_desc"),
          icon: <TriangleExclamationFill className="w-8 h-8 text-danger" />,
          isRetryable: true,
        };
    }
  };

  const { title, description, icon, isRetryable } = getErrorContent();

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md overflow-hidden border border-border/60 bg-surface/40 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8">
        <CardContent className="flex flex-col items-center text-center gap-6 p-0">
          <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center border border-border/60 shadow-xs">
            {icon}
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-foreground/70 max-w-sm">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
            {isRetryable && (
              <Button
                variant="outline"
                onPress={onRetry}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowRotateRight className="w-4 h-4" />
                <span>{t("join_crew.retry_btn")}</span>
              </Button>
            )}
            <Button
              variant="primary"
              onPress={() => router.push("/")}
              className={`w-full ${isRetryable ? "sm:w-1/2" : ""} flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md`}
            >
              <House className="w-4 h-4" />
              <span>{t("join_crew.back_to_home")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
