"use client";

import { TrashBin } from "@gravity-ui/icons";
import {
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogIcon,
  Button,
  Spinner,
} from "@heroui/react";
import { useTranslation } from "react-i18next";

interface TerminateConfirmModalProps {
  isOpen: boolean;
  type: "single" | "all";
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function TerminateConfirmModal({
  isOpen,
  type,
  isPending,
  onClose,
  onConfirm,
}: TerminateConfirmModalProps) {
  const { t } = useTranslation();

  return (
    <AlertDialogBackdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      isDismissable
      isKeyboardDismissDisabled={false}
    >
      <AlertDialogContainer placement="center" size="md">
        <AlertDialogDialog className="border border-border/60 bg-background/95 backdrop-blur-xl">
          <AlertDialogHeader className="flex flex-row items-center gap-3">
            <AlertDialogIcon status="danger" />
            <AlertDialogHeading className="text-base font-bold text-foreground">
              {type === "single"
                ? t("settings.sessions.modal_single_title")
                : t("settings.sessions.modal_all_title")}
            </AlertDialogHeading>
          </AlertDialogHeader>
          <AlertDialogBody className="py-2 text-sm text-foreground/70 leading-relaxed">
            {type === "single"
              ? t("settings.sessions.modal_single_desc")
              : t("settings.sessions.modal_all_desc")}
          </AlertDialogBody>
          <AlertDialogFooter className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onPress={onClose}>
              {t("settings.sessions.cancel_btn")}
            </Button>
            <Button
              variant="danger"
              isDisabled={isPending}
              onPress={onConfirm}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <Spinner size="sm" color="current" />
              ) : (
                <TrashBin className="w-4 h-4" />
              )}
              <span>{t("settings.sessions.confirm_btn")}</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogDialog>
      </AlertDialogContainer>
    </AlertDialogBackdrop>
  );
}
