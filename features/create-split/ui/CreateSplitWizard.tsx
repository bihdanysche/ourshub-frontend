"use client";

import { useMe } from "@/entities/auth";
import { CrewMember, useCrewMembers } from "@/entities/crew";
import { CreateSplitDto, CreateSplitExpenseDto, useCreateSplit } from "@/entities/split";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { Card, CardContent, Chip, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExpenseDraft } from "../model/types";
import { CreateSplitStep1 } from "./CreateSplitStep1";
import { CreateSplitStep2 } from "./CreateSplitStep2";

interface CreateSplitWizardProps {
  crewId: number;
}

const round2 = (num: number): number =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export function CreateSplitWizard({ crewId }: CreateSplitWizardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: currentUser } = useMe();
  const currentUserId = currentUser?.id;

  const { mutate: createSplit, isPending } = useCreateSplit(crewId);

  const [step, setStep] = useState<1 | 2>(1);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>(() =>
    currentUserId ? [currentUserId] : [],
  );

  const { data: membersData } = useCrewMembers(crewId);
  const allMembers = useMemo(() => membersData?.items ?? [], [membersData?.items]);

  const effectiveSelectedMemberIds = useMemo(() => {
    if (!currentUserId) return selectedMemberIds;
    if (selectedMemberIds.includes(currentUserId)) {
      return selectedMemberIds;
    }
    return [currentUserId, ...selectedMemberIds];
  }, [currentUserId, selectedMemberIds]);

  const selectedMembersMap = useMemo(() => {
    const map = new Map<number, CrewMember>();
    allMembers.forEach((m) => {
      if (effectiveSelectedMemberIds.includes(m.userId)) {
        map.set(m.userId, m);
      }
    });
    return map;
  }, [allMembers, effectiveSelectedMemberIds]);

  const [expenses, setExpenses] = useState<ExpenseDraft[]>(() => [
    {
      id: "1",
      title: "",
      desc: "",
      spenderId: 0,
      selectedUserIds: [],
      mode: "AUTO",
      totalAmount: "",
      manualShares: {},
    },
  ]);

  const handleGoToStep2 = () => {
    if (
      !title.trim() ||
      title.trim().length < 2 ||
      effectiveSelectedMemberIds.length < 2
    ) {
      return;
    }

    setExpenses((prevExpenses) =>
      prevExpenses.map((exp) => {
        const defaultSpender =
          exp.spenderId && effectiveSelectedMemberIds.includes(exp.spenderId)
            ? exp.spenderId
            : currentUserId && effectiveSelectedMemberIds.includes(currentUserId)
              ? currentUserId
              : effectiveSelectedMemberIds[0] || 0;
        return {
          ...exp,
          spenderId: defaultSpender,
          selectedUserIds: effectiveSelectedMemberIds,
        };
      }),
    );

    setStep(2);
  };

  const handleAddExpense = () => {
    if (expenses.length >= 10) return;
    const firstSpender = currentUserId || effectiveSelectedMemberIds[0] || 0;
    setExpenses((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: "",
        desc: "",
        spenderId: firstSpender,
        selectedUserIds: [...effectiveSelectedMemberIds],
        mode: "AUTO",
        totalAmount: "",
        manualShares: {},
      },
    ]);
  };

  const handleRemoveExpense = (id: string) => {
    if (expenses.length <= 1) return;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExpense = (id: string, updates: Partial<ExpenseDraft>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    );
  };

  const isStep2Valid = useMemo(() => {
    if (expenses.length === 0 || expenses.length > 10) return false;
    return expenses.every((exp) => {
      if (exp.title.trim().length < 2 || exp.title.trim().length > 30) {
        return false;
      }
      if (!exp.spenderId || !effectiveSelectedMemberIds.includes(exp.spenderId)) {
        return false;
      }
      if (exp.selectedUserIds.length < 2) {
        return false;
      }

      if (exp.mode === "AUTO") {
        const total = parseFloat(exp.totalAmount);
        return !isNaN(total) && total > 0;
      } else {
        return exp.selectedUserIds.every((userId) => {
          if (userId === exp.spenderId) return true;
          const share = parseFloat(exp.manualShares[userId] || "");
          return !isNaN(share) && share >= 0;
        });
      }
    });
  }, [expenses, effectiveSelectedMemberIds]);

  const handleSubmitFinal = () => {
    if (
      !title.trim() ||
      title.trim().length < 2 ||
      effectiveSelectedMemberIds.length < 2 ||
      !isStep2Valid
    ) {
      return;
    }

    const payloadExpenses: CreateSplitExpenseDto[] = expenses.map((exp) => {
      if (exp.mode === "AUTO") {
        const total = parseFloat(exp.totalAmount) || 0;
        const count = exp.selectedUserIds.length;
        const autoShare = count > 0 ? round2(total / count) : 0;

        const members = exp.selectedUserIds.map((userId) => {
          if (userId === exp.spenderId) {
            return {
              user: userId,
              paid: autoShare,
              mustPay: autoShare,
            };
          }
          return {
            user: userId,
            paid: 0,
            mustPay: autoShare,
          };
        });

        return {
          title: exp.title.trim(),
          desc: exp.desc.trim() || undefined,
          spender: exp.spenderId,
          members,
        };
      } else {
        let spenderPaidSum = 0;

        const members = exp.selectedUserIds.map((userId) => {
          if (userId === exp.spenderId) {
            return {
              user: userId,
              paid: 0,
              mustPay: 0,
            };
          }
          const share = parseFloat(exp.manualShares[userId] || "0") || 0;
          const roundedShare = round2(share);
          spenderPaidSum += roundedShare;
          return {
            user: userId,
            paid: 0,
            mustPay: roundedShare,
          };
        });

        const spenderShare = round2(
          spenderPaidSum / Math.max(1, exp.selectedUserIds.length),
        );
        const finalMembers = members.map((m) => {
          if (m.user === exp.spenderId) {
            return {
              user: m.user,
              paid: round2(spenderPaidSum),
              mustPay: spenderShare,
            };
          }
          return m;
        });

        return {
          title: exp.title.trim(),
          desc: exp.desc.trim() || undefined,
          spender: exp.spenderId,
          members: finalMembers,
        };
      }
    });

    const payload: CreateSplitDto = {
      title: title.trim(),
      desc: desc.trim() || undefined,
      expenses: payloadExpenses,
    };

    createSplit(payload, {
      onSuccess: () => {
        toast.success(t("splits.success_toast"));
        router.push(`/crews/${crewId}/splits`);
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  return (
    <Card className="border border-border/60 bg-surface/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xs">
      <CardContent className="p-0 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-foreground">
              {t("splits.wizard.title")}
            </h2>
            <p className="text-xs text-foreground/60">
              {step === 1
                ? t("splits.wizard.step1_desc")
                : t("splits.wizard.step2_desc")}
            </p>
          </div>
          <Chip size="sm" variant="soft" color="accent" className="font-bold">
            {t("splits.wizard.step_indicator", { current: step, total: 2 })}
          </Chip>
        </div>

        {step === 1 ? (
          <CreateSplitStep1
            crewId={crewId}
            currentUserId={currentUserId}
            title={title}
            onChangeTitle={setTitle}
            desc={desc}
            onChangeDesc={setDesc}
            selectedMemberIds={effectiveSelectedMemberIds}
            onChangeSelectedMemberIds={setSelectedMemberIds}
            onGoToStep2={handleGoToStep2}
            isPending={isPending}
          />
        ) : (
          <CreateSplitStep2
            expenses={expenses}
            selectedMemberIds={effectiveSelectedMemberIds}
            selectedMembersMap={selectedMembersMap}
            onBackToStep1={() => setStep(1)}
            onAddExpense={handleAddExpense}
            onRemoveExpense={handleRemoveExpense}
            onUpdateExpense={updateExpense}
            onSubmitFinal={handleSubmitFinal}
            isStep2Valid={isStep2Valid}
            isPending={isPending}
          />
        )}
      </CardContent>
    </Card>
  );
}
