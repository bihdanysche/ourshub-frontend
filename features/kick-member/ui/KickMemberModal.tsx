"use client";

import { CrewMember, useRemoveMember } from "@/entities/crew";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { PersonXmark } from "@gravity-ui/icons";
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

interface KickMemberModalProps {
  crewId: number;
  member: CrewMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function KickMemberModal({
  crewId,
  member,
  isOpen,
  onClose,
}: KickMemberModalProps) {
  const { t } = useTranslation();
  const { mutate: removeMember, isPending } = useRemoveMember();

  const handleKick = () => {
    if (!member) return;

    removeMember(
      {
        crewId,
        memberId: member.id,
      },
      {
        onSuccess: () => {
          toast.success(t("crew_page.members_list.kick_modal.success_toast"));
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
      <ModalContainer placement="center" size="md">
        <ModalDialog className="border border-border/60 bg-background/95 backdrop-blur-xl">
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-danger">
              <PersonXmark className="w-5 h-5" />
              <ModalHeading className="text-lg font-bold text-foreground">
                {t("crew_page.members_list.kick_modal.title")}
              </ModalHeading>
            </div>
            <p className="text-xs text-foreground/60 leading-relaxed">
              {t("crew_page.members_list.kick_modal.desc", {
                name: member?.name ?? "",
              })}
            </p>
          </ModalHeader>

          <ModalBody className="py-2" />

          <ModalFooter className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              isDisabled={isPending}
              onPress={onClose}
            >
              {t("crew_page.members_list.kick_modal.cancel_btn")}
            </Button>
            <Button
              variant="danger"
              type="button"
              isDisabled={isPending || !member}
              onPress={handleKick}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <Spinner size="sm" color="current" />
              ) : (
                <PersonXmark className="w-4 h-4" />
              )}
              <span>{t("crew_page.members_list.kick_modal.kick_btn")}</span>
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
