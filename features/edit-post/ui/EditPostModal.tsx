"use client";

import {
  PostContentInput,
  postContentSchema,
  PostItem,
  useDeletePostAttachment,
  useEditPost,
  useUploadPostAttachments,
} from "@/entities/post";
import { getAvatarUrl } from "@/shared/lib";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Paperclip, Pencil, TrashBin, Xmark } from "@gravity-ui/icons";
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
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface EditPostModalProps {
  post: PostItem | null;
  crewId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface DraftNewFile {
  file: File;
  previewUrl?: string;
  type: "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
}

export function EditPostModal({
  post,
  crewId,
  isOpen,
  onClose,
}: EditPostModalProps) {
  const { t } = useTranslation();
  const { mutate: editPost, isPending: isEditing } = useEditPost(crewId);
  const { mutate: deleteAttachment, isPending: isDeletingAttachment } =
    useDeletePostAttachment(crewId);
  const { mutate: uploadAttachments, isPending: isUploadingAttachments } =
    useUploadPostAttachments(crewId);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newFiles, setNewFiles] = useState<DraftNewFile[]>([]);
  const [previewMedia, setPreviewMedia] = useState<{
    url: string;
    type: "IMAGE" | "VIDEO";
    name: string;
  } | null>(null);

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
      setNewFiles([]);
    }
  }, [post, reset]);

  const contentValue = watch("content") || "";
  const isTooLong = contentValue.length > 1500;
  const isUnchanged =
    post ? contentValue.trim() === post.content.trim() && newFiles.length === 0 : false;

  const isPending = isEditing || isDeletingAttachment || isUploadingAttachments;

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const newHeight = Math.min(Math.max(el.scrollHeight, 100), 260);
      el.style.height = `${newHeight}px`;
    }
  }, [contentValue]);

  const { ref: registerRef, ...registerProps } = register("content");

  const handleDeleteAttachment = (attachmentId: number) => {
    if (!post) return;
    deleteAttachment(
      { postId: post.id, attachmentId },
      {
        onSuccess: () => {
          toast.success(t("common.success"));
        },
        onError: (err) => {
          toastApiError(err);
        },
      },
    );
  };

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const currentCount = (post?.attachments?.length || 0) + newFiles.length;
    if (currentCount + selectedFiles.length > 15) {
      toast.danger(t("api_errors.MAX_ATTACHMENTS_EXCEEDED"));
      return;
    }

    const newDrafts: DraftNewFile[] = [];
    for (const f of selectedFiles) {
      if (f.size > 200 * 1024 * 1024) {
        toast.danger(t("api_errors.ATTACHMENT_TOO_LARGE"));
        continue;
      }

      let type: "IMAGE" | "VIDEO" | "AUDIO" | "FILE" = "FILE";
      let previewUrl: string | undefined = undefined;

      if (f.type.startsWith("image/")) {
        type = "IMAGE";
        previewUrl = URL.createObjectURL(f);
      } else if (f.type.startsWith("video/")) {
        type = "VIDEO";
        previewUrl = URL.createObjectURL(f);
      } else if (f.type.startsWith("audio/")) {
        type = "AUDIO";
      }

      newDrafts.push({ file: f, previewUrl, type });
    }

    setNewFiles((prev) => [...prev, ...newDrafts]);
    e.target.value = "";
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => {
      const item = prev[index];
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = (data: PostContentInput) => {
    if (!post) return;

    const rawFiles = newFiles.map((nf) => nf.file);

    if (contentValue.trim() !== post.content.trim()) {
      editPost(
        { postId: post.id, data },
        {
          onSuccess: () => {
            if (rawFiles.length > 0) {
              uploadAttachments(
                { postId: post.id, files: rawFiles },
                {
                  onSuccess: () => {
                    toast.success(t("posts.edit_modal.success_toast"));
                    handleClose();
                  },
                  onError: (err) => {
                    toastApiError(err);
                  },
                },
              );
            } else {
              toast.success(t("posts.edit_modal.success_toast"));
              handleClose();
            }
          },
          onError: (err) => {
            toastApiError(err);
          },
        },
      );
    } else if (rawFiles.length > 0) {
      uploadAttachments(
        { postId: post.id, files: rawFiles },
        {
          onSuccess: () => {
            toast.success(t("posts.edit_modal.success_toast"));
            handleClose();
          },
          onError: (err) => {
            toastApiError(err);
          },
        },
      );
    }
  };

  const handleClose = () => {
    reset();
    newFiles.forEach((nf) => {
      if (nf.previewUrl) URL.revokeObjectURL(nf.previewUrl);
    });
    setNewFiles([]);
    onClose();
  };

  return (
    <ModalBackdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isPending) handleClose();
      }}
      isDismissable={!isPending}
      isKeyboardDismissDisabled={isPending}
    >
      <ModalContainer placement="center" size="md">
        <ModalDialog className="border border-border/60 bg-background/95 backdrop-blur-xl max-w-lg w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              <ModalHeading className="text-lg font-bold text-foreground">
                {t("posts.edit_modal.title")}
              </ModalHeading>
              <p className="text-xs text-foreground/60">
                {t("posts.edit_modal.subtitle")}
              </p>
            </ModalHeader>

            <ModalBody className="py-4 flex flex-col gap-4">
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

              {/* Existing Attachments */}
              {post?.attachments && post.attachments.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-foreground/70">
                    {t("posts.edit_modal.existing_attachments")}
                  </span>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-surface-secondary/30 border border-border/40">
                    {post.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center gap-2 p-1.5 px-2 rounded-lg bg-background border border-border/50 text-xs shrink-0"
                      >
                        <span className="truncate max-w-[140px] font-medium">
                          {att.name || `Attachment #${att.id}`}
                        </span>
                        <Button
                          variant="danger-soft"
                          size="sm"
                          isDisabled={isPending}
                          onPress={() => handleDeleteAttachment(att.id)}
                          className="w-5 h-5 min-w-0 p-0 rounded-full cursor-pointer ml-1"
                        >
                          <TrashBin className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Draft Attachments */}
              {newFiles.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-accent">
                    {t("posts.edit_modal.new_attachments")}
                  </span>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-accent/5 border border-accent/20">
                    {newFiles.map((nf, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-1.5 px-2 rounded-lg bg-background border border-border/50 text-xs shrink-0"
                      >
                        <span className="truncate max-w-[120px] font-medium">
                          {nf.file.name}
                        </span>

                        {(nf.type === "IMAGE" || nf.type === "VIDEO") && nf.previewUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            isDisabled={isPending}
                            onPress={() =>
                              setPreviewMedia({
                                url: nf.previewUrl!,
                                type: nf.type as "IMAGE" | "VIDEO",
                                name: nf.file.name,
                              })
                            }
                            className="w-5 h-5 min-w-0 p-0 rounded-full cursor-pointer bg-background hover:bg-surface-secondary text-foreground"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        )}

                        <Button
                          variant="danger-soft"
                          size="sm"
                          isDisabled={isPending}
                          onPress={() => removeNewFile(i)}
                          className="w-5 h-5 min-w-0 p-0 rounded-full cursor-pointer ml-0.5"
                        >
                          <Xmark className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  disabled={isPending}
                  onChange={handleFilesSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  isDisabled={isPending}
                  onPress={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer border-border/60 hover:bg-surface-secondary px-3 shrink-0"
                >
                  <Paperclip className="w-4 h-4 text-foreground/70 shrink-0" />
                  <span>{t("posts.attachments.add_btn")}</span>
                </Button>
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

          {/* Lightbox Preview Modal for Draft New Media via Portal */}
          {typeof window !== "undefined" &&
            previewMedia &&
            createPortal(
              <div
                onClick={() => setPreviewMedia(null)}
                className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-default animate-in fade-in-0 duration-200"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setPreviewMedia(null)}
                  className="fixed top-5 right-5 z-[100000] w-11 h-11 min-w-0 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-2xl cursor-pointer"
                >
                  <Xmark className="w-6 h-6" />
                </Button>

                <div className="relative w-full h-full max-w-[95vw] max-h-[92vh] flex items-center justify-center cursor-default">
                  {previewMedia.type === "IMAGE" ? (
                    <Image
                      src={previewMedia.url}
                      alt={previewMedia.name}
                      fill
                      unoptimized
                      className="object-contain select-none"
                    />
                  ) : (
                    <video
                      src={previewMedia.url}
                      controls
                      autoPlay
                      className="max-w-5xl max-h-[90vh] rounded-2xl object-contain shadow-2xl"
                    />
                  )}
                </div>
              </div>,
              document.body,
            )}
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
