import fs from "node:fs/promises";
import path from "node:path";

import { notFound, redirect } from "next/navigation";

import DexClient from "@/components/DexClient";
import type { AttributeData, PetData } from "@/lib/dexTypes";

type DexPageProps = {
  params: Promise<{
    name: string;
  }>;
};

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

export async function generateStaticParams() {
  const pets = await getPets();
  return Object.keys(pets).map((name) => ({ name }));
}

export default async function DexDetailPage({ params }: DexPageProps) {
  const resolvedParams = await params;
  const pets = await getPets();
  const attributes = await getAttributes();
  const sortedPets = sortPets(pets);
  const normalizedName = String(resolvedParams?.name ?? "")
    .trim()
    .toLowerCase();
  const activeIndex = sortedPets.findIndex(
    (pet) => pet.key.toLowerCase() === normalizedName,
  );
  if (activeIndex === -1) {
    const fallbackKey = sortedPets[0]?.key;
    if (fallbackKey) redirect(`/dex/${fallbackKey}`);
    notFound();
  }

  const [activePet] = sortedPets.splice(activeIndex, 1);
  const petEntries = activePet ? [activePet, ...sortedPets] : sortedPets;

  return <DexClient pets={petEntries} attributes={attributes} />;
}
