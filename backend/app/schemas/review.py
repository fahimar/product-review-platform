from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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
