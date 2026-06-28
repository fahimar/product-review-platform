from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.product import Product
from app.repositories import product_repo
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate


async def list_products(db: AsyncSession, skip: int = 0, limit: int = 20) -> list[ProductOut]:
    products = await product_repo.get_all(db, skip, limit)
    return [ProductOut.model_validate(p) for p in products]


async def get_product(db: AsyncSession, product_id: int) -> ProductOut:
    product = await product_repo.get_by_id(db, product_id)
    if not product:
        raise NotFoundError(f"Product {product_id} not found")
    return ProductOut.model_validate(product)


async def create_product(db: AsyncSession, data: ProductCreate) -> ProductOut:
    product = await product_repo.create(db, data)
    return ProductOut.model_validate(product)


async def update_product(db: AsyncSession, product_id: int, data: ProductUpdate) -> ProductOut:
    product = await _get_or_404(db, product_id)
    updated = await product_repo.update(db, product, data)
    return ProductOut.model_validate(updated)


async def delete_product(db: AsyncSession, product_id: int) -> None:
    product = await _get_or_404(db, product_id)
    await product_repo.delete(db, product)


async def _get_or_404(db: AsyncSession, product_id: int) -> Product:
    product = await product_repo.get_by_id(db, product_id)
    if not product:
        raise NotFoundError(f"Product {product_id} not found")
    return product
