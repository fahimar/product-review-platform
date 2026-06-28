import Link from "next/link";
import type { Product } from "@/lib/types";
import { StarRating } from "./star-rating";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="block rounded-xl border p-4 hover:shadow-md transition-shadow">
      {product.image_url && (
        <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
      )}
      <h2 className="font-semibold text-lg">{product.name}</h2>
      <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product.description}</p>
      <div className="mt-2">
        <StarRating rating={product.average_rating ?? 0} />
      </div>
    </Link>
  );
}
