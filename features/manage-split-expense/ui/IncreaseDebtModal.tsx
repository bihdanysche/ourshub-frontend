"use client";

import { useIncreaseDebtExpenseMember } from "@/entities/split";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { Plus } from "@gravity-ui/icons";
import {
  Button,
  Input,
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  Spinner,
  toast,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface IncreaseDebtModalProps {
  splitId: number;
  expenseId: number;
  member: {
    userId: number;
    name: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IncreaseDebtModal({
  splitId,
  expenseId,
  member,
  isOpen,
  onClose,
}: IncreaseDebtModalProps) {
  const { t } = useTranslation();
  const { mutate: increaseDebt, isPending } = useIncreaseDebtExpenseMember(
    splitId,
    expenseId,
  );

  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (member) {
      setAmount("");
      setMsg("");
    }
  }, [member]);

  const handleSubmit = () => {
    if (!member) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    increaseDebt(
      [
        {
          user: member.userId,
          amount: numAmount,
          msg: msg.trim() || undefined,
        },
      ],
      {
        onSuccess: () => {
          toast.success(t("common.success"));
          onClose();
        },
        onError: (err) => {
          toastApiError(err);
        },
      },
    );
  };

  const parsedAmount = parseFloat(amount);
  const isValid =
    member &&
    !isNaN(parsedAmount) &&
    parsedAmount > 0 &&
    msg.length <= 50;

  return (
    <ModalBackdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      isDismissable
      isKeyboardDismissDisabled={false}
    >
      <ModalContainer placement="center" size="sm">
        <ModalDialog className="border border-border/60 bg-background/95 backdrop-blur-xl">
          <ModalHeader className="flex flex-col gap-1">
            <ModalHeading className="text-base font-bold text-foreground">
              {t("splits.detail.increase_modal_title", {
                name: member?.name || "",
              })}
            </ModalHeading>
          </ModalHeader>

          <ModalBody className="py-2 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground">
                {t("splits.detail.amount_label")}
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t("splits.detail.amount_placeholder")}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {t("splits.detail.note_label")}
                </label>
                <span className="text-[10px] text-foreground/40 font-mono">
                  {msg.length}/50
                </span>
              </div>
              <Input
                value={msg}
                onChange={(e) => {
                  if (e.target.value.length <= 50) {
                    setMsg(e.target.value);
                  }
                }}
                placeholder={t("splits.detail.note_placeholder")}
                className="w-full"
              />
            </div>
          </ModalBody>

          <ModalFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              isDisabled={isPending}
              onPress={onClose}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              type="button"
              isDisabled={isPending || !isValid}
              onPress={handleSubmit}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <Spinner size="sm" color="current" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{t("splits.detail.submit_increase")}</span>
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
