"use client";

import { CrewDetail, CrewListItem, useDeleteCrew } from "@/entities/crew";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { TrashBin } from "@gravity-ui/icons";
import {
  Button,
  InputGroup,
  InputGroupInput,
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
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface DeleteCrewModalProps {
  crew: CrewListItem | CrewDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteCrewModal({
  crew,
  isOpen,
  onClose,
  onSuccess,
}: DeleteCrewModalProps) {
  const { t } = useTranslation();
  const [confirmText, setConfirmText] = useState("");
  const { mutate: deleteCrew, isPending } = useDeleteCrew();

  const isConfirmed = confirmText.trim().toUpperCase() === "CONFIRM";

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const handleDelete = () => {
    if (!crew || !isConfirmed) return;

    deleteCrew(crew.id, {
      onSuccess: () => {
        toast.success(t("home.delete_modal.success_toast"));
        handleClose();
        onSuccess?.();
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  return (
    <ModalBackdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      isDismissable
      isKeyboardDismissDisabled={false}
    >
      <ModalContainer placement="center" size="md">
        <ModalDialog className="border border-border/60 bg-background/95 backdrop-blur-xl">
          <ModalHeader className="flex flex-col gap-1">
            <ModalHeading className="text-lg font-bold text-danger flex items-center gap-2">
              <TrashBin className="w-5 h-5 text-danger" />
              <span>{t("home.delete_modal.title")}</span>
            </ModalHeading>
            <p className="text-xs text-foreground/60 leading-relaxed">
              {t("home.delete_modal.desc", { title: crew?.title ?? "" })}
            </p>
          </ModalHeader>

          <ModalBody className="py-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirm-delete-input"
                className="text-xs font-semibold text-foreground/80"
              >
                {t("home.delete_modal.confirm_label")}
              </label>
              <InputGroup className="w-full">
                <InputGroupInput
                  id="confirm-delete-input"
                  type="text"
                  autoComplete="off"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={t("home.delete_modal.confirm_placeholder")}
                  disabled={isPending}
                  autoFocus
                />
              </InputGroup>
            </div>
          </ModalBody>

          <ModalFooter className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              isDisabled={isPending}
              onPress={handleClose}
            >
              {t("home.delete_modal.cancel_btn")}
            </Button>
            <Button
              variant="danger"
              type="button"
              isDisabled={!isConfirmed || isPending}
              onPress={handleDelete}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <Spinner size="sm" color="current" />
              ) : (
                <TrashBin className="w-4 h-4" />
              )}
              <span>{t("home.delete_modal.delete_btn")}</span>
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
