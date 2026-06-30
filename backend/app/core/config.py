import json
import re

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"  # internal — callers use JWT_SECRET/JWT_EXPIRE_MINUTES
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def asyncpg_url(self) -> str:
        # asyncpg uses ssl=true, not sslmode=require (libpq syntax)
        return re.sub(r"sslmode=\w+", "ssl=true", self.DATABASE_URL)

    @property
    def cors_origins_list(self) -> list[str]:
        raw = self.CORS_ORIGINS.strip()
        if raw.startswith("["):
            return json.loads(raw)
        return [o.strip() for o in raw.split(",") if o.strip()]


settings = Settings()  # type: ignore[call-arg]
