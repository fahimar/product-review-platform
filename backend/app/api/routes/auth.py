from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginIn, Token
from app.schemas.user import UserCreate, UserOut
from app.services import auth_service

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=201)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)) -> UserOut:
    return await auth_service.register(db, data)


@router.post("/login", response_model=Token)
async def login(data: LoginIn, db: AsyncSession = Depends(get_db)) -> Token:
    return await auth_service.login(db, data.email, data.password)


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)
