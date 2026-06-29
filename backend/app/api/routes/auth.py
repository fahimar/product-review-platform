from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import Token
from app.schemas.user import UserCreate, UserOut
from app.services import auth_service

router = APIRouter()


@router.post(
    "/register",
    response_model=Token,
    status_code=201,
    summary="Register a new user and receive a JWT",
)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)) -> Token:
    return await auth_service.register(db, data)


@router.post(
    "/login",
    response_model=Token,
    summary="OAuth2 password flow — username field accepts email",
)
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
) -> Token:
    # OAuth2 standard calls the field 'username'; we treat it as email
    return await auth_service.login(db, form.username, form.password)


@router.get("/me", response_model=UserOut, summary="Current authenticated user")
async def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)
