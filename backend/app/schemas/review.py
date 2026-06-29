from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewOut(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 9,
                "user": "John",
                "rating": 5,
                "comment": "Excellent product",
                "created_at": "2024-01-15T10:30:00Z",
            }
        },
    )

    id: int
    user: str
    rating: int
    comment: str | None
    created_at: datetime


class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewUpdate(BaseModel):
    rating: int | None = Field(default=None, ge=1, le=5)
    comment: str | None = None
