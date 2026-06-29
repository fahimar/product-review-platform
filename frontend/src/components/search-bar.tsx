"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  initialSearch?: string;
  initialMinRating?: string;
}

export function SearchBar({ initialSearch = "", initialMinRating = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialSearch);
  const [minRating, setMinRating] = useState(initialMinRating);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (minRating) params.set("minRating", minRating);
    const qs = params.toString();
    router.push(`/${qs ? `?${qs}` : ""}`);
  }

  function handleClear() {
    setQuery("");
    setMinRating("");
    router.push("/");
  }

  const hasFilter = query.trim() !== "" || minRating !== "";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="search"
        placeholder="Search products…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border border-input bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <select
        value={minRating}
        onChange={(e) => setMinRating(e.target.value)}
        className="border border-input bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:w-36"
      >
        <option value="">All ratings</option>
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r}+ Stars
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Search
      </button>
      {hasFilter && (
        <button
          type="button"
          onClick={handleClear}
          className="border border-input rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          Clear
        </button>
      )}
    </form>
  );
}
