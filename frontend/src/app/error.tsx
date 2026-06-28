"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
      <p className="text-gray-500 mb-6">{error.message}</p>
      <button onClick={reset} className="px-4 py-2 bg-black text-white rounded-lg">
        Try again
      </button>
    </div>
  );
}
