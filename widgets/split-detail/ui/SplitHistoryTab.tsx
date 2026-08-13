"use client";

import { useSplitHistory } from "@/entities/split";
import { formatRelativeTime } from "@/shared/lib/format-relative-time";
import { getAvatarUrl } from "@/shared/lib";
import { useDebounce } from "@/shared/lib/use-debounce";
import { Clock, Comment, Magnifier, Receipt, TriangleExclamationFill } from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  Chip,
  Input,
  Spinner,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SplitHistoryTabProps {
  splitId: number;
  authors: Array<{
    id: number;
    name: string;
    alias?: string | null;
    avatar?: string | null;
    username?: string | null;
  }>;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function SplitHistoryTab({ splitId, authors }: SplitHistoryTabProps) {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data, isPending, isError } = useSplitHistory(splitId, {
    q: debouncedQuery || undefined,
    userId: selectedUserId ? Number(selectedUserId) : undefined,
  });

  const historyItems = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in-0 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-3xl border border-border/60 bg-surface/30 backdrop-blur-md">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("splits.detail.search_history_placeholder")}
            className="w-full pl-9"
          />
          <Magnifier className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-surface-secondary/50 border border-border/50 text-foreground text-xs font-semibold outline-none cursor-pointer"
        >
          <option value="">{t("splits.detail.all_members")}</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.alias || author.name}
            </option>
          ))}
        </select>
      </div>

      {isPending ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="accent" />
        </div>
      ) : isError ? (
        <Card className="border border-border/60 bg-surface/30 p-6 text-center">
          <CardContent className="flex flex-col items-center gap-2 p-0">
            <TriangleExclamationFill className="w-6 h-6 text-danger" />
            <span className="text-sm font-semibold text-foreground">
              {t("common.error")}
            </span>
          </CardContent>
        </Card>
      ) : historyItems.length === 0 ? (
        <Card className="border border-border/60 bg-surface/30 p-10 text-center">
          <CardContent className="flex flex-col items-center gap-3 p-0 max-w-sm mx-auto">
            <Receipt className="w-8 h-8 text-foreground/40" />
            <span className="text-sm font-semibold text-foreground/70">
              {t("splits.detail.empty_history")}
            </span>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {historyItems.map((item) => {
            const userName = item.user.alias || item.user.name;
            const isPayOff = item.type === "PAY";

            return (
              <Card
                key={item.id}
                className="border border-border/50 bg-surface/40 p-4 rounded-2xl flex flex-col gap-3 hover:bg-surface/60 transition-colors shadow-xs"
              >
                <CardContent className="p-0 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        size="sm"
                        className="w-9 h-9 rounded-full shrink-0"
                      >
                        {item.user.avatar && (
                          <AvatarImage
                            src={getAvatarUrl(item.user.avatar)}
                            alt={userName}
                          />
                        )}
                        <AvatarFallback className="text-[10px] font-bold bg-accent/20 text-accent-foreground">
                          {getInitials(userName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground">
                            {userName}
                          </span>

                          <Chip
                            size="sm"
                            variant="soft"
                            color={isPayOff ? "success" : "accent"}
                            className="text-[9px] font-bold px-1.5 py-0"
                          >
                            {isPayOff
                              ? t("splits.detail.history_pay_off_badge")
                              : t("splits.detail.history_increase_badge")}
                          </Chip>

                          {item.procByRequest && (
                            <Chip
                              size="sm"
                              variant="soft"
                              color="accent"
                              className="text-[9px] font-bold px-1.5 py-0"
                            >
                              {t("splits.detail.proc_by_request")}
                            </Chip>
                          )}

                          <span className="text-xs font-mono font-bold text-foreground">
                            {item.amount} ₴
                          </span>
                        </div>

                        <span className="text-[11px] text-foreground/60 font-medium">
                          {isPayOff
                            ? t("splits.detail.history_pay_off", {
                                amount: item.amount,
                                name: userName,
                              })
                            : t("splits.detail.history_increase", {
                                amount: item.amount,
                                name: userName,
                              })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-foreground/40 font-medium shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatRelativeTime(item.createdAt)}</span>
                    </div>
                  </div>

                  {item.msg && (
                    <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-secondary/50 border border-border/40 text-xs text-foreground/80">
                      <div className="flex items-center gap-2">
                        <Comment className="w-3.5 h-3.5 text-accent shrink-0" />
                        {item.procByRequest && (
                          <span className="text-[10px] text-foreground/50 font-medium italic">
                            ({t("splits.detail.proc_by_request")})
                          </span>
                        )}
                      </div>
                      <p className="italic font-medium leading-relaxed pl-5">
                        "{item.msg}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
