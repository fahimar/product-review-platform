from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.product import Product
from app.models.review import Review
from app.repositories import product_repo
from app.schemas.product import ProductCreate, ProductDetail, ProductListItem, ProductUpdate
from app.schemas.review import ReviewOut


async def list_products(
    db: AsyncSession,
    search: str | None = None,
    min_rating: float | None = None,
) -> list[ProductListItem]:
    rows = await product_repo.list_with_aggregates(db, search, min_rating)
    return [
        ProductListItem(
            id=row.id,
            title=row.title,
            description=row.description,
            image_url=row.image_url,
            average_rating=float(row.average_rating),
            review_count=row.review_count,
        )
        for row in rows
    ]


async def get_product(db: AsyncSession, product_id: int) -> ProductDetail:
    product = await product_repo.get_with_reviews(db, product_id)
    if not product:
        raise NotFoundError(f"Product {product_id} not found")
    return _to_detail(product)


async def create_product(db: AsyncSession, data: ProductCreate) -> ProductDetail:
    product = await product_repo.create(db, data)
    return ProductDetail(
        id=product.id,
        title=product.title,
        description=product.description,
        image_url=product.image_url,
        average_rating=0.0,
        review_count=0,
        reviews=[],
    )


async def update_product(db: AsyncSession, product_id: int, data: ProductUpdate) -> ProductDetail:
    product = await _get_or_404_orm(db, product_id)
    await product_repo.update(db, product, data)
    return await get_product(db, product_id)


async def delete_product(db: AsyncSession, product_id: int) -> None:
    product = await _get_or_404_orm(db, product_id)
    await product_repo.delete(db, product)


def _to_detail(product: Product) -> ProductDetail:
    reviews = product.reviews
    average_rating = (
        round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else 0.0
    )
    return ProductDetail(
        id=product.id,
        title=product.title,
        description=product.description,
        image_url=product.image_url,
        average_rating=average_rating,
        review_count=len(reviews),
        reviews=[_review_to_out(r) for r in reviews],
    )


def _review_to_out(review: Review) -> ReviewOut:
    return ReviewOut(
        id=review.id,
        user=review.user.name,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
    )


async def _get_or_404_orm(db: AsyncSession, product_id: int) -> Product:
    product = await product_repo.get_by_id(db, product_id)
    if not product:
        raise NotFoundError(f"Product {product_id} not found")
    return product
