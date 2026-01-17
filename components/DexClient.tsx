"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import DexCornerCards from "@/components/DexCornerCards";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { AttributeData, PetData } from "@/lib/dexTypes";

type PetEntry = PetData & { key: string };

type DexClientProps = {
  pets: PetEntry[];
  attributes: Record<string, AttributeData>;
};

type AttributeBadge = {
  key: string;
  name: string;
  logoUrl: string;
};

const getAttributeSummary = (
  pet: PetEntry,
  attributes: Record<string, AttributeData>,
) => {
  return (pet.attributes ?? []).reduce<{
    weak: string[];
    strong: string[];
  }>(
    (acc, key) => {
      const attribute = attributes[key];
      const offense = attribute?.battleMultiplier?.offense ?? {};
      const defense = attribute?.battleMultiplier?.defense ?? {};
      const weakTargets = [
        ...(offense["0.5"] ?? []),
        ...(defense["2.0"] ?? []),
      ];
      const strongTargets = [
        ...(offense["2.0"] ?? []),
        ...(defense["0.5"] ?? []),
      ];
      weakTargets.forEach((target) => {
        if (!acc.weak.includes(target)) acc.weak.push(target);
      });
      strongTargets.forEach((target) => {
        if (!acc.strong.includes(target)) acc.strong.push(target);
      });
      return acc;
    },
    { weak: [], strong: [] },
  );
};

export default function DexClient({ pets, attributes }: DexClientProps) {
  const fallbackPet: PetEntry = {
    key: "unknown",
    name: { zh: "未知精灵", en: "Unknown" },
    image: "001.png",
    attributes: [],
    introduction: { zh: "暂无精灵档案说明。" },
    evolution: null,
    distribution: null,
  };
  const [activeKey, setActiveKey] = useState(pets[0]?.key ?? fallbackPet.key);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const switchTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activePet =
    pets.find((pet) => pet.key === activeKey) ?? pets[0] ?? fallbackPet;

  const creature = useMemo(() => {
    const activeId = activePet?.image?.split(".")[0] ?? "000";
    const attributeBadges: AttributeBadge[] =
      activePet?.attributes?.map((attributeKey) => {
        const attribute = attributes[attributeKey];
        return {
          key: attributeKey,
          name: attribute?.nameCn ?? attributeKey,
          logoUrl: attribute?.logoUrl ?? "",
        };
      }) ?? [];
    const activeEvolution = activePet?.evolution ?? null;
    const activeDistribution = activePet?.distribution ?? null;

    const prevPet = activeEvolution?.prev
      ? pets.find((pet) => pet.key === activeEvolution.prev)
      : null;
    const nextPet = activeEvolution?.next
      ? pets.find((pet) => pet.key === activeEvolution.next)
      : null;

    return {
      id: activeId,
      name: activePet?.name?.zh ?? "未知精灵",
      title: activePet?.name?.en ?? "Unknown",
      rarity: activeEvolution?.next ? "可进化" : "终阶",
      habitat: activeDistribution?.zh ?? "分布未知",
      attributes: attributeBadges,
      temperament: activeEvolution?.level
        ? `Lv.${activeEvolution.level} 进化`
        : "进化终点",
      summary: activePet?.introduction?.zh ?? "暂无精灵档案说明。",
      image: activePet?.image ? `/pets/${activePet.image}` : "/pets/001.png",
      evolutionPrev: prevPet?.image ? `/pets/${prevPet.image}` : null,
      evolutionPrevName: prevPet?.name?.zh ?? "",
      evolutionPrevKey: prevPet?.key ?? "",
      evolutionNext: nextPet?.image ? `/pets/${nextPet.image}` : null,
      evolutionNextName: nextPet?.name?.zh ?? "",
      evolutionNextKey: nextPet?.key ?? "",
      skills: [] as string[],
    };
  }, [activePet, attributes, pets]);

  const attributeSummary = useMemo(
    () => getAttributeSummary(activePet, attributes),
    [activePet, attributes],
  );
  const filteredPets = useMemo(() => {
    if (!activeFilter) return pets;
    return pets.filter((pet) => pet.attributes?.includes(activeFilter));
  }, [activeFilter, pets]);

  const filterItems = useMemo(
    () =>
      Object.entries(attributes).map(([key, attribute]) => ({
        title: attribute.nameCn ?? key,
        description: attribute.nameEn ?? "",
        icon: attribute.logoUrl ? (
          <img
            src={attribute.logoUrl}
            alt={attribute.nameCn ?? key}
            className="h-6 w-6"
          />
        ) : (
          <span className="text-xs text-zinc-500">
            {attribute.nameCn ?? key}
          </span>
        ),
        active: activeFilter === key,
        onClick: () => setActiveFilter((prev) => (prev === key ? null : key)),
      })),
    [attributes, activeFilter],
  );

  useEffect(() => {
    return () => {
      switchTimeouts.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (filteredPets.length === 0) return;
    if (filteredPets.some((pet) => pet.key === activeKey)) return;
    setActiveKey(filteredPets[0].key);
  }, [activeKey, filteredPets]);

  const handlePetSwitch = (nextKey: string) => {
    if (nextKey === activeKey) return;
    switchTimeouts.current.forEach((timer) => clearTimeout(timer));
    setIsSwitching(true);
    switchTimeouts.current = [
      setTimeout(() => setActiveKey(nextKey), 160),
      setTimeout(() => setIsSwitching(false), 320),
    ];
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-[#0f172a]">
      <div className="pointer-events-none absolute -right-24 top-10 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(236,253,245,0.9),rgba(236,253,245,0))] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 left-6 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(224,231,255,0.7),rgba(224,231,255,0))] blur-2xl" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-24">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div
            className={`space-y-6 transition-all duration-300 ${isSwitching ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-black/50">
              <span className="h-2 w-2 rounded-full bg-black/60" />
              Dex Archive
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <h1 className="font-display text-5xl font-semibold tracking-tight text-black sm:text-6xl">
                    {creature.name}
                  </h1>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/45">
                    {creature.title}
                  </p>
                </div>
                <div className="text-right text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                  {creature.habitat}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
                {creature.attributes.map((attribute) => (
                  <span
                    key={attribute.key}
                    className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-black/60"
                  >
                    {attribute.logoUrl ? (
                      <img
                        src={attribute.logoUrl}
                        alt={attribute.name}
                        className="h-3.5 w-3.5"
                      />
                    ) : null}
                    <span>{attribute.name}</span>
                  </span>
                ))}
                <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1">
                  {creature.temperament}
                </span>
              </div>
              <p className="max-w-xl text-base text-black/70">
                {creature.summary}
              </p>
              {creature.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                  {creature.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/10 bg-white/80 px-3 py-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "生态区域", value: "12 个" },
                { label: "记录精灵", value: "228 只" },
                { label: "监测事件", value: "64 组" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-black/10 bg-white/85 px-4 py-4 shadow-[0_16px_40px_-30px_rgba(16,24,40,0.4)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
                    {item.label}
                  </p>
                  <p className="mt-2 font-display text-2xl text-black">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
              {["属性联结", "生态标签", "进化路径", "技能观察", "风纹图谱"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/10 bg-white/80 px-3 py-1"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[520px]">
              {creature.evolutionPrev || creature.evolutionNext ? (
                <div className="absolute right-0 top-1/2 z-0 flex -translate-y-1/2 translate-x-[calc(100%+16px)] flex-col items-center gap-6">
                  {creature.evolutionPrev ? (
                    <button
                      type="button"
                      onClick={() => handlePetSwitch(creature.evolutionPrevKey)}
                      className="group relative h-84 w-84 opacity-50 transition duration-300 hover:opacity-100 sm:h-84 sm:w-84 cursor-pointer"
                      aria-label={`查看${creature.evolutionPrevName || "进化前精灵"}`}
                    >
                      <Image
                        src={creature.evolutionPrev}
                        alt={`${creature.evolutionPrevName || "进化前精灵"} 进化前`}
                        fill
                        className="object-contain drop-shadow-[0_12px_22px_rgba(15,23,42,0.2)] transition duration-300 group-hover:scale-110"
                        sizes="144px"
                      />
                    </button>
                  ) : null}
                  {creature.evolutionNext ? (
                    <button
                      type="button"
                      onClick={() => handlePetSwitch(creature.evolutionNextKey)}
                      className="group relative h-84 w-84 opacity-50 transition duration-300 hover:opacity-100 sm:h-84 sm:w-84 cursor-pointer"
                      aria-label={`查看${creature.evolutionNextName || "进化后精灵"}`}
                    >
                      <Image
                        src={creature.evolutionNext}
                        alt={`${creature.evolutionNextName || "进化后精灵"} 进化后`}
                        fill
                        className="object-contain drop-shadow-[0_12px_22px_rgba(15,23,42,0.2)] transition duration-300 group-hover:scale-110"
                        sizes="144px"
                      />
                    </button>
                  ) : null}
                </div>
              ) : null}
              <DexCornerCards
                className="relative z-10 w-full max-w-[480px] mx-auto"
                cardClassName="rounded-[36px] border border-white/60 bg-gradient-to-br from-white via-white to-[#eef2ff] p-10 shadow-[0_25px_55px_-45px_rgba(15,23,42,0.5)]"
              >
                <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.85),rgba(255,255,255,0)_55%)] opacity-80" />
                <div
                  className={`relative z-10 flex flex-col gap-6 transition-all duration-300 ${isSwitching ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/50">
                      Dex #{creature.id}
                    </div>
                    <div className="rounded-full border border-amber-200/80 bg-amber-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700">
                      {creature.rarity}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {creature.attributes.map((attribute) => (
                      <span
                        key={attribute.key}
                        className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/60"
                      >
                        {attribute.logoUrl ? (
                          <img
                            src={attribute.logoUrl}
                            alt={attribute.name}
                            className="h-3.5 w-3.5"
                          />
                        ) : null}
                        <span>{attribute.name}</span>
                      </span>
                    ))}
                  </div>

                  <div className="relative flex min-h-[320px] items-center justify-center rounded-[28px]">
                    <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
                    <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
                    <div className="relative z-10 h-[300px] w-[600px] drop-shadow-[0_20px_35px_rgba(15,23,42,0.25)]">
                      <Image
                        src={creature.image}
                        alt={`${creature.name} 精灵`}
                        fill
                        className="object-contain scale-160"
                        sizes="600px"
                        priority
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/50">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-1">克制</span>
                      {attributeSummary.strong.length === 0 ? (
                        <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1">
                          暂无
                        </span>
                      ) : (
                        attributeSummary.strong.map((key) => (
                          <span
                            key={`strong-${key}`}
                            className="flex h-7 w-7 items-center justify-center"
                            title={attributes[key]?.nameCn ?? key}
                          >
                            {attributes[key]?.logoUrl ? (
                              <img
                                src={attributes[key]?.logoUrl}
                                alt={attributes[key]?.nameCn ?? key}
                                className="h-4 w-4"
                              />
                            ) : (
                              <span className="text-[10px] text-emerald-700">
                                {attributes[key]?.nameCn ?? key}
                              </span>
                            )}
                          </span>
                        ))
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-1">被克</span>
                      {attributeSummary.weak.length === 0 ? (
                        <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1">
                          暂无
                        </span>
                      ) : (
                        attributeSummary.weak.map((key) => (
                          <span
                            key={`weak-${key}`}
                            className="flex h-7 w-7 items-center justify-center"
                            title={attributes[key]?.nameCn ?? key}
                          >
                            {attributes[key]?.logoUrl ? (
                              <img
                                src={attributes[key]?.logoUrl}
                                alt={attributes[key]?.nameCn ?? key}
                                className="h-4 w-4"
                              />
                            ) : (
                              <span className="text-[10px] text-rose-700">
                                {attributes[key]?.nameCn ?? key}
                              </span>
                            )}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </DexCornerCards>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-[0_22px_50px_-36px_rgba(16,24,40,0.45)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
                  精灵图鉴
                </div>
                <p className="text-sm text-black/70">
                  选择精灵查看对应属性与档案摘要。
                </p>
              </div>
              <div className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/50">
                {filteredPets.length} 只已收录
              </div>
            </div>
            <div className="mt-4 h-px w-full bg-black/5" />

            <ScrollArea
              className="w-full mt-5"
              scrollbar="horizontal"
              hideScrollbar
            >
              <div className="px-2 py-2">
                <HoverEffect
                  items={filterItems}
                  variant="filter"
                  className="w-max flex-nowrap gap-3 pr-4"
                />
              </div>
            </ScrollArea>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
              {filteredPets.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-black/10 bg-white/70 px-4 py-6 text-center text-sm text-black/60">
                  暂无符合该属性的精灵
                </div>
              ) : (
                filteredPets.map((pet) => {
                  const petId = pet.image?.split(".")[0] ?? pet.key;
                  const petAttributes =
                    pet.attributes?.map(
                      (attributeKey) => attributes[attributeKey],
                    ) ?? [];
                  const isActive = pet.key === activePet?.key;
                  return (
                    <button
                      key={pet.key}
                      type="button"
                      onClick={() => handlePetSwitch(pet.key)}
                      className={`flex flex-col items-center gap-3 rounded-2xl border px-3 py-4 text-center transition-colors ${
                        isActive
                          ? "border-black/30 bg-white shadow-[0_18px_40px_-32px_rgba(16,24,40,0.4)]"
                          : "border-black/10 bg-white/70 hover:border-black/20"
                      }`}
                      aria-pressed={isActive}
                    >
                      <div className="relative h-16 w-16">
                        <Image
                          src={`/pets/${pet.image}`}
                          alt={pet.name.zh}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                          Dex #{petId}
                        </div>
                        <div className="text-sm font-semibold text-black">
                          {pet.name.zh}
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        {petAttributes.map((attribute) =>
                          attribute?.logoUrl ? (
                            <img
                              key={attribute.nameEn}
                              src={attribute.logoUrl}
                              alt={attribute.nameCn}
                              className="h-4 w-4"
                            />
                          ) : null,
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
