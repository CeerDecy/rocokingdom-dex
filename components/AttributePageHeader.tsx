"use client";

import { useLanguage } from "@/components/i18n/language-context";

export default function AttributePageHeader() {
  const { currentMessages } = useLanguage();
  const t = (key: string, fallback: string) =>
    (currentMessages?.[key] as string) ?? fallback;

  return (
    <div className="space-y-3 text-center">
      <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
        {t(
          "attribute.pageTitle",
          "洛克王国：世界 属性克制关系",
        )}
      </h1>
      <p className="text-sm text-black/60">
        {t(
          "attribute.pageSubtitle",
          "点击或悬停属性，查看克制关系与说明。支持进攻/防守视角切换。",
        )}
      </p>
    </div>
  );
}
