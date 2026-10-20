"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CONTACT_STATUSES, type ContactWithSources } from "@/lib/contacts";
import { useAdminI18n } from "@/components/admin/AdminI18n";
import { fmt } from "@/lib/admin/dictionary";

export default function ContactsTable({ contacts }: { contacts: ContactWithSources[] }) {
  const { locale, t: all } = useAdminI18n();
  const t = all.contacts;
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
          placeholder={t.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.15)] flex-1 min-w-[200px]"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.15)]">
          <option value="">{t.allStatuses}</option>
          {CONTACT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {t.statuses[s] ?? s}
            </option>
          ))}
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value)} className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.15)]">
          <option value="">{t.allSources}</option>
          {allSources.map((s) => (
            <option key={s} value={s}>
              {t.sources[s] ?? s}
            </option>
          ))}
        </select>
        {allTags.length > 0 && (
          <select value={tag} onChange={(e) => setTag(e.target.value)} className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.15)]">
            <option value="">{t.allTags}</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
      </div>

      <p className="text-xs opacity-70 mb-3">
        {fmt(t.count, { shown: filtered.length, total: contacts.length })}
      </p>

      {filtered.length === 0 ? (
        <p className="opacity-70">{t.noMatch}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.contact}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.language}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.source}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.status}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.since}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-[rgba(20,25,43,0.08)]">
                <td className="py-3">
                  <Link href={`/admin/contactos/${c.id}`} className="hover:underline">
                    {c.name || c.email}
                  </Link>
                  <div className="text-xs opacity-70">{c.email}</div>
                </td>
                <td className="py-3 font-mono text-xs opacity-70">{(c.preferred_language ?? "es").toUpperCase()}</td>
                <td className="py-3 opacity-70">{c.sources.map((s) => t.sources[s] ?? s).join(", ") || "—"}</td>
                <td className="py-3 opacity-70">{t.statuses[c.status] ?? c.status}</td>
                <td className="py-3 opacity-70">{new Date(c.created_at).toLocaleDateString(locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
