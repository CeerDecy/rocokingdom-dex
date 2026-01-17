import fs from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";

import AttributePageHeader from "@/components/AttributePageHeader";
import AttributeRing, { type AttributeItem } from "@/components/AttributeRing";

type AttributePageProps = {
  params: Promise<{
    locale: string;
    name?: string;
  }>;
};

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
  return JSON.parse(sanitized) as Record<string, AttributeItem>;
}

function normalizeAttributeKey(name?: string) {
  if (!name || typeof name !== "string") return null;
  return name.toLowerCase();
}

export async function generateMetadata({
  params,
}: AttributePageProps): Promise<Metadata> {
  const { name, locale } = await params;
  const attributes = await getAttributes();
  const normalizedKey = normalizeAttributeKey(name);
  const selected = normalizedKey ? attributes[normalizedKey] : undefined;

  if (!selected) {
    if (locale === "en") {
      return {
        title: "Rocokindom World: Attribute Matchups",
        description:
          "View attribute matchups in Rocokindom World and switch between offense and defense perspectives.",
      };
    }

    return {
      title: "洛克王国：世界 属性克制关系",
      description:
        "查看洛克王国属性克制关系，可在进攻与防守视角间切换并了解克制与弱势。",
    };
  }

  if (locale === "en") {
    const description =
      selected.description?.en ??
      "View attribute matchups in Rocokindom World.";
    return {
      title: `Rocokindom World: ${selected.nameEn} Matchups`,
      description,
    };
  }

  const description =
    selected.description?.zh ??
    "查看洛克王国属性克制关系，可在进攻与防守视角间切换并了解克制与弱势。";
  const title = `洛克王国：世界 ${selected.nameCn}属性克制关系`;

  return {
    title,
    description,
  };
}

export async function generateStaticParams() {
  const attributes = await getAttributes();
  return Object.keys(attributes).flatMap((name) => [
    { locale: "zh", name },
    { locale: "en", name },
  ]);
}

export default async function AttributeDetailPage({
  params,
}: AttributePageProps) {
  const { name } = await params;
  const attributes = await getAttributes();
  const attributeEntries = Object.entries(attributes).map(([key, value]) => ({
    key,
    ...value,
  }));
  const normalizedKey = normalizeAttributeKey(name);
  const selectedKey =
    normalizedKey && attributes[normalizedKey] ? normalizedKey : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-[#101828]">
      <main className="relative mx-auto flex min-h-[calc(100vh-56px)] max-w-7xl flex-col items-center justify-center gap-6 px-6 pt-14">
        <AttributePageHeader />
        <AttributeRing
          attributes={attributeEntries}
          key={selectedKey ?? "none"}
          initialSelectedKey={selectedKey}
        />
      </main>
    </div>
  );
}
