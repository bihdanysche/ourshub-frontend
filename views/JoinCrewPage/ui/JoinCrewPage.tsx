"use client";

import { useMe } from "@/entities/auth";
import { useCrewInvitePreview } from "@/entities/crew";
import { getApiErrorCode } from "@/shared/api";
import { toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { JoinCrewCard } from "./JoinCrewCard";
import { JoinCrewErrorState } from "./JoinCrewErrorState";
import { JoinCrewLoadingState } from "./JoinCrewLoadingState";
import { JoinCrewUnauthCard } from "./JoinCrewUnauthCard";

export interface JoinCrewPageProps {
  inviteCode: string;
}

export function JoinCrewPage({ inviteCode }: JoinCrewPageProps) {
  const router = useRouter();
  const { data: user, isPending: isUserPending } = useMe();
  const {
    data: preview,
    isPending: isPreviewPending,
    isError: isPreviewError,
    error: previewError,
    refetch,
  } = useCrewInvitePreview(user ? inviteCode : "");
  const { t } = useTranslation();
  const isAlreadyMember = getApiErrorCode(previewError) === "ALREADY_MEMBER";

  useEffect(() => {
    if (isAlreadyMember) {
      toast.danger(t("common.error"), {
        description: t("api_errors.ALREADY_MEMBER"),
      });
      router.replace("/");
    }
  }, [isAlreadyMember, router, t]);

  if (isUserPending || isAlreadyMember) {
    return <JoinCrewLoadingState />;
  }

  if (!user) {
    return <JoinCrewUnauthCard inviteCode={inviteCode} />;
  }

  if (isPreviewPending) {
    return <JoinCrewLoadingState />;
  }

  if (isPreviewError || !preview) {
    return (
      <JoinCrewErrorState error={previewError} onRetry={() => refetch()} />
    );
  }

  return <JoinCrewCard inviteCode={inviteCode} preview={preview} />;
}
