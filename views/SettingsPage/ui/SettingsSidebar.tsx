"use client";

import { cn } from "@/shared/lib/utils";
import { ChevronRight, Display, Palette, Person } from "@gravity-ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const navItems = [
  {
    href: "/settings/profile",
    labelKey: "settings.nav.profile",
    icon: Person,
  },
  {
    href: "/settings/sessions",
    labelKey: "settings.nav.sessions",
    icon: Display,
  },
  {
    href: "/settings/appearance",
    labelKey: "settings.nav.appearance",
    icon: Palette,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="flex flex-col gap-1.5 p-2 rounded-2xl border border-border/60 bg-surface/50 backdrop-blur-md shadow-xs">
        <div className="px-3.5 pt-2.5 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted select-none">
          {t("settings.title")}
        </div>
        <nav className="flex flex-col gap-1" aria-label={t("settings.title")}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-focus",
                  isActive
                    ? "bg-accent/15 text-accent dark:bg-accent/20 font-semibold shadow-xs"
                    : "text-foreground/75 hover:text-foreground hover:bg-surface-secondary/80 active:scale-[0.99]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200",
                      isActive
                        ? "bg-accent/20 text-accent"
                        : "bg-surface-secondary/70 text-foreground/70 group-hover:bg-surface-secondary group-hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{t(item.labelKey)}</span>
                </div>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-all duration-200",
                    isActive
                      ? "text-accent opacity-100 translate-x-0"
                      : "text-foreground/40 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
