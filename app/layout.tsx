import { I18nProvider } from "@/shared/config/i18n";
import { cn } from "@/shared/lib/utils";
import { QueryProvider, ThemeProvider } from "@/shared/providers";
import { Header } from "@/widgets/header";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const primaryFont = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ours Hub",
  description: "Hub for ours :)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", primaryFont.variable, "font-sans")}
    >
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <ThemeProvider
            defaultTheme="light"
            storageKey="theme"
            attribute="class"
          >
            <I18nProvider>
              <div className="flex min-h-screen flex-col gap-3">
                <Header />
                <main className="flex min-h-full flex-1 justify-center overflow-y-auto pb-3">
                  {children}
                </main>
              </div>
            </I18nProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
