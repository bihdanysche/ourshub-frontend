"use client";

import { LogoTelegram, Sparkles } from "@gravity-ui/icons";
import { Button, Card, CardContent } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "./ScrollReveal";

export function CtaSection() {
  const { t } = useTranslation();

  const handleTelegramLogin = () => {
    window.location.replace(`${process.env.NEXT_PUBLIC_API_URL}/auth/telegram`);
  };

  return (
    <section className="w-full py-12 sm:py-16">
      <ScrollReveal>
        <Card className="relative overflow-hidden border border-accent/40 bg-gradient-to-b from-surface to-surface-secondary/90 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

          <CardContent className="p-0 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent mb-4">
              <Sparkles className="h-6 w-6" />
            </div>

            <h2 className="max-w-xl text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t("landing.cta_banner.title")}
            </h2>

            <p className="mt-3 max-w-lg text-sm text-foreground/75 sm:text-base">
              {t("landing.cta_banner.subtitle")}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <Button
                size="lg"
                variant="primary"
                onPress={handleTelegramLogin}
                className="flex h-12 items-center gap-2.5 px-8 font-semibold shadow-xl shadow-accent/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogoTelegram className="h-5 w-5" />
                <span>{t("landing.cta_banner.button")}</span>
              </Button>

              <span className="text-xs text-foreground/60">
                {t("landing.cta_banner.note")}
              </span>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </section>
  );
}
