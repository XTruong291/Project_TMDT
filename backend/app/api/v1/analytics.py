import time
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.site_analytics import SiteAnalytics
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.analytics import AnalyticsStatsResponse

router = APIRouter(tags=["Analytics"])


@router.get("/analytics/stats", response_model=AnalyticsStatsResponse)
def get_site_analytics(db: Session = Depends(get_db)):
    # 1. Update & get total visits from MySQL
    analytics = db.query(SiteAnalytics).first()
    if not analytics:
        analytics = SiteAnalytics(total_visits=154820)
        db.add(analytics)
        db.flush()

    analytics.total_visits = (analytics.total_visits or 154820) + 1
    db.commit()
    db.refresh(analytics)

    # 2. Dynamic online visitors calculation (e.g., 14 to 28 active users)
    current_time_sec = int(time.time())
    online_visitors = 14 + (current_time_sec % 15)

    # 3. Aggregates from database
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0

    total_rev = db.query(func.sum(Order.total_amount)).filter(
        Order.status != OrderStatus.CANCELLED
    ).scalar() or 0.0

    return AnalyticsStatsResponse(
        online_visitors=online_visitors,
        total_visits=analytics.total_visits,
        total_orders=total_orders,
        total_products=total_products,
        total_users=total_users,
        total_revenue=float(total_rev),
    )

