import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";
import { StarRating } from "@/components/star-rating";
import { getProduct } from "@/lib/api";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(Number(id));
  } catch {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to products
      </Link>

      {/* Product image */}
      {product.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}

      {/* Product header */}
      <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>

      <div className="flex items-center gap-2 mt-3">
        <StarRating rating={product.average_rating} />
        <span className="font-semibold tabular-nums">{product.average_rating.toFixed(1)}</span>
        <span className="text-muted-foreground text-sm">
          · {product.review_count} {product.review_count === 1 ? "review" : "reviews"}
        </span>
      </div>

      {product.description && (
        <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>
      )}

      {/* Reviews section */}
      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-semibold">
          Reviews{" "}
          {product.review_count > 0 && (
            <span className="text-muted-foreground font-normal text-base">
              ({product.review_count})
            </span>
          )}
        </h2>
        <ReviewList reviews={product.reviews} />
        <ReviewForm productId={product.id} />
      </section>
    </main>
  );
}
