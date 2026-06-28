"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qs = query.trim() ? `?q=${encodeURIComponent(query)}` : "";
    router.push(`/${qs}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="search"
        placeholder="Search products…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border rounded-lg px-3 py-2"
      />
      <button type="submit" className="bg-black text-white px-4 rounded-lg">
        Search
      </button>
    </form>
  );
}
