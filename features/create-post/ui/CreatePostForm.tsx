"use client";

import {
  PostContentInput,
  postContentSchema,
  useCreatePost,
} from "@/entities/post";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Paperclip, PaperPlane, Xmark } from "@gravity-ui/icons";
import { Button, Card, CardContent, Spinner, TextArea, toast } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface CreatePostFormProps {
  crewId: number;
}

interface DraftFile {
  id: string;
  file: File;
  previewUrl?: string;
  type: "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
}

export function CreatePostForm({ crewId }: CreatePostFormProps) {
  const { t } = useTranslation();
  const { mutate: createPost, isPending } = useCreatePost(crewId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [draftFiles, setDraftFiles] = useState<DraftFile[]>([]);
  const [previewMedia, setPreviewMedia] = useState<{
    url: string;
    type: "IMAGE" | "VIDEO";
    name: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PostContentInput>({
    resolver: zodResolver(postContentSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  const contentValue = useWatch({ control, name: "content" }) || "";
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

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (draftFiles.length + selectedFiles.length > 15) {
      toast.danger(t("api_errors.MAX_ATTACHMENTS_EXCEEDED"));
      return;
    }

    const newDrafts: DraftFile[] = [];
    for (const file of selectedFiles) {
      if (file.size > 200 * 1024 * 1024) {
        toast.danger(t("api_errors.ATTACHMENT_TOO_LARGE"));
        continue;
      }

      let type: "IMAGE" | "VIDEO" | "AUDIO" | "FILE" = "FILE";
      let previewUrl: string | undefined = undefined;

      if (file.type.startsWith("image/")) {
        type = "IMAGE";
        previewUrl = URL.createObjectURL(file);
      } else if (file.type.startsWith("video/")) {
        type = "VIDEO";
        previewUrl = URL.createObjectURL(file);
      } else if (file.type.startsWith("audio/")) {
        type = "AUDIO";
      }

      newDrafts.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl,
        type,
      });
    }

    setDraftFiles((prev) => [...prev, ...newDrafts]);
    e.target.value = "";
  };

  const removeDraftFile = (id: string) => {
    setDraftFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const onSubmit = (data: PostContentInput) => {
    createPost(
      {
        content: data.content,
        files: draftFiles.map((df) => df.file),
      },
      {
        onSuccess: () => {
          toast.success(t("posts.create.success_toast"));
          reset();
          draftFiles.forEach((df) => {
            if (df.previewUrl) URL.revokeObjectURL(df.previewUrl);
          });
          setDraftFiles([]);
        },
        onError: (err) => {
          toastApiError(err);
        },
      },
    );
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

          {draftFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-surface-secondary/30 border border-border/40 max-h-48 overflow-y-auto">
              {draftFiles.map((df) => (
                <div
                  key={df.id}
                  className="relative group rounded-xl overflow-hidden border border-border/50 bg-background/80 flex items-center gap-2 p-1.5 pr-2 shrink-0"
                >
                  {df.type === "IMAGE" && df.previewUrl && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={df.previewUrl}
                        alt={df.file.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}

                  {df.type === "VIDEO" && (
                    <div className="w-10 h-10 rounded-lg bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                      VID
                    </div>
                  )}

                  {df.type === "AUDIO" && (
                    <div className="w-10 h-10 rounded-lg bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                      AUD
                    </div>
                  )}

                  {df.type === "FILE" && (
                    <div className="w-10 h-10 rounded-lg bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                      FILE
                    </div>
                  )}

                  <div className="flex flex-col min-w-0 max-w-[110px]">
                    <span className="text-xs font-medium text-foreground truncate">
                      {df.file.name}
                    </span>
                    <span className="text-[10px] text-foreground/50 font-mono">
                      {(df.file.size / (1024 * 1024)).toFixed(1)}MB
                    </span>
                  </div>

                  <div className="flex items-center gap-1 ml-1">
                    {(df.type === "IMAGE" || df.type === "VIDEO") && df.previewUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        isDisabled={isPending}
                        onPress={() =>
                          setPreviewMedia({
                            url: df.previewUrl!,
                            type: df.type as "IMAGE" | "VIDEO",
                            name: df.file.name,
                          })
                        }
                        className="w-6 h-6 min-w-0 p-0 rounded-full cursor-pointer bg-background/80 hover:bg-background text-foreground border-border/50"
                        aria-label="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    )}

                    <Button
                      variant="danger-soft"
                      size="sm"
                      isDisabled={isPending}
                      onPress={() => removeDraftFile(df.id)}
                      className="w-6 h-6 min-w-0 p-0 rounded-full cursor-pointer"
                      aria-label="Remove"
                    >
                      <Xmark className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                disabled={isPending || draftFiles.length >= 15}
                onChange={handleFilesSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                isDisabled={isPending || draftFiles.length >= 15}
                onPress={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer border-border/60 hover:bg-surface-secondary px-3 shrink-0"
              >
                <Paperclip className="w-4 h-4 text-foreground/70 shrink-0" />
                <span>{t("posts.attachments.add_btn")}</span>
                {draftFiles.length > 0 && (
                  <span className="text-foreground/60 font-normal ml-0.5">
                    ({draftFiles.length}/15)
                  </span>
                )}
              </Button>
            </div>

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
    </Card>
  );
}
