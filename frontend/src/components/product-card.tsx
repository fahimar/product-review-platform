import Link from "next/link";
import type { Product } from "@/lib/types";
import { StarRating } from "./star-rating";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-48 bg-muted shrink-0">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl text-muted-foreground/40" aria-hidden>
              📦
            </span>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4 space-y-2">
        <h2 className="font-semibold text-base leading-snug line-clamp-2">
          {product.title}
        </h2>
        {product.description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-2 pt-1">
          <StarRating rating={product.average_rating} />
          <span className="text-sm font-semibold tabular-nums">
            {product.average_rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground text-sm">·</span>
          <span className="text-muted-foreground text-sm">
            {product.review_count} {product.review_count === 1 ? "Review" : "Reviews"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
