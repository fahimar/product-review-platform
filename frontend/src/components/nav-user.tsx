"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function NavUser() {
  const router = useRouter();
  const { token, userName, clearToken } = useAuth();

  function handleSignOut() {
    clearToken();
    router.push("/");
    router.refresh();
  }

  // undefined = localStorage not yet read (SSR / first paint) — show default links
  // to avoid hydration mismatch
  if (!token) {
    return (
      <nav className="flex items-center gap-3 text-sm">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="bg-primary text-primary-foreground rounded-md px-3 py-1.5 font-medium hover:bg-primary/90 transition-colors"
        >
          Register
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground hidden sm:inline">
        {userName ?? "Account"}
      </span>
      <button
        onClick={handleSignOut}
        className="border border-input rounded-md px-3 py-1.5 font-medium hover:bg-accent transition-colors"
      >
        Sign out
      </button>
    </nav>
  );
}
