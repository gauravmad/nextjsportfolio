import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

import { profile } from "@/content/portfolio";
import { siteConfig } from "@/lib/config/site";
import { Providers } from "@/providers";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const description = `${profile.headline}. ${profile.pitch}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${profile.name}: ${profile.headline}`, template: `%s · ${profile.name}` },
  description,
  authors: [{ name: profile.name, url: siteConfig.url }],
  openGraph: {
    type: "profile",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: profile.name,
    title: `${profile.name}: ${profile.headline}`,
    description,
  },
  twitter: { card: "summary_large_image", title: profile.name, description },
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bricolage.variable} ${jetbrains.variable} dark`}>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
