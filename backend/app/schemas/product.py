from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    description: str = ""
    image_url: str | None = None


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    image_url: str | None = None


class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    image_url: str | None
    average_rating: float | None = None

    model_config = {"from_attributes": True}
