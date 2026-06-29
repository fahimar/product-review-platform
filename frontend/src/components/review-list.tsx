import type { ReviewOut } from "@/lib/types";
import { StarRating } from "./star-rating";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function InitialAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
      {initial}
    </span>
  );
}

export function ReviewList({ reviews }: { reviews: ReviewOut[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">
        No reviews yet — be the first!
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="border rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <InitialAvatar name={review.user} />
              <div>
                <p className="text-sm font-medium leading-none">{review.user}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(review.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <StarRating rating={review.rating} />
              <span className="text-sm font-medium tabular-nums">{review.rating}.0</span>
            </div>
          </div>
          {review.comment && (
            <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
