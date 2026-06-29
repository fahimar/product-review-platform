"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { createReview } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Interactive star picker ───────────────────────────────────────────────────

function StarPicker({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(0);
  const labels = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            className="text-3xl leading-none focus:outline-none disabled:cursor-not-allowed transition-transform hover:scale-110"
          >
            <span className={(hover || value) >= star ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground h-4">
        {(hover || value) > 0 ? labels[(hover || value) - 1] : ""}
      </p>
    </div>
  );
}

// ── Review form ───────────────────────────────────────────────────────────────

export function ReviewForm({ productId }: { productId: number }) {
  const router = useRouter();
  const { token } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // token === undefined means localStorage not yet read — render nothing to
  // avoid a flash between "Sign in" and the actual form.
  if (token === undefined) return null;

  if (!token) {
    return (
      <Card className="mt-8 border-dashed">
        <CardContent className="py-8 text-center space-y-3">
          <p className="text-muted-foreground text-sm">Sign in to leave a review</p>
          <div className="flex justify-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createReview(
        { product_id: productId, rating, comment: comment.trim() || undefined },
        token ?? undefined
      );
      setRating(0);
      setComment("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Write a review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {success && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">Review submitted — thank you!</span>
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium">Your rating</label>
            <StarPicker value={rating} onChange={setRating} disabled={loading} />
          </div>

          <div className="space-y-1">
            <label htmlFor="comment" className="text-sm font-medium">
              Comment{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              id="comment"
              placeholder="Share your experience with this product…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={4}
              disabled={loading}
              className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/1000
            </p>
          </div>

          <Button type="submit" disabled={loading || rating === 0} className="w-full sm:w-auto">
            {loading ? "Submitting…" : "Submit review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
