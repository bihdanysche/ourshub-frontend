"use client";

import { CrewMember } from "@/entities/crew";
import {
  Ellipsis,
  PersonPencil,
  PersonXmark,
  StarFill,
} from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
} from "@heroui/react";
import { useTranslation } from "react-i18next";

interface CrewMemberItemProps {
  member: CrewMember;
  isCurrentOwner: boolean;
  isSelf: boolean;
  onUpdateAlias: (member: CrewMember) => void;
  onKick: (member: CrewMember) => void;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function CrewMemberItem({
  member,
  isCurrentOwner,
  isSelf,
  onUpdateAlias,
  onKick,
}: CrewMemberItemProps) {
  const { t } = useTranslation();

  const isMemberOwner = member.role === "OWNER";
  const hasActions = isCurrentOwner || isSelf;

  const displayName = member.alias ? member.alias : member.name;
  const secondaryName = member.alias ? member.name : null;

  const handleAction = (key: React.Key) => {
    if (key === "alias") {
      onUpdateAlias(member);
    } else if (key === "kick") {
      onKick(member);
    }
  };

  return (
    <div className="group flex items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-surface/30 hover:bg-surface/60 hover:border-accent/40 backdrop-blur-md transition-all duration-200 shadow-xs hover:shadow-sm">
      <div className="flex items-center gap-3.5 min-w-0">
        <Avatar
          size="md"
          color="accent"
          className="w-12 h-12 rounded-2xl ring-2 ring-border/40 group-hover:ring-accent/40 transition-all shrink-0"
        >
          {member.avatar && <AvatarImage src={member.avatar} alt={displayName} />}
          <AvatarFallback className="font-bold text-sm text-accent-foreground bg-accent/20">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0 gap-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-foreground truncate group-hover:text-accent transition-colors">
              {displayName}
            </span>

            {isSelf && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent border border-accent/25">
                {t("crew_page.members_list.you_badge")}
              </span>
            )}

            {isMemberOwner && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning/10 text-warning border border-warning/20">
                <StarFill className="w-3 h-3 text-warning" />
                <span>{t("crew_page.members_list.owner_badge")}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-foreground/55 flex-wrap">
            {secondaryName && (
              <span className="text-foreground/70 font-medium">
                {secondaryName}
              </span>
            )}

            {secondaryName && member.username && (
              <span className="text-foreground/30">•</span>
            )}

            {member.username && (
              <span className="text-foreground/50">@{member.username}</span>
            )}
          </div>
        </div>
      </div>

      {hasActions && (
        <Dropdown>
          <DropdownTrigger className="w-8 h-8 flex items-center justify-center rounded-xl border border-border/50 bg-surface/30 hover:bg-surface-secondary text-foreground/70 hover:text-foreground transition-colors cursor-pointer outline-none focus:outline-none data-[hovered=true]:bg-surface-secondary shrink-0">
            <Ellipsis className="w-4 h-4" />
          </DropdownTrigger>
          <DropdownPopover
            placement="bottom end"
            className="min-w-[170px] p-1 rounded-xl shadow-xl border border-border/50 bg-background/95 backdrop-blur-md outline-none focus:outline-none"
          >
            <DropdownMenu
              onAction={handleAction}
              className="outline-none focus:outline-none"
            >
              {[
                <DropdownItem
                  id="alias"
                  key="alias"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary data-[hovered=true]:bg-surface-secondary transition-colors outline-none focus:outline-none text-xs font-medium"
                >
                  <PersonPencil className="w-3.5 h-3.5 text-foreground/70" />
                  <span>
                    {member.alias
                      ? t("crew_page.members_list.menu.edit_alias")
                      : t("crew_page.members_list.menu.set_alias")}
                  </span>
                </DropdownItem>,
                isCurrentOwner && !isSelf && (
                  <DropdownItem
                    id="kick"
                    key="kick"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-danger hover:bg-danger/10 data-[hovered=true]:bg-danger/10 transition-colors outline-none focus:outline-none text-xs font-medium"
                  >
                    <PersonXmark className="w-3.5 h-3.5" />
                    <span>{t("crew_page.members_list.menu.kick")}</span>
                  </DropdownItem>
                ),
              ].filter(Boolean)}
            </DropdownMenu>
          </DropdownPopover>
        </Dropdown>
      )}
    </div>
  );
}
