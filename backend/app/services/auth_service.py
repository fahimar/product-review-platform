from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import Token
from app.schemas.user import UserCreate


async def register(db: AsyncSession, data: UserCreate) -> Token:
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise ConflictError("Email already registered")
    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return Token(access_token=create_access_token(str(user.id)))


async def login(db: AsyncSession, email: str, password: str) -> Token:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.password_hash):
        raise NotFoundError("Invalid credentials")
    return Token(access_token=create_access_token(str(user.id)))
