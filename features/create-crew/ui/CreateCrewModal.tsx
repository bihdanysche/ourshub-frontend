"use client";

import {
  CreateCrewInput,
  createCrewSchema,
  useCreateCrew,
} from "@/entities/crew";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "@gravity-ui/icons";
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
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface CreateCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCrewModal({ isOpen, onClose }: CreateCrewModalProps) {
  const { t } = useTranslation();
  const { mutate: createCrew, isPending } = useCreateCrew();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateCrewInput>({
    resolver: zodResolver(createCrewSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (data: CreateCrewInput) => {
    createCrew(data, {
      onSuccess: () => {
        toast.success(t("home.create_modal.success_toast"));
        reset();
        onClose();
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              <ModalHeading className="text-lg font-bold text-foreground">
                {t("home.create_modal.title")}
              </ModalHeading>
              <p className="text-xs text-foreground/60">
                {t("home.create_modal.subtitle")}
              </p>
            </ModalHeader>

            <ModalBody className="py-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="create-crew-title-input"
                  className="text-sm font-semibold text-foreground"
                >
                  {t("home.create_modal.name_label")}
                </label>
                <InputGroup className="w-full">
                  <InputGroupInput
                    id="create-crew-title-input"
                    type="text"
                    disabled={isPending}
                    placeholder={t("home.create_modal.name_placeholder")}
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
                onPress={handleClose}
              >
                {t("home.create_modal.cancel_btn")}
              </Button>
              <Button
                variant="primary"
                type="submit"
                isDisabled={!isValid || isPending}
                className="flex items-center gap-2"
              >
                {isPending ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{t("home.create_modal.submit_btn")}</span>
              </Button>
            </ModalFooter>
          </form>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
