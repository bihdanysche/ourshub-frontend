"use client";

import { useDeletePost } from "@/entities/post";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { TrashBin } from "@gravity-ui/icons";
import {
  Button,
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
import { useTranslation } from "react-i18next";

interface DeletePostModalProps {
  postId: number | null;
  crewId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function DeletePostModal({
  postId,
  crewId,
  isOpen,
  onClose,
}: DeletePostModalProps) {
  const { t } = useTranslation();
  const { mutate: deletePost, isPending } = useDeletePost(crewId);

  const handleDelete = () => {
    if (!postId) return;

    deletePost(postId, {
      onSuccess: () => {
        toast.success(t("posts.delete_modal.success_toast"));
        onClose();
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
        if (!open) onClose();
      }}
      isDismissable
      isKeyboardDismissDisabled={false}
    >
      <ModalContainer placement="center" size="sm">
        <ModalDialog className="border border-border/60 bg-background/95 backdrop-blur-xl">
          <ModalHeader className="flex flex-col gap-1">
            <ModalHeading className="text-lg font-bold text-foreground">
              {t("posts.delete_modal.title")}
            </ModalHeading>
          </ModalHeader>

          <ModalBody className="py-2">
            <p className="text-sm text-foreground/70 leading-relaxed">
              {t("posts.delete_modal.desc")}
            </p>
          </ModalBody>

          <ModalFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              isDisabled={isPending}
              onPress={onClose}
            >
              {t("posts.delete_modal.cancel_btn")}
            </Button>
            <Button
              variant="danger"
              type="button"
              isDisabled={isPending || !postId}
              onPress={handleDelete}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <Spinner size="sm" color="current" />
              ) : (
                <TrashBin className="w-4 h-4" />
              )}
              <span>{t("posts.delete_modal.delete_btn")}</span>
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
