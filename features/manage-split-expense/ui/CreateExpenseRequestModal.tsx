"use client";

import { useCreateExpenseRequest } from "@/entities/split";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { Check } from "@gravity-ui/icons";
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
  TextArea,
  toast,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CreateExpenseRequestModalProps {
  splitId: number;
  expenseId: number;
  expenseTitle: string;
  maxAmount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateExpenseRequestModal({
  splitId,
  expenseId,
  expenseTitle,
  maxAmount,
  isOpen,
  onClose,
}: CreateExpenseRequestModalProps) {
  const { t } = useTranslation();
  const { mutate: createRequest, isPending } = useCreateExpenseRequest(
    splitId,
    expenseId,
  );

  const [amount, setAmount] = useState(maxAmount > 0 ? String(maxAmount) : "");
  const [msg, setMsg] = useState("");

  const parsedAmount = parseFloat(amount || "0");
  const isValidAmount =
    !isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= maxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount) return;

    createRequest(
      {
        amount: parsedAmount,
        msg: msg.trim() || undefined,
      },
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
              {t("splits.detail.create_request_modal_title", {
                title: expenseTitle,
              })}
            </ModalHeading>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody className="py-2 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-foreground/80">
                    {t("splits.detail.amount_label")}
                  </label>
                  <span className="text-foreground/50 font-mono">
                    {t("splits.detail.max_pay_off", { amount: maxAmount })}
                  </span>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={maxAmount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t("splits.detail.amount_placeholder")}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  {t("splits.detail.note_label")}
                </label>
                <TextArea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  maxLength={50}
                  placeholder={t("splits.detail.note_placeholder")}
                  className="w-full text-xs"
                />
                <span className="text-[10px] text-foreground/40 text-right font-mono">
                  {msg.length}/50
                </span>
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
                type="submit"
                isDisabled={isPending || !isValidAmount}
                className="flex items-center gap-2"
              >
                {isPending ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{t("splits.detail.create_request_submit")}</span>
              </Button>
            </ModalFooter>
          </form>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
