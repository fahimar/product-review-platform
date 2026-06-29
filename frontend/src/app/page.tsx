import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";
import { getProducts } from "@/lib/api";

interface HomePageProps {
  searchParams: Promise<{ search?: string; minRating?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { search, minRating: minRatingStr } = await searchParams;
  const minRating = minRatingStr ? Number(minRatingStr) : undefined;

  const products = await getProducts(search?.trim() || undefined, minRating);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-1">
          Discover products and share your honest reviews
        </p>
      </div>

      <SearchBar initialSearch={search ?? ""} initialMinRating={minRatingStr ?? ""} />

      {products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
