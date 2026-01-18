import fs from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import DexClient from "@/components/DexClient";
import type { AttributeData, PetData } from "@/lib/dexTypes";
import { getMessage, loadMessages } from "@/lib/i18n-messages";
import { generateSEOData, getSEOConfig } from "@/lib/seo";

type DexPageProps = {
  params: Promise<{
    locale: string;
    name: string;
  }>;
  searchParams?: Promise<{
    attr?: string | string[];
  }>;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://rocokingdomdex.com";

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
  return Object.keys(pets).flatMap((name) => [
    { locale: "zh", name },
    { locale: "en", name },
  ]);
}

export async function generateMetadata({
  params,
}: DexPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const messages = await loadMessages(resolvedParams.locale);
  const pets = await getPets();
  const normalizedName = normalizeKey(String(resolvedParams?.name ?? ""));
  const petEntry = Object.entries(pets).find(
    ([key]) => normalizeKey(key) === normalizedName,
  );
  if (!petEntry) {
    return {
      title: getMessage(messages, "dex.metaNotFoundTitle", "精灵未找到"),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const [key, pet] = petEntry;
  const locale = resolvedParams.locale;
  const petName =
    locale === "en"
      ? (pet.name?.en ?? pet.name?.zh ?? "Unknown")
      : (pet.name?.zh ?? pet.name?.en ?? "精灵");
  const titleSuffix = getMessage(messages, "dex.metaTitle", "洛克王国图鉴档案");
  const title = `${petName} · ${titleSuffix}`;
  const description =
    locale === "en"
      ? (pet.introduction?.en ??
        pet.introduction?.zh ??
        getMessage(
          messages,
          "dex.metaDetailFallback",
          "查看该精灵的属性、生态分布与进化路径。",
        ))
      : (pet.introduction?.zh ??
        pet.introduction?.en ??
        getMessage(
          messages,
          "dex.metaDetailFallback",
          "查看该精灵的属性、生态分布与进化路径。",
        ));
  const imagePath = pet.image ? `/pets/${pet.image}` : "/pets/001.png";
  const seo = generateSEOData(
    locale,
    `/dex/${key}`,
    getSEOConfig(),
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
  const messages = await loadMessages(resolvedParams.locale);
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
    if (fallbackKey) redirect(`/${resolvedParams.locale}/dex/${fallbackKey}`);
    notFound();
  }

  const [activePet] = sortedPets.splice(activeIndex, 1);
  const petEntries = activePet ? [activePet, ...sortedPets] : sortedPets;
  const imagePath = activePet?.image
    ? `/pets/${activePet.image}`
    : "/pets/001.png";
  const fallbackDescription = getMessage(
    messages,
    "dex.metaDetailFallback",
    "查看该精灵的属性、生态分布与进化路径。",
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name:
      resolvedParams.locale === "en"
        ? (activePet?.name?.en ?? activePet?.name?.zh ?? "Unknown")
        : (activePet?.name?.zh ?? activePet?.name?.en ?? "精灵"),
    alternateName: activePet?.name?.en ?? undefined,
    description:
      resolvedParams.locale === "en"
        ? (activePet?.introduction?.en ??
          activePet?.introduction?.zh ??
          fallbackDescription)
        : (activePet?.introduction?.zh ??
          activePet?.introduction?.en ??
          fallbackDescription),
    image: new URL(imagePath, siteUrl).toString(),
    inLanguage: resolvedParams.locale === "en" ? "en-US" : "zh-CN",
    url: new URL(
      `/${resolvedParams.locale}/dex/${activePet?.key ?? ""}`,
      siteUrl,
    ).toString(),
    isPartOf: {
      "@type": "WebSite",
      name: getMessage(messages, "dex.metaSiteName", "Rocokindom Dex"),
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
        basePath={`/${resolvedParams.locale}/dex/${activePet?.key ?? "unknown"}`}
      />
    </>
  );
}
