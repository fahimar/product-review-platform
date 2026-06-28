// ── Product ─────────────────────────────────────────────────────────────────
// Mirrors GET /api/products list item (ARD §5)
export interface Product {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  average_rating: number;
  review_count: number;
}

// Mirrors GET /api/products/{id} detail with nested reviews (ARD §5)
export interface ProductDetail extends Omit<Product, "average_rating" | "review_count"> {
  average_rating: number;
  review_count: number;
  reviews: ReviewOut[];
}

// ── Review ───────────────────────────────────────────────────────────────────
// Mirrors a review entry nested inside ProductDetail (ARD §5)
export interface ReviewOut {
  id: number;
  user: string;       // reviewer's display name, not id
  rating: number;
  comment: string | null;
  created_at: string; // ISO-8601
}

// Request body for POST /api/reviews (ARD §5)
export interface ReviewCreate {
  product_id: number;
  user_id?: number;   // omitted when derived from JWT token
  rating: number;     // 1–5
  comment?: string;   // ≤1000 chars
}

// Request body for PUT /api/reviews/{id}
export interface ReviewUpdate {
  rating?: number;
  comment?: string;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface TokenOut {
  access_token: string;
  token_type: string;
}

export interface UserOut {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}
