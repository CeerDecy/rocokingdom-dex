import fs from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";

import AttributePageHeader from "@/components/AttributePageHeader";
import AttributeRing, { type AttributeItem } from "@/components/AttributeRing";

type AttributePayload = Omit<AttributeItem, "key">;

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
  return JSON.parse(sanitized) as Record<string, AttributePayload>;
}

export const metadata: Metadata = {
  title: "洛克王国：世界 属性克制关系",
  description:
    "查看洛克王国属性克制关系，可在进攻与防守视角间切换并了解克制与弱势。",
};

export default async function AttributePage() {
  const attributes = await getAttributes();
  const attributeEntries = Object.entries(attributes).map(([key, value]) => ({
    key,
    ...value,
  }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-[#101828]">
      <main className="relative mx-auto flex min-h-[calc(100vh-56px)] max-w-7xl flex-col items-center justify-center gap-6 px-6 pt-14">
        <AttributePageHeader />
        <AttributeRing attributes={attributeEntries} />
      </main>
    </div>
  );
}
