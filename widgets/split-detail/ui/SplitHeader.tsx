"use client";

import { SplitDetail, SplitUser, useArchiveSplit } from "@/entities/split";
import { EditSplitModal } from "@/features/manage-split-expense";
import { formatRelativeTime } from "@/shared/lib/format-relative-time";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { Archive, Pencil, Receipt } from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  Chip,
  ProgressBar,
  Spinner,
  Tooltip,
  toast,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface SplitHeaderProps {
  split: SplitDetail;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function SplitHeader({ split }: SplitHeaderProps) {
  const { t } = useTranslation();
  const { mutate: archiveSplit, isPending } = useArchiveSplit(split.id);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const authors = useMemo(() => {
    const map = new Map<number, SplitUser>();
    split.expenses.forEach((e) => {
      if (e.spender) map.set(e.spender.id, e.spender);
      e.members?.forEach((m) => {
        if (m.user) map.set(m.user.id, m.user);
      });
    });
    return Array.from(map.values());
  }, [split.expenses]);

  const totalPaid = useMemo(() => {
    return split.expenses.reduce(
      (acc, e) => acc + (e.members?.reduce((mAcc, m) => mAcc + m.paid, 0) || 0),
      0,
    );
  }, [split.expenses]);

  const totalMustPay = useMemo(() => {
    return split.expenses.reduce(
      (acc, e) =>
        acc + (e.members?.reduce((mAcc, m) => mAcc + m.mustPay, 0) || 0),
      0,
    );
  }, [split.expenses]);

  const isPaidInFull = totalPaid >= totalMustPay && totalMustPay > 0;
  const progressPercent =
    totalMustPay > 0
      ? Math.min(100, Math.round((totalPaid / totalMustPay) * 100))
      : 0;

  const handleArchive = () => {
    archiveSplit(undefined, {
      onSuccess: () => {
        toast.success(t("splits.detail.archived_msg"));
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  return (
    <>
      <Card className="border border-border/60 bg-surface/40 backdrop-blur-md rounded-3xl p-6 shadow-xs">
        <CardContent className="p-0 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent border border-accent/25 flex items-center justify-center shrink-0 mt-0.5">
                <Receipt className="w-6 h-6" />
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold text-foreground">
                    {split.title}
                  </h1>
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
                  <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">
                    {split.desc}
                  </p>
                )}

                <span className="text-xs text-foreground/40 font-medium">
                  {formatRelativeTime(split.createdAt)}
                </span>
              </div>
            </div>

            {!split.archived && (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setIsEditOpen(true)}
                  className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
                >
                  <Pencil className="w-4 h-4 text-foreground/60" />
                  <span>{t("splits.detail.edit_btn")}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  isDisabled={isPending}
                  onPress={handleArchive}
                  className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
                >
                  {isPending ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Archive className="w-4 h-4 text-foreground/60" />
                  )}
                  <span>{t("splits.detail.archive_btn")}</span>
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-border/30">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-foreground/70">
                {t("splits.detail.total_progress")}
              </span>
              <span className="text-xs font-bold font-mono text-foreground">
                {totalPaid} / {totalMustPay} ₴ ({progressPercent}%)
              </span>
            </div>

            <ProgressBar value={progressPercent} aria-label={split.title}>
              <ProgressBar.Track className="h-2.5 w-full rounded-full bg-surface-secondary/70 overflow-hidden relative">
                <ProgressBar.Fill
                  className={`h-full transition-all duration-500 rounded-full ${
                    isPaidInFull ? "bg-success" : "bg-accent"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </ProgressBar.Track>
            </ProgressBar>
          </div>

          <div className="flex flex-col gap-2.5 pt-2 border-t border-border/30">
            <span className="text-xs font-semibold text-foreground/70">
              {t("splits.detail.participants_title")} ({authors.length})
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {authors.map((author) => {
                const displayName = author.alias || author.name;

                return (
                  <Tooltip key={author.id}>
                    <Tooltip.Trigger>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-secondary/50 border border-border/40">
                        <Avatar size="sm" className="w-6 h-6 rounded-lg shrink-0">
                          {author.avatar && (
                            <AvatarImage src={author.avatar} alt={displayName} />
                          )}
                          <AvatarFallback className="text-[9px] font-bold bg-accent/20 text-accent-foreground">
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold text-foreground truncate max-w-32">
                          {displayName}
                        </span>
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content className="px-2.5 py-1 text-[11px] font-medium rounded-xl bg-background border border-border shadow-md">
                      {author.name}
                      {author.username ? ` (@${author.username})` : ""}
                    </Tooltip.Content>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditOpen && (
        <EditSplitModal
          splitId={split.id}
          currentTitle={split.title}
          currentDesc={split.desc}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
}
