"use client";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

export function LandingPage() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "uk" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <div>
      <h1>{t("temporary_test.welcome")}</h1>

      <Button onClick={toggleLanguage}>
        {t("temporary_test.change_lang")}
      </Button>
    </div>
  );
}
