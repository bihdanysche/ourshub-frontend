"use client";

import { PostAttachment } from "@/entities/post";
import { formatAttachmentName, getAvatarUrl } from "@/shared/lib";
import { File, Xmark } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CustomAudioPlayer } from "./CustomAudioPlayer";
import { CustomVideoPlayer } from "./CustomVideoPlayer";

interface MediaAttachmentsGridProps {
  attachments: PostAttachment[];
}

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const getAttachmentUrl = (attachment: PostAttachment): string => {
  const raw =
    attachment.key ||
    attachment.url ||
    (attachment as unknown as { path?: string }).path ||
    "";
  return getAvatarUrl(raw) || raw;
};

const getFileType = (attachment: PostAttachment): "IMAGE" | "VIDEO" | "AUDIO" | "FILE" => {
  if (attachment.type) {
    const t = attachment.type.toUpperCase();
    if (t.includes("IMAGE")) return "IMAGE";
    if (t.includes("VIDEO")) return "VIDEO";
    if (t.includes("AUDIO")) return "AUDIO";
  }

  const raw = (attachment.key || attachment.url || "").toLowerCase();
  if (raw.match(/\.(jpg|jpeg|png|gif|webp|heic|heif)(\?|$)/)) return "IMAGE";
  if (raw.match(/\.(mp4|webm|ogg|mov|mkv)(\?|$)/)) return "VIDEO";
  if (raw.match(/\.(mp3|wav|ogg|m4a|aac|flac)(\?|$)/)) return "AUDIO";

  return "FILE";
};

export function MediaAttachmentsGrid({ attachments }: MediaAttachmentsGridProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  if (!attachments || attachments.length === 0) return null;

  const images = attachments.filter((a) => getFileType(a) === "IMAGE");
  const videos = attachments.filter((a) => getFileType(a) === "VIDEO");
  const audios = attachments.filter((a) => getFileType(a) === "AUDIO");
  const files = attachments.filter((a) => getFileType(a) === "FILE");

  return (
    <div className="flex flex-col gap-3 mt-3 w-full">
      {images.length > 0 && (
        <div
          className={`grid gap-2 rounded-2xl overflow-hidden ${
            images.length === 1
              ? "grid-cols-1 max-h-[450px]"
              : images.length === 2
              ? "grid-cols-2 max-h-[350px]"
              : images.length === 3
              ? "grid-cols-3 max-h-[280px]"
              : "grid-cols-2 sm:grid-cols-3 max-h-[450px]"
          }`}
        >
          {images.map((img) => {
            const url = getAttachmentUrl(img);
            return (
              <div
                key={img.id}
                onClick={() => setActiveImage(url)}
                className="relative aspect-square sm:aspect-4/3 w-full overflow-hidden rounded-xl bg-surface-secondary/40 border border-border/40 cursor-pointer group hover:opacity-95 transition-opacity"
              >
                <Image
                  src={url}
                  alt={img.name || "Post image"}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>
            );
          })}
        </div>
      )}

      {videos.map((vid) => (
        <CustomVideoPlayer key={vid.id} src={getAttachmentUrl(vid)} name={vid.name} />
      ))}

      {audios.map((aud) => (
        <CustomAudioPlayer key={aud.id} src={getAttachmentUrl(aud)} name={aud.name} />
      ))}

      {files.map((file) => {
        const url = getAttachmentUrl(file);
        return (
          <a
            key={file.id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-surface-secondary/40 hover:bg-surface-secondary/70 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <File className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                {formatAttachmentName(file.name, file.url)}
              </span>
              {file.size && (
                <span className="text-[11px] text-foreground/50">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>
          </a>
        );
      })}

      {mounted &&
        activeImage &&
        createPortal(
          <div
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-default animate-in fade-in-0 duration-200"
          >
            <Button
              variant="outline"
              size="sm"
              onPress={() => setActiveImage(null)}
              className="fixed top-5 right-5 z-[100000] w-11 h-11 min-w-0 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-2xl cursor-pointer"
            >
              <Xmark className="w-6 h-6" />
            </Button>

            <div className="relative w-full h-full max-w-[95vw] max-h-[92vh] flex items-center justify-center cursor-default">
              <Image
                src={activeImage}
                alt="Full view image"
                fill
                unoptimized
                className="object-contain select-none"
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
