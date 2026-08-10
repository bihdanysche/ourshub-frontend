"use client";

import { CrewListItem } from "@/entities/crew";
import { cn } from "@/shared/lib/utils";
import {
  ArrowRightFromSquare,
  Ellipsis,
  Pencil,
  Person,
  Persons,
  StarFill,
  TrashBin,
} from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
} from "@heroui/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface CrewCardProps {
  crew: CrewListItem;
  onEdit: (crew: CrewListItem) => void;
  onDelete: (crew: CrewListItem) => void;
  onLeave: (crew: CrewListItem) => void;
}

const getInitials = (title: string): string => {
  const parts = title.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "C";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function CrewCard({
  crew,
  onEdit,
  onDelete,
  onLeave,
}: CrewCardProps) {
  const { t } = useTranslation();

  const isOwner = crew.role === "OWNER";
  const roleBadge = isOwner
    ? {
        label: t("home.roles.owner"),
        icon: <StarFill className="w-3 h-3 text-warning" />,
        className: "bg-warning/10 text-warning border-warning/20",
      }
    : {
        label: t("home.roles.member"),
        icon: <Person className="w-3 h-3 text-foreground/60" />,
        className: "bg-surface-secondary text-foreground/70 border-border/50",
      };

  const handleAction = (key: React.Key) => {
    if (key === "edit") {
      onEdit(crew);
    } else if (key === "delete") {
      onDelete(crew);
    } else if (key === "leave") {
      onLeave(crew);
    }
  };

  return (
    <Link href={`/crews/${crew.id}`} className="block group">
      <Card
        className={cn(
          "relative flex flex-col justify-between overflow-hidden h-full min-h-[140px]",
          "border border-border/60 bg-surface/40 hover:bg-surface/70",
          "backdrop-blur-md rounded-2xl p-5 shadow-xs hover:shadow-md",
          "transition-all duration-200 hover:border-accent/40 cursor-pointer",
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <Avatar
              size="lg"
              color="accent"
              className="w-14 h-14 rounded-2xl ring-2 ring-border/50 group-hover:ring-accent/40 transition-all shrink-0"
            >
              {crew.avatar && <AvatarImage src={crew.avatar} alt={crew.title} />}
              <AvatarFallback className="font-bold text-sm text-accent-foreground bg-accent/20">
                {getInitials(crew.title)}
              </AvatarFallback>
            </Avatar>

            <div
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                  roleBadge.className,
                )}
              >
                {roleBadge.icon}
                <span>{roleBadge.label}</span>
              </span>

              <Dropdown>
                <DropdownTrigger className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-secondary text-foreground/60 hover:text-foreground transition-colors cursor-pointer outline-none focus:outline-none data-[hovered=true]:bg-surface-secondary">
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

          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="text-base font-bold text-foreground truncate group-hover:text-accent transition-colors">
              {crew.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-foreground/60">
              <Persons className="w-3.5 h-3.5" />
              <span>
                {t("home.members_count", { count: crew.membersCount })}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
