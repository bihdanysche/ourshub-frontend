"use client";

import {
  CrewMember,
  UpdateMemberAliasInput,
  updateMemberAliasSchema,
  useUpdateMemberAlias,
} from "@/entities/crew";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloppyDisk, Tag } from "@gravity-ui/icons";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface UpdateMemberAliasModalProps {
  crewId: number;
  member: CrewMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateMemberAliasModal({
  crewId,
  member,
  isOpen,
  onClose,
}: UpdateMemberAliasModalProps) {
  const { t } = useTranslation();
  const { mutate: updateAlias, isPending } = useUpdateMemberAlias();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<UpdateMemberAliasInput>({
    resolver: zodResolver(updateMemberAliasSchema),
    mode: "onChange",
    defaultValues: {
      alias: "",
    },
  });

  useEffect(() => {
    if (member) {
      reset({ alias: member.alias ?? "" });
    }
  }, [member, reset]);

  const onSubmit = (data: UpdateMemberAliasInput) => {
    if (!member) return;

    const trimmedAlias = data.alias?.trim();
    const payload = trimmedAlias ? trimmedAlias : null;

    updateAlias(
      {
        crewId,
        memberId: member.id,
        data: { alias: payload },
      },
      {
        onSuccess: () => {
          toast.success(t("crew_page.members_list.alias_modal.success_toast"));
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-accent">
                <Tag className="w-5 h-5" />
                <ModalHeading className="text-lg font-bold text-foreground">
                  {t("crew_page.members_list.alias_modal.title")}
                </ModalHeading>
              </div>
              <p className="text-xs text-foreground/60">
                {t("crew_page.members_list.alias_modal.subtitle", {
                  name: member?.name ?? "",
                })}
              </p>
            </ModalHeader>

            <ModalBody className="py-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="member-alias-input"
                  className="text-xs font-semibold text-foreground/80"
                >
                  {t("crew_page.members_list.alias_modal.label")}
                </label>
                <InputGroup className="w-full">
                  <InputGroupInput
                    id="member-alias-input"
                    type="text"
                    disabled={isPending}
                    placeholder={t(
                      "crew_page.members_list.alias_modal.placeholder",
                    )}
                    autoFocus
                    {...register("alias")}
                  />
                </InputGroup>
                <span className="text-[11px] text-foreground/50">
                  {t("crew_page.members_list.alias_modal.helper")}
                </span>
                {errors.alias?.message && (
                  <p className="text-xs text-danger font-medium animate-in fade-in-0 duration-150">
                    {t(errors.alias.message)}
                  </p>
                )}
              </div>
            </ModalBody>

            <ModalFooter className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                isDisabled={isPending}
                onPress={onClose}
              >
                {t("crew_page.members_list.alias_modal.cancel_btn")}
              </Button>
              <Button
                variant="primary"
                type="submit"
                isDisabled={!isValid || !isDirty || isPending}
                className="flex items-center gap-2"
              >
                {isPending ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <FloppyDisk className="w-4 h-4" />
                )}
                <span>{t("crew_page.members_list.alias_modal.save_btn")}</span>
              </Button>
            </ModalFooter>
          </form>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
