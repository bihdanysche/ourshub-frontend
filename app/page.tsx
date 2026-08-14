"use client";

import { useMe } from "@/entities/auth";
import { HomePage } from "@/views/HomePage";
import { LandingPage } from "@/views/LandingPage";

export default function RootPage() {
  const { data: user } = useMe();

  if (user) {
    return <HomePage />;
  }

  return <LandingPage />;
}
