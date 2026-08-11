"use client";

import { JoinCrewInput, joinCrewSchema, useJoinCrew } from "@/entities/crew";
import { getApiErrorCode } from "@/shared/api";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { PersonPlus } from "@gravity-ui/icons";
import {
  Button,
  InputGroup,
  InputGroupInput,
  Spinner,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface JoinCrewFormProps {
  inviteCode: string;
  crewId?: number;
}

export function JoinCrewForm({ inviteCode, crewId }: JoinCrewFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: joinCrew, isPending } = useJoinCrew();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<JoinCrewInput>({
    resolver: zodResolver(joinCrewSchema),
    mode: "onChange",
    defaultValues: {
      alias: "",
    },
  });

  const onSubmit = (data: JoinCrewInput) => {
    const trimmedAlias = data.alias?.trim();
    joinCrew(
      {
        invCode: inviteCode,
        alias: trimmedAlias ? trimmedAlias : undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(t("join_crew.success_toast"));
          const targetId = res?.crewId ?? crewId;
          if (targetId) {
            router.push(`/crews/${targetId}`);
          } else {
            router.push("/");
          }
        },
        onError: (err) => {
          const code = getApiErrorCode(err);
          if (code === "ALREADY_MEMBER") {
            if (crewId) {
              router.replace(`/crews/${crewId}`);
            } else {
              router.replace("/");
            }
            return;
          }
          toastApiError(err);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="join-crew-alias-input"
          className="text-xs font-semibold uppercase tracking-wider text-foreground/70"
        >
          {t("join_crew.alias_label")}
        </label>
        <InputGroup className="w-full">
          <InputGroupInput
            id="join-crew-alias-input"
            type="text"
            disabled={isPending}
            placeholder={t("join_crew.alias_placeholder")}
            {...register("alias")}
          />
        </InputGroup>
        {errors.alias?.message ? (
          <p className="text-xs text-danger font-medium animate-in fade-in-0 duration-150">
            {t(errors.alias.message)}
          </p>
        ) : (
          <p className="text-xs text-foreground/50">
            {t("join_crew.alias_helper")}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button
          variant="outline"
          type="button"
          isDisabled={isPending}
          onPress={() => router.push("/")}
          className="w-full sm:w-1/2 order-2 sm:order-1 cursor-pointer"
        >
          {t("join_crew.cancel_btn")}
        </Button>
        <Button
          variant="primary"
          type="submit"
          isDisabled={!isValid || isPending}
          className="w-full sm:w-1/2 order-1 sm:order-2 flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
        >
          {isPending ? (
            <Spinner size="sm" color="current" />
          ) : (
            <PersonPlus className="w-4 h-4" />
          )}
          <span>{t("join_crew.join_btn")}</span>
        </Button>
      </div>
    </form>
  );
}
