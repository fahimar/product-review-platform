"use client";

import { useState } from "react";
import { createReview } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export function ReviewForm({ productId }: { productId: number }) {
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!token) return <p className="mt-6 text-sm text-gray-500">Sign in to leave a review.</p>;
  if (submitted) return <p className="mt-6 text-green-600">Review submitted — thanks!</p>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createReview({ product_id: productId, rating, title, body }, token!);
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <h3 className="font-semibold text-lg">Write a review</h3>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border rounded-lg px-3 py-2"
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} star{n !== 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />
      <textarea
        placeholder="Your review"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 h-28 resize-none"
        required
      />
      <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg">
        Submit
      </button>
    </form>
  );
}
