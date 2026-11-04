import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Spotlight } from "@/components/motion/Spotlight";
import { site } from "@/content/site";
import { geist, geistMono } from "./fonts";
import "./globals.css";

// Defaults only; every indexable page sets its own via pageMetadata() from the route manifest.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} | Experimental Intelligence for Resistant Cancer`,
  description: site.mission,
  openGraph: { siteName: site.name, locale: "en_GB", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#070c1a", // = --canvas
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>
          <Header />
          <main id="main" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <Footer />
          <Spotlight />
        </MotionProvider>
      </body>
    </html>
  );
}
