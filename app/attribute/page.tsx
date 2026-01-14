import fs from "node:fs/promises";
import path from "node:path";

import AttributeRing, { type AttributeItem } from "@/components/AttributeRing";

async function getAttributes() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "attribute",
    "attributes.json"
  );
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as Record<string, AttributeItem>;
}

export default async function AttributePage() {
  const attributes = await getAttributes();
  const attributeEntries = Object.values(attributes);
  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-[#101828]">
      <main className="relative mx-auto flex min-h-[calc(100vh-56px)] max-w-7xl items-center justify-center px-6 pb-0 pt-14">
        <AttributeRing attributes={attributeEntries} />
      </main>
    </div>
  );
}
