"use client";

import { Session } from "@/entities/session";
import { ShieldCheck, TrashBin } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { SessionItemCard } from "./SessionItemCard";

interface OtherSessionsBlockProps {
  sessions: Session[];
  isShuttingDownAll: boolean;
  isShuttingDownSingle: boolean;
  terminatingSessionId?: number;
  onOpenTerminateSingle: (id: number) => void;
  onOpenTerminateAll: () => void;
}

export function OtherSessionsBlock({
  sessions,
  isShuttingDownAll,
  isShuttingDownSingle,
  terminatingSessionId,
  onOpenTerminateSingle,
  onOpenTerminateAll,
}: OtherSessionsBlockProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted select-none">
            {t("settings.sessions.other_title")}
          </h2>
          {sessions.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-secondary text-foreground/70">
              {sessions.length}
            </span>
          )}
        </div>

        {sessions.length > 0 && (
          <Button
            size="sm"
            variant="danger-soft"
            isDisabled={isShuttingDownAll}
            onPress={onOpenTerminateAll}
            className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <TrashBin className="w-3.5 h-3.5" />
            <span>{t("settings.sessions.terminate_all_btn")}</span>
          </Button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border/60 bg-surface/30 text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-secondary flex items-center justify-center text-foreground/60">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">
              {t("settings.sessions.no_other_sessions")}
            </p>
            <p className="text-xs text-foreground/50">
              {t("settings.sessions.no_other_sessions_desc")}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sessions.map((session) => (
            <SessionItemCard
              key={session.id}
              session={session}
              isTerminating={
                isShuttingDownSingle && terminatingSessionId === session.id
              }
              onTerminate={onOpenTerminateSingle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
