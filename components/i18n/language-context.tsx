"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import locales_en from "../../i18n/en.json";
import locales_zh from "../../i18n/zh.json";
import { locales, type Locale } from "@/lib/i18n-config";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  // eslint-disable-next-line
  currentMessages: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

type LanguageProviderProps = {
  children: React.ReactNode;
  initialLocale?: Locale;
};

export function LanguageProvider({
  children,
  initialLocale,
}: LanguageProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale ?? "en");
  // eslint-disable-next-line
  const [currentMessages, setCurrentMessages] = useState<any>(
    initialLocale === "zh" ? locales_zh : locales_en,
  );

  // 初始化语言
  useEffect(() => {
    if (initialLocale) {
      setLocale(initialLocale);
      return;
    }

    // 从 localStorage 获取保存的语言设置
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocale(savedLocale);
      return;
    }

    // 检测浏览器语言
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "zh") {
      setLocale("zh");
    } else {
      setLocale("en");
    }
  }, [initialLocale]);

  // 加载语言消息
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await import(`../../i18n/${locale}.json`);
        setCurrentMessages(messages.default);
      } catch (error) {
        console.error("Failed to load messages:", error);
        // 回退到英文
        try {
          const fallbackMessages = await import(`../../i18n/en.json`);
          setCurrentMessages(fallbackMessages.default);
        } catch (fallbackError) {
          console.error("Failed to load fallback messages:", fallbackError);
          // 最后的回退：使用空对象
          setCurrentMessages(locales_en);
        }
      }
    };

    loadMessages();
  }, [locale]);

  // 保存语言设置到 localStorage
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
  };

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale: handleSetLocale, currentMessages }}
    >
      <NextIntlClientProvider
        locale={locale}
        messages={currentMessages}
        timeZone="Asia/Shanghai"
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
