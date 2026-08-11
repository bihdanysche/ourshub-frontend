"use client";

import {
  PostContentInput,
  postContentSchema,
  useCreatePost,
} from "@/entities/post";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaperPlane } from "@gravity-ui/icons";
import { Button, Card, CardContent, Spinner, TextArea, toast } from "@heroui/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface CreatePostFormProps {
  crewId: number;
}

export function CreatePostForm({ crewId }: CreatePostFormProps) {
  const { t } = useTranslation();
  const { mutate: createPost, isPending } = useCreatePost(crewId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostContentInput>({
    resolver: zodResolver(postContentSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  const contentValue = watch("content") || "";
  const isTooLong = contentValue.length > 1500;

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const newHeight = Math.min(Math.max(el.scrollHeight, 84), 260);
      el.style.height = `${newHeight}px`;
    }
  }, [contentValue]);

  const { ref: registerRef, ...registerProps } = register("content");

  const onSubmit = (data: PostContentInput) => {
    createPost(data, {
      onSuccess: () => {
        toast.success(t("posts.create.success_toast"));
        reset();
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  return (
    <Card className="border border-border/60 bg-surface/40 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-xs transition-all hover:border-border/80">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="relative flex flex-col gap-1.5">
            <TextArea
              disabled={isPending}
              placeholder={t("posts.create.placeholder")}
              rows={3}
              className="w-full p-3.5 rounded-2xl bg-surface-secondary/50 border border-border/50 focus:border-accent/60 text-foreground text-sm resize-none outline-none focus:outline-none transition-all duration-150 max-h-64 overflow-y-auto"
              {...registerProps}
              ref={(e) => {
                registerRef(e);
                textareaRef.current = e as HTMLTextAreaElement | null;
              }}
            />
            <div className="flex items-center justify-between px-1 text-xs">
              <div>
                {errors.content?.message && (
                  <p className="text-danger font-medium animate-in fade-in-0 duration-150">
                    {t(errors.content.message)}
                  </p>
                )}
              </div>
              <span
                className={`font-mono text-[11px] ${
                  isTooLong
                    ? "text-danger font-bold"
                    : "text-foreground/40"
                }`}
              >
                {contentValue.length}/1500
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              type="submit"
              isDisabled={!contentValue.trim() || isPending || isTooLong}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
            >
              {isPending ? (
                <>
                  <Spinner size="sm" color="current" />
                  <span>{t("posts.create.submitting_btn")}</span>
                </>
              ) : (
                <>
                  <PaperPlane className="w-4 h-4" />
                  <span>{t("posts.create.submit_btn")}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
