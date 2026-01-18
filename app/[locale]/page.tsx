import type { Metadata } from "next";

import HomePageClient from "@/components/HomePageClient";
import { getMessage, loadMessages } from "@/lib/i18n-messages";
import { generateSEOData, getSEOConfig } from "@/lib/seo";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  const seo = generateSEOData(locale, "/", getSEOConfig());
  const title = getMessage(messages, "home.metaTitle", "洛克王国：世界");
  const description = getMessage(
    messages,
    "home.metaDescription",
    "探索洛克王国精灵图鉴，了解生态、进化与技能。",
  );

  return {
    title,
    description,
    alternates: {
      canonical: seo.canonical,
      languages: seo.alternates.languages,
    },
    openGraph: {
      title,
      description,
      url: seo.canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function HomePage() {
  return <HomePageClient />;
}
