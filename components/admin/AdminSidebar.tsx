import Link from "next/link";
import { logout } from "@/app/admin/(dashboard)/actions";
import AdminLanguageSwitcher from "@/components/admin/AdminLanguageSwitcher";
import { getAdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";

export default function AdminSidebar() {
  const locale = getAdminLocale();
  const { nav } = getAdminDictionary(locale);
  const links = [
    { href: "/admin", label: nav.dashboard },
    { href: "/admin/blog", label: nav.blog },
    { href: "/admin/contactos", label: nav.contacts },
    { href: "/admin/mentorias", label: nav.sessions },
    { href: "/admin/pagos", label: nav.payments },
    { href: "/admin/productos", label: nav.products },
    { href: "/admin/resenas", label: nav.reviews },
    { href: "/admin/newsletter", label: nav.newsletter },
    { href: "/admin/analytics", label: nav.analytics },
  ];

  return (
    <aside className="w-56 shrink-0 bg-ink text-paper min-h-screen px-6 py-8 flex flex-col gap-8">
      <div className="font-display text-lg">{nav.admin}</div>
      <nav className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wide">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="opacity-75 hover:opacity-100 transition-opacity">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-4">
        <AdminLanguageSwitcher locale={locale} />
        <form action={logout}>
          <button type="submit" className="font-mono text-xs uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity">
            {nav.signOut}
          </button>
        </form>
      </div>
    </aside>
  );
}
