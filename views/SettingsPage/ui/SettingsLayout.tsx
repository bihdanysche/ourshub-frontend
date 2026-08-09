"use client";

import { useMe } from "@/entities/auth";
import { Card, CardContent } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SettingsSidebar } from "./SettingsSidebar";

export function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: me, status } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!me && status !== "pending") {
      router.replace("/");
    }
  }, [me, status, router]);

  return (
    <div className="w-(--page-width) max-w-full flex flex-col md:flex-row items-start gap-6 px-4 md:px-0 py-6">
      <SettingsSidebar />
      <section className="flex-1 min-w-0 w-full">
        <Card className="border border-border/60 bg-surface/50 shadow-xs backdrop-blur-md rounded-2xl h-fit">
          <CardContent className="p-6 sm:p-8">
            {children}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

