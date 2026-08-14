"use client";

import { cn } from "@/shared/lib/utils";
import { Comment, Persons, Receipt } from "@gravity-ui/icons";
import { Tab, TabList, Tabs } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { Key } from "react";
import { useTranslation } from "react-i18next";

interface CrewTabsProps {
  crewId: number;
  membersCount: number;
  activeSplitsCount?: number;
}

export function CrewTabs({
  crewId,
  membersCount,
  activeSplitsCount,
}: CrewTabsProps) {
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
      badge:
        typeof activeSplitsCount === "number" && activeSplitsCount > 0
          ? activeSplitsCount
          : undefined,
    },
    {
      id: "members",
      label: t("crew_page.tabs.members"),
      icon: <Persons className="w-4 h-4" />,
      badge: membersCount,
    },
  ];

  const handleSelectionChange = (key: Key) => {
    router.push(`/crews/${crewId}/${String(key)}`);
  };

  return (
    <div className="w-full">
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={handleSelectionChange}
        className="w-full"
      >
        <TabList className="w-full grid grid-cols-3 gap-1 p-1.5 rounded-2xl bg-surface/50 border border-border/60 backdrop-blur-md shadow-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <Tab
                key={tab.id}
                id={tab.id}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer select-none outline-none focus:outline-none",
                  isActive
                    ? "bg-accent text-accent-foreground font-bold shadow-xs"
                    : "text-foreground/70 hover:text-foreground hover:bg-surface-secondary/40",
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
              </Tab>
            );
          })}
        </TabList>
      </Tabs>
    </div>
  );
}
