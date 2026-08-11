"use client";

import { PostItem } from "@/entities/post";
import { formatRelativeTime } from "@/shared/lib/format-relative-time";
import { Ellipsis, Pencil, TrashBin } from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
  ScrollShadow,
} from "@heroui/react";
import { useTranslation } from "react-i18next";

interface CrewPostCardProps {
  post: PostItem;
  isOwner: boolean;
  onEdit: (post: PostItem) => void;
  onDelete: (postId: number) => void;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function CrewPostCard({
  post,
  isOwner,
  onEdit,
  onDelete,
}: CrewPostCardProps) {
  const { t } = useTranslation();

  const authorDisplayName = post.author.alias || post.author.name;
  const secondaryName = post.author.alias ? post.author.name : null;

  const canEdit = post.youIsAuthor;
  const canDelete = isOwner || post.youIsAuthor;
  const hasActions = canEdit || canDelete;

  const isEdited =
    Boolean(post.updatedAt) &&
    new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime();

  const handleAction = (key: React.Key) => {
    if (key === "edit") {
      onEdit(post);
    } else if (key === "delete") {
      onDelete(post.id);
    }
  };

  return (
    <Card className="group border border-border/60 bg-surface/30 backdrop-blur-md rounded-3xl p-5 hover:bg-surface/50 transition-all duration-200 shadow-xs hover:shadow-sm">
      <CardContent className="p-0 flex flex-col gap-3.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar
              size="md"
              color="accent"
              className="w-11 h-11 rounded-2xl ring-2 ring-border/40 group-hover:ring-accent/40 transition-all shrink-0"
            >
              {post.author.avatar && (
                <AvatarImage src={post.author.avatar} alt={authorDisplayName} />
              )}
              <AvatarFallback className="font-bold text-sm text-accent-foreground bg-accent/20">
                {getInitials(authorDisplayName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0 gap-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-foreground truncate">
                  {authorDisplayName}
                </span>
                {post.youIsAuthor && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent border border-accent/25">
                    {t("crew_page.members_list.you_badge")}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-foreground/50 flex-wrap">
                {secondaryName && (
                  <>
                    <span className="text-foreground/70 font-medium">
                      {secondaryName}
                    </span>
                    <span>•</span>
                  </>
                )}
                {post.author.username && (
                  <>
                    <span>@{post.author.username}</span>
                    <span>•</span>
                  </>
                )}
                <span>{formatRelativeTime(post.createdAt)}</span>
                {isEdited && (
                  <span className="text-foreground/40 italic">
                    ({t("posts.card.edited")} {formatRelativeTime(post.updatedAt)})
                  </span>
                )}
              </div>
            </div>
          </div>

          {hasActions && (
            <Dropdown>
              <DropdownTrigger className="w-8 h-8 flex items-center justify-center rounded-xl border border-border/50 bg-surface/30 hover:bg-surface-secondary text-foreground/70 hover:text-foreground transition-colors cursor-pointer outline-none focus:outline-none shrink-0">
                <Ellipsis className="w-4 h-4" />
              </DropdownTrigger>
              <DropdownPopover
                placement="bottom end"
                className="min-w-[150px] p-1 rounded-xl shadow-xl border border-border/50 bg-background/95 backdrop-blur-md outline-none focus:outline-none"
              >
                <DropdownMenu
                  onAction={handleAction}
                  className="outline-none focus:outline-none"
                >
                  {[
                    canEdit && (
                      <DropdownItem
                        id="edit"
                        key="edit"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary transition-colors outline-none focus:outline-none text-xs font-medium"
                      >
                        <Pencil className="w-3.5 h-3.5 text-foreground/70" />
                        <span>{t("posts.card.menu.edit")}</span>
                      </DropdownItem>
                    ),
                    canDelete && (
                      <DropdownItem
                        id="delete"
                        key="delete"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-danger hover:bg-danger/10 transition-colors outline-none focus:outline-none text-xs font-medium"
                      >
                        <TrashBin className="w-3.5 h-3.5" />
                        <span>{t("posts.card.menu.delete")}</span>
                      </DropdownItem>
                    ),
                  ].filter(Boolean)}
                </DropdownMenu>
              </DropdownPopover>
            </Dropdown>
          )}
        </div>

        <ScrollShadow className="max-h-60 overflow-y-auto pr-1">
          <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed break-words">
            {post.content}
          </p>
        </ScrollShadow>
      </CardContent>
    </Card>
  );
}
