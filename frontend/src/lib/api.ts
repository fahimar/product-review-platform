import type { Product, Review, TokenOut, UserOut } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const getProducts = (skip = 0, limit = 20): Promise<Product[]> =>
  request(`/products/?skip=${skip}&limit=${limit}`);

export const getProduct = (id: number): Promise<Product> => request(`/products/${id}`);

export const getReviews = (productId: number): Promise<Review[]> =>
  request(`/reviews/?product_id=${productId}`);

export const createReview = (
  data: { product_id: number; rating: number; title?: string; body?: string },
  token: string
): Promise<Review> =>
  request("/reviews/", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const login = (email: string, password: string): Promise<TokenOut> =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const register = (email: string, password: string): Promise<UserOut> =>
  request("/auth/register", { method: "POST", body: JSON.stringify({ email, password }) });
