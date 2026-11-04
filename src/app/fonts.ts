import localFont from "next/font/local";

// Self-hosted, Latin subset. Licences: src/fonts/*-OFL.txt (SIL OFL 1.1).
export const geist = localFont({
  src: "../fonts/Geist-latin-wght.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist",
});

export const geistMono = localFont({
  src: "../fonts/GeistMono-latin-wght.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-mono",
});
