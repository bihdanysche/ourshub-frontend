"use client";

import { CrewMember } from "@/entities/crew";
import { Receipt, TrashBin } from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  Chip,
  Input,
  TextArea,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ExpenseDraft } from "../model/types";

interface ExpenseItemCardProps {
  exp: ExpenseDraft;
  index: number;
  totalExpensesCount: number;
  selectedMemberIds: number[];
  selectedMembersMap: Map<number, CrewMember>;
  onUpdateExpense: (id: string, updates: Partial<ExpenseDraft>) => void;
  onRemoveExpense: (id: string) => void;
}

const round2 = (num: number): number =>
  Math.round((num + Number.EPSILON) * 100) / 100;

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function ExpenseItemCard({
  exp,
  index,
  totalExpensesCount,
  selectedMemberIds,
  selectedMembersMap,
  onUpdateExpense,
  onRemoveExpense,
}: ExpenseItemCardProps) {
  const { t } = useTranslation();

  const sortedMemberIds = [...selectedMemberIds].sort((a, b) => {
    if (a === exp.spenderId) return -1;
    if (b === exp.spenderId) return 1;
    return 0;
  });

  return (
    <Card className="border border-border/60 bg-surface/30 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border/30 pb-3">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Receipt className="w-4 h-4 text-accent" />
          <span>{t("splits.wizard.expense_num", { num: index + 1 })}</span>
        </h4>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-surface-secondary/70 p-1 border border-border/40">
            <button
              type="button"
              onClick={() => onUpdateExpense(exp.id, { mode: "AUTO" })}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                exp.mode === "AUTO"
                  ? "bg-accent text-accent-foreground font-bold"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {t("splits.wizard.auto_mode")}
            </button>
            <button
              type="button"
              onClick={() => onUpdateExpense(exp.id, { mode: "MANUAL" })}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                exp.mode === "MANUAL"
                  ? "bg-accent text-accent-foreground font-bold"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {t("splits.wizard.manual_mode")}
            </button>
          </div>

          {totalExpensesCount > 1 && (
            <Button
              variant="danger"
              size="sm"
              onPress={() => onRemoveExpense(exp.id)}
              className="p-1.5 rounded-xl h-8 w-8 min-w-0 cursor-pointer"
            >
              <TrashBin className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          value={exp.title}
          onChange={(e) => onUpdateExpense(exp.id, { title: e.target.value })}
          placeholder={t("splits.wizard.expense_title_placeholder")}
          className="w-full"
        />
        <TextArea
          value={exp.desc}
          onChange={(e) => {
            if (e.target.value.length <= 1500) {
              onUpdateExpense(exp.id, { desc: e.target.value });
            }
          }}
          placeholder={t("splits.wizard.expense_desc_placeholder")}
          rows={1}
          className="w-full p-2.5 rounded-xl bg-surface-secondary/50 border border-border/50 text-foreground text-xs resize-none outline-none max-h-24 overflow-y-auto"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground/80">
            {t("splits.wizard.spender_label")}
          </label>
          <select
            value={exp.spenderId}
            onChange={(e) => {
              const newSpenderId = Number(e.target.value);
              const newSelected = exp.selectedUserIds.includes(newSpenderId)
                ? exp.selectedUserIds
                : [...exp.selectedUserIds, newSpenderId];
              onUpdateExpense(exp.id, {
                spenderId: newSpenderId,
                selectedUserIds: newSelected,
              });
            }}
            className="w-full p-2.5 rounded-xl bg-surface-secondary/50 border border-border/50 text-foreground text-xs font-semibold outline-none"
          >
            {selectedMemberIds.map((userId) => {
              const member = selectedMembersMap.get(userId);
              const name = member
                ? member.alias || member.name
                : `User #${userId}`;
              return (
                <option key={userId} value={userId}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        {exp.mode === "AUTO" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80">
              {t("splits.wizard.total_spent_label")}
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={exp.totalAmount}
              onChange={(e) =>
                onUpdateExpense(exp.id, { totalAmount: e.target.value })
              }
              placeholder={t("splits.wizard.total_spent_placeholder")}
              className="w-full"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 pt-2 border-t border-border/30">
        <label className="text-xs font-semibold text-foreground/80">
          {t("splits.wizard.expense_participants")}
        </label>

        <div className="flex flex-col gap-2">
          {sortedMemberIds.map((userId) => {
            const member = selectedMembersMap.get(userId);
            const displayName = member
              ? member.alias || member.name
              : `User #${userId}`;
            const isSpender = userId === exp.spenderId;
            const isIncluded =
              isSpender || exp.selectedUserIds.includes(userId);

            let calculatedShare = 0;
            if (exp.mode === "AUTO") {
              const total = parseFloat(exp.totalAmount) || 0;
              const count = exp.selectedUserIds.length;
              calculatedShare = count > 0 ? round2(total / count) : 0;
            }

            return (
              <div
                key={userId}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isIncluded
                    ? "bg-surface-secondary/70 border-border/60"
                    : "bg-surface/20 border-border/30 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    disabled={isSpender}
                    checked={isIncluded}
                    onChange={() => {
                      if (isSpender) return;
                      const nextUserIds = isIncluded
                        ? exp.selectedUserIds.filter((id) => id !== userId)
                        : [...exp.selectedUserIds, userId];
                      onUpdateExpense(exp.id, {
                        selectedUserIds: nextUserIds,
                      });
                    }}
                    className="rounded cursor-pointer shrink-0"
                  />

                  <Avatar size="sm" className="w-8 h-8 rounded-xl shrink-0">
                    {member?.avatar && (
                      <AvatarImage src={member.avatar} alt={displayName} />
                    )}
                    <AvatarFallback className="text-xs font-bold bg-accent/20 text-accent-foreground">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate">
                        {displayName}
                      </span>
                      {isSpender && (
                        <Chip
                          size="sm"
                          variant="soft"
                          color="accent"
                          className="text-[9px] font-bold px-1.5 py-0"
                        >
                          {t("splits.wizard.spender_badge")}
                        </Chip>
                      )}
                    </div>
                    {member?.username && (
                      <span className="text-[10px] text-foreground/40 truncate">
                        @{member.username}
                      </span>
                    )}
                  </div>
                </div>

                {isIncluded && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {exp.mode === "AUTO" ? (
                      <span className="font-mono text-xs font-bold text-foreground/80">
                        {calculatedShare} ₴
                      </span>
                    ) : isSpender ? (
                      <span className="font-mono text-xs font-bold text-accent px-2 py-1 rounded-lg bg-accent/10 border border-accent/20">
                        {t("splits.wizard.paid_status")}
                      </span>
                    ) : (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={exp.manualShares[userId] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          onUpdateExpense(exp.id, {
                            manualShares: {
                              ...exp.manualShares,
                              [userId]: val,
                            },
                          });
                        }}
                        placeholder="0.00"
                        className="w-28 text-right"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
