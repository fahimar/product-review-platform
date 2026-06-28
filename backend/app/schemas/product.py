from pydantic import BaseModel, ConfigDict

from app.schemas.review import ReviewOut


class ProductListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    image_url: str | None
    average_rating: float
    review_count: int


class ProductDetail(ProductListItem):
    reviews: list[ReviewOut]


class ProductCreate(BaseModel):
    title: str
    description: str | None = None
    image_url: str | None = None


class ProductUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    image_url: str | None = None
