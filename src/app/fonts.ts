import localFont from "next/font/local";

// Self-hosted, Latin subset, variable weight. Licences: src/fonts/*-OFL.txt (SIL OFL 1.1).
export const spaceGrotesk = localFont({
  src: "../fonts/SpaceGrotesk-latin-wght.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-space-grotesk",
});

export const jetbrainsMono = localFont({
  src: "../fonts/JetBrainsMono-latin-wght.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-jetbrains-mono",
});
