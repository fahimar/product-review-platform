from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.db.session import get_db
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate
from app.services import product_service

router = APIRouter()


@router.get("/", response_model=list[ProductOut])
async def list_products(
    skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)
) -> list[ProductOut]:
    return await product_service.list_products(db, skip, limit)


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)) -> ProductOut:
    return await product_service.get_product(db, product_id)


@router.post("/", response_model=ProductOut, status_code=201, dependencies=[Depends(require_admin)])
async def create_product(data: ProductCreate, db: AsyncSession = Depends(get_db)) -> ProductOut:
    return await product_service.create_product(db, data)


@router.patch("/{product_id}", response_model=ProductOut, dependencies=[Depends(require_admin)])
async def update_product(
    product_id: int, data: ProductUpdate, db: AsyncSession = Depends(get_db)
) -> ProductOut:
    return await product_service.update_product(db, product_id, data)


@router.delete("/{product_id}", status_code=204, dependencies=[Depends(require_admin)])
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)) -> None:
    await product_service.delete_product(db, product_id)
