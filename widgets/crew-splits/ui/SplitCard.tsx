"use client";

import { SplitItem } from "@/entities/split";
import { formatRelativeTime } from "@/shared/lib/format-relative-time";
import { Receipt } from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  Chip,
  ProgressBar,
  Tooltip,
} from "@heroui/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface SplitCardProps {
  split: SplitItem;
  crewId: number;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function SplitCard({ split, crewId }: SplitCardProps) {
  const { t } = useTranslation();

  const isPaidInFull = split.totalPaid >= split.totalMustPay && split.totalMustPay > 0;
  const progressPercent =
    split.totalMustPay > 0
      ? Math.min(100, Math.round((split.totalPaid / split.totalMustPay) * 100))
      : 0;

  return (
    <Link href={`/crews/${crewId}/splits/${split.id}`} className="block">
      <Card className="group border border-border/60 bg-surface/40 backdrop-blur-md rounded-3xl p-5 hover:bg-surface/70 hover:border-accent/40 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer">
        <CardContent className="p-0 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent border border-accent/25 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-foreground truncate group-hover:text-accent transition-colors">
                    {split.title}
                  </h3>
                  {split.archived ? (
                    <Chip
                      size="sm"
                      variant="soft"
                      color="default"
                      className="text-[10px] font-bold"
                    >
                      {t("splits.archived_badge")}
                    </Chip>
                  ) : isPaidInFull ? (
                    <Chip
                      size="sm"
                      variant="soft"
                      color="success"
                      className="text-[10px] font-bold"
                    >
                      {t("splits.paid_full_badge")}
                    </Chip>
                  ) : (
                    <Chip
                      size="sm"
                      variant="soft"
                      color="accent"
                      className="text-[10px] font-bold"
                    >
                      {t("splits.active_badge")}
                    </Chip>
                  )}
                </div>
                {split.desc && (
                  <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed">
                    {split.desc}
                  </p>
                )}
                <span className="text-[11px] text-foreground/40 font-medium">
                  {formatRelativeTime(split.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/30">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex -space-x-2 overflow-hidden py-1">
                {split.authors.slice(0, 5).map((author) => {
                  const displayName = author.alias || author.name;
                  return (
                    <Tooltip key={author.id}>
                      <Tooltip.Trigger>
                        <Avatar
                          size="sm"
                          className="w-8 h-8 rounded-full ring-2 ring-background shrink-0"
                        >
                          {author.avatar && (
                            <AvatarImage src={author.avatar} alt={displayName} />
                          )}
                          <AvatarFallback className="text-[10px] font-bold bg-accent/20 text-accent-foreground">
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="px-2.5 py-1 text-[11px] font-medium rounded-xl bg-background border border-border shadow-md">
                        {author.name}
                        {author.username ? ` (@${author.username})` : ""}
                      </Tooltip.Content>
                    </Tooltip>
                  );
                })}
              </div>
              {split.authors.length > 5 && (
                <span className="text-xs font-semibold text-foreground/50">
                  +{split.authors.length - 5}
                </span>
              )}
            </div>

            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <span className="text-xs font-bold text-foreground">
                {split.totalPaid} / {split.totalMustPay} ₴
              </span>
              <span className="text-[10px] text-foreground/50 font-medium">
                {progressPercent}%
              </span>
            </div>
          </div>

          <ProgressBar value={progressPercent} aria-label={split.title}>
            <ProgressBar.Track className="h-2 w-full rounded-full bg-surface-secondary/70 overflow-hidden relative">
              <ProgressBar.Fill
                className={`h-full transition-all duration-500 rounded-full ${
                  isPaidInFull ? "bg-success" : "bg-accent"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </ProgressBar.Track>
          </ProgressBar>
        </CardContent>
      </Card>
    </Link>
  );
}
