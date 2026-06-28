import type { ReviewOut } from "@/lib/types";
import { StarRating } from "./star-rating";

export function ReviewList({ reviews }: { reviews: ReviewOut[] }) {
  if (reviews.length === 0) {
    return <p className="text-muted-foreground">No reviews yet. Be the first!</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{review.user}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          <StarRating rating={review.rating} />
          {review.comment && (
            <p className="text-foreground mt-2">{review.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
