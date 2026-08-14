"use client";

import {
  useSessions,
  useShutdownAllSessions,
  useShutdownSession,
} from "@/entities/session";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { toast } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CurrentSessionBlock } from "./blocks/CurrentSessionBlock";
import { OtherSessionsBlock } from "./blocks/OtherSessionsBlock";
import { TerminateConfirmModal } from "./modals/TerminateConfirmModal";
import { SessionsError } from "./states/SessionsError";
import { SessionsSkeleton } from "./states/SessionsSkeleton";

export function SessionsSection() {
  const { t } = useTranslation();
  const { data: sessions, isPending, isError, refetch } = useSessions();
  const { mutate: shutdownSession, isPending: isShuttingDownSingle } =
    useShutdownSession();
  const { mutate: shutdownAllSessions, isPending: isShuttingDownAll } =
    useShutdownAllSessions();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "single" | "all";
    sessionId?: number;
  }>({
    isOpen: false,
    type: "single",
  });

  const handleConfirm = () => {
    if (confirmModal.type === "single" && confirmModal.sessionId) {
      shutdownSession(confirmModal.sessionId, {
        onSuccess: () => {
          toast.success(t("settings.sessions.terminate_success"));
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        },
        onError: (err) => {
          toastApiError(err);
        },
      });
    } else if (confirmModal.type === "all") {
      shutdownAllSessions(undefined, {
        onSuccess: () => {
          toast.success(t("settings.sessions.terminate_all_success"));
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        },
        onError: (err) => {
          toastApiError(err);
        },
      });
    }
  };

  if (isPending) {
    return <SessionsSkeleton />;
  }

  if (isError) {
    return <SessionsError onRetry={() => refetch()} />;
  }

  const currentSession = sessions?.find((s) => s.isCurrent);
  const otherSessions = sessions?.filter((s) => !s.isCurrent) ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-bold text-foreground">
          {t("settings.sessions.title")}
        </h1>
        <p className="text-sm text-foreground/60 mt-1">
          {t("settings.sessions.description")}
        </p>
      </div>

      <CurrentSessionBlock session={currentSession} />

      <OtherSessionsBlock
        sessions={otherSessions}
        isShuttingDownAll={isShuttingDownAll}
        isShuttingDownSingle={isShuttingDownSingle}
        terminatingSessionId={confirmModal.sessionId}
        onOpenTerminateSingle={(id) =>
          setConfirmModal({
            isOpen: true,
            type: "single",
            sessionId: id,
          })
        }
        onOpenTerminateAll={() =>
          setConfirmModal({
            isOpen: true,
            type: "all",
          })
        }
      />

      <TerminateConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        isPending={isShuttingDownSingle || isShuttingDownAll}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
