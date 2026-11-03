from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.product import Product
from app.models.order import OrderItem
from app.models.user import User
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.api.deps import get_current_admin

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = Query(None, description="Filter by category slug"),
    collection: Optional[str] = Query(None, description="Filter by collection slug"),
    featured: Optional[bool] = Query(None, description="Filter featured products"),
    search: Optional[str] = Query(None, description="Search term in name or tagline"),
    sort: Optional[str] = Query("default", description="Sort order: default, price_asc, price_desc, rating_desc, newest"),
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    if category:
        query = query.filter(Product.category == category)
    
    if collection and collection != "all":
        if collection == "special":
            query = query.filter(Product.badge.isnot(None))
        elif collection == "accessories":
            query = query.filter(Product.collection_slug == "power-tech")
        else:
            query = query.filter(
                or_(
                    Product.collection_slug == collection,
                    Product.category == collection
                )
            )

    if featured is not None:
        query = query.filter(Product.featured == featured)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_filter),
                Product.tagline.ilike(search_filter),
                Product.description.ilike(search_filter),
            )
        )

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "rating_desc":
        query = query.order_by(Product.rating.desc())
    elif sort == "newest":
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.created_at.asc())

    return query.all()


@router.get("/{handle}", response_model=ProductResponse)
def get_product_by_handle(handle: str, db: Session = Depends(get_db)):
    # Support lookup either by handle or id
    product = db.query(Product).filter(
        or_(Product.handle == handle, Product.id == handle)
    ).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with handle '{handle}' not found"
        )
    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    existing_id = db.query(Product).filter(Product.id == product_in.id).first()
    if existing_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with ID '{product_in.id}' already exists"
        )
    
    existing_handle = db.query(Product).filter(Product.handle == product_in.handle).first()
    if existing_handle:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with handle '{product_in.handle}' already exists"
        )

    # Convert nested pydantic schemas to standard dictionaries for JSON storage
    product_data = product_in.model_dump(by_alias=False)
    if "colors" in product_data and product_data["colors"]:
        product_data["colors"] = [
            c if isinstance(c, dict) else c.model_dump() for c in product_data["colors"]
        ]
    if "specs" in product_data and product_data["specs"]:
        product_data["specs"] = [
            s if isinstance(s, dict) else s.model_dump() for s in product_data["specs"]
        ]

    new_product = Product(**product_data)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID '{product_id}' not found"
        )

    update_data = product_in.model_dump(exclude_unset=True, by_alias=False)

    if "colors" in update_data and update_data["colors"] is not None:
        update_data["colors"] = [
            c if isinstance(c, dict) else c.model_dump() for c in update_data["colors"]
        ]
    if "specs" in update_data and update_data["specs"] is not None:
        update_data["specs"] = [
            s if isinstance(s, dict) else s.model_dump() for s in update_data["specs"]
        ]

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID '{product_id}' not found"
        )

    # Detach order items so customer order history is preserved without FK violations
    db.query(OrderItem).filter(OrderItem.product_id == product_id).update(
        {OrderItem.product_id: None}, synchronize_session=False
    )
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully", "id": product_id}

