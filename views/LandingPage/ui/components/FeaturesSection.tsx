"use client";

import {
  Eye,
  LogoTelegram,
  Persons,
  Picture,
  Receipt,
  SlidersVertical,
  Sparkles,
} from "@gravity-ui/icons";
import { Card, CardContent } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "./ScrollReveal";

export function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Persons,
      title: t("landing.features.company.title"),
      desc: t("landing.features.company.desc"),
      color: "from-purple-500/20 to-indigo-500/10",
      iconColor: "text-purple-400",
    },
    {
      icon: Picture,
      title: t("landing.features.media.title"),
      desc: t("landing.features.media.desc"),
      color: "from-pink-500/20 to-rose-500/10",
      iconColor: "text-pink-400",
    },
    {
      icon: Receipt,
      title: t("landing.features.splits.title"),
      desc: t("landing.features.splits.desc"),
      color: "from-emerald-500/20 to-teal-500/10",
      iconColor: "text-emerald-400",
    },
    {
      icon: LogoTelegram,
      title: t("landing.features.auth.title"),
      desc: t("landing.features.auth.desc"),
      color: "from-sky-500/20 to-blue-500/10",
      iconColor: "text-sky-400",
    },
    {
      icon: Eye,
      title: t("landing.features.transparency.title"),
      desc: t("landing.features.transparency.desc"),
      color: "from-amber-500/20 to-yellow-500/10",
      iconColor: "text-amber-400",
    },
    {
      icon: SlidersVertical,
      title: t("landing.features.custom_shares.title"),
      desc: t("landing.features.custom_shares.desc"),
      color: "from-violet-500/20 to-fuchsia-500/10",
      iconColor: "text-violet-400",
    },
  ];

  return (
    <section id="features" className="w-full py-12 sm:py-16">
      <ScrollReveal className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {t("landing.features.badge")}
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("landing.features.title")}
        </h2>

        <p className="mt-3 max-w-xl text-sm text-foreground/70 sm:text-base">
          {t("landing.features.subtitle")}
        </p>
      </ScrollReveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <ScrollReveal key={idx} delay={idx * 80}>
              <Card className="group relative h-full overflow-hidden border border-border/70 bg-surface/50 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl">
                <div
                  className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${feature.color} blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <CardContent className="p-0 text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-surface-secondary/80 shadow-xs transition-colors duration-200 group-hover:border-accent/40">
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-foreground transition-colors group-hover:text-accent">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-foreground/70 sm:text-sm">
                    {feature.desc}
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
