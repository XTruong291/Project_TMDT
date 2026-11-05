import re
import unicodedata
import urllib.parse
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.article import Article
from app.models.user import User, RoleEnum
from app.schemas.article import (
    ArticleCreate,
    ArticleUpdate,
    ArticleResponse,
)
from app.api.deps import get_current_user, get_current_admin

router = APIRouter(tags=["Articles"])


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text).strip().lower()
    slug = re.sub(r"[-\s]+", "-", text)
    return slug or "bai-viet"


def clean_image_url(url: Optional[str]) -> Optional[str]:
    """
    Tự động trích xuất và chuẩn hóa địa chỉ ảnh gốc khi người dùng dán URL từ Google:
    - Nếu là dạng Google Images viewer: https://www.google.com/imgres?imgurl=https%3A%2F%2F...
      -> Trích xuất URL ảnh gốc trực tiếp từ query param 'imgurl'
    - Nếu là dạng Google Redirect: https://www.google.com/url?sa=i&url=https%3A%2F%2F...
      -> Trích xuất URL từ query param 'url'
    - Chuẩn hóa loại bỏ khoảng trắng thừa
    """
    if not url:
        return url
    cleaned = url.strip()
    try:
        parsed = urllib.parse.urlparse(cleaned)
        netloc = parsed.netloc.lower()
        if "google." in netloc:
            qs = urllib.parse.parse_qs(parsed.query)
            if "imgurl" in qs and qs["imgurl"]:
                return qs["imgurl"][0].strip()
            if "url" in qs and qs["url"]:
                return qs["url"][0].strip()
    except Exception:
        pass
    return cleaned


@router.get("/articles", response_model=List[ArticleResponse])
def get_articles(
    category: Optional[str] = Query(None, description="Lọc theo chuyên mục"),
    search: Optional[str] = Query(None, description="Tìm kiếm trong tiêu đề hoặc tóm tắt"),
    include_unpublished: bool = Query(False, description="Bao gồm cả bài viết ẩn (cho Admin / Tác giả)"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Article)
    if not include_unpublished:
        query = query.filter(Article.is_published == True)
    if category and category != "all":
        query = query.filter(Article.category == category)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Article.title.ilike(search_fmt),
                Article.summary.ilike(search_fmt),
            )
        )

    # Đề bài bắt buộc: sắp xếp theo thứ tự từ mới nhất đến cũ nhất
    return (
        query.order_by(Article.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.get("/articles/{slug_or_id}", response_model=ArticleResponse)
def get_article_detail(
    slug_or_id: str,
    db: Session = Depends(get_db),
):
    query = db.query(Article)
    if slug_or_id.isdigit():
        article = query.filter(or_(Article.slug == slug_or_id, Article.id == int(slug_or_id))).first()
    else:
        article = query.filter(Article.slug == slug_or_id).first()

    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy bài viết",
        )

    # Tăng lượt xem (views)
    try:
        article.views = (article.views or 0) + 1
        db.commit()
        db.refresh(article)
    except Exception:
        db.rollback()

    return article


@router.post("/articles", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
@router.post("/admin/articles", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
def create_article(
    article_in: ArticleCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    # Tạo slug nếu chưa có
    generated_slug = article_in.slug.strip() if article_in.slug else slugify(article_in.title)
    # Đảm bảo slug là duy nhất
    existing = db.query(Article).filter(Article.slug == generated_slug).first()
    if existing:
        generated_slug = f"{generated_slug}-{int(datetime.utcnow().timestamp())}"

    article = Article(
        title=article_in.title.strip(),
        slug=generated_slug,
        summary=article_in.summary.strip(),
        content=article_in.content,
        thumbnail=clean_image_url(article_in.thumbnail),
        category=article_in.category or "tin-tuc",
        author=current_admin.full_name or "Ban Biên Tập Raycon",
        author_id=str(current_admin.id),
        is_published=article_in.is_published,
        published_at=datetime.utcnow(),
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


@router.put("/articles/{article_id}", response_model=ArticleResponse)
@router.put("/admin/articles/{article_id}", response_model=ArticleResponse)
def update_article(
    article_id: int,
    article_in: ArticleUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy bài viết để cập nhật",
        )

    update_data = article_in.model_dump(exclude_unset=True)
    if "thumbnail" in update_data:
        update_data["thumbnail"] = clean_image_url(update_data["thumbnail"])
    for field, value in update_data.items():
        setattr(article, field, value)

    db.commit()
    db.refresh(article)
    return article


@router.delete("/articles/{article_id}", status_code=status.HTTP_200_OK)
@router.delete("/admin/articles/{article_id}", status_code=status.HTTP_200_OK)
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy bài viết để xóa",
        )

    db.delete(article)
    db.commit()
    return {"message": "Đã xóa bài viết thành công"}

