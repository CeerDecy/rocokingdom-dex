import fs from "node:fs/promises";
import path from "node:path";

import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n-config";
import { getSEOConfig } from "@/lib/seo";

const stripLineComments = (raw: string) =>
  raw.replace(/\/\/.*$/gm, (match, offset) => {
    const before = raw.slice(0, offset);
    let isString = false;
    let isEscape = false;
    for (let i = 0; i < before.length; i += 1) {
      const char = before[i];
      if (isEscape) {
        isEscape = false;
        continue;
      }
      if (char === "\\") {
        isEscape = true;
        continue;
      }
      if (char === '"') {
        isString = !isString;
      }
    }
    return isString ? match : "";
  });

const joinPath = (...parts: string[]) => {
  const cleaned = parts
    .map((part) => part.replace(/^\/|\/$/g, ""))
    .filter(Boolean);
  return `/${cleaned.join("/")}`;
};

async function getAttributes() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "attribute",
    "attributes.json",
  );
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(stripLineComments(raw)) as Record<string, unknown>;
}

async function getPets() {
  const filePath = path.join(process.cwd(), "public", "pets.json");
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as Record<string, unknown>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [attributes, pets] = await Promise.all([getAttributes(), getPets()]);
  const { baseUrl } = getSEOConfig();
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;
  const attributeKeys = Object.keys(attributes);
  const petKeys = Object.keys(pets);

  const entries: MetadataRoute.Sitemap = [];
  const addEntry = (pathName: string) => {
    entries.push({
      url: `${normalizedBaseUrl}${pathName}`,
    });
  };

  const addSection = (prefix = "") => {
    addEntry(joinPath(prefix));
    addEntry(joinPath(prefix, "dex"));
    addEntry(joinPath(prefix, "attribute"));
    attributeKeys.forEach((key) => {
      addEntry(joinPath(prefix, "attribute", key));
    });
    petKeys.forEach((key) => {
      addEntry(joinPath(prefix, "dex", key));
    });
  };

  addSection();
  locales.forEach((locale) => {
    addSection(locale);
  });

  return entries;
}
