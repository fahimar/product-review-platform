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
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "product_id": 1,
                "user_id": 2,
                "rating": 5,
                "comment": "Very good",
            }
        }
    )

    product_id: int
    user_id: int | None = None  # ignored when JWT token is present; required otherwise
    rating: int = Field(ge=1, le=5)
    comment: str | None = Field(default=None, max_length=1000)


class ReviewUpdate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {"rating": 4, "comment": "Updated opinion after a week"}
        }
    )

    rating: int | None = Field(default=None, ge=1, le=5)
    comment: str | None = Field(default=None, max_length=1000)
