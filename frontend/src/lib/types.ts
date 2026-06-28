export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  average_rating: number | null;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title: string;
  body: string;
}

export interface TokenOut {
  access_token: string;
  token_type: string;
}

export interface UserOut {
  id: number;
  email: string;
  is_admin: boolean;
}
