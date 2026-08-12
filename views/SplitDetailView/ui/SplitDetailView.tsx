"use client";

import { SplitUser, useSplit } from "@/entities/split";
import { cn } from "@/shared/lib/utils";
import {
  SplitExpensesTab,
  SplitHeader,
  SplitHistoryTab,
  SplitRequestsTab,
} from "@/widgets/split-detail";
import { ArrowRotateRight, Clock, PaperPlane, Receipt, TriangleExclamationFill } from "@gravity-ui/icons";
import { Button, Card, CardContent, Spinner, Tab, TabList, Tabs } from "@heroui/react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export function SplitDetailView() {
  const { t } = useTranslation();
  const params = useParams();
  const crewId = Number(params?.id);
  const splitId = Number(params?.splitId);

  const [activeTab, setActiveTab] = useState<
    "expenses" | "history" | "requests"
  >("expenses");

  const { data: split, isPending, isError, refetch } = useSplit(splitId);

  const authors = useMemo(() => {
    if (!split) return [];
    const map = new Map<number, SplitUser>();
    split.expenses.forEach((e) => {
      if (e.spender) map.set(e.spender.id, e.spender);
      e.members?.forEach((m) => {
        if (m.user) map.set(m.user.id, m.user);
      });
    });
    return Array.from(map.values());
  }, [split]);

  const tabs = useMemo(() => {
    const list: Array<{
      id: "expenses" | "history" | "requests";
      label: string;
      icon: React.ReactNode;
      badge?: number;
    }> = [
      {
        id: "expenses",
        label: t("splits.tabs.expenses"),
        icon: <Receipt className="w-4 h-4" />,
      },
      {
        id: "history",
        label: t("splits.tabs.history"),
        icon: <Clock className="w-4 h-4" />,
      },
    ];

    if (!split?.archived) {
      list.push({
        id: "requests",
        label: t("splits.tabs.requests"),
        icon: <PaperPlane className="w-4 h-4" />,
        badge:
          split?.requestsCount && split.requestsCount > 0
            ? split.requestsCount
            : undefined,
      });
    }

    return list;
  }, [split?.archived, split?.requestsCount, t]);

  const currentTab = split?.archived && activeTab === "requests" ? "expenses" : activeTab;

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  if (isError || !split) {
    return (
      <Card className="border border-border/60 bg-surface/30 backdrop-blur-md rounded-3xl p-8 text-center">
        <CardContent className="flex flex-col items-center gap-4 p-0">
          <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center border border-danger/20">
            <TriangleExclamationFill className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-foreground">
              {t("common.error")}
            </h3>
          </div>
          <Button
            variant="outline"
            onPress={() => refetch()}
            className="flex items-center gap-2 mt-2"
          >
            <ArrowRotateRight className="w-4 h-4" />
            <span>{t("auth_guard.retry_btn")}</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-page-slide-in-right">
      <SplitHeader split={split} />

      <div className="w-full">
        <Tabs
          selectedKey={currentTab}
          onSelectionChange={(key) =>
            setActiveTab(key as "expenses" | "history" | "requests")
          }
          className="w-full"
        >
          <TabList
            className={`w-full grid gap-1 p-1.5 rounded-2xl bg-surface/50 border border-border/60 backdrop-blur-md shadow-xs ${
              split.archived ? "grid-cols-2" : "grid-cols-3"
            }`}
          >
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;

              return (
                <Tab
                  key={tab.id}
                  id={tab.id}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer select-none outline-none focus:outline-none",
                    isActive
                      ? "bg-accent text-accent-foreground font-bold shadow-xs"
                      : "text-foreground/70 hover:text-foreground hover:bg-surface-secondary/40",
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {typeof tab.badge === "number" && tab.badge > 0 && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors",
                        isActive
                          ? "bg-accent-foreground/20 text-accent-foreground"
                          : "bg-accent text-accent-foreground",
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

      {currentTab === "expenses" && (
        <SplitExpensesTab split={split} crewId={crewId} />
      )}
      {currentTab === "history" && (
        <SplitHistoryTab splitId={split.id} authors={authors} />
      )}
      {!split.archived && currentTab === "requests" && (
        <SplitRequestsTab splitId={split.id} authors={authors} />
      )}
    </div>
  );
}
