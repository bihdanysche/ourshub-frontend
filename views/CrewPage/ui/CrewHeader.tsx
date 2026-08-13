"use client";

import {
  CrewDetail,
  useDeleteCrewAvatar,
  useDeleteCrewCover,
  useUploadCrewAvatar,
  useUploadCrewCover,
} from "@/entities/crew";
import { DeleteCrewModal } from "@/features/delete-crew";
import { EditCrewModal } from "@/features/edit-crew";
import { InviteCrewModal } from "@/features/invite-crew";
import { LeaveCrewModal } from "@/features/leave-crew";
import { cn, getAvatarUrl } from "@/shared/lib";
import { toastApiError } from "@/shared/lib/notify-api-error";
import { ImageCropModal } from "@/shared/ui/ImageCropModal";
import {
  ArrowRightFromSquare,
  ArrowUpFromLine,
  Camera,
  Delete,
  Ellipsis,
  Pencil,
  Person,
  PersonPlus,
  Picture,
  StarFill,
  TrashBin,
} from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  Spinner,
  toast,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface CrewHeaderProps {
  crew: CrewDetail;
}

const getInitials = (title: string): string => {
  const parts = title.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "C";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function CrewHeader({ crew }: CrewHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);

  const [isDeleteAvatarOpen, setIsDeleteAvatarOpen] = useState(false);
  const [isDeleteCoverOpen, setIsDeleteCoverOpen] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedCrop, setSelectedCrop] = useState<{
    src: string;
    type: "avatar" | "cover";
  } | null>(null);

  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadCrewAvatar();
  const { mutate: deleteAvatar, isPending: isDeletingAvatar } = useDeleteCrewAvatar();

  const { mutate: uploadCover, isPending: isUploadingCover } = useUploadCrewCover();
  const { mutate: deleteCover, isPending: isDeletingCover } = useDeleteCrewCover();

  const isOwner = crew.role === "OWNER";
  const roleBadge = isOwner
    ? {
        label: t("crew_page.roles.owner"),
        icon: <StarFill className="w-3 h-3 text-warning" />,
        className: "bg-warning/10 text-warning border-warning/20",
      }
    : {
        label: t("crew_page.roles.member"),
        icon: <Person className="w-3 h-3 text-foreground/60" />,
        className: "bg-surface-secondary text-foreground/70 border-border/50",
      };

  const handleAction = (key: React.Key) => {
    if (key === "edit") {
      setIsEditOpen(true);
    } else if (key === "delete") {
      setIsDeleteOpen(true);
    } else if (key === "leave") {
      setIsLeaveOpen(true);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedCrop({ src: reader.result as string, type });
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    if (!selectedCrop) return;

    if (selectedCrop.type === "avatar") {
      uploadAvatar(
        { crewId: crew.id, file: croppedFile },
        {
          onSuccess: () => {
            toast.success(t("common.success"));
            setSelectedCrop(null);
          },
          onError: (err) => {
            toastApiError(err);
          },
        },
      );
    } else {
      uploadCover(
        { crewId: crew.id, file: croppedFile },
        {
          onSuccess: () => {
            toast.success(t("common.success"));
            setSelectedCrop(null);
          },
          onError: (err) => {
            toastApiError(err);
          },
        },
      );
    }
  };

  const handleDeleteAvatar = () => {
    deleteAvatar(crew.id, {
      onSuccess: () => {
        toast.success(t("common.success"));
        setIsDeleteAvatarOpen(false);
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  const handleDeleteCover = () => {
    deleteCover(crew.id, {
      onSuccess: () => {
        toast.success(t("common.success"));
        setIsDeleteCoverOpen(false);
      },
      onError: (err) => {
        toastApiError(err);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Cover Container */}
      <div className="relative w-full aspect-[3/1] max-h-72 sm:max-h-80 rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-br from-accent/20 via-surface-secondary/70 to-accent/10 shadow-xs group">
        {crew.cover ? (
          <Image
            src={getAvatarUrl(crew.cover)!}
            alt={crew.title}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30 select-none">
            <Picture className="w-16 h-16 text-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />

        {isOwner && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            <input
              ref={coverInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/heic"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "cover")}
            />
            <Button
              variant="outline"
              size="sm"
              isDisabled={isUploadingCover || isDeletingCover}
              onPress={() => coverInputRef.current?.click()}
              className="bg-background/80 backdrop-blur-md hover:bg-background text-foreground text-xs font-semibold flex items-center gap-1.5 border-border/60 cursor-pointer shadow-md"
            >
              {isUploadingCover ? (
                <Spinner size="sm" color="current" />
              ) : (
                <ArrowUpFromLine className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{t("crew_page.upload_cover_btn")}</span>
            </Button>

            {crew.cover && (
              <Button
                variant="danger-soft"
                size="sm"
                isDisabled={isUploadingCover || isDeletingCover}
                onPress={() => setIsDeleteCoverOpen(true)}
                className="bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md backdrop-blur-md"
              >
                {isDeletingCover ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <Delete className="w-3.5 h-3.5" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2 sm:px-4 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="relative group/avatar">
            <Avatar
              size="lg"
              color="accent"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-background shadow-xl shrink-0"
            >
              {crew.avatar && (
                <AvatarImage src={getAvatarUrl(crew.avatar)} alt={crew.title} />
              )}
              <AvatarFallback className="font-bold text-2xl text-accent-foreground bg-accent/20">
                {getInitials(crew.title)}
              </AvatarFallback>
            </Avatar>

            {isOwner && (
              <>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/heic"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, "avatar")}
                />
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer z-20">
                  <Button
                    variant="outline"
                    size="sm"
                    isDisabled={isUploadingAvatar || isDeletingAvatar}
                    onPress={() => avatarInputRef.current?.click()}
                    className="p-1.5 h-8 w-8 min-w-0 rounded-full bg-background/80 hover:bg-background text-foreground cursor-pointer"
                  >
                    {isUploadingAvatar ? (
                      <Spinner size="sm" color="current" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                  {crew.avatar && (
                    <Button
                      variant="danger-soft"
                      size="sm"
                      isDisabled={isUploadingAvatar || isDeletingAvatar}
                      onPress={() => setIsDeleteAvatarOpen(true)}
                      className="p-1.5 h-8 w-8 min-w-0 rounded-full bg-danger/80 hover:bg-danger text-white cursor-pointer"
                    >
                      {isDeletingAvatar ? (
                        <Spinner size="sm" color="current" />
                      ) : (
                        <Delete className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-1.5 pb-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {crew.title}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                  roleBadge.className,
                )}
              >
                {roleBadge.icon}
                <span>{roleBadge.label}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto pb-1">
          {isOwner && (
            <Button
              variant="primary"
              onPress={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <PersonPlus className="w-4 h-4" />
              <span>{t("crew_page.invite_btn")}</span>
            </Button>
          )}

          <Dropdown>
            <DropdownTrigger className="w-9 h-9 flex items-center justify-center rounded-xl border border-border/60 bg-surface/40 hover:bg-surface-secondary text-foreground/70 hover:text-foreground transition-colors cursor-pointer outline-none focus:outline-none data-[hovered=true]:bg-surface-secondary">
              <Ellipsis className="w-4 h-4" />
            </DropdownTrigger>
            <DropdownPopover
              placement="bottom end"
              className="min-w-[160px] p-1 rounded-xl shadow-xl border border-border/50 bg-background/95 backdrop-blur-md outline-none focus:outline-none"
            >
              <DropdownMenu
                onAction={handleAction}
                className="outline-none focus:outline-none"
              >
                {isOwner ? (
                  [
                    <DropdownItem
                      id="edit"
                      key="edit"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary data-[hovered=true]:bg-surface-secondary transition-colors outline-none focus:outline-none text-xs font-medium"
                    >
                      <Pencil className="w-3.5 h-3.5 text-foreground/70" />
                      <span>{t("home.card_menu.edit")}</span>
                    </DropdownItem>,
                    <DropdownItem
                      id="delete"
                      key="delete"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-danger hover:bg-danger/10 data-[hovered=true]:bg-danger/10 transition-colors outline-none focus:outline-none text-xs font-medium"
                    >
                      <TrashBin className="w-3.5 h-3.5" />
                      <span>{t("home.card_menu.delete")}</span>
                    </DropdownItem>,
                  ]
                ) : (
                  <DropdownItem
                    id="leave"
                    key="leave"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-danger hover:bg-danger/10 data-[hovered=true]:bg-danger/10 transition-colors outline-none focus:outline-none text-xs font-medium"
                  >
                    <ArrowRightFromSquare className="w-3.5 h-3.5" />
                    <span>{t("home.card_menu.leave")}</span>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </DropdownPopover>
          </Dropdown>
        </div>
      </div>

      {selectedCrop && (
        <ImageCropModal
          imageSrc={selectedCrop.src}
          isOpen={Boolean(selectedCrop)}
          onClose={() => setSelectedCrop(null)}
          onCropComplete={handleCropComplete}
          aspectRatio={selectedCrop.type === "cover" ? 3 : 1}
          cropShape={selectedCrop.type === "cover" ? "rect" : "round"}
          title={
            selectedCrop.type === "cover"
              ? t("crew_page.crop_cover_title")
              : t("crew_page.crop_avatar_title")
          }
        />
      )}

      {isDeleteAvatarOpen && (
        <ModalBackdrop
          isOpen={isDeleteAvatarOpen}
          onOpenChange={(open) => {
            if (!open && !isDeletingAvatar) setIsDeleteAvatarOpen(false);
          }}
          isDismissable={!isDeletingAvatar}
          isKeyboardDismissDisabled={isDeletingAvatar}
        >
          <ModalContainer placement="center" size="sm">
            <ModalDialog className="border border-border/60 bg-background/95 backdrop-blur-xl">
              <ModalHeader className="flex flex-col gap-1">
                <ModalHeading className="text-base font-bold text-foreground">
                  {t("crew_page.delete_avatar_btn")}
                </ModalHeading>
              </ModalHeader>

              <ModalBody className="py-2">
                <p className="text-sm text-foreground/80">
                  {t("crew_page.delete_avatar_confirm")}
                </p>
              </ModalBody>

              <ModalFooter className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  isDisabled={isDeletingAvatar}
                  onPress={() => setIsDeleteAvatarOpen(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  isDisabled={isDeletingAvatar}
                  onPress={handleDeleteAvatar}
                  className="flex items-center gap-2"
                >
                  {isDeletingAvatar ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Delete className="w-4 h-4" />
                  )}
                  <span>{t("crew_page.delete_avatar_btn")}</span>
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      )}

      {isDeleteCoverOpen && (
        <ModalBackdrop
          isOpen={isDeleteCoverOpen}
          onOpenChange={(open) => {
            if (!open && !isDeletingCover) setIsDeleteCoverOpen(false);
          }}
          isDismissable={!isDeletingCover}
          isKeyboardDismissDisabled={isDeletingCover}
        >
          <ModalContainer placement="center" size="sm">
            <ModalDialog className="border border-border/60 bg-background/95 backdrop-blur-xl">
              <ModalHeader className="flex flex-col gap-1">
                <ModalHeading className="text-base font-bold text-foreground">
                  {t("crew_page.delete_cover_btn")}
                </ModalHeading>
              </ModalHeader>

              <ModalBody className="py-2">
                <p className="text-sm text-foreground/80">
                  {t("crew_page.delete_cover_confirm")}
                </p>
              </ModalBody>

              <ModalFooter className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  isDisabled={isDeletingCover}
                  onPress={() => setIsDeleteCoverOpen(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  isDisabled={isDeletingCover}
                  onPress={handleDeleteCover}
                  className="flex items-center gap-2"
                >
                  {isDeletingCover ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Delete className="w-4 h-4" />
                  )}
                  <span>{t("crew_page.delete_cover_btn")}</span>
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      )}

      <InviteCrewModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        inviteCode={crew.inviteCode}
      />

      <EditCrewModal
        crew={crew}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <DeleteCrewModal
        crew={crew}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={() => router.push("/")}
      />

      <LeaveCrewModal
        crew={crew}
        isOpen={isLeaveOpen}
        onClose={() => setIsLeaveOpen(false)}
        onSuccess={() => router.push("/")}
      />
    </div>
  );
}
