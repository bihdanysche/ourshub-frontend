"use client";

import {
  Compass,
  Flame,
  Heart,
  Persons,
  Sparkles,
} from "@gravity-ui/icons";
import { Card, CardContent } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "./ScrollReveal";

export function UseCasesSection() {
  const { t } = useTranslation();

  const cases = [
    {
      icon: Flame,
      title: t("landing.use_cases.item1_title"),
      desc: t("landing.use_cases.item1_desc"),
      color: "text-amber-400",
      bg: "bg-amber-500/15",
    },
    {
      icon: Compass,
      title: t("landing.use_cases.item2_title"),
      desc: t("landing.use_cases.item2_desc"),
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
    },
    {
      icon: Persons,
      title: t("landing.use_cases.item3_title"),
      desc: t("landing.use_cases.item3_desc"),
      color: "text-sky-400",
      bg: "bg-sky-500/15",
    },
    {
      icon: Heart,
      title: t("landing.use_cases.item4_title"),
      desc: t("landing.use_cases.item4_desc"),
      color: "text-pink-400",
      bg: "bg-pink-500/15",
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16">
      <ScrollReveal className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {t("landing.use_cases.badge")}
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("landing.use_cases.title")}
        </h2>
      </ScrollReveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cases.map((item, idx) => {
          const Icon = item.icon;
          return (
            <ScrollReveal key={idx} delay={idx * 100}>
              <Card className="h-full border border-border/70 bg-surface/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-accent/50">
                <CardContent className="p-0 text-left">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-foreground/70">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
