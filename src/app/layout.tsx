import type { Metadata } from "next";
import React, { Suspense } from "react";
import "@styles/global.css";
import { Header } from "@components/layout/header";
import { Footer } from "@components/layout/footer";
import classNames from "classnames";

import { Roboto_Slab } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Providers } from "../providers/providers";
import { ErrorNotifier } from "@/components/layout/error-notifier";
import { Toaster } from "@/components/ui/toaster";
import { CookiesProvider } from "next-client-cookies/server";

const font = Roboto_Slab({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Hermits Diary",
  description: "diary",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={classNames("dark bg-bg text-foreground", font.className)}
      >
        <Toaster />
        <ErrorNotifier />
        <CookiesProvider>
          <Suspense>
            <Providers>
              <div className="grid min-h-[100vh] grid-rows-[auto_1fr_auto]">
                <Header />
                <div className="">{children}</div>
                <Footer />
              </div>
            </Providers>
          </Suspense>
        </CookiesProvider>
      </body>
    </html>
  );
}
