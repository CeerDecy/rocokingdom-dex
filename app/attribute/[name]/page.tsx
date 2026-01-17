import fs from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";

import AttributeRing, { type AttributeItem } from "@/components/AttributeRing";

type AttributePageProps = {
  params: Promise<{
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

const baseMetadata: Metadata = {
  title: "洛克王国：世界 属性克制关系",
  description:
    "查看洛克王国属性克制关系，可在进攻与防守视角间切换并了解克制与弱势。",
};

function normalizeAttributeKey(name?: string) {
  if (!name || typeof name !== "string") return null;
  return name.toLowerCase();
}

export async function generateMetadata({
  params,
}: AttributePageProps): Promise<Metadata> {
  const { name } = await params;
  const attributes = await getAttributes();
  const normalizedKey = normalizeAttributeKey(name);
  const selected = normalizedKey ? attributes[normalizedKey] : undefined;

  if (!selected) {
    return baseMetadata;
  }

  const description =
    selected.description?.zh ?? baseMetadata.description ?? "";
  const title = `洛克王国：世界 ${selected.nameCn}属性克制关系`;

  return {
    ...baseMetadata,
    title,
    description,
  };
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
        <div className="space-y-3 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl mt-5">
            洛克王国：世界 属性克制关系
          </h1>
          <p className="text-sm text-black/60">
            点击或悬停属性，查看克制关系与说明。支持进攻/防守视角切换。
          </p>
        </div>
        <AttributeRing
          attributes={attributeEntries}
          key={selectedKey ?? "none"}
          initialSelectedKey={selectedKey}
        />
      </main>
    </div>
  );
}
