"use client";

import { useLogout, useMe } from "@/entities/auth";
import { isUnauthorizedError } from "@/shared/api";
import { getAvatarUrl } from "@/shared/lib";
import {
  ArrowChevronDown,
  ArrowRightFromSquare,
  Gear,
  LogoTelegram,
  TriangleExclamationFill,
} from "@gravity-ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
  Skeleton,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export function UserMenu() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: user, isPending, isError, error, refetch } = useMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-20 h-4 rounded-md hidden sm:block" />
      </div>
    );
  }

  const isUnauthorized = isUnauthorizedError(error);

  if (isError && !isUnauthorized) {
    return (
      <Button
        size="sm"
        variant="danger-soft"
        onPress={() => refetch()}
        className="flex items-center gap-1.5"
      >
        <TriangleExclamationFill className="w-4 h-4" />
        {t("header.error_user")}
      </Button>
    );
  }

  if (!user) {
    const loginViaTg = () => {
      window.location.replace(`${process.env.NEXT_PUBLIC_API_URL}/auth/telegram`);
    };

    return (
      <Button variant="primary" onPress={loginViaTg} className="flex items-center gap-2">
        <LogoTelegram className="w-4 h-4" />
        {t("header.login_via_tg")}
      </Button>
    );
  }

  const handleAction = (key: React.Key) => {
    if (key === "settings") {
      router.push("/settings");
    } else if (key === "logout") {
      logout();
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 hover:bg-surface-secondary border border-border/80 hover:border-accent/60 data-[hovered=true]:bg-surface-secondary data-[hovered=true]:border-accent/60 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 data-[focused=true]:outline-none data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-0">
        <div className="flex items-center gap-2.5">
          <Avatar size="sm" color="accent" className="rounded-full">
            {user.avatar && <AvatarImage src={getAvatarUrl(user.avatar)} alt={user.name} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground hidden sm:block max-w-[140px] truncate">
            {user.name}
          </span>
          <ArrowChevronDown className="w-3.5 h-3.5 text-foreground/60 transition-transform duration-200 group-data-[open=true]:rotate-180 hidden sm:block" />
        </div>
      </DropdownTrigger>
      <DropdownPopover
        placement="bottom end"
        className="min-w-[200px] p-1.5 rounded-xl shadow-xl border border-border/50 bg-background/95 backdrop-blur-md outline-none focus:outline-none ring-0"
      >
        <div className="px-3 py-2 border-b border-border/40 mb-1">
          <p className="font-semibold text-foreground text-sm truncate">{user.name}</p>
          {user.username && (
            <p className="text-xs text-foreground/60 truncate">@{user.username}</p>
          )}
        </div>
        <DropdownMenu
          onAction={handleAction}
          disabledKeys={isLoggingOut ? ["logout"] : []}
          className="outline-none focus:outline-none"
        >
          <DropdownItem
            id="settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary data-[hovered=true]:bg-surface-secondary transition-colors outline-none focus:outline-none"
          >
            <Gear className="w-4 h-4 text-foreground/70" />
            <span>{t("header.settings")}</span>
          </DropdownItem>
          <DropdownItem
            id="logout"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-danger hover:bg-danger/10 data-[hovered=true]:bg-danger/10 transition-colors outline-none focus:outline-none"
          >
            <ArrowRightFromSquare className="w-4 h-4" />
            <span>{t("header.logout")}</span>
          </DropdownItem>
        </DropdownMenu>
      </DropdownPopover>
    </Dropdown>
  );
}
