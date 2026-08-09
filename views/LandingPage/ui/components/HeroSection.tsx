"use client";

import {
  ArrowRight,
  LogoTelegram,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "@gravity-ui/icons";
import { Button, Card, CardContent } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "./ScrollReveal";

interface HeroSectionProps {
  onExploreClick: () => void;
}

export function HeroSection({ onExploreClick }: HeroSectionProps) {
  const { t } = useTranslation();

  const handleTelegramLogin = () => {
    window.location.replace(`${process.env.NEXT_PUBLIC_API_URL}/auth/telegram`);
  };

  return (
    <section className="relative w-full overflow-hidden pt-6 pb-12 sm:py-16">
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-accent/25 via-accent/10 to-transparent blur-3xl" />

      <div className="flex flex-col items-center text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {t("landing.badge")}
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl sm:leading-[1.15]">
            {t("landing.hero_title_1")}{" "}
            <span className="bg-gradient-to-r from-accent via-accent/80 to-purple-400 bg-clip-text text-transparent">
              {t("landing.hero_title_2")}
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mt-5 max-w-2xl text-base text-foreground/75 sm:text-lg">
            {t("landing.hero_description")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Button
              size="lg"
              variant="primary"
              onPress={handleTelegramLogin}
              className="flex h-12 items-center gap-2.5 px-6 font-semibold shadow-lg shadow-accent/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogoTelegram className="h-5 w-5" />
              <span>{t("landing.cta_primary")}</span>
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onPress={onExploreClick}
              className="flex h-12 items-center gap-2 border border-border/80 bg-surface/70 px-5 backdrop-blur-md transition-all duration-200 hover:bg-surface-secondary"
            >
              <span>{t("landing.cta_secondary")}</span>
              <ArrowRight className="h-4 w-4 text-foreground/60" />
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400} className="w-full">
          <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 mx-auto">
            <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface/40 p-3 backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground">
                  {t("landing.highlights.private_title")}
                </p>
                <p className="text-[11px] text-foreground/60">
                  {t("landing.highlights.private_desc")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface/40 p-3 backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <LogoTelegram className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground">
                  {t("landing.highlights.instant_auth_title")}
                </p>
                <p className="text-[11px] text-foreground/60">
                  {t("landing.highlights.instant_auth_desc")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface/40 p-3 backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Receipt className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground">
                  {t("landing.highlights.smart_splits_title")}
                </p>
                <p className="text-[11px] text-foreground/60">
                  {t("landing.highlights.smart_splits_desc")}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={500} className="w-full">
          <div className="mt-8 w-full max-w-2xl mx-auto">
            <Card className="border border-border/60 bg-surface/40 p-4 sm:p-5 backdrop-blur-md text-left">
              <CardContent className="p-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-xs font-bold text-foreground">
                    {t("landing.example_box.title")}
                  </span>
                </div>
                <p className="text-xs text-foreground/75 leading-relaxed">
                  {t("landing.example_box.text")}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
