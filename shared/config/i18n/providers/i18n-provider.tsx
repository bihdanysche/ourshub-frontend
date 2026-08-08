"use client";

import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18nInstance from "../i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])

  if (!mounted) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
}