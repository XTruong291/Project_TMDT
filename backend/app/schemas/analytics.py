from app.schemas.base import CamelModel


class AnalyticsStatsResponse(CamelModel):
    online_visitors: int
    total_visits: int
    total_orders: int
    total_products: int
    total_users: int
    total_revenue: float

