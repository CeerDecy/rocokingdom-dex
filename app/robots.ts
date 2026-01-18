import type { MetadataRoute } from "next";

import { getSEOConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const { baseUrl } = getSEOConfig();
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${normalizedBaseUrl}/sitemap.xml`,
  };
}
