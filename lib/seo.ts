import { locales } from "@/lib/i18n-config";

export interface SEOConfig {
  baseUrl: string;
  defaultLocale: string;
  locales: string[];
}

export interface SEOData {
  canonical: string;
  alternates: {
    languages: Record<string, string>;
  };
}

export function generateSEOData(
  currentLang: string,
  currentPath: string,
  config: SEOConfig,
): SEOData {
  const { baseUrl, locales: supportedLocales } = config;

  let normalizedPath = currentPath;
  if (!normalizedPath.startsWith("/")) {
    normalizedPath = `/${normalizedPath}`;
  }

  const langRegex = new RegExp(`^/(${supportedLocales.join("|")})`);
  const hasLangPrefix = langRegex.test(normalizedPath);

  if (!hasLangPrefix) {
    normalizedPath = `/${currentLang}${
      normalizedPath === "/" ? "" : normalizedPath
    }`;
  }

  const basePath = normalizedPath.replace(langRegex, "") || "";
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  const canonical = `${normalizedBaseUrl}/${currentLang}${basePath}`;

  const languages: Record<string, string> = {};
  supportedLocales.forEach((locale) => {
    const altPath = `/${locale}${basePath}`;
    languages[locale] = `${normalizedBaseUrl}${altPath}`;
  });

  return {
    canonical,
    alternates: {
      languages,
    },
  };
}

export function getSEOConfig(): SEOConfig {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://www.rocokingdomdex.com";

  return {
    baseUrl,
    defaultLocale: "zh",
    locales: Array.from(locales),
  };
}
