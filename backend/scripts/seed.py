"""Seed the database with sample data: 2 users, 5 products, 6 reviews."""

import asyncio

from app.core.security import hash_password
from app.db.session import AsyncSessionLocal
from app.models.product import Product
from app.models.review import Review
from app.models.user import User


async def main() -> None:
    async with AsyncSessionLocal() as db:
        # ── Users ─────────────────────────────────────────────────────────
        alice = User(
            name="Alice",
            email="alice@example.com",
            password_hash=hash_password("password123"),
        )
        bob = User(
            name="Bob",
            email="bob@example.com",
            password_hash=hash_password("password123"),
            is_admin=True,
        )
        db.add_all([alice, bob])
        await db.flush()  # populate alice.id / bob.id before FK refs

        # ── Products ──────────────────────────────────────────────────────
        products = [
            Product(
                title="Mechanical Keyboard",
                description="TKL layout, Cherry MX Red switches, per-key RGB backlight.",
                image_url="https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600",
            ),
            Product(
                title="Noise-Cancelling Headphones",
                description="Over-ear ANC headphones with 30 h battery and foldable design.",
                image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
            ),
            Product(
                title="Ergonomic Vertical Mouse",
                description="Natural wrist posture, 6 buttons, 400–4000 DPI.",
                image_url="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
            ),
            Product(
                title="USB-C Hub 7-in-1",
                description="HDMI 4K@60Hz, 3× USB-A, SD/microSD, 100W PD pass-through.",
                image_url=None,
            ),
            Product(
                title='27" 4K IPS Monitor',
                description="144 Hz, HDR400, USB-C 90W, factory-calibrated panel.",
                image_url="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
            ),
        ]
        db.add_all(products)
        await db.flush()  # populate product IDs

        # ── Reviews ───────────────────────────────────────────────────────
        reviews = [
            Review(
                product_id=products[0].id,
                user_id=alice.id,
                rating=5,
                comment="Best keyboard I have ever typed on. The switches feel amazing after break-in.",
            ),
            Review(
                product_id=products[0].id,
                user_id=bob.id,
                rating=4,
                comment="Great build quality. RGB customisation software could be cleaner.",
            ),
            Review(
                product_id=products[1].id,
                user_id=alice.id,
                rating=5,
                comment="ANC is exceptional on flights. Battery life matches the spec sheet.",
            ),
            Review(
                product_id=products[2].id,
                user_id=bob.id,
                rating=3,
                comment="Decent mouse but took about a week to fully adjust to the vertical grip.",
            ),
            Review(
                product_id=products[3].id,
                user_id=alice.id,
                rating=4,
                comment="Works perfectly with my MacBook. HDMI output is rock solid at 4K.",
            ),
            Review(
                product_id=products[4].id,
                user_id=bob.id,
                rating=5,
                comment="Stunning display. Colour accuracy out of the box is superb.",
            ),
        ]
        db.add_all(reviews)
        await db.commit()

    print("Seed complete: 2 users, 5 products, 6 reviews.")


if __name__ == "__main__":
    asyncio.run(main())
