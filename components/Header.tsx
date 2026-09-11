import Link from "next/link";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-[8vw] py-[18px] bg-[rgba(237,230,216,0.9)] backdrop-blur-[10px] border-b border-[rgba(20,25,43,0.12)]">
      <Link href="/" className="flex items-center gap-2.5 font-display font-semibold text-[17px]">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path
            d="M3 19 C 7 14, 6 8, 12 8 C 18 8, 15 15, 21 15"
            stroke="var(--clay)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="3" cy="19" r="1.6" fill="var(--ink)" />
          <circle cx="21" cy="15" r="1.6" fill="var(--clay)" />
        </svg>
        Carla Montaño
      </Link>
      <div className="hidden md:flex gap-7 font-mono text-[11.5px] tracking-wide uppercase">
        <Link href="/" className="opacity-65 hover:opacity-100 transition-opacity">
          Inicio
        </Link>
        <Link href="/blog" className="opacity-65 hover:opacity-100 transition-opacity">
          Recursos
        </Link>
        <Link href="/mentorias" className="opacity-65 hover:opacity-100 transition-opacity">
          Mentorías
        </Link>
        <Link href="/productos" className="opacity-65 hover:opacity-100 transition-opacity">
          Productos
        </Link>
        <Link href="/comunidad" className="opacity-65 hover:opacity-100 transition-opacity">
          Comunidad
        </Link>
        <Link href="/mi-historia" className="opacity-65 hover:opacity-100 transition-opacity">
          Sobre mí
        </Link>
        <Link href="/contacto" className="opacity-65 hover:opacity-100 transition-opacity">
          Contacto
        </Link>
      </div>
      <Link
        href="/diagnostico-next-you"
        className="font-mono text-xs tracking-wide uppercase px-[18px] py-2.5 rounded-[2px] bg-clay text-paper"
      >
        Diagnóstico gratis
      </Link>
    </nav>
  );
}
