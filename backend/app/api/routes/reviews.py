from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewOut, ReviewUpdate
from app.services import review_service

router = APIRouter()


@router.get("/", response_model=list[ReviewOut])
async def list_reviews(product_id: int, db: AsyncSession = Depends(get_db)) -> list[ReviewOut]:
    return await review_service.list_reviews(db, product_id)


@router.post("/", response_model=ReviewOut, status_code=201)
async def create_review(
    data: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReviewOut:
    return await review_service.create_review(db, data, current_user.id)


@router.put("/{review_id}", response_model=ReviewOut)
async def update_review(
    review_id: int,
    data: ReviewUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReviewOut:
    return await review_service.update_review(db, review_id, data, current_user.id)


@router.delete("/{review_id}", status_code=204)
async def delete_review(
    review_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    await review_service.delete_review(db, review_id, current_user.id, current_user.is_admin)
