from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.products import router as products_router
from app.api.v1.orders import router as orders_router
from app.api.v1.users import router as users_router
from app.api.v1.coupons import router as coupons_router
from app.api.v1.about_sections import router as about_router
from app.api.v1.articles import router as articles_router
from app.api.v1.contacts import router as contacts_router
from app.api.v1.analytics import router as analytics_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(products_router)
api_router.include_router(orders_router)
api_router.include_router(users_router)
api_router.include_router(coupons_router)
api_router.include_router(about_router)
api_router.include_router(articles_router)
api_router.include_router(contacts_router)
api_router.include_router(analytics_router)
