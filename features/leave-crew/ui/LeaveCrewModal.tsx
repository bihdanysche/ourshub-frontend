"use client";

import { useMe } from "@/entities/auth";
import {
  CrewDetail,
  CrewListItem,
  useCrewMembers,
  useRemoveMember,
} from "@/entities/crew";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { ArrowRightFromSquare } from "@gravity-ui/icons";
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

interface LeaveCrewModalProps {
  crew: CrewListItem | CrewDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LeaveCrewModal({
  crew,
  isOpen,
  onClose,
  onSuccess,
}: LeaveCrewModalProps) {
  const { t } = useTranslation();
  const { data: me } = useMe();
  const { data: membersData, isPending: isMembersLoading } = useCrewMembers(
    crew?.id ?? 0,
  );
  const { mutate: removeMember, isPending: isLeaving } = useRemoveMember();

  const myMember = membersData?.items.find((m) => m.userId === me?.id);

  const handleLeave = () => {
    if (!crew || !myMember) return;

    removeMember(
      { crewId: crew.id, memberId: myMember.id },
      {
        onSuccess: () => {
          toast.success(t("home.leave_modal.success_toast"));
          onClose();
          onSuccess?.();
        },
        onError: (err) => {
          toastApiError(err);
        },
      },
    );
  };

  const isBusy = isMembersLoading || isLeaving;

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
            <ModalHeading className="text-lg font-bold text-foreground flex items-center gap-2">
              <ArrowRightFromSquare className="w-5 h-5 text-danger" />
              <span>{t("home.leave_modal.title")}</span>
            </ModalHeading>
            <p className="text-xs text-foreground/60 leading-relaxed">
              {t("home.leave_modal.desc", { title: crew?.title ?? "" })}
            </p>
          </ModalHeader>

          <ModalBody className="py-2" />

          <ModalFooter className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              isDisabled={isBusy}
              onPress={onClose}
            >
              {t("home.leave_modal.cancel_btn")}
            </Button>
            <Button
              variant="danger"
              type="button"
              isDisabled={isBusy || !myMember}
              onPress={handleLeave}
              className="flex items-center gap-2"
            >
              {isBusy ? (
                <Spinner size="sm" color="current" />
              ) : (
                <ArrowRightFromSquare className="w-4 h-4" />
              )}
              <span>{t("home.leave_modal.leave_btn")}</span>
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
