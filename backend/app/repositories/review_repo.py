from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.review import Review
from app.schemas.review import ReviewCreate


async def get_by_product(db: AsyncSession, product_id: int) -> list[Review]:
    result = await db.execute(select(Review).where(Review.product_id == product_id))
    return list(result.scalars().all())


async def get_by_id(db: AsyncSession, review_id: int) -> Review | None:
    return await db.get(Review, review_id)


async def create(db: AsyncSession, data: ReviewCreate, user_id: int) -> Review:
    review = Review(**data.model_dump(), user_id=user_id)
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


async def delete(db: AsyncSession, review: Review) -> None:
    await db.delete(review)
    await db.commit()
