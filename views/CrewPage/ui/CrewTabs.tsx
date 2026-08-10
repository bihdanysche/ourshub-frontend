"use client";

import { cn } from "@/shared/lib/utils";
import { Comment, Persons, Receipt } from "@gravity-ui/icons";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface CrewTabsProps {
  crewId: number;
  membersCount: number;
}

export function CrewTabs({ crewId, membersCount }: CrewTabsProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = pathname.split("/").pop() || "posts";
  const activeTab = ["posts", "splits", "members"].includes(currentTab)
    ? currentTab
    : "posts";

  const tabs = [
    {
      id: "posts",
      label: t("crew_page.tabs.posts"),
      icon: <Comment className="w-4 h-4" />,
    },
    {
      id: "splits",
      label: t("crew_page.tabs.splits"),
      icon: <Receipt className="w-4 h-4" />,
    },
    {
      id: "members",
      label: t("crew_page.tabs.members"),
      icon: <Persons className="w-4 h-4" />,
      badge: membersCount,
    },
  ];

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab),
  );

  return (
    <div className="w-full">
      <div className="w-full p-1.5 rounded-2xl bg-surface/50 border border-border/60 backdrop-blur-md shadow-xs relative">
        <div
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-accent shadow-xs transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none"
          style={{
            width: "calc((100% - 12px) / 3)",
            left: `calc(6px + ${activeIndex} * (100% - 12px) / 3)`,
          }}
        />

        <div className="grid grid-cols-3 gap-1 relative z-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => router.push(`/crews/${crewId}/${tab.id}`)}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer select-none",
                  isActive
                    ? "text-accent-foreground font-bold"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.badge === "number" && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-bold rounded-full transition-colors",
                      isActive
                        ? "bg-accent-foreground/20 text-accent-foreground"
                        : "bg-surface-secondary text-foreground/70 border border-border/40",
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
