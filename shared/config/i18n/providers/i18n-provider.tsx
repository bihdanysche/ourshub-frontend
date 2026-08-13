import React, { useSyncExternalStore } from "react";
import { I18nextProvider } from "react-i18next";
import i18nInstance from "../i18n";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
}