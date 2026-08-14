"use client";

import {
  CrewDetail,
  CrewListItem,
  UpdateCrewInput,
  updateCrewSchema,
  useUpdateCrew,
} from "@/entities/crew";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloppyDisk } from "@gravity-ui/icons";
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

interface EditCrewModalProps {
  crew: CrewListItem | CrewDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditCrewModal({
  crew,
  isOpen,
  onClose,
  onSuccess,
}: EditCrewModalProps) {
  const { t } = useTranslation();
  const { mutate: updateCrew, isPending } = useUpdateCrew();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<UpdateCrewInput>({
    resolver: zodResolver(updateCrewSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (crew) {
      reset({ title: crew.title });
    }
  }, [crew, reset]);

  const onSubmit = (data: UpdateCrewInput) => {
    if (!crew) return;

    updateCrew(
      { id: crew.id, data },
      {
        onSuccess: () => {
          toast.success(t("home.edit_modal.success_toast"));
          onClose();
          onSuccess?.();
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
              <ModalHeading className="text-lg font-bold text-foreground">
                {t("home.edit_modal.title")}
              </ModalHeading>
              <p className="text-xs text-foreground/60">
                {t("home.edit_modal.subtitle")}
              </p>
            </ModalHeader>

            <ModalBody className="py-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="edit-crew-title-input"
                  className="text-sm font-semibold text-foreground"
                >
                  {t("home.edit_modal.name_label")}
                </label>
                <InputGroup className="w-full">
                  <InputGroupInput
                    id="edit-crew-title-input"
                    type="text"
                    disabled={isPending}
                    placeholder={t("home.edit_modal.name_placeholder")}
                    autoFocus
                    {...register("title")}
                  />
                </InputGroup>
                {errors.title?.message && (
                  <p className="text-xs text-danger font-medium animate-in fade-in-0 duration-150">
                    {t(errors.title.message)}
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
                {t("home.edit_modal.cancel_btn")}
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
                <span>{t("home.edit_modal.save_btn")}</span>
              </Button>
            </ModalFooter>
          </form>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
