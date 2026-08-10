"use client";

import { Check, Copy, QrCode } from "@gravity-ui/icons";
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
  toast,
} from "@heroui/react";
import { QRCodeSVG } from "qrcode.react";
import { useState, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";

interface InviteCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string | null;
}

const emptySubscribe = () => () => {};

export function InviteCrewModal({
  isOpen,
  onClose,
  inviteCode,
}: InviteCrewModalProps) {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const origin = useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin,
    () => "",
  );

  const inviteUrl = inviteCode && origin ? `${origin}/join-crew/${inviteCode}` : "";

  const handleCopy = async () => {
    if (!inviteUrl) return;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setIsCopied(true);
      toast.success(t("crew_page.invite_modal.copied_toast"));
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      return;
    }
  };

  return (
    <ModalBackdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      isDismissable
      isKeyboardDismissDisabled={false}
    >
      <ModalContainer placement="center" size="md">
        <ModalDialog className="border border-border/60 bg-background/95 backdrop-blur-xl">
          <ModalHeader className="flex flex-col gap-1 text-center items-center">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/20 mb-1">
              <QrCode className="w-6 h-6" />
            </div>
            <ModalHeading className="text-lg font-bold text-foreground">
              {t("crew_page.invite_modal.title")}
            </ModalHeading>
            <p className="text-xs text-foreground/60 max-w-sm">
              {t("crew_page.invite_modal.subtitle")}
            </p>
          </ModalHeader>

          <ModalBody className="py-4 flex flex-col items-center gap-5">
            {inviteUrl ? (
              <div className="p-4 bg-white rounded-3xl shadow-md border border-border/40 inline-flex items-center justify-center">
                <QRCodeSVG
                  value={inviteUrl}
                  size={180}
                  level="H"
                  marginSize={1}
                />
              </div>
            ) : (
              <div className="w-[212px] h-[212px] rounded-3xl bg-surface-secondary border border-border/40 flex items-center justify-center text-foreground/40">
                <QrCode className="w-12 h-12 opacity-30" />
              </div>
            )}

            <div className="w-full flex flex-col gap-1.5">
              <label
                htmlFor="invite-link-input"
                className="text-xs font-semibold text-foreground/80"
              >
                {t("crew_page.invite_modal.link_label")}
              </label>

              <div className="flex items-center gap-2">
                <InputGroup className="flex-1">
                  <InputGroupInput
                    id="invite-link-input"
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="text-xs font-mono select-all"
                  />
                </InputGroup>

                <Button
                  variant={isCopied ? "primary" : "outline"}
                  onPress={handleCopy}
                  isDisabled={!inviteUrl}
                  className="flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t("crew_page.invite_modal.copied_btn")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t("crew_page.invite_modal.copy_btn")}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="flex justify-end pt-2">
            <Button variant="outline" type="button" onPress={onClose}>
              {t("crew_page.invite_modal.close_btn")}
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
