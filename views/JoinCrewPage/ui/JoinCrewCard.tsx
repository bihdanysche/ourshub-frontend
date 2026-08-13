"use client";

import { CrewInvitePreview } from "@/entities/crew";
import { JoinCrewForm } from "@/features/join-crew";
import { getAvatarUrl } from "@/shared/lib";
import { Persons, Picture } from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
} from "@heroui/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface JoinCrewCardProps {
  inviteCode: string;
  preview: CrewInvitePreview;
}

const getInitials = (title: string): string => {
  const parts = title.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "C";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function JoinCrewCard({ inviteCode, preview }: JoinCrewCardProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md overflow-hidden border border-border/60 bg-surface/40 backdrop-blur-xl rounded-3xl shadow-xl">
        <div className="relative w-full aspect-[3/1] bg-gradient-to-br from-accent/20 via-surface-secondary/70 to-accent/10">
          {preview.cover ? (
            <Image
              src={getAvatarUrl(preview.cover)!}
              alt={preview.title}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30 select-none">
              <Picture className="w-12 h-12 text-foreground/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
        </div>

        <CardContent className="flex flex-col items-center px-6 pb-6 -mt-12 sm:-mt-14 relative z-10 gap-5 p-0">
          <Avatar
            size="lg"
            color="accent"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-background shadow-xl shrink-0"
          >
            {preview.avatar && (
              <AvatarImage src={getAvatarUrl(preview.avatar)} alt={preview.title} />
            )}
            <AvatarFallback className="font-bold text-2xl text-accent-foreground bg-accent/20">
              {getInitials(preview.title)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center text-center gap-1.5 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight line-clamp-2">
              {preview.title}
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-secondary text-foreground/70 border border-border/50">
              <Persons className="w-3.5 h-3.5" />
              <span>
                {t("home.members_count", { count: preview.membersCount })}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4 pt-4 border-t border-border/40">
            <h3 className="text-sm font-semibold text-center text-foreground/80">
              {t("join_crew.question")}
            </h3>
            <JoinCrewForm inviteCode={inviteCode} crewId={preview.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
