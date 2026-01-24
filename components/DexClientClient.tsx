"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Shield, ShieldOff, Sword, Swords } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-context";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getClientMessage } from "@/lib/i18n-client";
import type {
  AttributeData,
  PetData,
  PetQualifications,
  QualificationKey,
} from "@/lib/dexTypes";

type PetEntry = PetData & { key: string };

type DexClientProps = {
  pets: PetEntry[];
  attributes: Record<string, AttributeData>;
  activeKey: string;
  activeFilter: string | null;
  basePath: string;
};

type AttributeBadge = {
  key: string;
  name: string;
  logoUrl: string;
};

type CreatureSummary = {
  id: string;
  name: string;
  title: string;
  rarity: string;
  habitat: string;
  attributes: AttributeBadge[];
  temperament: string;
  summary: string;
  image: string;
  evolutionPrev: string | null;
  evolutionPrevName: string;
  evolutionPrevKey: string;
  evolutionNext: string | null;
  evolutionNextName: string;
  evolutionNextKey: string;
  skills: string[];
};

const QUALIFICATION_MAX = 200;

const QUALIFICATION_ITEMS: Array<{
  key: QualificationKey;
  labelKey: string;
  fallback: string;
  icon: string;
  accent: string;
}> = [
  {
    key: "health",
    labelKey: "dex.qualificationHealth",
    fallback: "生命值",
    icon: "/qualifications/health.png",
    accent: "from-rose-400 to-rose-500",
  },
  {
    key: "physical_attack",
    labelKey: "dex.qualificationPhysicalAttack",
    fallback: "物理攻击",
    icon: "/qualifications/physical_attack.png",
    accent: "from-amber-400 to-amber-500",
  },
  {
    key: "magic_attack",
    labelKey: "dex.qualificationMagicAttack",
    fallback: "魔法攻击",
    icon: "/qualifications/magic_attack.png",
    accent: "from-indigo-400 to-indigo-500",
  },
  {
    key: "physical_defense",
    labelKey: "dex.qualificationPhysicalDefense",
    fallback: "物理防御",
    icon: "/qualifications/physical_defense.png",
    accent: "from-emerald-400 to-emerald-500",
  },
  {
    key: "magic_defense",
    labelKey: "dex.qualificationMagicDefense",
    fallback: "魔法防御",
    icon: "/qualifications/magic_defense.png",
    accent: "from-sky-400 to-sky-500",
  },
  {
    key: "speed",
    labelKey: "dex.qualificationSpeed",
    fallback: "速度",
    icon: "/qualifications/speed.png",
    accent: "from-fuchsia-400 to-fuchsia-500",
  },
];

const buildHref = (path: string, attr?: string | null) =>
  attr ? `${path}?attr=${encodeURIComponent(attr)}` : path;

const getAttributeSummary = (
  pet: PetEntry,
  attributes: Record<string, AttributeData>,
) => {
  return (pet.attributes ?? []).reduce<{
    strong: string[];
    resisted: string[];
    resist: string[];
    weak: string[];
  }>(
    (acc, key) => {
      const attribute = attributes[key];
      const offense = attribute?.battleMultiplier?.offense ?? {};
      const defense = attribute?.battleMultiplier?.defense ?? {};
      const offenseStrongTargets = offense["2.0"] ?? [];
      const offenseResistedTargets = offense["0.5"] ?? [];
      const defenseResistTargets = defense["0.5"] ?? [];
      const defenseWeakTargets = defense["2.0"] ?? [];
      offenseStrongTargets.forEach((target) => {
        if (!acc.strong.includes(target)) acc.strong.push(target);
      });
      offenseResistedTargets.forEach((target) => {
        if (!acc.resisted.includes(target)) acc.resisted.push(target);
      });
      defenseResistTargets.forEach((target) => {
        if (!acc.resist.includes(target)) acc.resist.push(target);
      });
      defenseWeakTargets.forEach((target) => {
        if (!acc.weak.includes(target)) acc.weak.push(target);
      });
      return acc;
    },
    { strong: [], resisted: [], resist: [], weak: [] },
  );
};

const buildCreatureSummary = (
  pet: PetEntry,
  pets: PetEntry[],
  attributes: Record<string, AttributeData>,
  locale: string,
  t: (key: string, fallback: string) => string,
): CreatureSummary => {
  const activeId = pet?.image?.split(".")[0] ?? "000";
  const attributeBadges: AttributeBadge[] =
    pet?.attributes?.map((attributeKey) => {
      const attribute = attributes[attributeKey];
      return {
        key: attributeKey,
        name:
          locale === "en"
            ? (attribute?.nameEn ?? attribute?.nameCn ?? attributeKey)
            : (attribute?.nameCn ?? attribute?.nameEn ?? attributeKey),
        logoUrl: attribute?.logoUrl ?? "",
      };
    }) ?? [];
  const activeEvolution = pet?.evolution ?? null;
  const activeDistribution = pet?.distribution ?? null;

  const prevPet = activeEvolution?.prev
    ? pets.find((entry) => entry.key === activeEvolution.prev)
    : null;
  const nextPet = activeEvolution?.next
    ? pets.find((entry) => entry.key === activeEvolution.next)
    : null;

  const name =
    locale === "en"
      ? (pet?.name?.en ?? pet?.name?.zh ?? t("dex.fallbackName", "Unknown"))
      : (pet?.name?.zh ?? pet?.name?.en ?? t("dex.fallbackName", "未知精灵"));
  const title =
    locale === "en"
      ? (pet?.name?.zh ?? pet?.name?.en ?? "")
      : (pet?.name?.en ?? pet?.name?.zh ?? "");
  const habitat =
    locale === "en"
      ? (activeDistribution?.en ??
        activeDistribution?.zh ??
        t("dex.unknownHabitat", "Habitat unknown"))
      : (activeDistribution?.zh ??
        activeDistribution?.en ??
        t("dex.unknownHabitat", "分布未知"));
  const temperament = activeEvolution?.level
    ? t("dex.evolutionLevel", "Lv.{level} 进化").replace(
        "{level}",
        String(activeEvolution.level),
      )
    : t("dex.evolutionEnd", "进化终点");
  const summary =
    locale === "en"
      ? (pet?.introduction?.en ??
        pet?.introduction?.zh ??
        t("dex.noSummary", "No profile summary yet."))
      : (pet?.introduction?.zh ??
        pet?.introduction?.en ??
        t("dex.noSummary", "暂无精灵档案说明。"));

  return {
    id: activeId,
    name,
    title,
    rarity: activeEvolution?.next
      ? t("dex.evolvable", "可进化")
      : t("dex.finalStage", "终阶"),
    habitat,
    attributes: attributeBadges,
    temperament,
    summary,
    image: pet?.image ? `/pets/${pet.image}` : "/pets/001.png",
    evolutionPrev: prevPet?.image ? `/pets/${prevPet.image}` : null,
    evolutionPrevName:
      locale === "en"
        ? (prevPet?.name?.en ?? prevPet?.name?.zh ?? "")
        : (prevPet?.name?.zh ?? prevPet?.name?.en ?? ""),
    evolutionPrevKey: prevPet?.key ?? "",
    evolutionNext: nextPet?.image ? `/pets/${nextPet.image}` : null,
    evolutionNextName:
      locale === "en"
        ? (nextPet?.name?.en ?? nextPet?.name?.zh ?? "")
        : (nextPet?.name?.zh ?? nextPet?.name?.en ?? ""),
    evolutionNextKey: nextPet?.key ?? "",
    skills: [],
  };
};

export default function DexClientClient({
  pets,
  attributes,
  activeKey,
  activeFilter,
  basePath,
}: DexClientProps) {
  const { locale, currentMessages } = useLanguage();
  const t = (key: string, fallback: string) =>
    getClientMessage(currentMessages, key, fallback);
  const fallbackPet: PetEntry = {
    key: "unknown",
    name: { zh: t("dex.fallbackName", "未知精灵"), en: "Unknown" },
    image: "001.png",
    attributes: [],
    introduction: { zh: t("dex.noSummary", "暂无精灵档案说明。") },
    evolution: null,
    distribution: null,
  };
  const [activeKeyState, setActiveKeyState] = useState(activeKey);
  const [isSwitching, setIsSwitching] = useState(false);
  const switchTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const filteredPets = useMemo(() => {
    if (!activeFilter) return pets;
    return pets.filter((pet) => pet.attributes?.includes(activeFilter));
  }, [activeFilter, pets]);

  useEffect(() => {
    setActiveKeyState(activeKey);
  }, [activeKey]);

  useEffect(() => {
    if (filteredPets.length === 0) return;
    if (filteredPets.some((pet) => pet.key === activeKeyState)) return;
    setActiveKeyState(filteredPets[0].key);
  }, [activeKeyState, filteredPets]);

  useEffect(() => {
    return () => {
      switchTimeouts.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const activePet =
    pets.find((pet) => pet.key === activeKeyState) ??
    filteredPets[0] ??
    pets[0] ??
    fallbackPet;
  const labelForPetName = (pet: PetEntry) =>
    locale === "en"
      ? (pet.name?.en ?? pet.name?.zh ?? t("dex.fallbackName", "Unknown"))
      : (pet.name?.zh ?? pet.name?.en ?? t("dex.fallbackName", "未知精灵"));
  const labelForPetSubtitle = (pet: PetEntry) =>
    locale === "en"
      ? (pet.name?.zh ?? pet.name?.en ?? "")
      : (pet.name?.en ?? "");
  const labelForAttribute = (
    attribute: AttributeData | undefined,
    key: string,
  ) =>
    locale === "en"
      ? (attribute?.nameEn ?? attribute?.nameCn ?? key)
      : (attribute?.nameCn ?? attribute?.nameEn ?? key);
  const formatMessage = (
    template: string,
    values: Record<string, string | number>,
  ) =>
    Object.entries(values).reduce(
      (acc, [key, value]) => acc.replace(`{${key}}`, String(value)),
      template,
    );
  const creature = useMemo(
    () => buildCreatureSummary(activePet, pets, attributes, locale, t),
    [activePet, attributes, locale, pets, t],
  );
  const attributeSummary = useMemo(
    () => getAttributeSummary(activePet, attributes),
    [activePet, attributes],
  );
  const qualificationItems = useMemo(() => {
    const qualifications: PetQualifications = activePet.qualifications ?? {};
    return QUALIFICATION_ITEMS.map((item) => {
      const rawValue = qualifications[item.key];
      const value =
        typeof rawValue === "number" && !Number.isNaN(rawValue) ? rawValue : 0;
      const cappedValue = Math.min(value, QUALIFICATION_MAX);
      const percentage =
        QUALIFICATION_MAX === 0 ? 0 : (cappedValue / QUALIFICATION_MAX) * 100;
      return {
        ...item,
        label: t(item.labelKey, item.fallback),
        value,
        cappedValue,
        percentage,
      };
    });
  }, [activePet.qualifications, t]);
  const filterItems = useMemo(
    () =>
      Object.entries(attributes).map(([key, attribute]) => {
        const nextFilter = activeFilter === key ? null : key;
        const title = labelForAttribute(attribute, key);
        const description =
          locale === "en"
            ? (attribute.nameCn ?? attribute.nameEn ?? "")
            : (attribute.nameEn ?? attribute.nameCn ?? "");
        return {
          title,
          description,
          icon: attribute.logoUrl ? (
            <img src={attribute.logoUrl} alt={title} className="h-6 w-6" />
          ) : (
            <span className="text-xs text-zinc-500">{title}</span>
          ),
          active: activeFilter === key,
          link: buildHref(basePath, nextFilter),
        };
      }),
    [activeFilter, attributes, basePath, locale],
  );
  const baseStatsValue = activePet.qualifications?.base_stats;
  const baseStatsLabel = formatMessage(
    t("dex.baseStats", "种族值 {value}"),
    {
      value: baseStatsValue ?? "--",
    },
  );
  const handlePetSwitch = (nextKey: string) => {
    if (nextKey === activeKeyState) return;
    switchTimeouts.current.forEach((timer) => clearTimeout(timer));
    setIsSwitching(true);
    switchTimeouts.current = [
      setTimeout(() => setActiveKeyState(nextKey), 160),
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
            className={`space-y-6 transition-all duration-300 ${
              isSwitching
                ? "translate-y-2 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-black/50">
              <span className="h-2 w-2 rounded-full bg-black/60" />
              {t("dex.heroBadge", "Dex Archive")}
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
              <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/50">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="flex items-center gap-2 px-1"
                    aria-label={t("dex.strongAgainst", "克制")}
                    title={t("dex.strongAgainst", "克制")}
                  >
                    <Sword className="h-3.5 w-3.5" />
                    <span>{t("dex.strongAgainst", "克制")}</span>
                  </span>
                  {attributeSummary.strong.length === 0 ? (
                    <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1">
                      {t("dex.none", "暂无")}
                    </span>
                  ) : (
                    attributeSummary.strong.map((key) => (
                      <span
                        key={`strong-${key}`}
                        className="flex h-7 w-7 items-center justify-center"
                        title={labelForAttribute(attributes[key], key)}
                      >
                        {attributes[key]?.logoUrl ? (
                          <img
                            src={attributes[key]?.logoUrl}
                            alt={labelForAttribute(attributes[key], key)}
                            className="h-4 w-4"
                          />
                        ) : (
                          <span className="text-[10px] text-emerald-700">
                            {labelForAttribute(attributes[key], key)}
                          </span>
                        )}
                      </span>
                    ))
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="flex items-center gap-2 px-1"
                    aria-label={t("dex.resistAgainst", "抵抗")}
                    title={t("dex.resistAgainst", "抵抗")}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>{t("dex.resistAgainst", "抵抗")}</span>
                  </span>
                  {attributeSummary.resist.length === 0 ? (
                    <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1">
                      {t("dex.none", "暂无")}
                    </span>
                  ) : (
                    attributeSummary.resist.map((key) => (
                      <span
                        key={`resist-${key}`}
                        className="flex h-7 w-7 items-center justify-center"
                        title={labelForAttribute(attributes[key], key)}
                      >
                        {attributes[key]?.logoUrl ? (
                          <img
                            src={attributes[key]?.logoUrl}
                            alt={labelForAttribute(attributes[key], key)}
                            className="h-4 w-4"
                          />
                        ) : (
                          <span className="text-[10px] text-sky-700">
                            {labelForAttribute(attributes[key], key)}
                          </span>
                        )}
                      </span>
                    ))
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="flex items-center gap-2 px-1"
                    aria-label={t("dex.weakAgainst", "被克制")}
                    title={t("dex.weakAgainst", "被克制")}
                  >
                    <Swords className="h-3.5 w-3.5" />
                    <span>{t("dex.weakAgainst", "被克制")}</span>
                  </span>
                  {attributeSummary.weak.length === 0 ? (
                    <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1">
                      {t("dex.none", "暂无")}
                    </span>
                  ) : (
                    attributeSummary.weak.map((key) => (
                      <span
                        key={`weak-${key}`}
                        className="flex h-7 w-7 items-center justify-center"
                        title={labelForAttribute(attributes[key], key)}
                      >
                        {attributes[key]?.logoUrl ? (
                          <img
                            src={attributes[key]?.logoUrl}
                            alt={labelForAttribute(attributes[key], key)}
                            className="h-4 w-4"
                          />
                        ) : (
                          <span className="text-[10px] text-rose-700">
                            {labelForAttribute(attributes[key], key)}
                          </span>
                        )}
                      </span>
                    ))
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="flex items-center gap-2 px-1"
                    aria-label={t("dex.resistedBy", "被抵抗")}
                    title={t("dex.resistedBy", "被抵抗")}
                  >
                    <ShieldOff className="h-3.5 w-3.5" />
                    <span>{t("dex.resistedBy", "被抵抗")}</span>
                  </span>
                  {attributeSummary.resisted.length === 0 ? (
                    <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1">
                      {t("dex.none", "暂无")}
                    </span>
                  ) : (
                    attributeSummary.resisted.map((key) => (
                      <span
                        key={`resisted-${key}`}
                        className="flex h-7 w-7 items-center justify-center"
                        title={labelForAttribute(attributes[key], key)}
                      >
                        {attributes[key]?.logoUrl ? (
                          <img
                            src={attributes[key]?.logoUrl}
                            alt={labelForAttribute(attributes[key], key)}
                            className="h-4 w-4"
                          />
                        ) : (
                          <span className="text-[10px] text-amber-700">
                            {labelForAttribute(attributes[key], key)}
                          </span>
                        )}
                      </span>
                    ))
                  )}
                </div>
              </div>
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
                      className={`group relative h-84 w-84 cursor-pointer transition duration-300 motion-reduce:transition-none hover:opacity-100 sm:h-84 sm:w-84 ${
                        isSwitching
                          ? "opacity-0 translate-y-2"
                          : "opacity-50 translate-y-0"
                      }`}
                      aria-label={formatMessage(
                        t("dex.viewEvolutionPrev", "查看{pet}"),
                        {
                          pet:
                            creature.evolutionPrevName ||
                            t("dex.evolutionPrevFallback", "进化前精灵"),
                        },
                      )}
                    >
                      <Image
                        src={creature.evolutionPrev}
                        alt={formatMessage(
                          t("dex.evolutionPrevAlt", "{pet} 进化前"),
                          {
                            pet:
                              creature.evolutionPrevName ||
                              t("dex.evolutionPrevFallback", "进化前精灵"),
                          },
                        )}
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
                      className={`group relative h-84 w-84 cursor-pointer transition duration-300 motion-reduce:transition-none hover:opacity-100 sm:h-84 sm:w-84 ${
                        isSwitching
                          ? "opacity-0 translate-y-2"
                          : "opacity-50 translate-y-0"
                      }`}
                      aria-label={formatMessage(
                        t("dex.viewEvolutionNext", "查看{pet}"),
                        {
                          pet:
                            creature.evolutionNextName ||
                            t("dex.evolutionNextFallback", "进化后精灵"),
                        },
                      )}
                    >
                      <Image
                        src={creature.evolutionNext}
                        alt={formatMessage(
                          t("dex.evolutionNextAlt", "{pet} 进化后"),
                          {
                            pet:
                              creature.evolutionNextName ||
                              t("dex.evolutionNextFallback", "进化后精灵"),
                          },
                        )}
                        fill
                        className="object-contain drop-shadow-[0_12px_22px_rgba(15,23,42,0.2)] transition duration-300 group-hover:scale-110"
                        sizes="144px"
                      />
                    </button>
                  ) : null}
                </div>
              ) : null}
              <CardContainer
                className="inter-var w-full"
                containerClassName="py-0"
              >
                <CardBody className="shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] border border-withe relative group/card w-full h-auto rounded-[36px] p-12  bg-gradient-to-br from-white via-white to-[#eef2ff] ">
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.85),rgba(255,255,255,0)_55%)] opacity-80" />
                  <div
                    className={`relative z-10 flex flex-col gap-6 transition-all duration-300 ${
                      isSwitching
                        ? "translate-y-2 opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
                  >
                    <CardItem
                      translateZ={20}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/50">
                        {t("dex.dexLabel", "Dex")} #{creature.id}
                      </div>
                      <div className="rounded-full border border-amber-200/80 bg-amber-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700">
                        {baseStatsLabel}
                      </div>
                    </CardItem>
                    <CardItem translateZ={20} className="flex flex-wrap gap-2">
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
                    </CardItem>

                    <CardItem
                      translateZ={100}
                      className="relative flex min-h-[320px] w-full items-center justify-center rounded-[28px]"
                    >
                      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
                      <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
                      <div className="relative z-10 h-[300px] w-full max-w-[520px]">
                        <Image
                          src={creature.image}
                          alt={formatMessage(
                            t("dex.petImageAlt", "{pet} 精灵"),
                            {
                              pet: creature.name,
                            },
                          )}
                          fill
                          className="object-contain scale-160 transition duration-300 "
                          sizes="600px"
                          priority
                        />
                      </div>
                    </CardItem>

                    <CardItem translateZ={30} className="w-full">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {qualificationItems.map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/60"
                          >
                            <div className="flex min-w-[64px] items-center gap-2">
                              <img
                                src={item.icon}
                                alt={item.label}
                                className="h-4 w-4 rounded-full border border-black/20 bg-black p-0.5"
                              />
                              <span className="truncate">{item.label}</span>
                            </div>
                            <div
                              className="h-2 flex-1 rounded-full bg-black/5"
                              role="progressbar"
                              aria-valuemin={0}
                              aria-valuemax={QUALIFICATION_MAX}
                              aria-valuenow={item.cappedValue}
                              aria-label={item.label}
                            >
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${item.accent}`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="min-w-[24px] text-right text-black/45">
                              {item.cappedValue}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-[0_22px_50px_-36px_rgba(16,24,40,0.45)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
                  {t("dex.collectionTitle", "精灵图鉴")}
                </div>
                <p className="text-sm text-black/70">
                  {t(
                    "dex.collectionSubtitle",
                    "选择精灵查看对应属性与档案摘要。",
                  )}
                </p>
              </div>
              <div className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/50">
                {formatMessage(t("dex.collectionCount", "{count} 只已收录"), {
                  count: filteredPets.length,
                })}
              </div>
            </div>
            <div className="mt-4 h-px w-full bg-black/5" />

            <ScrollArea
              className="mt-5 w-full"
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
                  {t("dex.emptyState", "暂无符合该属性的精灵")}
                </div>
              ) : (
                <>
                  {filteredPets.map((pet) => {
                    const petId = pet.image?.split(".")[0] ?? pet.key;
                    const petAttributes =
                      pet.attributes?.map(
                        (attributeKey) => attributes[attributeKey],
                      ) ?? [];
                    const isActive = pet.key === activeKeyState;
                    const petName = labelForPetName(pet);
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
                            alt={petName}
                            fill
                            className="object-contain"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                            {t("dex.dexLabel", "Dex")} #{petId}
                          </div>
                          <div className="text-sm font-semibold text-black">
                            {petName}
                          </div>
                          {labelForPetSubtitle(pet) ? (
                            <div className="text-xs text-black/45">
                              {labelForPetSubtitle(pet)}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          {petAttributes.map((attribute) =>
                            attribute?.logoUrl ? (
                              <img
                                key={attribute.nameEn}
                                src={attribute.logoUrl}
                                alt={labelForAttribute(
                                  attribute,
                                  attribute?.nameEn ??
                                    attribute?.nameCn ??
                                    "attribute",
                                )}
                                className="h-4 w-4"
                              />
                            ) : null,
                          )}
                        </div>
                      </button>
                    );
                  })}
                  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-black/15 bg-white/60 px-4 py-6 text-center">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/35">
                      {t("dex.comingSoonLabel", "Coming Soon")}
                    </div>
                    <div className="text-sm font-semibold text-black/70">
                      {t("dex.comingSoonItem", "精灵数据正在收集中 敬请期待")}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
