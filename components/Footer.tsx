import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper px-[8vw] pt-14 pb-8">
      <div className="flex justify-between gap-10 flex-wrap pb-9 border-b border-[rgba(237,230,216,0.14)]">
        <div className="font-display text-xl">
          Carla Montaño
          <br />
          <span className="font-mono text-[11px] opacity-50">Reiniciar Sin Mapa · Next You™</span>
        </div>
        <div className="flex gap-14 flex-wrap">
          <div>
            <h5 className="font-mono text-[10.5px] tracking-widest uppercase opacity-50 mb-3.5">Explorar</h5>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/" className="no-underline opacity-75 text-[13.5px]">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="no-underline opacity-75 text-[13.5px]">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="/mentorias" className="no-underline opacity-75 text-[13.5px]">
                  Mentorías
                </Link>
              </li>
              <li>
                <Link href="/mi-historia" className="no-underline opacity-75 text-[13.5px]">
                  Sobre mí
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-[10.5px] tracking-widest uppercase opacity-50 mb-3.5">Conecta</h5>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="no-underline opacity-75 text-[13.5px]">
                  YouTube
                </a>
              </li>
              <li>
                <a href="#" className="no-underline opacity-75 text-[13.5px]">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="no-underline opacity-75 text-[13.5px]">
                  TikTok
                </a>
              </li>
              <li>
                <a href="#" className="no-underline opacity-75 text-[13.5px]">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-6 flex justify-between font-mono text-[11px] opacity-50 flex-wrap gap-2.5">
        <span>© 2026 Carla Montaño — Reiniciar Sin Mapa</span>
        <span>carlamontano.io</span>
      </div>
    </footer>
  );
}
