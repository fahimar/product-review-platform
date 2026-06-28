"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReview } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export function ReviewForm({ productId }: { productId: number }) {
  const router = useRouter();
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return <p className="mt-6 text-sm text-muted-foreground">Sign in to leave a review.</p>;
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createReview({ product_id: productId, rating, comment }, token ?? undefined);
      setComment("");
      setRating(5);
      router.refresh(); // revalidate server component data (avg + review list)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <h3 className="font-semibold text-lg">Write a review</h3>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border rounded-lg px-3 py-2"
        disabled={loading}
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} star{n !== 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Your review (optional, max 1000 characters)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
        className="w-full border rounded-lg px-3 py-2 h-28 resize-none"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
