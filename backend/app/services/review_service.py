from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, ForbiddenError, NotFoundError
from app.models.review import Review
from app.repositories import product_repo, review_repo
from app.schemas.review import ReviewCreate, ReviewOut, ReviewUpdate


async def list_reviews(db: AsyncSession, product_id: int) -> list[ReviewOut]:
    reviews = await review_repo.get_by_product(db, product_id)
    return [_to_out(r) for r in reviews]


async def create_review(db: AsyncSession, data: ReviewCreate, user_id: int) -> ReviewOut:
    product = await product_repo.get_by_id(db, data.product_id)
    if not product:
        raise NotFoundError(f"Product {data.product_id} not found")
    try:
        review = await review_repo.create(db, data, user_id)
    except IntegrityError:
        await db.rollback()
        raise ConflictError("You have already reviewed this product")
    return _to_out(review)


async def update_review(
    db: AsyncSession, review_id: int, data: ReviewUpdate, user_id: int
) -> ReviewOut:
    review = await _get_or_404(db, review_id)
    if review.user_id != user_id:
        raise ForbiddenError("Cannot edit another user's review")
    updated = await review_repo.update(db, review, data)
    return _to_out(updated)


async def delete_review(
    db: AsyncSession, review_id: int, user_id: int, is_admin: bool
) -> None:
    review = await _get_or_404(db, review_id)
    if review.user_id != user_id and not is_admin:
        raise ForbiddenError("Cannot delete another user's review")
    await review_repo.delete(db, review)


def _to_out(review: Review) -> ReviewOut:
    return ReviewOut(
        id=review.id,
        user=review.user.name,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
    )


async def _get_or_404(db: AsyncSession, review_id: int) -> Review:
    review = await review_repo.get(db, review_id)
    if not review:
        raise NotFoundError(f"Review {review_id} not found")
    return review
