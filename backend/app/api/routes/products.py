from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.db.session import get_db
from app.schemas.product import ProductCreate, ProductDetail, ProductListItem, ProductUpdate
from app.services import product_service

router = APIRouter()

_404 = {404: {"description": "Not found", "content": {"application/json": {"example": {"detail": "Product 1 not found"}}}}}


@router.get("/", response_model=list[ProductListItem])
async def list_products(
    search: str | None = Query(None, description="Filter by title (case-insensitive)"),
    min_rating: float | None = Query(None, ge=0, le=5, description="Minimum average rating"),
    db: AsyncSession = Depends(get_db),
) -> list[ProductListItem]:
    return await product_service.list_products(db, search, min_rating)


@router.get("/{product_id}", response_model=ProductDetail, responses=_404)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)) -> ProductDetail:
    return await product_service.get_product(db, product_id)


@router.post("/", response_model=ProductDetail, status_code=201, dependencies=[Depends(require_admin)])
async def create_product(data: ProductCreate, db: AsyncSession = Depends(get_db)) -> ProductDetail:
    return await product_service.create_product(db, data)


@router.patch("/{product_id}", response_model=ProductDetail, dependencies=[Depends(require_admin)])
async def update_product(
    product_id: int, data: ProductUpdate, db: AsyncSession = Depends(get_db)
) -> ProductDetail:
    return await product_service.update_product(db, product_id, data)


@router.delete("/{product_id}", status_code=204, dependencies=[Depends(require_admin)])
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)) -> None:
    await product_service.delete_product(db, product_id)
