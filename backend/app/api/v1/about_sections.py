from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.about_section import AboutSection
from app.schemas.about_section import (
    AboutSectionCreate,
    AboutSectionUpdate,
    AboutSectionResponse,
)
from app.api.deps import get_current_admin
from app.models.user import User

router = APIRouter(tags=["About Sections"])


@router.get("/about-sections", response_model=List[AboutSectionResponse])
def get_about_sections(
    category: Optional[str] = Query(None, description="Filter by category"),
    include_hidden: bool = Query(False, description="Include hidden sections (Admin view)"),
    db: Session = Depends(get_db),
):
    query = db.query(AboutSection)
    if not include_hidden:
        query = query.filter(AboutSection.is_visible == True)
    if category:
        query = query.filter(AboutSection.category == category)
    
    return query.order_by(AboutSection.sort_order.asc(), AboutSection.id.asc()).all()


@router.post("/admin/about-sections", response_model=AboutSectionResponse, status_code=status.HTTP_201_CREATED)
def create_about_section(
    section_in: AboutSectionCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    section = AboutSection(
        title=section_in.title,
        category=section_in.category,
        content=section_in.content,
        image_url=section_in.image_url,
        is_visible=section_in.is_visible,
        sort_order=section_in.sort_order,
    )
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


@router.put("/admin/about-sections/{section_id}", response_model=AboutSectionResponse)
def update_about_section(
    section_id: int,
    section_in: AboutSectionUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    section = db.query(AboutSection).filter(AboutSection.id == section_id).first()
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy mục giới thiệu",
        )

    update_data = section_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(section, field, value)

    db.commit()
    db.refresh(section)
    return section


@router.delete("/admin/about-sections/{section_id}", status_code=status.HTTP_200_OK)
def delete_about_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    section = db.query(AboutSection).filter(AboutSection.id == section_id).first()
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy mục giới thiệu",
        )

    db.delete(section)
    db.commit()
    return {"message": "Đã xóa mục giới thiệu thành công"}

