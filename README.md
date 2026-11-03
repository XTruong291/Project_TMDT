# Raycon Global Homepage Clone 🎧

Dự án tái hiện (clone) giao diện trang chủ của thương hiệu công nghệ âm thanh **[Raycon Global](https://rayconglobal.com/)**. Dự án được xây dựng với mục tiêu thực hành kỹ thuật Reverse-Engineering giao diện thương mại điện tử (E-Commerce), đảm bảo chuẩn Responsive, tương tác mượt mà và tách bạch dữ liệu sản phẩm theo chuẩn hiện đại.

---

## 🚀 Công nghệ sử dụng (Tech Stack)

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library:** [React 19](https://react.dev/), TypeScript (Strict mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) với hệ màu thiết kế OKLCH
- **UI Primitives:** Base UI / shadcn/ui
- **Icons:** SVG vector trích xuất chuẩn theo nhận diện thương hiệu Raycon
- **Asset Optimization:** Next.js Static Optimization, hình ảnh thực tế tối ưu hóa

---

## ✨ Tính năng nổi bật (Key Features)

1. **Sticky Header & Announcement Bar:**
   - Thanh thông báo khuyến mãi đầu trang (Early Black Friday / Sale).
   - Thanh điều hướng cố định (Sticky Header) với logo Raycon, danh mục nổi bật (Deals màu Coral, Open Audio, Earbuds,...).
   - **Tìm kiếm Realtime:** Hộp thoại tìm kiếm sản phẩm trực tiếp theo tên với gợi ý nhanh.
   - Menu trượt dạng drawer trên thiết bị di động (Mobile Responsive).

2. **Hero Banner & Split Banners:**
   - Banner mở đầu *"Before the rush starts."* với hình nền chuẩn nhận diện và nút kêu gọi hành động (*Shop The Sale*).
   - Banner chuyển tiếp *"Press play on your day."* và banner chốt trang *"Ready for Whatever's Next."*.

3. **Fan Favorites (Best Sellers Carousel):**
   - Danh sách sản phẩm bán chạy nhất (`Everyday Earbuds`, `Bone Conduction Gen 1`, `Essential Open Earbuds`, `Everyday Clip Earbuds`).
   - Huy hiệu giảm giá màu Coral (`20% OFF`, `30% OFF`, `40% OFF`).
   - **Bộ chọn màu tương tác (Color Swatches):** Click chọn màu sẽ tự động chuyển đổi ảnh đại diện sản phẩm tương ứng theo thời gian thực.
   - Đánh giá sao, số lượng review, hiển thị giá khuyến mãi kèm giá niêm yết gạch ngang.

4. **Shop by Category:**
   - 4 danh mục chính: *Open Audio*, *Earbuds*, *Headphones*, *Power Tech*.
   - Hiệu ứng zoom ảnh khi rê chuột (Hover Scale).

5. **Raycon Core Tech (Chi tiết công nghệ):**
   - Đồ họa vector sóng xoay góc đặc trưng của Raycon.
   - Thẻ thông số thời lượng pin ấn tượng (**40 hrs** kèm icon pin).
   - Đồ họa tai nghe kèm 3 chú thích nét đứt chỉ vào từng tính năng kỹ thuật: *Featherlight Fit*, *Tuned 6MM Drivers*, *IPX4 Waterproof*.

6. **Brand Story & Reviews:**
   - 3 thẻ giá trị thương hiệu: *Effortless Tech*, *Fits your Style*, *Built to Last*.
   - Mục đánh giá khách hàng *"5 Million+ and Counting"* với nền màu pastel (cyan, peach, lilac), dấu ngoặc kép lớn và nhãn *Verified Buyer*.

7. **Footer & Đăng ký nhận tin:**
   - Form nhận bản tin *"Shop With Us - Your favorite email, probably."* có phản hồi trạng thái đăng ký thành công.
   - Hệ thống liên kết mạng xã hội (*Instagram, YouTube, Facebook, Twitter*), danh mục thông tin sản phẩm và chính sách bảo hành.

8. **Tách biệt dữ liệu (E-Commerce Data Separation):**
   - Không hardcode thông tin sản phẩm trong mã nguồn JSX. Toàn bộ thông tin giá cả, hình ảnh, swatch màu, đánh giá được quản lý tập trung và định kiểu chặt chẽ trong `src/data/products.ts`.

---

## 📁 Cấu trúc thư mục (Project Structure)

```text
├── docs/                           # Tài liệu phân tích & ảnh tham chiếu
│   ├── design-references/raycon/   # Ảnh chụp đối chiếu Desktop (1440x900) & Mobile
│   └── research/raycon/            # Trích xuất màu sắc, typography & page brief
├── public/sites/raycon/images/     # Toàn bộ hình ảnh, swatch màu, banner của trang
├── src/
│   ├── app/                        # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   ├── components/sites/raycon/    # Các section độc lập của trang chủ
│   │   ├── announcement-bar.tsx    # Thanh thông báo trên cùng
│   │   ├── header.tsx              # Header và thanh tìm kiếm tương tác
│   │   ├── hero-banner.tsx         # Banner Hero mở đầu
│   │   ├── best-sellers.tsx        # Section Fan Favorites
│   │   ├── product-card.tsx        # Thẻ sản phẩm kèm bộ chọn màu
│   │   ├── press-play-banner.tsx   # Banner chuyển tiếp giữa trang
│   │   ├── category-grid.tsx       # Lưới danh mục sản phẩm
│   │   ├── core-tech.tsx           # Thông số kỹ thuật & chú thích tính năng
│   │   ├── brand-story.tsx         # Câu chuyện thương hiệu
│   │   ├── reviews.tsx             # Đánh giá khách hàng
│   │   ├── closing-cta.tsx         # Banner kêu gọi hành động cuối trang
│   │   ├── footer.tsx              # Footer & Form newsletter
│   │   └── icons.tsx               # Hệ thống biểu tượng SVG chuẩn
│   └── data/
│       └── products.ts             # Cơ sở dữ liệu mẫu (Sản phẩm, Màu sắc, Danh mục, Review)
```

---

## 🛠️ Hướng dẫn cài đặt & Khởi chạy (Getting Started)

### 1. Yêu cầu môi trường
- [Node.js](https://nodejs.org/) phiên bản **20.x** trở lên (khuyên dùng Node 22/24).
- Trình quản lý gói `npm` (đi kèm Node.js).

### 2. Cài đặt các thư viện phụ thuộc
Mở terminal tại thư mục gốc của dự án và chạy:
```bash
npm install
```

### 3. Khởi chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Sau khi khởi chạy thành công, mở trình duyệt và truy cập:
👉 **[http://localhost:3000](http://localhost:3000)**

*(Nếu cổng 3000 bị chiếm dụng bởi tiến trình khác, bạn có thể chỉ định cổng khác, ví dụ:* `npm run dev -- -p 3005`*).*

---

## 🧪 Kiểm tra chất lượng mã nguồn (Code Quality Check)

Dự án đã thiết lập quy trình kiểm thử đồng bộ bao gồm: kiểm tra cú pháp ESLint, kiểm tra kiểu tĩnh TypeScript và biên dịch kiểm thử Next.js:

```bash
npm run check
```
> Lệnh này sẽ lần lượt chạy: `npm run lint` && `npm run typecheck` && `npm run build`.

---

## 📦 Đóng gói ứng dụng chạy thực tế (Production Build)

Khi cần triển khai (deploy) lên Vercel, Netlify hoặc máy chủ riêng:
```bash
# 1. Tạo bản build tối ưu
npm run build

# 2. Khởi chạy bản production build
npm run start
```

---

## ⚠️ Tuyên bố miễn trừ trách nhiệm (Disclaimer)

Dự án này được thực hiện phục vụ cho **mục đích học tập và nghiên cứu công nghệ phát triển web / thương mại điện tử**. Mọi bản quyền về nhãn hiệu, hình ảnh, văn bản và thiết kế thuộc về **[Raycon Global Inc.](https://rayconglobal.com/)**.
