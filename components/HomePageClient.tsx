"use client";

import clsx from "clsx";
import Link from "next/link";
import {
  BookOpen,
  Compass,
  Github,
  Layers,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";

import { useLanguage } from "@/components/i18n/language-context";
import { getClientMessage } from "@/lib/i18n-client";

export default function HomePageClient() {
  const { locale, currentMessages } = useLanguage();
  const t = (key: string, fallback: string) =>
    getClientMessage(currentMessages, key, fallback);
  const localePrefix = `/${locale}`;

  const featureCards = [
    {
      key: "dex",
      title: t("home.featureCards.dex.title", "精灵图鉴"),
      desc: t(
        "home.featureCards.dex.desc",
        "用清晰的档案结构记录栖息地、进化路径与技能亮点。",
      ),
      points: [
        t("home.featureCards.dex.point1", "生态分布速查"),
        t("home.featureCards.dex.point2", "进化链一览"),
        t("home.featureCards.dex.point3", "技能与天赋整理"),
      ],
      href: `${localePrefix}/dex`,
      action: t("home.featureCards.dex.action", "进入图鉴"),
      icon: BookOpen,
      toneStyle:
        "linear-gradient(135deg, rgba(254, 243, 199, 0.75) 0%, rgba(255, 255, 255, 0.95) 55%, rgba(255, 255, 255, 1) 100%)",
    },
    {
      key: "attribute",
      title: t("home.featureCards.attribute.title", "属性介绍"),
      desc: t(
        "home.featureCards.attribute.desc",
        "用直观关系网梳理属性克制，为队伍配置提供依据。",
      ),
      points: [
        t("home.featureCards.attribute.point1", "进攻/防守双视角"),
        t("home.featureCards.attribute.point2", "克制关系一键查看"),
        t("home.featureCards.attribute.point3", "战斗搭配建议"),
      ],
      href: `${localePrefix}/attribute`,
      action: t("home.featureCards.attribute.action", "查看属性"),
      icon: Layers,
      toneStyle:
        "linear-gradient(135deg, rgba(209, 250, 229, 0.75) 0%, rgba(255, 255, 255, 0.95) 55%, rgba(255, 255, 255, 1) 100%)",
    },
  ];

  const quickSteps = [
    {
      title: t("home.quickSteps.browse.title", "快速浏览"),
      desc: t(
        "home.quickSteps.browse.desc",
        "先从图鉴挑选目标精灵，查看生态与成长方向。",
      ),
      icon: Sparkles,
    },
    {
      title: t("home.quickSteps.understand.title", "理解属性"),
      desc: t(
        "home.quickSteps.understand.desc",
        "掌握克制关系，让阵容搭配更有依据。",
      ),
      icon: Layers,
    },
    {
      title: t("home.quickSteps.journey.title", "踏上旅程"),
      desc: t(
        "home.quickSteps.journey.desc",
        "收藏喜爱的精灵，构建个人训练者手册。",
      ),
      icon: Compass,
    },
  ];

  const communityChannels = [
    {
      key: "github",
      title: t("home.community.githubTitle", "Github"),
      desc: t(
        "home.community.githubDesc",
        "可以在 Github 提交问题、整理资料，或直接贡献内容。",
      ),
      icon: Github,
      href: "https://github.com/CeerDecy/rocokingdom-dex",
    },
    {
      key: "group",
      title: t("home.community.groupTitle", "交流群"),
      desc: t(
        "home.community.groupDesc",
        "也可以通过群进行交流和提交想法，当前仍在规划创建中。",
      ),
      icon: MessageCircleMore,
      href: "https://www.bilibili.com/video/BV1spQ6BnEc2/",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-slate-900">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-28 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-200/30 blur-[120px]" />

      <main className="relative mx-auto grid max-w-6xl gap-16 px-6 pb-20 pt-24">
        <section className="flex flex-col">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full border border-black/10 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-black/60">
              {t("home.badge", "Roco Kingdom Field Notes")}
            </span>
            <h1 className="font-display text-5xl tracking-[0.08em] text-black sm:text-6xl">
              {t("home.titleLine1", "洛克王国：世界")}
              <span className="block text-[#1f2937]">
                {t("home.titleLine2", "精灵知识中枢")}
              </span>
            </h1>
            <h2 className="max-w-xl text-base leading-7 text-black/70">
              {t(
                "home.description",
                "在这里快速了解精灵生态与战斗规则。本站提供「精灵图鉴」与「属性介绍」两大功能，帮你查资料、理清属性关系，随时建立自己的训练手册。",
              )}
            </h2>
            <p
              className={clsx([
                "bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-lg inline-flex w-fit",
                "dark:bg-linear-to-r dark:from-green-400 dark:via-teal-500 dark:to-cyan-500 dark:text-white",
                "text-sm mt-2 inline-block px-3 py-1 rounded-lg",
                "[&>span]:font-bold",
                "animate-pulse",
                "[animation-duration:2s]",
              ])}
            >
              {t("home.publicTestNote", "为洛克王国：世界公测随时做好准备")}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`${localePrefix}/dex`}
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/85"
              >
                {t("home.primaryCta", "进入精灵图鉴")}
                <BookOpen className="h-4 w-4" />
              </Link>
              <Link
                href={`${localePrefix}/attribute`}
                className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/80 px-6 py-3 text-sm font-semibold text-black transition-colors hover:border-black/40"
              >
                {t("home.secondaryCta", "查看属性介绍")}
                <Layers className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 border-t border-dashed border-black/15 pt-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                  {t("home.community.kicker", "Community")}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-black">
                  {t("home.community.title", "本站由社区维护")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  {t(
                    "home.community.description",
                    "任何人只要有想法，都可以通过 Github 提交问题、贡献内容，也可以通过群进行交流和提交想法。我们鼓励各位通过 Vibe Coding 的方式使用 AI 来进行代码贡献。",
                  )}
                </p>
              </div>
              <div className="min-w-0 border-l border-black/10 pl-5 sm:pl-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/40">
                  {t("home.community.channelLabel", "参与渠道")}
                </div>
                <div className="mt-3 divide-y divide-black/10">
                  {communityChannels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <div key={channel.key} className="py-4 first:pt-0 last:pb-0">
                        {channel.href ? (
                          <a
                            href={channel.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex gap-4 transition-colors"
                          >
                            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-black transition-colors group-hover:border-black/25 group-hover:bg-black group-hover:text-white">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-black underline-offset-4 group-hover:underline">
                                {channel.title}
                              </div>
                              <p className="mt-1 text-sm leading-6 text-black/70">
                                {channel.desc}
                              </p>
                            </div>
                          </a>
                        ) : (
                          <div className="flex gap-4">
                            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-black">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-black">
                                {channel.title}
                              </div>
                              <p className="mt-1 text-sm leading-6 text-black/70">
                                {channel.desc}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid w-full gap-4 sm:grid-cols-2">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.key}
                href={card.href}
                className="group relative block min-w-0 overflow-hidden rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(16,24,40,0.35)] transition-transform hover:-translate-y-1 will-change-transform"
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ backgroundImage: card.toneStyle }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                          {t("home.featureCards.moduleLabel", "Module")}{" "}
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="text-xl font-semibold text-black">
                          {card.title}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/60">
                      {card.action}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-black/70">
                    {card.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/55">
                    {card.points.map((point) => (
                      <span
                        key={point}
                        className="rounded-full border border-black/10 bg-white/80 px-3 py-1"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col">
            <h2 className="font-display text-4xl tracking-wide text-black">
              {t("home.steps.title", "三步开启你的图鉴计划")}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-black/70">
              {t(
                "home.steps.subtitle",
                "用轻量流程快速掌握核心信息，把探索效率交给我们。",
              )}
            </p>
            <div className="mt-4 rounded-[24px] border border-black/10 bg-white/85 p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-black/50">
                {t("home.steps.kicker", "Field Notes")}
              </div>
              <p className="mt-2 text-sm text-black/70">
                {t(
                  "home.steps.note",
                  "无论是准备挑战还是查找冷门精灵，都能在这里找到准确资料。",
                )}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-[22px] border border-black/10 bg-white/80 p-5 shadow-[0_18px_40px_-32px_rgba(16,24,40,0.45)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/45">
                      {t("home.steps.label", "Step")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-black">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
