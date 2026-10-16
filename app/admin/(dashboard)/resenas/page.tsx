import { getAllReviewsForAdmin } from "@/lib/productReviews";
import ReviewModerationActions from "@/components/admin/ReviewModerationActions";
import { fmt, getAdminDictionary, type AdminDictionary } from "@/lib/admin/dictionary";
import type { Locale } from "@/lib/i18n/config";
import { getAdminLocale } from "@/lib/admin/i18n";

export default async function AdminResenasPage() {
  const locale = getAdminLocale();
  const { reviews: t } = getAdminDictionary(locale);
  const reviews = await getAllReviewsForAdmin();
  const pending = reviews.filter((r) => r.status === "pending");
  const rest = reviews.filter((r) => r.status !== "pending");

  return (
    <main className="p-10">
      <h1 className="font-display text-2xl mb-6">{t.title}</h1>

      {reviews.length === 0 ? (
        <p className="opacity-60">{t.none}</p>
      ) : (
        <>
          {pending.length > 0 && (
            <>
              <h2 className="font-semibold mb-3">{fmt(t.pending, { n: pending.length })}</h2>
              <ReviewTable reviews={pending} showActions t={t} locale={locale} />
            </>
          )}

          {rest.length > 0 && (
            <>
              <h2 className="font-semibold mb-3 mt-10">{t.reviewed}</h2>
              <ReviewTable reviews={rest} showActions={false} t={t} locale={locale} />
            </>
          )}
        </>
      )}
    </main>
  );
}

function ReviewTable({
  reviews,
  showActions,
  t,
  locale,
}: {
  reviews: Awaited<ReturnType<typeof getAllReviewsForAdmin>>;
  showActions: boolean;
  t: AdminDictionary["reviews"];
  locale: Locale;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.columns.product}</th>
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.columns.customer}</th>
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.columns.rating}</th>
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.columns.comment}</th>
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.columns.date}</th>
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{showActions ? t.columns.action : t.columns.status}</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-b border-[rgba(20,25,43,0.08)] align-top">
              <td className="py-3">{r.productName}</td>
              <td className="py-3 opacity-70">
                {r.contactName ?? "—"}
                <div className="text-xs opacity-60">{r.contactEmail}</div>
              </td>
              <td className="py-3 text-clay whitespace-nowrap">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</td>
              <td className="py-3 opacity-70 max-w-[280px]">{r.comment || "—"}</td>
              <td className="py-3 opacity-70 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString(locale)}</td>
              <td className="py-3">{showActions ? <ReviewModerationActions reviewId={r.id} /> : t.statuses[r.status] ?? r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
