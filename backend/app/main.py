from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1.api import api_router
# Import models to ensure they are registered with Base.metadata
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist on startup
    Base.metadata.create_all(bind=engine)
    # Safe idempotent migration for products table
    try:
        with engine.begin() as conn:
            existing_cols = {
                row[0]
                for row in conn.execute(
                    text(
                        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS "
                        "WHERE TABLE_NAME = 'products' AND TABLE_SCHEMA = DATABASE()"
                    )
                ).fetchall()
            }
            if "sku" not in existing_cols:
                conn.execute(text("ALTER TABLE products ADD COLUMN sku VARCHAR(64) UNIQUE NULL"))
            if "is_active" not in existing_cols:
                conn.execute(text("ALTER TABLE products ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE"))
            if "sub_category" not in existing_cols:
                conn.execute(text("ALTER TABLE products ADD COLUMN sub_category VARCHAR(100) NULL"))

            # Ensure articles.thumbnail and about_sections.image_url can store long URLs / Google image addresses / base64
            conn.execute(text("ALTER TABLE articles MODIFY COLUMN thumbnail LONGTEXT NULL"))
            conn.execute(text("ALTER TABLE about_sections MODIFY COLUMN image_url LONGTEXT NULL"))

            # Ensure orders has discount_amount and coupon_code
            order_cols = [r[0] for r in conn.execute(text("SHOW COLUMNS FROM orders")).fetchall()]
            if "discount_amount" not in order_cols:
                conn.execute(text("ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.0"))
            if "coupon_code" not in order_cols:
                conn.execute(text("ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(64) NULL"))

            # Expand currency columns to DECIMAL(15, 2) for Vietnamese Dong (VNĐ)
            conn.execute(text("ALTER TABLE products MODIFY COLUMN price DECIMAL(15, 2) NOT NULL"))
            conn.execute(text("ALTER TABLE products MODIFY COLUMN compare_at_price DECIMAL(15, 2) NULL"))
            conn.execute(text("ALTER TABLE coupons MODIFY COLUMN discount_value DECIMAL(15, 2) NOT NULL"))
            conn.execute(text("ALTER TABLE coupons MODIFY COLUMN min_order_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.0"))
            conn.execute(text("ALTER TABLE orders MODIFY COLUMN subtotal DECIMAL(15, 2) NOT NULL"))
            conn.execute(text("ALTER TABLE orders MODIFY COLUMN shipping_fee DECIMAL(15, 2) NOT NULL DEFAULT 0.0"))
            conn.execute(text("ALTER TABLE orders MODIFY COLUMN discount_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.0"))
            conn.execute(text("ALTER TABLE orders MODIFY COLUMN total_amount DECIMAL(15, 2) NOT NULL"))
            conn.execute(text("ALTER TABLE order_items MODIFY COLUMN unit_price DECIMAL(15, 2) NOT NULL"))
            conn.execute(text("ALTER TABLE order_items MODIFY COLUMN total_price DECIMAL(15, 2) NOT NULL"))
    except Exception as e:
        print(f"Migration note: {e}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for RYVO E-commerce application (FastAPI + MySQL + SQLAlchemy)",
    lifespan=lifespan,
)

# Configure CORS
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}

