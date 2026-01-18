import { Suspense } from "react";
import { notFound } from "next/navigation";

import HeaderBar from "@/components/HeaderBar";
import FooterBar from "@/components/FooterBar";
import { LanguageProvider } from "@/components/i18n/language-context";
import { locales, type Locale } from "@/lib/i18n-config";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <LanguageProvider initialLocale={locale as Locale}>
      <div className="flex min-h-screen flex-col">
        <Suspense fallback={<div className="h-14 w-full" />}>
          <HeaderBar />
        </Suspense>
        <div className="flex-1">{children}</div>
        <FooterBar />
      </div>
    </LanguageProvider>
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
