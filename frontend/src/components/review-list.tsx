import type { Review } from "@/lib/types";
import { StarRating } from "./star-rating";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet. Be the first!</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="border rounded-lg p-4">
          <StarRating rating={review.rating} />
          {review.title && <h3 className="font-medium mt-1">{review.title}</h3>}
          <p className="text-gray-700 mt-1">{review.body}</p>
        </li>
      ))}
    </ul>
  );
}
