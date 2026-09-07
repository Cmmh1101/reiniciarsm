"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CONTACT_STATUSES, STATUS_LABELS, type ContactWithSources } from "@/lib/contacts";

export default function ContactsTable({ contacts }: { contacts: ContactWithSources[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [tag, setTag] = useState("");

  const allSources = useMemo(() => [...new Set(contacts.flatMap((c) => c.sources))].sort(), [contacts]);
  const allTags = useMemo(() => [...new Set(contacts.flatMap((c) => c.tags))].sort(), [contacts]);

  const filtered = contacts.filter((c) => {
    if (status && c.status !== status) return false;
    if (source && !c.sources.includes(source)) return false;
    if (tag && !c.tags.includes(tag)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.email.toLowerCase().includes(q) && !(c.name ?? "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.15)] flex-1 min-w-[200px]"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.15)]">
          <option value="">Todos los estados</option>
          {CONTACT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value)} className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.15)]">
          <option value="">Todas las fuentes</option>
          {allSources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {allTags.length > 0 && (
          <select value={tag} onChange={(e) => setTag(e.target.value)} className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.15)]">
            <option value="">Todos los tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
      </div>

      <p className="text-xs opacity-50 mb-3">
        {filtered.length} de {contacts.length} contactos
      </p>

      {filtered.length === 0 ? (
        <p className="opacity-60">No hay contactos que coincidan.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Contacto</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Fuente</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Estado</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Desde</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-[rgba(20,25,43,0.08)]">
                <td className="py-3">
                  <Link href={`/admin/contactos/${c.id}`} className="hover:underline">
                    {c.name || c.email}
                  </Link>
                  <div className="text-xs opacity-60">{c.email}</div>
                </td>
                <td className="py-3 opacity-70">{c.sources.join(", ") || "—"}</td>
                <td className="py-3 opacity-70">{STATUS_LABELS[c.status as keyof typeof STATUS_LABELS] ?? c.status}</td>
                <td className="py-3 opacity-70">{new Date(c.created_at).toLocaleDateString("es")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
