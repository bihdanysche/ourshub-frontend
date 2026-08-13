"use client";

import { Check, ChevronDown, Globe, Moon, Sun } from "@gravity-ui/icons";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
} from "@heroui/react";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function AppearanceSection() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  const currentLang = (i18n.language || "uk").startsWith("en") ? "en" : "uk";
  const currentTheme = (mounted ? theme : "dark") || "dark";

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-bold text-foreground">
          {t("settings.appearance.title")}
        </h1>
        <p className="text-sm text-foreground/60 mt-1">
          {t("settings.appearance.description")}
        </p>
      </div>

      <div className="flex flex-col divide-y divide-border/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-secondary text-foreground/80 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {t("settings.appearance.language.title")}
              </span>
              <span className="text-xs text-foreground/60">
                {t("settings.appearance.language.description")}
              </span>
            </div>
          </div>

          <Dropdown>
            <DropdownTrigger className="group flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-surface/80 hover:bg-surface-secondary border border-border/80 hover:border-accent/50 transition-all duration-200 cursor-pointer shadow-xs min-w-[150px] outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {currentLang === "en"
                    ? t("settings.appearance.language.en")
                    : t("settings.appearance.language.uk")}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-foreground/50 transition-transform duration-200 group-data-[open=true]:rotate-180" />
            </DropdownTrigger>
            <DropdownPopover
              placement="bottom end"
              className="min-w-[160px] p-1.5 rounded-xl shadow-xl border border-border/50 bg-background/95 backdrop-blur-md outline-none focus:outline-none ring-0"
            >
              <DropdownMenu
                onAction={(key) => i18n.changeLanguage(String(key))}
                className="outline-none focus:outline-none"
              >
                <DropdownItem
                  id="uk"
                  className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary data-[hovered=true]:bg-surface-secondary transition-colors outline-none"
                >
                  <span className="text-sm font-medium">
                    {t("settings.appearance.language.uk")}
                  </span>
                  {currentLang === "uk" && (
                    <Check className="w-4 h-4 text-accent" />
                  )}
                </DropdownItem>
                <DropdownItem
                  id="en"
                  className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary data-[hovered=true]:bg-surface-secondary transition-colors outline-none"
                >
                  <span className="text-sm font-medium">
                    {t("settings.appearance.language.en")}
                  </span>
                  {currentLang === "en" && (
                    <Check className="w-4 h-4 text-accent" />
                  )}
                </DropdownItem>
              </DropdownMenu>
            </DropdownPopover>
          </Dropdown>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 last:pb-0">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-secondary text-foreground/80 shrink-0">
              {currentTheme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {t("settings.appearance.theme.title")}
              </span>
              <span className="text-xs text-foreground/60">
                {t("settings.appearance.theme.description")}
              </span>
            </div>
          </div>

          <Dropdown>
            <DropdownTrigger className="group flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-surface/80 hover:bg-surface-secondary border border-border/80 hover:border-accent/50 transition-all duration-200 cursor-pointer shadow-xs min-w-[150px] outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <div className="flex items-center gap-2">
                {currentTheme === "dark" ? (
                  <Moon className="w-4 h-4 text-foreground/70" />
                ) : (
                  <Sun className="w-4 h-4 text-foreground/70" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {currentTheme === "dark"
                    ? t("settings.appearance.theme.dark")
                    : t("settings.appearance.theme.light")}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-foreground/50 transition-transform duration-200 group-data-[open=true]:rotate-180" />
            </DropdownTrigger>
            <DropdownPopover
              placement="bottom end"
              className="min-w-[160px] p-1.5 rounded-xl shadow-xl border border-border/50 bg-background/95 backdrop-blur-md outline-none focus:outline-none ring-0"
            >
              <DropdownMenu
                onAction={(key) => setTheme(String(key))}
                className="outline-none focus:outline-none"
              >
                <DropdownItem
                  id="dark"
                  className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary data-[hovered=true]:bg-surface-secondary transition-colors outline-none"
                >
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-foreground/70" />
                    <span className="text-sm font-medium">
                      {t("settings.appearance.theme.dark")}
                    </span>
                  </div>
                  {currentTheme === "dark" && (
                    <Check className="w-4 h-4 text-accent" />
                  )}
                </DropdownItem>
                <DropdownItem
                  id="light"
                  className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary data-[hovered=true]:bg-surface-secondary transition-colors outline-none"
                >
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-foreground/70" />
                    <span className="text-sm font-medium">
                      {t("settings.appearance.theme.light")}
                    </span>
                  </div>
                  {currentTheme === "light" && (
                    <Check className="w-4 h-4 text-accent" />
                  )}
                </DropdownItem>
              </DropdownMenu>
            </DropdownPopover>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
