"""Seed the database with sample products, users, and reviews."""

import asyncio

from app.db.session import AsyncSessionLocal


async def main() -> None:
    async with AsyncSessionLocal() as session:
        # TODO: insert sample data
        await session.commit()
    print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(main())
