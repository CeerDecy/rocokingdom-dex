import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import Script from "next/script";
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
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.rocokingdomdex.com";

export const metadata: Metadata = {
  icons: "/favicon.ico",
  metadataBase: new URL(siteUrl),
  title: {
    default: "Roco Kingdom Dex",
    template: "%s | Roco Kingdom Dex",
  },
  description: "探索洛克王国精灵图鉴，记录生态、进化与技能。",
  openGraph: {
    title: "Roco Kingdom Dex",
    description: "探索洛克王国精灵图鉴，记录生态、进化与技能。",
    url: "/",
    siteName: "Roco Kingdom Dex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roco Kingdom Dex",
    description: "探索洛克王国精灵图鉴，记录生态、进化与技能。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7F8ZWNEZEK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7F8ZWNEZEK');
                `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "v3ao233xyb");
          `}
        </Script>
      </head>
      <body
        className={`${spaceGrotesk.variable} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
