from pydantic import BaseModel, ConfigDict

from app.schemas.review import ReviewOut


class ProductListItem(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "title": "Laptop",
                "description": "Gaming laptop with RTX 4090",
                "image_url": "https://example.com/laptop.jpg",
                "average_rating": 4.5,
                "review_count": 120,
            }
        },
    )

    id: int
    title: str
    description: str | None
    image_url: str | None
    average_rating: float
    review_count: int


class ProductDetail(ProductListItem):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "title": "Laptop",
                "description": "Gaming laptop with RTX 4090",
                "image_url": "https://example.com/laptop.jpg",
                "average_rating": 4.5,
                "review_count": 2,
                "reviews": [
                    {
                        "id": 9,
                        "user": "John",
                        "rating": 5,
                        "comment": "Excellent product",
                        "created_at": "2024-01-15T10:30:00Z",
                    }
                ],
            }
        },
    )

    reviews: list[ReviewOut]


class ProductCreate(BaseModel):
    title: str
    description: str | None = None
    image_url: str | None = None


class ProductUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    image_url: str | None = None
