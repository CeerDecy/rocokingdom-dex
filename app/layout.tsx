import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://rocokingdom.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rocokindom Dex",
    template: "%s | Rocokindom Dex",
  },
  description: "探索洛可王国精灵图鉴，记录生态、进化与技能。",
  openGraph: {
    title: "Rocokindom Dex",
    description: "探索洛可王国精灵图鉴，记录生态、进化与技能。",
    url: "/",
    siteName: "Rocokindom Dex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rocokindom Dex",
    description: "探索洛可王国精灵图鉴，记录生态、进化与技能。",
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
        className={`${spaceGrotesk.variable} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
