"use client";

import { Github, MessageCircle } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-context";
import { getClientMessage } from "@/lib/i18n-client";

export default function FooterBar() {
  const { locale, currentMessages } = useLanguage();
  const t = (key: string, fallback: string) =>
    getClientMessage(currentMessages, key, fallback);
  const localePrefix = `/${locale}`;

  return (
    <footer className="border-t border-black/10 px-6 py-12 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-12 md:flex-row">
        <div>
          <a
            href={localePrefix}
            className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900"
          >
            <span className="h-3.5 w-3.5 rounded-full bg-slate-900" />
            {t("footer.brandName", "Roco Kingdom Dex")}
          </a>
          <p className="text-sm text-slate-600">
            {t("footer.noticePrefix", "本站点所有素材资源都来自")}
            <a
              href="https://rocom.qq.com/"
              className="underline decoration-black/30 underline-offset-4 hover:decoration-black/60"
            >
              {t("footer.noticeLinkText", "@洛克王国:世界 官方")}
            </a>
            {t("footer.noticeAndWeb", "和网络，")}
            <span className="block">
              {t(
                "footer.noticeSuffix",
                "本站作为第三方只做信息的收集以帮助用户更好体验游戏！",
              )}
            </span>
          </p>
          <p className="text-sm text-slate-600">
            {t("footer.noticeContact", "如有侵权请联系我们。")}
          </p>
        </div>

        <div className="grid gap-10 text-sm sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <span className="font-medium text-slate-900">
              {t("footer.productTitle", "Product")}
            </span>
            <a
              href={`${localePrefix}/dex`}
              className="text-slate-600 transition-colors hover:text-slate-900"
            >
              {t("footer.productDex", "Dex")}
            </a>
            <a
              href={`${localePrefix}/attribute`}
              className="text-slate-600 transition-colors hover:text-slate-900"
            >
              {t("footer.productAttributes", "Attributes")}
            </a>
            <a
              href={localePrefix}
              className="text-slate-600 transition-colors hover:text-slate-900"
            >
              {t("footer.productHome", "Home")}
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-medium text-slate-900">
              {t("footer.communityTitle", "Community")}
            </span>
            <a
              href="mailto:ceerdecy@gmail.com?subject=Feedback"
              className="text-slate-600 transition-colors hover:text-slate-900"
            >
              {t("footer.communityFeedback", "Feedback")}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 border-t border-black/10 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>
          {t(
            "footer.copyright",
            "© 2025 Roco Kingdom Dex. Developed by @CeerDecy",
          )}
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/ceerdecy"
            aria-label={t("footer.githubLabel", "GitHub")}
            className="text-slate-500 transition-colors hover:text-slate-900"
          >
            <Github size={18} strokeWidth={1.5} />
          </a>
          <a
            href="mailto:ceerdecy@gmail.com?subject=Feedback&body=Hello"
            aria-label={t("footer.messageLabel", "Message")}
            className="text-slate-500 transition-colors hover:text-slate-900"
          >
            <MessageCircle size={18} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
}
