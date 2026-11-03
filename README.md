# 🎧 FITFLOW - Nền Tảng Thương Mại Điện Tử Thiết Bị Âm Thanh (Full-Stack)

Hệ thống Thương mại Điện tử (E-Commerce) bán thiết bị âm thanh hoàn chỉnh, độc lập và hiện đại. Dự án kết hợp kiến trúc **Frontend Next.js 16 (App Router)** tốc độ cao với **Backend FastAPI (Python)** hiệu năng vượt trội, kết nối cơ sở dữ liệu **MySQL 8.0** chạy qua **Docker Compose** và giao diện quản trị **Admin Dashboard** trực quan.

---

## 🌟 Tổng Quan Kiến Trúc Hệ Thống (Architecture)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        FITFLOW AUDIO E-COMMERCE                        │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│     STOREFRONT (NEXT.JS)     │              │    ADMIN PORTAL (NEXT.JS)    │
│  - Trang chủ & Fan Favorites │              │  - Quản lý Sản phẩm (CRUD)   │
│  - Danh mục (/collections/*) │              │  - Quản lý Đơn hàng & Status │
│  - Chi tiết SP (/products/*) │              │  - Bảo vệ quyền (AdminGuard) │
│  - Giỏ hàng trượt (Drawer)   │              │  - Đăng nhập nhanh 1-Click   │
│  - Trang Thanh toán/Checkout │              │                              │
└──────────────┬───────────────┘              └──────────────┬───────────────┘
               │                                             │
               └──────────────────────┬──────────────────────┘
                                      │ HTTP / REST API (cache: 'no-store')
                                      ▼
                      ┌──────────────────────────────┐
                      │    BACKEND (FASTAPI + ORM)   │
                      │  - Xác thực JWT & Bcrypt     │
                      │  - Quản lý Sản phẩm & Biến thể│
                      │  - Tạo đơn & Tính phí ship   │
                      │  - REST API Swagger Docs     │
                      └──────────────┬───────────────┘
                                     │ SQLAlchemy
                                     ▼
                      ┌──────────────────────────────┐
                      │   DATABASE (DOCKER COMPOSE)  │
                      │  - MySQL 8.0 (Port 3306)     │
                      │  - phpMyAdmin (Port 8080)    │
                      └──────────────────────────────┘
```

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

### Frontend (Storefront & Admin Dashboard)
* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack Engine, React 19)
* **Ngôn ngữ:** TypeScript (Strict Type Safety)
* **Giao diện & Styling:** Tailwind CSS v4, Lucide React Icons
* **Quản lý Trạng thái (State Management):** [Zustand](https://github.com/pmndrs/zustand) với middleware `persist` (Lưu giỏ hàng & phiên đăng nhập an toàn chống lỗi Hydration)
* **Tối ưu hình ảnh:** Hỗ trợ đa nguồn ảnh ngoài qua cấu hình `next.config.ts`

### Backend (REST API Service)
* **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
* **Cơ sở dữ liệu & ORM:** [SQLAlchemy 2.0](https://www.sqlalchemy.org/) kết nối MySQL qua driver `pymysql`
* **Mã hóa & Xác thực:** `bcrypt` nguyên bản và `PyJWT` (chuẩn Bearer Token, phân quyền Admin & Customer)
* **Validation & Serialization:** [Pydantic v2](https://docs.pydantic.dev/) tự động chuyển đổi camelCase/snake_case và ép kiểu số thực (`float`) cho giá tiền

### Hạ tầng (Infrastructure)
* **Database Container:** `mysql:8.0` (Cổng 3306, mã hóa `utf8mb4_unicode_ci`, lưu trữ qua Docker volume)
* **Quản trị Database trực quan:** `phpmyadmin:latest` (Cổng 8080)

---

## ⚡ Các Tính Năng Đã Hoàn Thiện

### 🛒 Dành Cho Khách Hàng (Storefront)
1. **Trang Chủ Hiện Đại:**
   * Banner Hero, Carousel sản phẩm bán chạy (*Fan Favorites*).
   * Khám phá công nghệ lõi (*Core Tech*), câu chuyện thương hiệu (*Brand Story*), đánh giá xác thực (*Reviews*).
2. **Trang Danh Mục Động (`/collections/[slug]`):**
   * Phân loại: *Earbuds*, *Open Audio*, *Headphones*, *Power Tech*, *Special Deals*.
   * Lọc giá (Dưới \$50, Trên \$50), Top đánh giá (4.5★+), Đang giảm giá.
   * Sắp xếp: Giá tăng/giảm dần, Đánh giá, Số lượng reviews.
3. **Trang Chi Tiết Sản Phẩm Động (`/products/[slug]`):**
   * Gallery ảnh đồng bộ thời gian thực theo biến thể màu sắc (*Color Swatches*).
   * Bảng thông số kỹ thuật chi tiết (*Specs*), mô tả chi tiết, chính sách đổi trả.
   * Nút thêm vào giỏ hàng kèm hiệu ứng trực quan.
4. **Giỏ Hàng Trượt (Slide-out Cart Drawer):**
   * Mở/đóng mượt mà từ cạnh phải màn hình.
   * Tăng/giảm số lượng, xóa sản phẩm, hiển thị thanh tiến trình Free Shipping (\$50).
5. **Trang Thanh Toán Hoàn Chỉnh (`/checkout`):**
   * Điền thông tin giao nhận hàng, mã giảm giá (`RAYCON10`), phương thức COD.
   * Gửi đơn trực tiếp vào MySQL, sinh mã đơn hàng chuẩn định dạng `RAY-YYYYMMDD-XXXXXX`.

### 🛡️ Dành Cho Quản Trị Viên (Admin Portal)
1. **Bảo vệ Route (Admin Route Guard):** Chặn truy cập trái phép, tự động kiểm tra quyền Admin sau khi đọc xong bộ nhớ trình duyệt (chống văng khi bấm F5).
2. **Quản Lý Sản Phẩm (`/admin/products`):**
   * Bảng dữ liệu hiển thị toàn bộ sản phẩm trong MySQL.
   * **Form Thêm / Sửa Sản Phẩm:** Tự động tạo mã ID và Slug từ tên sản phẩm, quản lý danh sách biến thể màu sắc (`colors`), thông số kỹ thuật (`specs`), bật/tắt còn hàng (`inStock`) và nổi bật (`featured`).
   * **Xóa Sản Phẩm:** Kèm popup xác nhận an toàn, bảo toàn nguyên vẹn lịch sử đơn hàng cũ.
3. **Quản Lý Đơn Hàng (`/admin/orders`):**
   * Xem danh sách đơn hàng thực tế của khách hàng.
   * Đổi trạng thái đơn hàng tức thì: `pending` ➔ `processing` ➔ `shipped` ➔ `delivered` ➔ `cancelled`.
   * Xem chi tiết sản phẩm, màu sắc, địa chỉ và ghi chú từng đơn.
4. **Đăng Nhập Nhanh (1-Click Demo Login):** Tích hợp nút điền sẵn tài khoản Admin và Customer để tiện kiểm thử phân quyền ngay lập tức.

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```text
raycon-clone/
├── backend/                        # Nguồn mã nguồn Backend FastAPI
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py             # Dependency injection (get_current_admin)
│   │   │   └── v1/
│   │   │       ├── api.py          # Router tổng hợp v1
│   │   │       ├── auth.py         # Endpoints xác thực (/register, /login, /me)
│   │   │       ├── orders.py       # Endpoints đơn hàng
│   │   │       └── products.py     # Endpoints CRUD sản phẩm
│   │   ├── core/
│   │   │   ├── config.py           # Cấu hình Pydantic settings & CORS
│   │   │   ├── database.py         # SQLAlchemy engine & SessionLocal
│   │   │   └── security.py         # Mã hóa Bcrypt & PyJWT
│   │   ├── models/                 # SQLAlchemy Database Models
│   │   │   ├── order.py            # Model Order & OrderItem
│   │   │   ├── product.py          # Model Product (JSON columns)
│   │   │   └── user.py             # Model User & RoleEnum
│   │   ├── schemas/                # Pydantic v2 Data Validation Schemas
│   │   │   ├── base.py             # CamelModel tự động sinh alias camelCase
│   │   │   ├── order.py            # Order schemas
│   │   │   ├── product.py          # Product schemas (Computed href)
│   │   │   └── user.py             # User schemas
│   │   ├── seed/
│   │   │   └── seed.py             # Script nạp dữ liệu mẫu vào MySQL
│   │   └── main.py                 # File khởi động FastAPI
│   ├── .env                        # Biến môi trường Backend
│   └── requirements.txt            # Danh sách thư viện Python
├── docker-compose.yml              # Cấu hình MySQL 8.0 & phpMyAdmin
├── public/                         # Tài nguyên tĩnh (ảnh tai nghe, banner)
├── src/                            # Nguồn mã nguồn Frontend Next.js
│   ├── app/
│   │   ├── admin/                  # Giao diện Quản trị Cửa hàng
│   │   │   ├── login/page.tsx      # Đăng nhập Admin
│   │   │   ├── orders/page.tsx     # Quản lý đơn hàng
│   │   │   ├── products/page.tsx   # Quản lý sản phẩm (Thêm/Sửa/Xóa)
│   │   │   └── layout.tsx          # Layout Admin có Sidebar
│   │   ├── checkout/page.tsx       # Trang Thanh toán đơn hàng
│   │   ├── collections/[slug]/     # Trang Danh mục sản phẩm động
│   │   ├── products/[slug]/        # Trang Chi tiết sản phẩm động
│   │   ├── layout.tsx              # Khung giao diện toàn trang
│   │   └── page.tsx                # Trang chủ (Homepage)
│   ├── components/                 # Các components giao diện React
│   │   ├── admin/admin-guard.tsx   # Component bảo vệ quyền Admin
│   │   └── sites/raycon/           # Header, Footer, Cart Drawer, Modals...
│   ├── data/products.ts            # Dữ liệu fallback dự phòng
│   ├── lib/api.ts                  # HTTP API Client kết nối FastAPI
│   ├── store/                      # Zustand State Stores
│   │   ├── use-auth-store.ts       # Quản lý trạng thái đăng nhập
│   │   └── use-cart-store.ts       # Quản lý giỏ hàng mua sắm
│   └── types/                      # TypeScript Interface & Types
├── next.config.ts                  # Cấu hình Next.js (unoptimized images)
└── package.json                    # Cấu hình dự án & scripts Next.js
```

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN CHI TIẾT

### Bước 1: Khởi động Hạ tầng Database (Docker)
Đảm bảo máy tính đã cài đặt và bật **Docker Desktop**. Tại thư mục gốc của dự án, mở terminal và chạy:

```bash
docker compose up -d
```
*Lệnh này sẽ tự động tải và khởi chạy 2 container:*
* **MySQL 8.0:** `localhost:3306` (Tự động tạo database `raycon_ecommerce`).
* **phpMyAdmin:** `http://localhost:8080` (Dùng để xem và quản lý bảng dữ liệu).

Kiểm tra trạng thái container bằng lệnh:
```bash
docker ps
```

---

### Bước 2: Thiết lập & Khởi chạy Backend FastAPI

1. **Di chuyển vào thư mục backend:**
   ```bash
   cd backend
   ```

2. **Kích hoạt môi trường ảo Python (Virtual Environment):**
   * *Trên Windows (PowerShell):*
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * *Trên macOS / Linux:*
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Cài đặt các gói phụ thuộc:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Nạp dữ liệu mẫu ban đầu (Seed Database):**
   *Chạy lệnh sau để tự động tạo bảng và nạp 2 tài khoản mẫu cùng 7 sản phẩm Raycon vào MySQL:*
   ```bash
   python app/seed/seed.py
   ```
   *(Kết quả hiển thị `[OK] Database seeding completed successfully!` là thành công)*

5. **Khởi chạy máy chủ FastAPI Backend:**
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   * Backend API hoạt động tại: **[http://localhost:8000](http://localhost:8000)**
   * Xem tài liệu Swagger UI tương tác tại: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

### Bước 3: Cài đặt & Khởi chạy Frontend Next.js

Mở một cửa sổ Terminal mới tại thư mục gốc của dự án:

1. **Cài đặt các thư viện Node.js:**
   ```bash
   npm install
   ```

2. **Khởi chạy máy chủ Next.js:**
   ```bash
   npm run dev
   ```

3. **Truy cập ứng dụng trên trình duyệt:**
   👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 DANH SÁCH TÀI KHOẢN & ĐƯỜNG DẪN TRUY CẬP

### 1. Tài khoản Đăng nhập Hệ thống
| Loại tài khoản | Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@raycon.local` | `admin123` | Toàn quyền Thêm/Sửa/Xóa sản phẩm, Đổi trạng thái đơn hàng |
| **Khách hàng (Customer)** | `user@raycon.local` | `user123` | Mua hàng, xem lịch sử đơn cá nhân |

*(Giao diện Đăng nhập có sẵn 2 nút **Demo Login** để điền và đăng nhập ngay trong 1 click).*

### 2. Thông tin Kết nối Cơ sở dữ liệu (MySQL & phpMyAdmin)
* **phpMyAdmin URL:** [http://localhost:8080](http://localhost:8080)
* **Server:** `mysql` (hoặc `localhost:3306`)
* **Username:** `raycon_user` / **Password:** `raycon_password`
* **Root Password:** `rootpassword`
* **Database Name:** `raycon_ecommerce`

### 3. Các Đường dẫn Trọng yếu
* **Cửa hàng (Storefront):** [http://localhost:3000](http://localhost:3000)
* **Danh mục Tai nghe:** [http://localhost:3000/collections/earbuds](http://localhost:3000/collections/earbuds)
* **Trang Giỏ hàng & Checkout:** [http://localhost:3000/checkout](http://localhost:3000/checkout)
* **Trang Đăng nhập Quản trị:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
* **Dashboard Quản lý Sản phẩm:** [http://localhost:3000/admin/products](http://localhost:3000/admin/products)
* **Dashboard Quản lý Đơn hàng:** [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders)
* **FastAPI Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 KIỂM TRA CHẤT LƯỢNG MÃ NGUỒN (CI/CD CHECK)

Trước khi đóng gói hoặc triển khai, chạy lệnh kiểm tra toàn diện:

```bash
npm run check
```
Lệnh sẽ tự động thực thi 3 bước:
1. `npm run lint` — Kiểm tra quy chuẩn cú pháp mã nguồn (ESLint 9).
2. `npm run typecheck` — Kiểm tra toàn vẹn kiểu dữ liệu tĩnh (`tsc --noEmit`).
3. `npm run build` — Biên dịch tối ưu hóa toàn bộ 23 trang production (Next.js Turbopack).

---

## 📄 Bản Quyền
Dự án được xây dựng phục vụ mục đích học tập, nghiên cứu kiến trúc E-commerce Full-Stack hiện đại. Hình ảnh và thương hiệu thuộc quyền sở hữu của Raycon Global Inc.
