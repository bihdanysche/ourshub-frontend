"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsCorePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings/profile");
  }, []);

  return null;
}
