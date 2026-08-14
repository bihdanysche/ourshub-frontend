"use client";

import { Session } from "@/entities/session";
import { useTranslation } from "react-i18next";
import { SessionItemCard } from "./SessionItemCard";

interface CurrentSessionBlockProps {
  session?: Session;
}

export function CurrentSessionBlock({ session }: CurrentSessionBlockProps) {
  const { t } = useTranslation();

  if (!session) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted select-none">
        {t("settings.sessions.current_title")}
      </h2>
      <SessionItemCard session={session} />
    </div>
  );
}
