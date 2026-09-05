import Link from "next/link";
import { logout } from "@/app/admin/(dashboard)/actions";

export default function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 bg-ink text-paper min-h-screen px-6 py-8 flex flex-col gap-8">
      <div className="font-display text-lg">Admin</div>
      <nav className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wide">
        <Link href="/admin" className="opacity-75 hover:opacity-100 transition-opacity">
          Dashboard
        </Link>
        <Link href="/admin/blog" className="opacity-75 hover:opacity-100 transition-opacity">
          Blog
        </Link>
      </nav>
      <form action={logout} className="mt-auto">
        <button type="submit" className="font-mono text-xs uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity">
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
