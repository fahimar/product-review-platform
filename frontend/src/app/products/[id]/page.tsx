import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";
import { StarRating } from "@/components/star-rating";
import { getProduct, getReviews } from "@/lib/api";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [product, reviews] = await Promise.all([
    getProduct(Number(params.id)),
    getReviews(Number(params.id)),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <StarRating rating={product.average_rating ?? 0} />
      <p className="mt-4 text-gray-700">{product.description}</p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <ReviewList reviews={reviews} />
        <ReviewForm productId={product.id} />
      </section>
    </main>
  );
}
