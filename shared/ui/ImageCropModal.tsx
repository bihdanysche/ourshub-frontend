"use client";

import { Check, Magnifier } from "@gravity-ui/icons";
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
} from "@heroui/react";
import { useCallback, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { useTranslation } from "react-i18next";

export interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio?: number;
  cropShape?: "rect" | "round";
  title?: string;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  fileName = "cropped_image.jpeg",
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const cropX = Math.round(pixelCrop.x);
  const cropY = Math.round(pixelCrop.y);
  const cropWidth = Math.round(pixelCrop.width);
  const cropHeight = Math.round(pixelCrop.height);

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], fileName, { type: "image/jpeg" });
        resolve(file);
      },
      "image/jpeg",
      0.95,
    );
  });
}

export function ImageCropModal({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  cropShape = "round",
  title,
}: ImageCropModalProps) {
  const { t } = useTranslation();

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((newCrop: Point) => {
    setCrop(newCrop);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, currentCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(currentCroppedAreaPixels);
    },
    [],
  );

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    try {
      setIsProcessing(true);
      const file = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(file);
      onClose();
    } catch {
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ModalBackdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isProcessing) onClose();
      }}
      isDismissable={!isProcessing}
      isKeyboardDismissDisabled={isProcessing}
    >
      <ModalContainer placement="center" size="lg">
        <ModalDialog className="max-w-2xl sm:max-w-3xl w-full border border-border/60 bg-background/95 backdrop-blur-xl">
          <ModalHeader className="flex flex-col gap-1">
            <ModalHeading className="text-base font-bold text-foreground">
              {title || t("crop_modal.title")}
            </ModalHeading>
          </ModalHeader>

          <ModalBody className="py-2 flex flex-col gap-4">
            <div className="relative w-full h-96 sm:h-[450px] rounded-2xl overflow-hidden bg-black/40 border border-border/40">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                cropShape={cropShape}
                showGrid={cropShape === "rect"}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropCompleteCallback}
              />
            </div>

            <div className="flex items-center gap-3 px-1">
              <Magnifier className="w-4 h-4 text-foreground/50 shrink-0" />
              <span className="text-xs font-semibold text-foreground/70 shrink-0">
                {t("crop_modal.zoom")}
              </span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                aria-label={t("crop_modal.zoom")}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </ModalBody>

          <ModalFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              isDisabled={isProcessing}
              onPress={onClose}
            >
              {t("crop_modal.cancel_btn")}
            </Button>
            <Button
              variant="primary"
              type="button"
              isDisabled={isProcessing || !croppedAreaPixels}
              onPress={handleSave}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <Spinner size="sm" color="current" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>{t("crop_modal.crop_btn")}</span>
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
