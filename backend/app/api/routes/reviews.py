from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_optional_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewOut, ReviewUpdate
from app.services import review_service

router = APIRouter()

_404 = {
    404: {
        "description": "Not found",
        "content": {"application/json": {"example": {"detail": "Review 1 not found"}}},
    }
}


@router.get("/", response_model=list[ReviewOut])
async def list_reviews(product_id: int, db: AsyncSession = Depends(get_db)) -> list[ReviewOut]:
    return await review_service.list_reviews(db, product_id)


@router.post("/", response_model=ReviewOut, status_code=201, responses=_404)
async def create_review(
    data: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
) -> ReviewOut:
    # JWT takes precedence over body user_id (supports both auth and no-auth flows)
    effective_user_id = current_user.id if current_user else data.user_id
    if effective_user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign in to post a review",
        )
    return await review_service.create_review(db, data, effective_user_id)


@router.put("/{review_id}", response_model=ReviewOut, responses=_404)
async def update_review(
    review_id: int,
    data: ReviewUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReviewOut:
    return await review_service.update_review(db, review_id, data, current_user.id)


@router.delete("/{review_id}", status_code=204, responses=_404)
async def delete_review(
    review_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    await review_service.delete_review(db, review_id, current_user.id, current_user.is_admin)
