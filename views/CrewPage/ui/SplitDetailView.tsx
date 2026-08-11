"use client";

import { SplitUser, useSplit } from "@/entities/split";
import { cn } from "@/shared/lib/utils";
import {
  SplitExpensesTab,
  SplitHeader,
  SplitHistoryTab,
} from "@/widgets/split-detail";
import { ArrowRotateRight, Clock, Receipt, TriangleExclamationFill } from "@gravity-ui/icons";
import { Button, Card, CardContent, Spinner, Tab, TabList, Tabs } from "@heroui/react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export function SplitDetailView() {
  const { t } = useTranslation();
  const params = useParams();
  const crewId = Number(params?.id);
  const splitId = Number(params?.splitId);

  const [activeTab, setActiveTab] = useState<"expenses" | "history">("expenses");

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

  const tabs = [
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

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <SplitHeader split={split} />

      <div className="w-full">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) =>
            setActiveTab(key as "expenses" | "history")
          }
          className="w-full"
        >
          <TabList className="w-full grid grid-cols-2 gap-1 p-1.5 rounded-2xl bg-surface/50 border border-border/60 backdrop-blur-md shadow-xs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

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
                </Tab>
              );
            })}
          </TabList>
        </Tabs>
      </div>

      {activeTab === "expenses" && (
        <SplitExpensesTab split={split} crewId={crewId} />
      )}
      {activeTab === "history" && (
        <SplitHistoryTab splitId={split.id} authors={authors} />
      )}
    </div>
  );
}
