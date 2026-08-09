"use client";

import {
  editProfileSchema,
  EditProfileInput,
  useEditProfile,
  useMe,
} from "@/entities/auth";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { cn } from "@/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { At, FloppyDisk, Person } from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  InputGroup,
  InputGroupInput,
  InputGroupPrefix,
  Skeleton,
  Spinner,
  toast,
} from "@heroui/react";
import { useEffect } from "react";
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
        <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-border/60 bg-surface/40 shadow-xs">
          <Avatar size="lg" color="accent" className="w-16 h-16 text-base shrink-0">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {t("settings.profile.avatar_title")}
            </p>
            <p className="text-xs text-foreground/60 mt-0.5">
              {t("settings.profile.avatar_desc")}
            </p>
          </div>
        </div>
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
