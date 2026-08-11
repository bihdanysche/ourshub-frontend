"use client";

import { LogoTelegram, PersonPlus } from "@gravity-ui/icons";
import { Button, Card, CardContent } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { JoinCrewPageProps } from "./JoinCrewPage";

export function JoinCrewUnauthCard({ inviteCode }: JoinCrewPageProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const loginViaTg = () => {
    window.location.replace(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/telegram?inv_code=${encodeURIComponent(inviteCode)}`,
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md overflow-hidden border border-border/60 bg-surface/40 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8">
        <CardContent className="flex flex-col items-center text-center gap-6 p-0">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-xs">
            <PersonPlus className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {t("join_crew.login_required_title")}
            </h2>
            <p className="text-sm text-foreground/70 max-w-sm">
              {t("join_crew.login_required_desc")}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full pt-2">
            <Button
              variant="primary"
              onPress={loginViaTg}
              className="w-full flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
            >
              <LogoTelegram className="w-4 h-4" />
              <span>{t("header.login_via_tg")}</span>
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push("/")}
              className="w-full cursor-pointer"
            >
              {t("join_crew.cancel_btn")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
