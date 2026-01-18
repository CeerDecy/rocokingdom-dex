import { LanguageProvider } from "@/components/i18n/language-context";
import type { Locale } from "@/lib/i18n-config";

type AttributeLayoutProps = {
  children: React.ReactNode;
};

export default function AttributeLayout({ children }: AttributeLayoutProps) {
  return (
    <LanguageProvider initialLocale={"zh" as Locale}>
      <div className="flex min-h-screen flex-col">{children}</div>
    </LanguageProvider>
  );
}
