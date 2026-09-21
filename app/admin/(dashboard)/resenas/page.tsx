import { getAllReviewsForAdmin } from "@/lib/productReviews";
import ReviewModerationActions from "@/components/admin/ReviewModerationActions";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};

export default async function AdminResenasPage() {
  const reviews = await getAllReviewsForAdmin();
  const pending = reviews.filter((r) => r.status === "pending");
  const rest = reviews.filter((r) => r.status !== "pending");

  return (
    <main className="p-10">
      <h1 className="font-display text-2xl mb-6">Reseñas</h1>

      {reviews.length === 0 ? (
        <p className="opacity-60">Todavía no hay reseñas.</p>
      ) : (
        <>
          {pending.length > 0 && (
            <>
              <h2 className="font-semibold mb-3">Pendientes de aprobar ({pending.length})</h2>
              <ReviewTable reviews={pending} showActions />
            </>
          )}

          {rest.length > 0 && (
            <>
              <h2 className="font-semibold mb-3 mt-10">Ya revisadas</h2>
              <ReviewTable reviews={rest} showActions={false} />
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
}: {
  reviews: Awaited<ReturnType<typeof getAllReviewsForAdmin>>;
  showActions: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Producto</th>
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Cliente</th>
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Calificación</th>
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Comentario</th>
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Fecha</th>
            <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{showActions ? "Acción" : "Estado"}</th>
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
              <td className="py-3 opacity-70 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("es")}</td>
              <td className="py-3">{showActions ? <ReviewModerationActions reviewId={r.id} /> : STATUS_LABELS[r.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
