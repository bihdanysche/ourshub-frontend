"use client";

import {
  LogoTelegram,
  Persons,
  Picture,
  Receipt,
  Sparkles,
} from "@gravity-ui/icons";
import { Card, CardContent } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "./ScrollReveal";

export function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      number: "01",
      icon: LogoTelegram,
      title: t("landing.how_it_works.step1_title"),
      desc: t("landing.how_it_works.step1_desc"),
    },
    {
      number: "02",
      icon: Persons,
      title: t("landing.how_it_works.step2_title"),
      desc: t("landing.how_it_works.step2_desc"),
    },
    {
      number: "03",
      icon: Picture,
      title: t("landing.how_it_works.step3_title"),
      desc: t("landing.how_it_works.step3_desc"),
    },
    {
      number: "04",
      icon: Receipt,
      title: t("landing.how_it_works.step4_title"),
      desc: t("landing.how_it_works.step4_desc"),
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-12 sm:py-16">
      <ScrollReveal className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {t("landing.how_it_works.badge")}
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("landing.how_it_works.title")}
        </h2>

        <p className="mt-3 max-w-xl text-sm text-foreground/70 sm:text-base">
          {t("landing.how_it_works.subtitle")}
        </p>
      </ScrollReveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <ScrollReveal key={idx} delay={idx * 100}>
              <Card className="relative h-full overflow-hidden border border-border/70 bg-surface/50 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-accent/50">
                <CardContent className="p-0 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-black text-foreground/20">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-foreground/70">
                    {step.desc}
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
