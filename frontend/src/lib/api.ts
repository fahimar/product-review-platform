import type {
  Product,
  ProductDetail,
  ReviewOut,
  ReviewCreate,
  ReviewUpdate,
  TokenOut,
  UserOut,
} from "./types";

// Server Components (SSR) use API_BASE_URL — routed inside the Docker network
// (e.g. http://backend:8000). Browser Client Components use NEXT_PUBLIC_API_BASE_URL
// — routed to the host-accessible URL (e.g. http://localhost:8000).
const BASE =
  typeof window === "undefined"
    ? (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000")
    : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error((detail as { detail?: string }).detail ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ── Products ─────────────────────────────────────────────────────────────────

export function getProducts(search?: string, minRating?: number): Promise<Product[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (minRating !== undefined) params.set("min_rating", String(minRating));
  const qs = params.toString();
  return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`, {
    next: { revalidate: 0 },
  });
}

export function getProduct(id: number): Promise<ProductDetail> {
  return request<ProductDetail>(`/api/products/${id}`, { next: { revalidate: 0 } });
}

// ── Reviews ──────────────────────────────────────────────────────────────────

export function createReview(data: ReviewCreate, token?: string): Promise<ReviewOut> {
  return request<ReviewOut>("/api/reviews", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: JSON.stringify(data),
  });
}

export function updateReview(
  id: number,
  data: ReviewUpdate,
  token?: string
): Promise<ReviewOut> {
  return request<ReviewOut>(`/api/reviews/${id}`, {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: JSON.stringify(data),
  });
}

export function deleteReview(id: number, token?: string): Promise<void> {
  return request<void>(`/api/reviews/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

// ── Auth ─────────────────────────────────────────────────────────────────────

// Backend uses OAuth2PasswordRequestForm — requires application/x-www-form-urlencoded
// with fields "username" (treated as email) and "password".
export function login(email: string, password: string): Promise<TokenOut> {
  const body = new URLSearchParams({ username: email, password });
  return request<TokenOut>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

// /register returns Token (access_token + token_type), not the UserOut object.
export function register(name: string, email: string, password: string): Promise<TokenOut> {
  return request<TokenOut>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function getMe(token: string): Promise<UserOut> {
  return request<UserOut>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
