import type { Metadata } from "next";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Admin — Carla Montaño",
};

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <form action={login} className="w-full max-w-sm flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-1">Admin</p>
        <h1 className="font-display text-2xl mb-2">Iniciar sesión</h1>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white text-ink"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Contraseña</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white text-ink"
          />
        </label>

        {searchParams.error && (
          <p role="alert" className="text-clay text-sm">
            Email o contraseña incorrectos.
          </p>
        )}

        <button
          type="submit"
          className="font-body font-semibold text-[15px] px-7 py-3.5 rounded-[3px] bg-clay text-white hover:-translate-y-px transition-transform"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
