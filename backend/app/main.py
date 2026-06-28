from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, products, reviews
from app.core.exceptions import add_exception_handlers

app = FastAPI(title="ReviewDibo API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

add_exception_handlers(app)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(reviews.router, prefix="/reviews", tags=["reviews"])


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
