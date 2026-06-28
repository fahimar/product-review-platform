import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";
import { StarRating } from "@/components/star-rating";
import { getProduct } from "@/lib/api";

// Next.js 15: params is a Promise
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(Number(id));

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <div className="flex items-center gap-2 mt-2">
        <StarRating rating={product.average_rating} />
        <span className="text-sm text-muted-foreground">
          {product.average_rating.toFixed(1)} · {product.review_count} review
          {product.review_count !== 1 ? "s" : ""}
        </span>
      </div>
      {product.description && (
        <p className="mt-4 text-muted-foreground">{product.description}</p>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <ReviewList reviews={product.reviews} />
        <ReviewForm productId={product.id} />
      </section>
    </main>
  );
}
