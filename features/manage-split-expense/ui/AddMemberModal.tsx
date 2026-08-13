"use client";

import { useCrewMembers } from "@/entities/crew";
import { useAddMemberToExpense } from "@/entities/split";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { getAvatarUrl } from "@/shared/lib";
import { Check, Plus } from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AddMemberModalProps {
  splitId: number;
  expenseId: number;
  crewId: number;
  existingUserIds: number[];
  isOpen: boolean;
  onClose: () => void;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function AddMemberModal({
  splitId,
  expenseId,
  crewId,
  existingUserIds,
  isOpen,
  onClose,
}: AddMemberModalProps) {
  const { t } = useTranslation();
  const { mutate: addMembers, isPending } = useAddMemberToExpense(
    splitId,
    expenseId,
  );

  const { data: crewMembersData, isPending: isMembersPending } =
    useCrewMembers(crewId);
  const availableMembers = (crewMembersData?.items ?? []).filter(
    (m) => !existingUserIds.includes(m.userId),
  );

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [mustPayValues, setMustPayValues] = useState<Record<number, string>>({});

  const handleToggleMember = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSubmit = () => {
    if (selectedUserIds.length === 0) return;

    const payloadMembers = selectedUserIds.map((userId) => {
      const share = parseFloat(mustPayValues[userId] || "0") || 0;
      return {
        user: userId,
        paid: 0,
        mustPay: share,
      };
    });

    addMembers(
      { members: payloadMembers },
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

  const isValid =
    selectedUserIds.length > 0 &&
    selectedUserIds.every((id) => {
      const val = parseFloat(mustPayValues[id] || "");
      return !isNaN(val) && val >= 0;
    });

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
            <ModalHeading className="text-base font-bold text-foreground">
              {t("splits.detail.add_members_modal_title")}
            </ModalHeading>
          </ModalHeader>

          <ModalBody className="py-2 flex flex-col gap-4 max-h-96 overflow-y-auto">
            <label className="text-xs font-semibold text-foreground/80">
              {t("splits.detail.add_members_select_label")}
            </label>

            {isMembersPending ? (
              <div className="flex justify-center py-6">
                <Spinner size="md" color="accent" />
              </div>
            ) : availableMembers.length === 0 ? (
              <p className="text-xs text-foreground/50 text-center py-4">
                All crew members are already in this expense.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {availableMembers.map((m) => {
                  const isSelected = selectedUserIds.includes(m.userId);
                  const displayName = m.alias || m.name;

                  return (
                    <div
                      key={m.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-accent/15 border-accent text-foreground"
                          : "bg-surface/30 border-border/50 text-foreground/70"
                      }`}
                    >
                      <div
                        onClick={() => handleToggleMember(m.userId)}
                        className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleMember(m.userId)}
                          className="rounded cursor-pointer"
                        />
                        <Avatar size="sm" className="w-8 h-8 rounded-full shrink-0">
                          {m.avatar && (
                            <AvatarImage src={getAvatarUrl(m.avatar)} alt={displayName} />
                          )}
                          <AvatarFallback className="text-xs font-bold bg-accent/20 text-accent-foreground">
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold truncate">
                            {displayName}
                          </span>
                          {m.username && (
                            <span className="text-[10px] text-foreground/40 font-mono truncate">
                              @{m.username}
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-32 shrink-0 ml-3">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={mustPayValues[m.userId] || ""}
                            onChange={(e) =>
                              setMustPayValues({
                                ...mustPayValues,
                                [m.userId]: e.target.value,
                              })
                            }
                            placeholder="Must pay (₴)"
                            className="w-full text-right"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
              <span>{t("splits.detail.add_members_submit")}</span>
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
