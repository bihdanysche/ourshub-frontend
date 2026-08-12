"use client";

import { useMe } from "@/entities/auth";
import {
  ExpenseRequestItem,
  ExpenseRequestRoleFilter,
  useAcceptExpenseRequest,
  useCancelExpenseRequest,
  useDeclineExpenseRequest,
  useExpenseRequests,
} from "@/entities/split";
import { formatRelativeTime } from "@/shared/lib/format-relative-time";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { Check, Clock, Comment, PaperPlane, TriangleExclamationFill, Xmark } from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  Chip,
  Spinner,
  toast,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SplitRequestsTabProps {
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

export function SplitRequestsTab({ splitId, authors }: SplitRequestsTabProps) {
  const { t } = useTranslation();
  const { data: currentUser } = useMe();
  const currentUserId = currentUser?.id;

  const [roleFilter, setRoleFilter] =
    useState<ExpenseRequestRoleFilter>("all");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data, isPending, isError } = useExpenseRequests(splitId, {
    role: roleFilter,
    userId: selectedUserId ? Number(selectedUserId) : undefined,
  });

  const requests = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in-0 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-3xl border border-border/60 bg-surface/30 backdrop-blur-md">
        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value as ExpenseRequestRoleFilter)
          }
          className="w-full p-2.5 rounded-xl bg-surface-secondary/50 border border-border/50 text-foreground text-xs font-semibold outline-none cursor-pointer"
        >
          <option value="all">{t("splits.detail.filter_role_all")}</option>
          <option value="as_spender">
            {t("splits.detail.filter_role_as_spender")}
          </option>
          <option value="as_user">
            {t("splits.detail.filter_role_as_user")}
          </option>
        </select>

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
      ) : requests.length === 0 ? (
        <Card className="border border-border/60 bg-surface/30 p-10 text-center">
          <CardContent className="flex flex-col items-center gap-3 p-0 max-w-sm mx-auto">
            <PaperPlane className="w-8 h-8 text-foreground/40" />
            <span className="text-sm font-semibold text-foreground/70">
              {t("splits.detail.empty_requests")}
            </span>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((item) => (
            <RequestCardItem
              key={item.id}
              splitId={splitId}
              item={item}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface RequestCardItemProps {
  splitId: number;
  item: ExpenseRequestItem;
  currentUserId?: number;
}

function RequestCardItem({
  splitId,
  item,
  currentUserId,
}: RequestCardItemProps) {
  const { t } = useTranslation();

  const isMyRequest = currentUserId === item.user.id;
  const isSpender = currentUserId === item.expense.spender.id;

  const userName = item.user.alias || item.user.name;
  const spenderName =
    item.expense.spender.alias || item.expense.spender.name;

  const { mutate: cancelRequest, isPending: isCanceling } =
    useCancelExpenseRequest(splitId, item.expense.id);
  const { mutate: acceptRequest, isPending: isAccepting } =
    useAcceptExpenseRequest(splitId, item.expense.id);
  const { mutate: declineRequest, isPending: isDeclining } =
    useDeclineExpenseRequest(splitId, item.expense.id);

  const handleCancel = () => {
    cancelRequest(item.id, {
      onSuccess: () => toast.success(t("common.success")),
      onError: (err) => toastApiError(err),
    });
  };

  const handleAccept = () => {
    acceptRequest(item.id, {
      onSuccess: () => toast.success(t("common.success")),
      onError: (err) => toastApiError(err),
    });
  };

  const handleDecline = () => {
    declineRequest(item.id, {
      onSuccess: () => toast.success(t("common.success")),
      onError: (err) => toastApiError(err),
    });
  };

  return (
    <Card className="border border-border/60 bg-surface/40 p-5 rounded-3xl flex flex-col gap-4 shadow-xs">
      <CardContent className="p-0 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4 flex-wrap border-b border-border/30 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar size="sm" className="w-10 h-10 rounded-2xl shrink-0">
              {item.user.avatar && (
                <AvatarImage src={item.user.avatar} alt={userName} />
              )}
              <AvatarFallback className="text-xs font-bold bg-accent/20 text-accent-foreground">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-foreground truncate">
                  {userName}
                </span>

                {isMyRequest && (
                  <Chip
                    size="sm"
                    variant="soft"
                    color="accent"
                    className="text-[9px] font-bold px-1.5 py-0"
                  >
                    {t("splits.wizard.you_badge")}
                  </Chip>
                )}
              </div>

              <span className="text-xs text-foreground/70 leading-normal">
                {isMyRequest
                  ? t("splits.detail.you_claim_text", {
                      amount: item.amount,
                      title: item.expense.title,
                      spender: spenderName,
                    })
                  : t("splits.detail.request_claim_text", {
                      user: userName,
                      amount: item.amount,
                      title: item.expense.title,
                      spender: spenderName,
                    })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-base font-mono font-bold text-foreground">
              {item.amount} ₴
            </span>
          </div>
        </div>

        {item.msg && (
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-surface-secondary/50 border border-border/40 text-xs text-foreground/80">
            <Comment className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="italic font-medium leading-relaxed">"{item.msg}"</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
          <div className="flex items-center gap-1.5 text-xs text-foreground/40 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatRelativeTime(item.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            {isMyRequest && (
              <Button
                variant="danger"
                size="sm"
                isDisabled={isCanceling}
                onPress={handleCancel}
                className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                {isCanceling ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <Xmark className="w-4 h-4" />
                )}
                <span>{t("splits.detail.cancel_request_btn")}</span>
              </Button>
            )}

            {isSpender && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  isDisabled={isDeclining || isAccepting}
                  onPress={handleDecline}
                  className="flex items-center gap-1.5 text-xs font-semibold text-danger border-danger/30 hover:bg-danger/10 cursor-pointer"
                >
                  {isDeclining ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Xmark className="w-4 h-4" />
                  )}
                  <span>{t("splits.detail.decline_request_btn")}</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  isDisabled={isAccepting || isDeclining}
                  onPress={handleAccept}
                  className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  {isAccepting ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{t("splits.detail.accept_request_btn")}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
