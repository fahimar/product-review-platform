import { Star, StarHalf } from "lucide-react";

function StarSlot({ fill }: { fill: number }) {
  const clamped = Math.min(1, Math.max(0, fill));

  if (clamped >= 0.75) {
    return <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />;
  }
  if (clamped >= 0.25) {
    return (
      <span className="relative inline-flex h-4 w-4">
        <Star className="h-4 w-4 fill-none stroke-gray-300" />
        <StarHalf className="absolute inset-0 h-4 w-4 fill-yellow-400 stroke-yellow-400" />
      </span>
    );
  }
  return <Star className="h-4 w-4 fill-none stroke-gray-300" />;
}

export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating.toFixed(1)} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => (
        <StarSlot key={i} fill={rating - i} />
      ))}
    </div>
  );
}
