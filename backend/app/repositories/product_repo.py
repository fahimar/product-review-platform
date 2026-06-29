from sqlalchemy import Float, Numeric, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.product import Product
from app.models.review import Review
from app.schemas.product import ProductCreate, ProductUpdate


async def list_with_aggregates(
    db: AsyncSession,
    search: str | None = None,
    min_rating: float | None = None,
) -> list:
    """Single LEFT JOIN query — no N+1. Returns raw rows with aggregate columns."""
    # round(numeric, int) — cast to NUMERIC first for portability across PG versions
    avg_expr = func.round(
        func.cast(
            func.coalesce(func.avg(func.cast(Review.rating, Float)), 0.0),
            Numeric(10, 2),
        ),
        1,
    ).label("average_rating")
    count_expr = func.count(Review.id).label("review_count")

    stmt = (
        select(
            Product.id,
            Product.title,
            Product.description,
            Product.image_url,
            avg_expr,
            count_expr,
        )
        .outerjoin(Review, Review.product_id == Product.id)
        .group_by(Product.id)
        .order_by(Product.id)
    )

    if search:
        stmt = stmt.where(Product.title.ilike(f"%{search}%"))
    if min_rating is not None:
        stmt = stmt.having(
            func.coalesce(func.avg(func.cast(Review.rating, Float)), 0.0) >= min_rating
        )

    result = await db.execute(stmt)
    return result.all()


async def get_with_reviews(db: AsyncSession, product_id: int) -> Product | None:
    """Eagerly loads reviews + each review's user in 2 queries total (not N+1)."""
    stmt = (
        select(Product)
        .options(selectinload(Product.reviews).selectinload(Review.user))
        .where(Product.id == product_id)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_by_id(db: AsyncSession, product_id: int) -> Product | None:
    return await db.get(Product, product_id)


async def create(db: AsyncSession, data: ProductCreate) -> Product:
    product = Product(**data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


async def update(db: AsyncSession, product: Product, data: ProductUpdate) -> Product:
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(product, field, value)
    await db.commit()
    await db.refresh(product)
    return product


async def delete(db: AsyncSession, product: Product) -> None:
    await db.delete(product)
    await db.commit()
