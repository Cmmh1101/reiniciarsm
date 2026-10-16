import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Analytics from "@/components/Analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LOCALES, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import "../globals.css";

// Staging deploys (Netlify branch / deploy previews) must not be indexed.
const isProduction = !process.env.CONTEXT || process.env.CONTEXT === "production";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carlamontano.io";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return {
    metadataBase: new URL(SITE_URL),
    robots: isProduction ? undefined : { index: false, follow: false },
    title: dict.home.meta.title,
    description: dict.home.meta.description,
    openGraph: {
      title: dict.home.meta.title,
      description: dict.home.meta.description,
      siteName: dict.site.name,
      locale: params.locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: dict.home.meta.title, description: dict.home.meta.description },
  };
}

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <Analytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-ink focus:text-paper focus:px-4 focus:py-2"
        >
          {dict.site.skipToContent}
        </a>
        <Header locale={locale} nav={dict.nav} siteName={dict.site.name} />
        <div id="main-content">{children}</div>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
