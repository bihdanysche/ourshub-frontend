"use client";

import {
  PostContentInput,
  postContentSchema,
  PostItem,
  useEditPost,
} from "@/entities/post";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "@gravity-ui/icons";
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
  TextArea,
  toast,
} from "@heroui/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface EditPostModalProps {
  post: PostItem | null;
  crewId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPostModal({
  post,
  crewId,
  isOpen,
  onClose,
}: EditPostModalProps) {
  const { t } = useTranslation();
  const { mutate: editPost, isPending } = useEditPost(crewId);
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
      content: post?.content || "",
    },
  });

  useEffect(() => {
    if (post) {
      reset({ content: post.content });
    }
  }, [post, reset]);

  const contentValue = watch("content") || "";
  const isTooLong = contentValue.length > 1500;
  const isUnchanged = post ? contentValue.trim() === post.content.trim() : false;

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const newHeight = Math.min(Math.max(el.scrollHeight, 100), 260);
      el.style.height = `${newHeight}px`;
    }
  }, [contentValue]);

  const { ref: registerRef, ...registerProps } = register("content");

  const onSubmit = (data: PostContentInput) => {
    if (!post) return;

    editPost(
      { postId: post.id, data },
      {
        onSuccess: () => {
          toast.success(t("posts.edit_modal.success_toast"));
          onClose();
        },
        onError: (err) => {
          toastApiError(err);
        },
      },
    );
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
                {t("posts.edit_modal.title")}
              </ModalHeading>
              <p className="text-xs text-foreground/60">
                {t("posts.edit_modal.subtitle")}
              </p>
            </ModalHeader>

            <ModalBody className="py-4">
              <div className="flex flex-col gap-1.5">
                <TextArea
                  disabled={isPending}
                  placeholder={t("posts.edit_modal.placeholder")}
                  rows={4}
                  autoFocus
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
                      isTooLong ? "text-danger font-bold" : "text-foreground/40"
                    }`}
                  >
                    {contentValue.length}/1500
                  </span>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                isDisabled={isPending}
                onPress={handleClose}
              >
                {t("posts.edit_modal.cancel_btn")}
              </Button>
              <Button
                variant="primary"
                type="submit"
                isDisabled={
                  !contentValue.trim() || isPending || isTooLong || isUnchanged
                }
                className="flex items-center gap-2"
              >
                {isPending ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <Pencil className="w-4 h-4" />
                )}
                <span>{t("posts.edit_modal.save_btn")}</span>
              </Button>
            </ModalFooter>
          </form>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
