"use client";

import { useCrewMembers } from "@/entities/crew";
import { useDebounce } from "@/shared/lib/use-debounce";
import { getAvatarUrl } from "@/shared/lib";
import {
  ArrowRight,
  Check,
  CheckDouble,
  Magnifier,
} from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Spinner,
  TextArea,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CreateSplitStep1Props {
  crewId: number;
  currentUserId?: number;
  title: string;
  onChangeTitle: (title: string) => void;
  desc: string;
  onChangeDesc: (desc: string) => void;
  selectedMemberIds: number[];
  onChangeSelectedMemberIds: (ids: number[]) => void;
  onGoToStep2: () => void;
  isPending?: boolean;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function CreateSplitStep1({
  crewId,
  currentUserId,
  title,
  onChangeTitle,
  desc,
  onChangeDesc,
  selectedMemberIds,
  onChangeSelectedMemberIds,
  onGoToStep2,
  isPending = false,
}: CreateSplitStep1Props) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: membersData, isPending: isMembersPending } = useCrewMembers(
    crewId,
    { q: debouncedSearchQuery },
  );

  const allMembers = membersData?.items ?? [];

  const handleToggleMember = (userId: number) => {
    if (userId === currentUserId) return;

    if (selectedMemberIds.includes(userId)) {
      onChangeSelectedMemberIds(
        selectedMemberIds.filter((id) => id !== userId),
      );
    } else {
      onChangeSelectedMemberIds([...selectedMemberIds, userId]);
    }
  };

  const handleSelectAllMembers = () => {
    if (allMembers.length === 0) return;
    const allIds = allMembers.map((m) => m.userId);
    const nonSelfIds = allIds.filter((id) => id !== currentUserId);
    const areAllNonSelfSelected = nonSelfIds.every((id) =>
      selectedMemberIds.includes(id),
    );

    if (areAllNonSelfSelected) {
      onChangeSelectedMemberIds(currentUserId ? [currentUserId] : []);
    } else {
      const merged = Array.from(new Set([...selectedMemberIds, ...allIds]));
      onChangeSelectedMemberIds(merged);
    }
  };

  const isStep1Valid =
    title.trim().length >= 2 &&
    title.trim().length <= 30 &&
    selectedMemberIds.length >= 2;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-0 slide-in-from-left-4 duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            {t("splits.wizard.title_label")}
          </label>
          <Input
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder={t("splits.wizard.title_placeholder")}
            disabled={isPending}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              {t("splits.wizard.desc_label")}
            </label>
            <span className="text-[11px] text-foreground/40 font-mono">
              {desc.length}/1500
            </span>
          </div>
          <TextArea
            value={desc}
            onChange={(e) => {
              if (e.target.value.length <= 1500) {
                onChangeDesc(e.target.value);
              }
            }}
            placeholder={t("splits.wizard.desc_placeholder")}
            rows={3}
            disabled={isPending}
            className="w-full p-3.5 rounded-2xl bg-surface-secondary/50 border border-border/50 focus:border-accent/60 text-foreground text-sm resize-none outline-none focus:outline-none transition-all duration-150 max-h-48 overflow-y-auto"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span>{t("splits.wizard.select_members_title")}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/25">
              {selectedMemberIds.length}
            </span>
          </h3>

          <Button
            variant="outline"
            size="sm"
            onPress={handleSelectAllMembers}
            className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <CheckDouble className="w-4 h-4" />
            <span>
              {selectedMemberIds.length === allMembers.length
                ? t("splits.wizard.deselect_all")
                : t("splits.wizard.select_all")}
            </span>
          </Button>
        </div>

        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("splits.wizard.search_members_placeholder")}
            className="w-full pl-9"
          />
          <Magnifier className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {isMembersPending ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" color="accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
            {allMembers.map((m) => {
              const isSelf = m.userId === currentUserId;
              const isSelected = selectedMemberIds.includes(m.userId);
              const displayName = m.alias || m.name;

              return (
                <div
                  key={m.id}
                  onClick={() => handleToggleMember(m.userId)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all select-none ${
                    isSelf
                      ? "bg-accent/20 border-accent text-foreground cursor-default"
                      : isSelected
                        ? "bg-accent/15 border-accent text-foreground cursor-pointer"
                        : "bg-surface/30 border-border/50 hover:bg-surface/60 text-foreground/70 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar size="sm" className="w-8 h-8 rounded-full shrink-0">
                      {m.avatar && (
                        <AvatarImage src={getAvatarUrl(m.avatar)} alt={displayName} />
                      )}
                      <AvatarFallback className="text-xs font-bold bg-accent/20 text-accent-foreground">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate">
                          {displayName}
                        </span>
                        {isSelf && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-accent/20 text-accent">
                            {t("splits.wizard.you_badge")}
                          </span>
                        )}
                      </div>
                      {m.username && (
                        <span className="text-[10px] text-foreground/40 truncate">
                          @{m.username}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-border/40">
        <Button
          variant="primary"
          isDisabled={!isStep1Valid}
          onPress={onGoToStep2}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold cursor-pointer"
        >
          <span>{t("splits.next_step_btn")}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
