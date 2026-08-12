"use client";

import { useMe } from "@/entities/auth";
import {
  SplitDetail,
  useDeleteExpense,
  useRemoveMembersFromExpense,
} from "@/entities/split";
import {
  AddMemberModal,
  CreateExpenseRequestModal,
  EditExpenseModal,
  IncreaseDebtModal,
  PayOffModal,
} from "@/features/manage-split-expense";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { Check, PaperPlane, Pencil, PersonPlus, Plus, Receipt, TrashBin } from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  Chip,
  ProgressBar,
  Tooltip,
  toast,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SplitExpensesTabProps {
  split: SplitDetail;
  crewId: number;
}

interface PayOffTarget {
  expenseId: number;
  member: {
    userId: number;
    name: string;
    maxAmount: number;
  };
}

interface IncreaseTarget {
  expenseId: number;
  member: {
    userId: number;
    name: string;
  };
}

interface AddMemberTarget {
  expenseId: number;
  existingUserIds: number[];
}

interface CreateRequestTarget {
  expenseId: number;
  expenseTitle: string;
  maxAmount: number;
}

interface EditExpenseTarget {
  expenseId: number;
  title: string;
  desc?: string;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function SplitExpensesTab({ split, crewId }: SplitExpensesTabProps) {
  const { t } = useTranslation();
  const { data: currentUser } = useMe();
  const currentUserId = currentUser?.id;

  const [payOffTarget, setPayOffTarget] = useState<PayOffTarget | null>(null);
  const [increaseTarget, setIncreaseTarget] = useState<IncreaseTarget | null>(null);
  const [addMemberTarget, setAddMemberTarget] = useState<AddMemberTarget | null>(null);
  const [createRequestTarget, setCreateRequestTarget] =
    useState<CreateRequestTarget | null>(null);
  const [editExpenseTarget, setEditExpenseTarget] =
    useState<EditExpenseTarget | null>(null);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in-0 duration-300">
      <div className="flex flex-col gap-6">
        {split.expenses.map((exp, index) => {
          const spenderName = exp.spender.alias || exp.spender.name;
          const isSpender = currentUserId === exp.spender.id;

          const currentUserMember = exp.members?.find(
            (m) => m.user.id === currentUserId,
          );
          const userRemainingDebt = currentUserMember
            ? Math.max(0, currentUserMember.mustPay - currentUserMember.paid)
            : 0;

          const expTotalPaid = exp.members?.reduce((acc, m) => acc + m.paid, 0) || 0;
          const expTotalMustPay =
            exp.members?.reduce((acc, m) => acc + m.mustPay, 0) || 0;

          const expProgressPercent =
            expTotalMustPay > 0
              ? Math.min(
                  100,
                  Math.round((expTotalPaid / expTotalMustPay) * 100),
                )
              : 0;

          return (
            <ExpenseCardItem
              key={exp.id}
              splitId={split.id}
              crewId={crewId}
              exp={exp}
              index={index}
              spenderName={spenderName}
              isSpender={isSpender}
              currentUserId={currentUserId}
              userRemainingDebt={userRemainingDebt}
              isSplitArchived={split.archived}
              expTotalPaid={expTotalPaid}
              expTotalMustPay={expTotalMustPay}
              expProgressPercent={expProgressPercent}
              onOpenPayOff={(target) => setPayOffTarget(target)}
              onOpenIncrease={(target) => setIncreaseTarget(target)}
              onOpenAddMember={() =>
                setAddMemberTarget({
                  expenseId: exp.id,
                  existingUserIds: exp.members.map((m) => m.user.id),
                })
              }
              onOpenCreateRequest={() =>
                setCreateRequestTarget({
                  expenseId: exp.id,
                  expenseTitle: exp.title,
                  maxAmount: userRemainingDebt,
                })
              }
              onOpenEditExpense={() =>
                setEditExpenseTarget({
                  expenseId: exp.id,
                  title: exp.title,
                  desc: exp.desc,
                })
              }
            />
          );
        })}
      </div>

      {payOffTarget && (
        <PayOffModal
          splitId={split.id}
          expenseId={payOffTarget.expenseId}
          member={payOffTarget.member}
          isOpen={Boolean(payOffTarget)}
          onClose={() => setPayOffTarget(null)}
        />
      )}

      {increaseTarget && (
        <IncreaseDebtModal
          splitId={split.id}
          expenseId={increaseTarget.expenseId}
          member={increaseTarget.member}
          isOpen={Boolean(increaseTarget)}
          onClose={() => setIncreaseTarget(null)}
        />
      )}

      {addMemberTarget && (
        <AddMemberModal
          splitId={split.id}
          expenseId={addMemberTarget.expenseId}
          crewId={crewId}
          existingUserIds={addMemberTarget.existingUserIds}
          isOpen={Boolean(addMemberTarget)}
          onClose={() => setAddMemberTarget(null)}
        />
      )}

      {createRequestTarget && (
        <CreateExpenseRequestModal
          splitId={split.id}
          expenseId={createRequestTarget.expenseId}
          expenseTitle={createRequestTarget.expenseTitle}
          maxAmount={createRequestTarget.maxAmount}
          isOpen={Boolean(createRequestTarget)}
          onClose={() => setCreateRequestTarget(null)}
        />
      )}

      {editExpenseTarget && (
        <EditExpenseModal
          splitId={split.id}
          expenseId={editExpenseTarget.expenseId}
          currentTitle={editExpenseTarget.title}
          currentDesc={editExpenseTarget.desc}
          isOpen={Boolean(editExpenseTarget)}
          onClose={() => setEditExpenseTarget(null)}
        />
      )}
    </div>
  );
}

interface ExpenseCardItemProps {
  splitId: number;
  crewId: number;
  exp: SplitDetail["expenses"][0];
  index: number;
  spenderName: string;
  isSpender: boolean;
  currentUserId?: number;
  userRemainingDebt: number;
  isSplitArchived: boolean;
  expTotalPaid: number;
  expTotalMustPay: number;
  expProgressPercent: number;
  onOpenPayOff: (target: PayOffTarget) => void;
  onOpenIncrease: (target: IncreaseTarget) => void;
  onOpenAddMember: () => void;
  onOpenCreateRequest: () => void;
  onOpenEditExpense: () => void;
}

function ExpenseCardItem({
  splitId,
  exp,
  index,
  spenderName,
  isSpender,
  currentUserId,
  isSplitArchived,
  expTotalPaid,
  expTotalMustPay,
  expProgressPercent,
  onOpenPayOff,
  onOpenIncrease,
  onOpenAddMember,
  onOpenCreateRequest,
  onOpenEditExpense,
}: ExpenseCardItemProps) {
  const { t } = useTranslation();
  const { mutate: removeMembers, isPending: isRemoving } =
    useRemoveMembersFromExpense(splitId, exp.id);
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense(
    splitId,
    exp.id,
  );

  const handleRemoveUser = (userId: number) => {
    removeMembers(
      { userIds: [userId] },
      {
        onSuccess: () => {
          toast.success(t("common.success"));
        },
        onError: (err) => {
          toastApiError(err);
        },
      },
    );
  };

  const handleDeleteExpense = () => {
    deleteExpense(undefined, {
      onSuccess: () => {
        toast.success(t("common.success"));
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  return (
    <Card className="border border-border/60 bg-surface/30 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 shadow-xs">
      <CardContent className="p-0 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4 flex-wrap border-b border-border/30 pb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent border border-accent/25 flex items-center justify-center shrink-0 mt-0.5">
              <Receipt className="w-5 h-5" />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-foreground truncate">
                  {exp.title}
                </h3>
                <Chip
                  size="sm"
                  variant="soft"
                  color="accent"
                  className="text-[10px] font-bold"
                >
                  {t("splits.wizard.expense_num", { num: index + 1 })}
                </Chip>
              </div>

              {exp.desc && (
                <p className="text-xs text-foreground/60 leading-relaxed whitespace-pre-wrap">
                  {exp.desc}
                </p>
              )}

              <div className="flex items-center gap-1.5 mt-1 text-xs text-foreground/70">
                <span className="font-semibold">
                  {t("splits.detail.spender_label", {
                    name: spenderName,
                  })}
                </span>
                {exp.spender.username && (
                  <span className="text-foreground/40 font-mono">
                    (@{exp.spender.username})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isSpender && !isSplitArchived && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onPress={onOpenEditExpense}
                  className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  <span>{t("splits.detail.edit_btn")}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onPress={onOpenAddMember}
                  className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <PersonPlus className="w-4 h-4" />
                  <span>{t("splits.detail.add_members_btn")}</span>
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  isDisabled={isDeleting}
                  onPress={handleDeleteExpense}
                  className="p-1.5 rounded-xl h-8 w-8 min-w-0 cursor-pointer"
                >
                  <TrashBin className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-bold font-mono text-foreground">
                {t("splits.detail.paid_of", {
                  paid: expTotalPaid,
                  total: expTotalMustPay,
                })}
              </span>
              <span className="text-xs text-foreground/50 font-medium">
                {expProgressPercent}%
              </span>
            </div>
          </div>
        </div>

        <ProgressBar value={expProgressPercent} aria-label={exp.title}>
          <ProgressBar.Track className="h-2 w-full rounded-full bg-surface-secondary/70 overflow-hidden relative">
            <ProgressBar.Fill
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${expProgressPercent}%` }}
            />
          </ProgressBar.Track>
        </ProgressBar>

        <div className="flex flex-col gap-2.5 pt-2">
          <span className="text-xs font-semibold text-foreground/70">
            {t("splits.wizard.expense_participants")} ({exp.members.length})
          </span>

          <div className="flex flex-col gap-2">
            {exp.members.map((m, mIndex) => {
              const memberName = m.user.alias || m.user.name;
              const isExpenseSpenderMember = m.user.id === exp.spender.id;
              const isMe = m.user.id === currentUserId;
              const remainingDebt = Math.max(0, m.mustPay - m.paid);
              const isSettled = remainingDebt === 0;

              return (
                <div
                  key={m.user.id || mIndex}
                  className="flex items-center justify-between p-3 rounded-2xl border border-border/40 bg-surface-secondary/40 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar size="sm" className="w-8 h-8 rounded-xl shrink-0">
                      {m.user.avatar && (
                        <AvatarImage src={m.user.avatar} alt={memberName} />
                      )}
                      <AvatarFallback className="text-xs font-bold bg-accent/20 text-accent-foreground">
                        {getInitials(memberName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold truncate">{memberName}</span>
                        {isExpenseSpenderMember && (
                          <Chip
                            size="sm"
                            variant="soft"
                            color="accent"
                            className="text-[9px] font-bold px-1.5 py-0"
                          >
                            {t("splits.wizard.spender_badge")}
                          </Chip>
                        )}
                        {isMe && !isExpenseSpenderMember && (
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
                      {m.user.username && (
                        <span className="text-[10px] text-foreground/40 font-mono truncate">
                          @{m.user.username}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isMe && !isSpender && !isSplitArchived && !isSettled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={onOpenCreateRequest}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-accent border-accent/40 hover:bg-accent/10 cursor-pointer py-1 px-2.5 h-7"
                      >
                        <PaperPlane className="w-3.5 h-3.5" />
                        <span>{t("splits.detail.create_request_btn")}</span>
                      </Button>
                    )}

                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-mono font-bold text-foreground">
                        {m.paid} / {m.mustPay} ₴
                      </span>
                      {isSettled ? (
                        <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>{t("splits.detail.settled_badge")}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-danger">
                          {t("splits.detail.owes_label", {
                            amount: remainingDebt,
                          })}
                        </span>
                      )}
                    </div>

                    {isSpender && !isSplitArchived && !isExpenseSpenderMember && (
                      <div className="flex items-center gap-1.5">
                        {!isSettled && (
                          <Tooltip key="pay-off">
                            <Tooltip.Trigger>
                              <Button
                                variant="outline"
                                size="sm"
                                onPress={() =>
                                  onOpenPayOff({
                                    expenseId: exp.id,
                                    member: {
                                      userId: m.user.id,
                                      name: memberName,
                                      maxAmount: remainingDebt,
                                    },
                                  })
                                }
                                className="p-1.5 rounded-xl h-8 w-8 min-w-0 text-success border-success/30 hover:bg-success/10 cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content className="px-2 py-1 text-[11px] rounded-md bg-background border border-border shadow-md">
                              {t("splits.detail.pay_off_btn")}
                            </Tooltip.Content>
                          </Tooltip>
                        )}

                        <Tooltip key="increase">
                          <Tooltip.Trigger>
                            <Button
                              variant="outline"
                              size="sm"
                              onPress={() =>
                                onOpenIncrease({
                                  expenseId: exp.id,
                                  member: {
                                    userId: m.user.id,
                                    name: memberName,
                                  },
                                })
                              }
                              className="p-1.5 rounded-xl h-8 w-8 min-w-0 text-accent border-accent/30 hover:bg-accent/10 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </Tooltip.Trigger>
                          <Tooltip.Content className="px-2 py-1 text-[11px] rounded-md bg-background border border-border shadow-md">
                            {t("splits.detail.increase_btn")}
                          </Tooltip.Content>
                        </Tooltip>

                        {exp.members.length > 2 && (
                          <Tooltip key="remove">
                            <Tooltip.Trigger>
                              <Button
                                variant="danger"
                                size="sm"
                                isDisabled={isRemoving}
                                onPress={() => handleRemoveUser(m.user.id)}
                                className="p-1.5 rounded-xl h-8 w-8 min-w-0 cursor-pointer"
                              >
                                <TrashBin className="w-4 h-4" />
                              </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content className="px-2 py-1 text-[11px] rounded-md bg-background border border-border shadow-md">
                              {t("splits.detail.remove_member_btn")}
                            </Tooltip.Content>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
