"use client";

import { useCrew } from "@/entities/crew";
import { ArrowLeft } from "@gravity-ui/icons";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CrewErrorState } from "./CrewErrorState";
import { CrewHeader } from "./CrewHeader";
import { CrewLoadingState } from "./CrewLoadingState";
import { CrewTabs } from "./CrewTabs";

interface CrewLayoutProps {
  children: React.ReactNode;
}

export function CrewLayout({ children }: CrewLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const { t } = useTranslation();
  const crewId = Number(params?.id);

  const isSplitSubpage =
    pathname?.includes("/splits/create") ||
    (pathname?.includes("/splits/") && Boolean(params?.splitId));

  const { data: crew, isPending, isError, refetch } = useCrew(crewId);

  if (isPending) {
    return <CrewLoadingState />;
  }

  if (isError || !crew) {
    return <CrewErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="w-(--page-width) max-w-full flex flex-col px-4 sm:px-6 md:px-0 py-6 gap-6">
      <CrewHeader crew={crew} />

      {isSplitSubpage ? (
        <div className="w-full flex items-center justify-start animate-page-slide-in-left">
          <Link
            href={`/crews/${crew.id}/splits`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-border/60 bg-surface/40 hover:bg-surface/70 text-foreground transition-all cursor-pointer shadow-xs active:scale-95 hover:border-accent/40"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>{t("splits.back_to_splits")}</span>
          </Link>
        </div>
      ) : (
        <div className="w-full animate-page-slide-in-left">
          <CrewTabs
            crewId={crew.id}
            membersCount={crew.membersCount}
            activeSplitsCount={crew.activeSplitsCount}
          />
        </div>
      )}

      <div className="w-full">{children}</div>
    </div>
  );
}
