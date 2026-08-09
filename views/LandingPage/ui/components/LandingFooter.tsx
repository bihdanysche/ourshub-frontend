"use client";

import { Globe, Lock } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "./ScrollReveal";

export function LandingFooter() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = (i18n.language || "uk").startsWith("en") ? "uk" : "en";
    i18n.changeLanguage(nextLang);
  };

  const currentLangLabel = (i18n.language || "uk").startsWith("en") ? "EN" : "UK";

  return (
    <footer className="w-full border-t border-border/40 py-10 text-foreground/60">
      <ScrollReveal className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/app_icon.png"
            alt="Ours Hub Logo"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <div>
            <span className="text-sm font-bold text-foreground">OursHub</span>
            <p className="text-xs text-foreground/60 max-w-xs">
              {t("landing.footer.brand_desc")}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onPress={toggleLanguage}
          className="flex items-center gap-1.5 h-8 px-3 text-xs rounded-full border border-border/70 bg-surface/70 w-fit"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{currentLangLabel}</span>
        </Button>
      </ScrollReveal>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-border/20 pt-6 text-[11px] text-foreground/50">
        <div className="flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-accent" />
          <span>{t("landing.footer.privacy_note")}</span>
        </div>
        <p>© {new Date().getFullYear()} OursHub. {t("landing.footer.rights")}</p>
      </div>
    </footer>
  );
}
