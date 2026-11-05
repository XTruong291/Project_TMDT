from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.contact import Contact
from app.models.user import User
from app.schemas.contact import (
    ContactCreate,
    ContactStatusUpdate,
    ContactResponse,
)
from app.api.deps import get_current_admin

router = APIRouter(tags=["Contacts"])


@router.post("/contacts", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_form(
    contact_in: ContactCreate,
    db: Session = Depends(get_db),
):
    contact = Contact(
        full_name=contact_in.full_name.strip(),
        email=contact_in.email.strip(),
        phone=contact_in.phone.strip() if contact_in.phone else None,
        address=contact_in.address.strip() if contact_in.address else None,
        subject=contact_in.subject.strip() if contact_in.subject else None,
        message=contact_in.message.strip(),
        status="unread",
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("/admin/contacts", response_model=List[ContactResponse])
def get_admin_contacts(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: unread, read, responded"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    query = db.query(Contact)
    if status_filter and status_filter != "all":
        query = query.filter(Contact.status == status_filter)

    return query.order_by(Contact.created_at.desc()).all()


@router.patch("/admin/contacts/{contact_id}/status", response_model=ContactResponse)
def update_contact_status(
    contact_id: int,
    status_in: ContactStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thư liên hệ",
        )

    contact.status = status_in.status
    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/admin/contacts/{contact_id}", status_code=status.HTTP_200_OK)
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thư liên hệ",
        )

    db.delete(contact)
    db.commit()
    return {"message": "Đã xóa thư liên hệ thành công"}

