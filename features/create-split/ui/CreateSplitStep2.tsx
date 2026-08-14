"use client";

import { CrewMember } from "@/entities/crew";
import { ArrowLeft, Check, Plus } from "@gravity-ui/icons";
import { Button, Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ExpenseDraft } from "../model/types";
import { ExpenseItemCard } from "./ExpenseItemCard";

interface CreateSplitStep2Props {
  expenses: ExpenseDraft[];
  selectedMemberIds: number[];
  selectedMembersMap: Map<number, CrewMember>;
  onBackToStep1: () => void;
  onAddExpense: () => void;
  onRemoveExpense: (id: string) => void;
  onUpdateExpense: (id: string, updates: Partial<ExpenseDraft>) => void;
  onSubmitFinal: () => void;
  isStep2Valid: boolean;
  isPending: boolean;
}

export function CreateSplitStep2({
  expenses,
  selectedMemberIds,
  selectedMembersMap,
  onBackToStep1,
  onAddExpense,
  onRemoveExpense,
  onUpdateExpense,
  onSubmitFinal,
  isStep2Valid,
  isPending,
}: CreateSplitStep2Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onPress={onBackToStep1}
          className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("splits.back_btn")}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          isDisabled={expenses.length >= 10}
          onPress={onAddExpense}
          className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("splits.wizard.add_expense_btn")}</span>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {expenses.map((exp, index) => (
          <ExpenseItemCard
            key={exp.id}
            exp={exp}
            index={index}
            totalExpensesCount={expenses.length}
            selectedMemberIds={selectedMemberIds}
            selectedMembersMap={selectedMembersMap}
            onUpdateExpense={onUpdateExpense}
            onRemoveExpense={onRemoveExpense}
          />
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-border/40">
        <Button
          variant="primary"
          isDisabled={!isStep2Valid || isPending}
          onPress={onSubmitFinal}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold cursor-pointer"
        >
          {isPending ? (
            <>
              <Spinner size="sm" color="current" />
              <span>{t("splits.submitting_btn")}</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{t("splits.create_split_btn")}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
