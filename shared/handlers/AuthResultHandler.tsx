"use client";

import { authKeys } from "@/entities/auth";
import { Check, TriangleExclamationFill } from "@gravity-ui/icons";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export function AuthResultHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const handledKey = useRef<string | null>(null);

  useEffect(() => {
    const auth = params.get("auth");
    if (!auth) return;

    const currentKey = `${auth}_${params.get("code") || ""}`;
    if (handledKey.current === currentKey) return;
    handledKey.current = currentKey;

    if (auth === "success") {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success(t("common.success"), {
        description: t("auth.success_auth_desc"),
        indicator: <Check />,
      });
    }

    if (auth === "error") {
      const code = params.get("code");
      toast.danger(t("common.error"), {
        description: t(
          i18n.exists(`api_errors.${code}`)
            ? `api_errors.${code}`
            : "api_errors.UNKNOWN_ERROR",
        ),
        indicator: <TriangleExclamationFill />,
      });
    }
    router.replace(window.location.pathname);
  }, [params, router, queryClient, t, i18n]);

  return null;
}
