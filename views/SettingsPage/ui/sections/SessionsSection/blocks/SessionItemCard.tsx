"use client";

import {
  parseUserAgent,
  Session,
} from "@/entities/session";
import { formatRelativeTime } from "@/shared/lib";
import {
  ArrowRightFromSquare,
  Display,
  Globe,
  Smartphone,
} from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface SessionItemCardProps {
  session: Session;
  onTerminate?: (id: number) => void;
  isTerminating?: boolean;
}

export function SessionItemCard({
  session,
  onTerminate,
  isTerminating = false,
}: SessionItemCardProps) {
  const { t, i18n } = useTranslation();
  const { browser, os, isMobile } = parseUserAgent(session.agent);

  const formattedDate = formatRelativeTime(session.lastUsedAt, i18n.language);
  const locationText = session.location;


  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 ${
        session.isCurrent
          ? "bg-surface/80 border-success/30 shadow-xs"
          : "bg-surface/50 hover:bg-surface-secondary/50 border-border/60 shadow-xs"
      }`}
    >
      <div className="flex items-start gap-3.5 min-w-0">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
            session.isCurrent
              ? "bg-success/15 text-success"
              : "bg-surface-secondary text-foreground/80"
          }`}
        >
          {isMobile ? (
            <Smartphone className="w-5 h-5" />
          ) : (
            <Display className="w-5 h-5" />
          )}
        </div>

        <div className="flex flex-col min-w-0 gap-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground truncate">
              {browser} • {os}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-foreground/60 flex-wrap">
            <span className="font-mono">{session.ip}</span>
            {locationText && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-foreground/50" />
                  {locationText}
                </span>
              </>
            )}
          </div>

          <span className="text-xs text-foreground/50 mt-0.5">
            {t("settings.sessions.last_active")}: {formattedDate}
          </span>
        </div>
      </div>

      <div className="flex items-center self-start sm:self-center shrink-0 mt-1 sm:mt-0">
        {session.isCurrent ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span>{t("settings.sessions.current_badge")}</span>
          </div>
        ) : (
          <Button
            size="sm"
            variant="danger-soft"
            isDisabled={isTerminating}
            onPress={() => onTerminate?.(session.id)}
            className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <ArrowRightFromSquare className="w-3.5 h-3.5" />
            <span>{t("settings.sessions.terminate_btn")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
