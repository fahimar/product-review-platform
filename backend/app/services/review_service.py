from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenError, NotFoundError
from app.models.review import Review
from app.repositories import review_repo
from app.schemas.review import ReviewCreate, ReviewOut


async def list_reviews(db: AsyncSession, product_id: int) -> list[ReviewOut]:
    reviews = await review_repo.get_by_product(db, product_id)
    return [ReviewOut.model_validate(r) for r in reviews]


async def create_review(db: AsyncSession, data: ReviewCreate, user_id: int) -> ReviewOut:
    review = await review_repo.create(db, data, user_id)
    return ReviewOut.model_validate(review)


async def delete_review(
    db: AsyncSession, review_id: int, user_id: int, is_admin: bool
) -> None:
    review = await _get_or_404(db, review_id)
    if review.user_id != user_id and not is_admin:
        raise ForbiddenError("Cannot delete another user's review")
    await review_repo.delete(db, review)


async def _get_or_404(db: AsyncSession, review_id: int) -> Review:
    review = await review_repo.get_by_id(db, review_id)
    if not review:
        raise NotFoundError(f"Review {review_id} not found")
    return review
