"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/i18n/language-context";
import { localeNames, locales } from "@/lib/i18n-config";

export default function HeaderBar() {
  const { locale, setLocale, currentMessages } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = (key: string, fallback: string) =>
    (currentMessages?.[key] as string) ?? fallback;
  const localePrefix = `/${locale}`;
  const searchSuffix = searchParams?.toString()
    ? `?${searchParams.toString()}`
    : "";

  const handleLocaleSwitch = (nextLocale: (typeof locales)[number]) => {
    if (nextLocale === locale) return;
    const nextPath = pathname.replace(/^\/(en|zh)(?=\/|$)/, "");
    const resolvedPath = nextPath === "" ? "/" : nextPath;
    setLocale(nextLocale);
    router.push(`/${nextLocale}${resolvedPath}${searchSuffix}`);
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            href={localePrefix}
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-black"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black">
              <div className="h-2 w-2 rounded-full bg-[#f8e16c]" />
            </div>
            Rocokindom Dex
          </Link>
          <div className="flex items-center gap-6 text-sm text-black/70">
            <Link
              href={`${localePrefix}/dex`}
              className="transition-colors hover:text-black"
            >
              {t("header.navDex", "图鉴")}
            </Link>
            <Link
              href={`${localePrefix}/attribute`}
              className="transition-colors hover:text-black"
            >
              {t("header.navAttribute", "属性克制")}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-black/10 bg-white/80 p-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/60">
            {locales.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLocaleSwitch(lang)}
                className={`rounded-full px-3 py-1 transition-colors ${
                  locale === lang
                    ? "bg-black text-white"
                    : "text-black/60 hover:text-black"
                }`}
                aria-pressed={locale === lang}
              >
                {localeNames[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
