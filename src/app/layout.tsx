import type { Metadata } from "next";
import { Space_Mono, Fraunces, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/components/locale-provider";
import { PwaRegister } from "@/components/pwa-register";
import { AppShell } from "@/components/app-shell";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMM Social Media Manager",
  description: "Social media tracker and AI advisor — Instagram, Facebook, and TikTok.",
  applicationName: "SMM",
  manifest: "/manifest.json",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    title: "SMM",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${spaceMono.variable} ${fraunces.variable} ${notoArabic.variable} antialiased min-h-screen`}
        style={{
          fontFamily: "var(--font-mono), var(--font-arabic), ui-monospace, monospace",
        }}
      >
        <ThemeProvider>
          <LocaleProvider>
            <PwaRegister />
            <AppShell>{children}</AppShell>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
