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
      <div className="p-1.5 md:p-2 rounded-2xl border border-border/60 bg-surface/50 backdrop-blur-md shadow-xs">
        <div className="hidden md:block px-3.5 pt-2.5 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted select-none">
          {t("settings.title")}
        </div>
        
        <nav
          className="grid grid-cols-3 md:flex md:flex-col gap-1.5 md:gap-1"
          aria-label={t("settings.title")}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-center md:justify-between py-2.5 px-2 md:px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer select-none",
                  isActive
                    ? "bg-accent text-accent-foreground md:bg-accent/15 md:text-accent dark:md:bg-accent/20 font-bold shadow-xs"
                    : "text-foreground/70 hover:text-foreground hover:bg-surface-secondary/60 active:scale-[0.98]"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      "flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg transition-colors duration-200 shrink-0",
                      isActive
                        ? "bg-accent-foreground/20 text-accent-foreground md:bg-accent/20 md:text-accent"
                        : "bg-surface-secondary/70 text-foreground/70 group-hover:bg-surface-secondary group-hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate text-xs sm:text-sm font-medium md:font-semibold">
                    {t(item.labelKey)}
                  </span>
                </div>
                
                <ChevronRight
                  className={cn(
                    "hidden md:block w-4 h-4 transition-all duration-200",
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
