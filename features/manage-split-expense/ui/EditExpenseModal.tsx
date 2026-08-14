"use client";

import { useUpdateSplit } from "@/entities/split";
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

interface EditExpenseModalProps {
  splitId: number;
  expenseId: number;
  currentTitle: string;
  currentDesc?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditExpenseModal({
  splitId,
  expenseId,
  currentTitle,
  currentDesc,
  isOpen,
  onClose,
}: EditExpenseModalProps) {
  const { t } = useTranslation();
  const { mutate: updateSplit, isPending } = useUpdateSplit(splitId);

  const [title, setTitle] = useState(currentTitle);
  const [desc, setDesc] = useState(currentDesc || "");

  const trimmedTitle = title.trim();
  const isValid = trimmedTitle.length >= 2 && trimmedTitle.length <= 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    updateSplit(
      {
        expenses: [
          {
            id: expenseId,
            title: trimmedTitle,
            desc: desc.trim() || undefined,
          },
        ],
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
              {t("splits.detail.edit_expense_modal_title")}
            </ModalHeading>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody className="py-2 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  {t("splits.wizard.expense_title_label")}
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("splits.wizard.expense_title_placeholder")}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  {t("splits.wizard.desc_label")}
                </label>
                <TextArea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  maxLength={1500}
                  placeholder={t("splits.wizard.expense_desc_placeholder")}
                  className="w-full text-xs"
                />
                <span className="text-[10px] text-foreground/40 text-right font-mono">
                  {(desc || "").length}/1500
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
                isDisabled={isPending || !isValid}
                className="flex items-center gap-2"
              >
                {isPending ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{t("common.save_btn")}</span>
              </Button>
            </ModalFooter>
          </form>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
