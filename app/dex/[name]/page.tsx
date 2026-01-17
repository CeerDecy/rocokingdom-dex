import fs from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import DexClient from "@/components/DexClient";
import type { AttributeData, PetData } from "@/lib/dexTypes";

type DexPageProps = {
  params: Promise<{
    name: string;
  }>;
  searchParams?: Promise<{
    attr?: string | string[];
  }>;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://rocokingdom.net";

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

const sortPets = (pets: Record<string, PetData>) =>
  Object.entries(pets)
    .map(([key, value]) => ({
      key,
      ...value,
    }))
    .sort((a, b) => {
      const aId = Number.parseInt(a.image?.split(".")[0] ?? "0", 10);
      const bId = Number.parseInt(b.image?.split(".")[0] ?? "0", 10);
      return aId - bId;
    });

const normalizeKey = (value: string) => value.trim().toLowerCase();

const resolveFilter = (
  attr: string | string[] | undefined,
  attributes: Record<string, AttributeData>,
) => {
  if (!attr) return null;
  const value = Array.isArray(attr) ? attr[0] : attr;
  return attributes[value] ? value : null;
};

export async function generateStaticParams() {
  const pets = await getPets();
  return Object.keys(pets).map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: DexPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const pets = await getPets();
  const normalizedName = normalizeKey(String(resolvedParams?.name ?? ""));
  const petEntry = Object.entries(pets).find(
    ([key]) => normalizeKey(key) === normalizedName,
  );
  if (!petEntry) {
    return {
      title: "精灵未找到",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const [key, pet] = petEntry;
  const title = `${pet.name?.zh ?? "精灵"} · 洛克王国图鉴档案`;
  const description =
    pet.introduction?.zh ?? "查看该精灵的属性、生态分布与进化路径。";
  const imagePath = pet.image ? `/pets/${pet.image}` : "/pets/001.png";

  return {
    title,
    description,
    alternates: {
      canonical: `/dex/${key}`,
    },
    openGraph: {
      title,
      description,
      url: `/dex/${key}`,
      type: "article",
      images: [
        {
          url: imagePath,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imagePath],
    },
  };
}

export default async function DexDetailPage({
  params,
  searchParams,
}: DexPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const pets = await getPets();
  const attributes = await getAttributes();
  const activeFilter = resolveFilter(resolvedSearchParams?.attr, attributes);
  const sortedPets = sortPets(pets);
  const normalizedName = normalizeKey(String(resolvedParams?.name ?? ""));
  const activeIndex = sortedPets.findIndex(
    (pet) => normalizeKey(pet.key) === normalizedName,
  );
  if (activeIndex === -1) {
    const fallbackKey = sortedPets[0]?.key;
    if (fallbackKey) redirect(`/dex/${fallbackKey}`);
    notFound();
  }

  const [activePet] = sortedPets.splice(activeIndex, 1);
  const petEntries = activePet ? [activePet, ...sortedPets] : sortedPets;
  const imagePath = activePet?.image
    ? `/pets/${activePet.image}`
    : "/pets/001.png";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: activePet?.name?.zh ?? "精灵",
    alternateName: activePet?.name?.en ?? undefined,
    description:
      activePet?.introduction?.zh ?? "查看该精灵的属性、生态分布与进化路径。",
    image: new URL(imagePath, siteUrl).toString(),
    inLanguage: "zh-CN",
    url: new URL(`/dex/${activePet?.key ?? ""}`, siteUrl).toString(),
    isPartOf: {
      "@type": "WebSite",
      name: "Rocokindom Dex",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <DexClient
        pets={petEntries}
        attributes={attributes}
        activeKey={activePet?.key ?? petEntries[0]?.key ?? "unknown"}
        activeFilter={activeFilter}
        basePath={`/dex/${activePet?.key ?? "unknown"}`}
      />
    </>
  );
}
