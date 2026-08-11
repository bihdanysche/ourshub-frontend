"use client";

import { CrewDetail } from "@/entities/crew";
import { DeleteCrewModal } from "@/features/delete-crew";
import { EditCrewModal } from "@/features/edit-crew";
import { InviteCrewModal } from "@/features/invite-crew";
import { LeaveCrewModal } from "@/features/leave-crew";
import { cn } from "@/shared/lib/utils";
import {
  ArrowRightFromSquare,
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
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-44 sm:h-52 md:h-60 w-full rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-br from-accent/20 via-surface-secondary/70 to-accent/10 shadow-xs">
        {crew.cover ? (
          <Image
            src={crew.cover}
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
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2 sm:px-4 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <Avatar
            size="lg"
            color="accent"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl ring-4 ring-background shadow-xl shrink-0"
          >
            {crew.avatar && <AvatarImage src={crew.avatar} alt={crew.title} />}
            <AvatarFallback className="font-bold text-2xl text-accent-foreground bg-accent/20">
              {getInitials(crew.title)}
            </AvatarFallback>
          </Avatar>

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
