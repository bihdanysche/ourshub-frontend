"use client";

import {
  editProfileSchema,
  EditProfileInput,
  useDeleteAvatar,
  useEditProfile,
  useMe,
  useUploadAvatar,
} from "@/entities/auth";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { cn, getAvatarUrl } from "@/shared/lib";
import { ImageCropModal } from "@/shared/ui/ImageCropModal";
import { ArrowUpFromLine, At, Delete, FloppyDisk, Person } from "@gravity-ui/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  InputGroup,
  InputGroupInput,
  InputGroupPrefix,
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  Skeleton,
  Spinner,
  toast,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function MyProfileSection() {
  const { t } = useTranslation();
  const { data: user, isPending } = useMe();
  const { mutate: editProfile, isPending: isUpdating } = useEditProfile();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();
  const { mutate: deleteAvatar, isPending: isDeletingAvatar } = useDeleteAvatar();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      username: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        username: user.username ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: EditProfileInput) => {
    const payload: { name?: string; username?: string } = {};
    if (data.name !== user?.name) payload.name = data.name;
    if (data.username !== (user?.username ?? "")) payload.username = data.username;

    editProfile(payload, {
      onSuccess: () => {
        toast.success(t("settings.profile.save_success"));
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    uploadAvatar(croppedFile, {
      onSuccess: () => {
        toast.success(t("common.success"));
        setSelectedImageSrc(null);
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  const handleDeleteAvatarConfirm = () => {
    deleteAvatar(undefined, {
      onSuccess: () => {
        toast.success(t("common.success"));
        setIsDeleteModalOpen(false);
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <div className="border-b border-border/40 pb-4">
          <Skeleton className="w-40 h-7 rounded-lg" />
          <Skeleton className="w-72 h-4 rounded-md mt-2" />
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-surface/30">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-32 h-5 rounded-md" />
            <Skeleton className="w-48 h-4 rounded-md" />
          </div>
        </div>

        <div className="flex flex-col gap-5 max-w-lg">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-full h-10 rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-full h-10 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-bold text-foreground">
          {t("settings.profile.title")}
        </h1>
        <p className="text-sm text-foreground/60 mt-1">
          {t("settings.profile.description")}
        </p>
      </div>

      {user && (
        <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-border/60 bg-surface/40 shadow-xs flex-wrap sm:flex-nowrap">
          <Avatar size="lg" color="accent" className="w-16 h-16 text-base shrink-0 rounded-full">
            {user.avatar && <AvatarImage src={getAvatarUrl(user.avatar)} alt={user.name} className="rounded-full" />}
            <AvatarFallback className="rounded-full">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {t("settings.profile.avatar_title")}
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/heic"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                variant="outline"
                size="sm"
                isDisabled={isUploadingAvatar || isDeletingAvatar}
                onPress={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 cursor-pointer text-xs"
              >
                {isUploadingAvatar ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <ArrowUpFromLine className="w-3.5 h-3.5" />
                )}
                <span>{t("settings.profile.upload_avatar_btn")}</span>
              </Button>

              {user.avatar && (
                <Button
                  variant="danger-soft"
                  size="sm"
                  isDisabled={isUploadingAvatar || isDeletingAvatar}
                  onPress={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  {isDeletingAvatar ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Delete className="w-3.5 h-3.5" />
                  )}
                  <span>{t("settings.profile.delete_avatar_btn")}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedImageSrc && (
        <ImageCropModal
          imageSrc={selectedImageSrc}
          isOpen={Boolean(selectedImageSrc)}
          onClose={() => setSelectedImageSrc(null)}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
          cropShape="round"
        />
      )}

      {isDeleteModalOpen && (
        <ModalBackdrop
          isOpen={isDeleteModalOpen}
          onOpenChange={(open) => {
            if (!open && !isDeletingAvatar) setIsDeleteModalOpen(false);
          }}
          isDismissable={!isDeletingAvatar}
          isKeyboardDismissDisabled={isDeletingAvatar}
        >
          <ModalContainer placement="center" size="sm">
            <ModalDialog className="border border-border/60 bg-background/95 backdrop-blur-xl">
              <ModalHeader className="flex flex-col gap-1">
                <ModalHeading className="text-base font-bold text-foreground">
                  {t("settings.profile.delete_avatar_btn")}
                </ModalHeading>
              </ModalHeader>

              <ModalBody className="py-2">
                <p className="text-sm text-foreground/80">
                  {t("settings.profile.delete_avatar_confirm")}
                </p>
              </ModalBody>

              <ModalFooter className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  isDisabled={isDeletingAvatar}
                  onPress={() => setIsDeleteModalOpen(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  isDisabled={isDeletingAvatar}
                  onPress={handleDeleteAvatarConfirm}
                  className="flex items-center gap-2"
                >
                  {isDeletingAvatar ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Delete className="w-4 h-4" />
                  )}
                  <span>{t("settings.profile.delete_avatar_btn")}</span>
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-xl">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="profile-name"
            className="text-sm font-semibold text-foreground"
          >
            {t("settings.profile.name_label")}
          </label>
          <InputGroup
            className={cn(
              "w-full transition-colors",
              errors.name && "border-danger ring-1 ring-danger"
            )}
          >
            <InputGroupPrefix>
              <Person className="w-4 h-4 text-foreground/50" />
            </InputGroupPrefix>
            <InputGroupInput
              id="profile-name"
              type="text"
              disabled={isUpdating}
              placeholder={t("settings.profile.name_placeholder")}
              {...register("name")}
            />
          </InputGroup>
          {errors.name?.message ? (
            <p className="text-xs text-danger font-medium animate-in fade-in-0 duration-150">
              {t(errors.name.message)}
            </p>
          ) : (
            <span className="text-xs text-foreground/50">
              {t("settings.profile.name_helper")}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="profile-username"
            className="text-sm font-semibold text-foreground"
          >
            {t("settings.profile.username_label")}
          </label>
          <InputGroup
            className={cn(
              "w-full transition-colors",
              errors.username && "border-danger ring-1 ring-danger"
            )}
          >
            <InputGroupPrefix>
              <At className="w-4 h-4 text-foreground/50" />
            </InputGroupPrefix>
            <InputGroupInput
              id="profile-username"
              type="text"
              disabled={isUpdating}
              placeholder={t("settings.profile.username_placeholder")}
              {...register("username")}
            />
          </InputGroup>
          {errors.username?.message ? (
            <p className="text-xs text-danger font-medium animate-in fade-in-0 duration-150">
              {t(errors.username.message)}
            </p>
          ) : (
            <span className="text-xs text-foreground/50">
              {t("settings.profile.username_helper")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            isDisabled={!isDirty || isUpdating}
            onPress={() =>
              reset({
                name: user?.name ?? "",
                username: user?.username ?? "",
              })
            }
            className="cursor-pointer"
          >
            {t("settings.profile.cancel_btn")}
          </Button>

          <Button
            type="submit"
            variant="primary"
            isDisabled={!isDirty || !isValid || isUpdating}
            className="flex items-center gap-2 cursor-pointer"
          >
            {isUpdating ? (
              <Spinner size="sm" color="current" />
            ) : (
              <FloppyDisk className="w-4 h-4" />
            )}
            <span>{t("settings.profile.save_btn")}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
