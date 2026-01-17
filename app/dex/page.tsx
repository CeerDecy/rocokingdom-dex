import fs from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";

import DexClient from "@/components/DexClient";
import type { AttributeData, PetData } from "@/lib/dexTypes";

async function getPets() {
  const filePath = path.join(process.cwd(), "public", "pets.json");
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as Record<string, PetData>;
}

async function getAttributes() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "attribute",
    "attributes.json",
  );
  const raw = await fs.readFile(filePath, "utf8");
  const sanitized = raw.replace(/\/\/.*$/gm, (match, offset) => {
    const before = raw.slice(0, offset);
    const inString = (() => {
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
      return isString;
    })();
    return inString ? match : "";
  });
  return JSON.parse(sanitized) as Record<string, AttributeData>;
}

type DexPageProps = {
  searchParams?: Promise<{
    attr?: string | string[];
  }>;
};

const resolveFilter = (
  attr: string | string[] | undefined,
  attributes: Record<string, AttributeData>,
) => {
  if (!attr) return null;
  const value = Array.isArray(attr) ? attr[0] : attr;
  return attributes[value] ? value : null;
};

export async function generateMetadata({
  searchParams,
}: DexPageProps): Promise<Metadata> {
  const baseMetadata: Metadata = {
    title: "洛克王国图鉴档案",
    description: "浏览洛可王国精灵图鉴，快速查看属性、生态与进化信息。",
    alternates: {
      canonical: "/dex",
    },
    openGraph: {
      title: "洛克王国图鉴档案",
      description: "浏览洛可王国精灵图鉴，快速查看属性、生态与进化信息。",
      url: "/dex",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "洛克王国图鉴档案",
      description: "浏览洛可王国精灵图鉴，快速查看属性、生态与进化信息。",
    },
  };
  const attributes = await getAttributes();
  const resolvedSearchParams = await searchParams;
  const activeFilter = resolveFilter(resolvedSearchParams?.attr, attributes);
  if (!activeFilter) return baseMetadata;

  const attributeName = attributes[activeFilter]?.nameCn ?? activeFilter;
  const title = `${attributeName}属性 · 洛克王国图鉴档案`;
  const description = `查看${attributeName}属性精灵，筛选洛可王国图鉴中的生态、进化与技能。`;
  const canonical = `/dex?attr=${encodeURIComponent(activeFilter)}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DexPage({ searchParams }: DexPageProps) {
  const pets = await getPets();
  const attributes = await getAttributes();
  const resolvedSearchParams = await searchParams;
  const activeFilter = resolveFilter(resolvedSearchParams?.attr, attributes);
  const petEntries = Object.entries(pets)
    .map(([key, value]) => ({
      key,
      ...value,
    }))
    .sort((a, b) => {
      const aId = Number.parseInt(a.image?.split(".")[0] ?? "0", 10);
      const bId = Number.parseInt(b.image?.split(".")[0] ?? "0", 10);
      return aId - bId;
    });

  const filteredPets = activeFilter
    ? petEntries.filter((pet) => pet.attributes?.includes(activeFilter))
    : petEntries;
  const activeKey = filteredPets[0]?.key ?? petEntries[0]?.key ?? "unknown";
  return (
    <DexClient
      pets={petEntries}
      attributes={attributes}
      activeKey={activeKey}
      activeFilter={activeFilter}
      basePath="/dex"
    />
  );
}
