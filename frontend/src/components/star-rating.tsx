function StarIcon({ fill }: { fill: number }) {
  const pct = Math.min(1, Math.max(0, fill)) * 100;
  return (
    <span className="relative inline-block text-gray-300 text-lg leading-none select-none">
      ★
      <span
        className="absolute inset-0 overflow-hidden text-yellow-400"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        ★
      </span>
    </span>
  );
}

export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div
      className="flex gap-0.5"
      aria-label={`${rating.toFixed(1)} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => (
        <StarIcon key={i} fill={rating - i} />
      ))}
    </div>
  );
}
