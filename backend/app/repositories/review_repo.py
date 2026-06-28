from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate


async def get(db: AsyncSession, review_id: int) -> Review | None:
    stmt = select(Review).options(selectinload(Review.user)).where(Review.id == review_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_by_product(db: AsyncSession, product_id: int) -> list[Review]:
    stmt = (
        select(Review)
        .options(selectinload(Review.user))
        .where(Review.product_id == product_id)
        .order_by(Review.created_at.desc())
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create(db: AsyncSession, data: ReviewCreate, user_id: int) -> Review:
    review = Review(
        product_id=data.product_id,
        user_id=user_id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    # Re-fetch with user relationship loaded (async SQLAlchemy forbids lazy loads)
    return await get(db, review.id)  # type: ignore[return-value]


async def update(db: AsyncSession, review: Review, data: ReviewUpdate) -> Review:
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(review, field, value)
    await db.commit()
    # Re-fetch with user relationship loaded
    return await get(db, review.id)  # type: ignore[return-value]


async def delete(db: AsyncSession, review: Review) -> None:
    await db.delete(review)
    await db.commit()
