// Presentational only — real avgRating/reviewCount computed in lib/productReviews.ts. Callers
// check MIN_REVIEWS_TO_SHOW_RATING before rendering this at all.
export default function StarRating({ avgRating, reviewCount, size = "sm" }: { avgRating: number; reviewCount: number; size?: "sm" | "md" }) {
  const rounded = Math.round(avgRating * 2) / 2; // nearest half star
  const textSize = size === "md" ? "text-base" : "text-xs";

  return (
    <div className={`flex items-center gap-1.5 ${textSize}`}>
      <span className="text-clay tracking-tight" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (n <= Math.round(rounded) ? "★" : "☆")).join("")}
      </span>
      <span className="opacity-60 font-mono">
        {avgRating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  );
}
