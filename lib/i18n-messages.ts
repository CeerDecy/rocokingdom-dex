import { locales, type Locale } from "@/lib/i18n-config";

type MessageMap = Record<string, string>;

export async function loadMessages(locale: string): Promise<MessageMap> {
  const resolvedLocale = locales.includes(locale as Locale) ? locale : "en";
  try {
    const messages = await import(`../i18n/${resolvedLocale}.json`);
    return messages.default as MessageMap;
  } catch (error) {
    console.error("Failed to load messages:", error);
    const fallback = await import("../i18n/en.json");
    return fallback.default as MessageMap;
  }
}

export const getMessage = (
  messages: MessageMap | null | undefined,
  key: string,
  fallback: string,
) => (messages?.[key] as string) ?? fallback;
