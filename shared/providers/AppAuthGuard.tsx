"use client";

import { useMe } from "@/entities/auth";
import { getApiErrorCode, isUnauthorizedError } from "@/shared/api";
import { ArrowRotateRight, TriangleExclamationFill } from "@gravity-ui/icons";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@heroui/react";
import { useTranslation } from "react-i18next";

interface AppAuthGuardProps {
  children: React.ReactNode;
}

export function AppAuthGuard({ children }: AppAuthGuardProps) {
  const {
    data: user,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useMe();
  const { t, i18n } = useTranslation();

  if (isPending && user === undefined) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="accent" />
          <p className="text-sm font-medium text-foreground/60 animate-pulse">
            {t("auth_guard.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (isError && !isUnauthorizedError(error)) {
    const code = getApiErrorCode(error);
    const errorDescription =
      code && i18n.exists(`api_errors.${code}`)
        ? t(`api_errors.${code}`)
        : t("auth_guard.server_error_desc");

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-lg">
        <Card className="max-w-md w-full border border-danger/20 bg-background/60 shadow-2xl backdrop-blur-xl">
          <CardHeader className="flex gap-3 items-center pb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-danger/10 text-danger">
              <TriangleExclamationFill className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-lg font-bold text-foreground">
                {t("auth_guard.server_error_title")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 pt-2 text-center">
            <p className="text-sm text-foreground/70 leading-relaxed">
              {errorDescription}
            </p>
            <div className="flex justify-center w-full">
              <Button
                variant="primary"
                isDisabled={isFetching}
                onPress={() => refetch()}
                className="font-medium flex items-center justify-center gap-2"
              >
                {isFetching ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <ArrowRotateRight className="w-4 h-4" />
                )}
                {t("auth_guard.retry_btn")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
