import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath, type RouteKey } from "@/lib/i18n/routes";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { LINKEDIN_URL, MONTANO_SYSTEMS_URL } from "@/lib/constants";

const EXPLORE: { route: RouteKey; label: keyof Dictionary["nav"] }[] = [
  { route: "home", label: "home" },
  { route: "about", label: "about" },
  { route: "workWithMe", label: "workWithMe" },
  { route: "work", label: "work" },
  { route: "shop", label: "shop" },
  { route: "resources", label: "resources" },
  { route: "contact", label: "contact" },
];

const SOCIAL = [
  { label: "LinkedIn", href: LINKEDIN_URL },
  { label: "YouTube", href: "https://www.youtube.com/@carlamontanotech" },
  { label: "Instagram", href: "https://www.instagram.com/carlamontanotech/" },
  { label: "TikTok", href: "https://www.tiktok.com/@carlamontanotech" },
];

const linkClass = "no-underline opacity-75 text-[13.5px] hover:opacity-100 transition-opacity";
const headingClass = "font-mono text-[10.5px] tracking-widest uppercase opacity-50 mb-3.5";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { nav, footer, site } = dict;
  return (
    <footer className="bg-ink text-paper px-[8vw] pt-14 pb-8">
      <div className="flex justify-between gap-10 flex-wrap pb-9 border-b border-[rgba(237,230,216,0.14)]">
        <div className="font-display text-xl max-w-[28ch]">
          {site.name}
          <br />
          <span className="font-mono text-[11px] opacity-50 leading-relaxed block mt-1">{site.descriptor}</span>
          <span className="font-body text-[13px] opacity-60 block mt-3">{site.tagline}</span>
        </div>
        <div className="flex gap-14 flex-wrap">
          <div>
            <h5 className={headingClass}>{footer.explore}</h5>
            <ul className="flex flex-col gap-2">
              {EXPLORE.map((item) => (
                <li key={item.route}>
                  <Link href={localizedPath(locale, item.route)} className={linkClass}>
                    {nav[item.label]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className={headingClass}>{footer.ventures}</h5>
            <ul className="flex flex-col gap-2">
              <li>
                <a href={MONTANO_SYSTEMS_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {footer.montanoSystems}
                </a>
              </li>
              <li>
                <Link href={localizedPath(locale, "ventures")} className={linkClass}>
                  {footer.acadetech}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, "nextYou")} className={linkClass}>
                  {footer.nextYou}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className={headingClass}>{footer.connect}</h5>
            <ul className="flex flex-col gap-2">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-6 flex justify-between font-mono text-[11px] opacity-50 flex-wrap gap-2.5">
        <span>{footer.rights}</span>
        <div className="flex gap-5">
          <Link href={localizedPath(locale, "privacy")} className="no-underline hover:opacity-100 transition-opacity">
            {footer.privacy}
          </Link>
          <Link href={localizedPath(locale, "terms")} className="no-underline hover:opacity-100 transition-opacity">
            {footer.terms}
          </Link>
          <span>carlamontano.io</span>
        </div>
      </div>
    </footer>
  );
}
