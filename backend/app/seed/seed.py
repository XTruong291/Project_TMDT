"""
Database seeding script for Raycon E-commerce.
Populates MySQL with default Admin/Customer users, 7 Raycon products (with SKU & Subcategories), Coupons, and Product Reviews.
"""
import sys
from pathlib import Path
from sqlalchemy import text

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models.user import User, RoleEnum
from app.models.product import Product
from app.models.review import ProductReview
from app.models.coupon import Coupon
from app.models.about_section import AboutSection
from app.models.article import Article
from app.models.contact import Contact
from app.models.site_analytics import SiteAnalytics

IMG = "/sites/raycon/images"

SEED_PRODUCTS = [
    {
        "id": "everyday-earbuds",
        "handle": "the-everyday-earbuds",
        "name": "Everyday Earbuds",
        "sku": "RYVO-E25-BLK",
        "tagline": "Pocket-size sound for active days.",
        "category": "earbuds",
        "sub_category": "true-wireless",
        "collection_slug": "earbuds",
        "image": f"{IMG}/E25_BLA_IMG1.png",
        "price": 1590000.0,
        "compare_at_price": 1990000.0,
        "badge": "20% OFF",
        "rating": 4.8,
        "review_count": 5,
        "featured": True,
        "in_stock": True,
        "is_active": True,
        "description": "Engineered for daily life, the Everyday Earbuds pack custom-tuned 6mm drivers into an ultra-compact, ergonomic body. Featuring seamless Bluetooth 5.2 pairing, crystal-clear microphone audio, and up to 40 hours of playtime with the pocket charging case.",
        "gallery_images": [
            f"{IMG}/E25_BLA_IMG1.png",
            f"{IMG}/E25_BLU_IMG1.png",
            f"{IMG}/earbuds-detail-trim.png",
            f"{IMG}/raycon-case.png",
        ],
        "specs": [
            {"label": "Battery Life", "value": "8 hours per charge (40 hrs total)"},
            {"label": "Bluetooth", "value": "Version 5.2 (10m range)"},
            {"label": "Water Resistance", "value": "IPX4 Water & Sweat Proof"},
            {"label": "Drivers", "value": "6mm Neodymium Dynamic Drivers"},
            {"label": "Charging", "value": "USB-C & Wireless Charging"},
            {"label": "Weight", "value": "4.2g per earbud"},
        ],
        "colors": [
            {
                "name": "Carbon Black",
                "swatch": f"{IMG}/swatch-black_200x.png",
                "image": f"{IMG}/E25_BLA_IMG1.png",
            },
            {
                "name": "Electric Blue",
                "swatch": f"{IMG}/swatch-electric-blue_200x.png",
                "image": f"{IMG}/E25_BLU_IMG1.png",
            },
            {
                "name": "Rose Gold",
                "swatch": f"{IMG}/swatch-black_180x.png",
                "image": f"{IMG}/E25_ROS_IMG1.png",
            },
            {
                "name": "Cool Mint",
                "swatch": f"{IMG}/swatch-mint_200x.png",
                "image": f"{IMG}/E25_MIN_IMG1.png",
            },
            {
                "name": "Blush Violet",
                "swatch": f"{IMG}/swatch_purple-violet_200x.jpg",
                "image": f"{IMG}/E25_PUR_IMG1.png",
            },
        ],
    },
    {
        "id": "bone-conduction-gen-1",
        "handle": "bone-conduction-headphones",
        "name": "Everyday Bone Conduction Headphones (Gen 1)",
        "sku": "RYVO-BONE-BLU",
        "tagline": "Total awareness for bud-free listening.",
        "category": "headphones",
        "sub_category": "bone-conduction",
        "collection_slug": "headphones",
        "image": f"{IMG}/bc-blue.png",
        "price": 1750000.0,
        "compare_at_price": 2490000.0,
        "badge": "30% OFF",
        "rating": 4.7,
        "review_count": 3,
        "featured": True,
        "in_stock": True,
        "is_active": True,
        "description": "Deliver sound through your cheekbones directly to your inner ears, leaving your ears completely open to ambient sound. Perfect for outdoor runners, cyclists, and professionals needing all-day environmental awareness.",
        "gallery_images": [
            f"{IMG}/bc-blue.png",
            f"{IMG}/RBB842_CAROUSEL_IMG2_720x.png",
            f"{IMG}/RBB842_PUR_CAROUSEL_IMG2.png",
        ],
        "specs": [
            {"label": "Battery Life", "value": "10 hours continuous playtime"},
            {"label": "Bluetooth", "value": "Bluetooth 5.3 Multipoint"},
            {"label": "Design", "value": "Open-Ear Titanium Wrap-around"},
            {"label": "Water Resistance", "value": "IP55 Water Resistant"},
            {"label": "Microphone", "value": "Dual Dual-Mic Noise Reduction"},
            {"label": "Charging", "value": "Magnetic Quick Charge"},
        ],
        "colors": [
            {
                "name": "Royal Blue",
                "swatch": f"{IMG}/swatch-royal-blue_200x.png",
                "image": f"{IMG}/bc-blue.png",
            },
            {
                "name": "Gray",
                "swatch": f"{IMG}/swatch-carbon-black_200x.png",
                "image": f"{IMG}/RBB842_CAROUSEL_IMG2_720x.png",
            },
        ],
    },
    {
        "id": "essential-open-earbuds",
        "handle": "essential-open-earbuds",
        "name": "Essential Open Earbuds",
        "sku": "RYVO-OPEN-BLK",
        "tagline": "Minimalist design for all day comfort.",
        "category": "open-audio",
        "sub_category": "open-clip",
        "collection_slug": "open-audio",
        "image": f"{IMG}/515.2514_6e551754-ab11-46e0-9eca-d9cb9a6e0ea6.png",
        "price": 1190000.0,
        "compare_at_price": 1990000.0,
        "badge": "40% OFF",
        "rating": 5.0,
        "review_count": 2,
        "featured": True,
        "in_stock": True,
        "is_active": True,
        "description": "Ultralight hook-style open-ear buds designed for featherlight fit with zero ear pressure. Stream music, take conference calls, and stay tuned into your surroundings simultaneously.",
        "gallery_images": [
            f"{IMG}/515.2514_6e551754-ab11-46e0-9eca-d9cb9a6e0ea6.png",
            f"{IMG}/511.2510_45f8dead-6bfa-4a78-bba8-3a7045131a05.png",
            f"{IMG}/O15_BLA_IMG2_1ddc0f96-909d-44eb-b15d-70bf2b496d24_720x.png",
        ],
        "specs": [
            {"label": "Battery Life", "value": "32 hours total with charging case"},
            {"label": "Audio Profile", "value": "Directional Acoustic Bass"},
            {"label": "Form Factor", "value": "Flexible Memory Wire Earhooks"},
            {"label": "Weight", "value": "5.1g per earbud"},
            {"label": "Water Resistance", "value": "IPX5 Splash-proof"},
        ],
        "colors": [
            {
                "name": "Carbon Black",
                "swatch": f"{IMG}/swatch-carbonblack_200x.png",
                "image": f"{IMG}/515.2514_6e551754-ab11-46e0-9eca-d9cb9a6e0ea6.png",
            },
            {
                "name": "Midnight Blue",
                "swatch": f"{IMG}/swatch-royal-blue_180x.png",
                "image": f"{IMG}/511.2510_45f8dead-6bfa-4a78-bba8-3a7045131a05.png",
            },
            {
                "name": "Cool Mint",
                "swatch": f"{IMG}/swatch-mint_180x.png",
                "image": f"{IMG}/O15_BLA_IMG2_1ddc0f96-909d-44eb-b15d-70bf2b496d24_720x.png",
            },
        ],
    },
    {
        "id": "everyday-clip-earbuds",
        "handle": "everyday-clip-earbuds",
        "name": "Everyday Clip Earbuds",
        "sku": "RYVO-CLIP-BLK",
        "tagline": "Lightweight, clip-on sound that never gets in the way.",
        "category": "open-audio",
        "sub_category": "open-clip",
        "collection_slug": "open-audio",
        "image": f"{IMG}/O55_bla_002_V1.png",
        "price": 1750000.0,
        "compare_at_price": 2490000.0,
        "badge": "30% OFF",
        "rating": 4.5,
        "review_count": 2,
        "featured": True,
        "in_stock": True,
        "is_active": True,
        "description": "A revolutionary clip-on jewelry-style audio accessory that clamps gently around the outer ear cartilage. Delivers spatial sound directly to your ear canal without blocking outside voices.",
        "gallery_images": [
            f"{IMG}/O55_bla_002_V1.png",
            f"{IMG}/O55_blu_002_V1.png",
            f"{IMG}/O55_pur_002_V1.png",
        ],
        "specs": [
            {"label": "Battery Life", "value": "36 hours with pebble charging case"},
            {"label": "Fit Style", "value": "Ear-cuff Clip design"},
            {"label": "Sound Leakage", "value": "Reverse sound wave cancellation"},
            {"label": "Water Resistance", "value": "IPX4 Weather Resistant"},
        ],
        "colors": [
            {
                "name": "Carbon Black",
                "swatch": f"{IMG}/swatch-carbonblack_180x.png",
                "image": f"{IMG}/O55_bla_002_V1.png",
            },
            {
                "name": "Midnight Blue",
                "swatch": f"{IMG}/swatch-royal-blue_200x.png",
                "image": f"{IMG}/O55_blu_002_V1.png",
            },
            {
                "name": "Blush Violet",
                "swatch": f"{IMG}/swatch-blush_200x.png",
                "image": f"{IMG}/O55_pur_002_V1.png",
            },
        ],
    },
    {
        "id": "fitness-earbuds",
        "handle": "the-fitness-earbuds",
        "name": "Fitness Earbuds",
        "sku": "RYVO-FIT-BLU",
        "tagline": "A perfect fit to keep you in the zone.",
        "category": "earbuds",
        "sub_category": "sport-fitness",
        "collection_slug": "earbuds",
        "image": f"{IMG}/E45_BLU_IMG1_d64b334f-cb84-48a3-b8fb-9c0a8e264cee.png",
        "price": 2090000.0,
        "compare_at_price": 2990000.0,
        "badge": "NEW - 30% OFF",
        "rating": 4.7,
        "review_count": 3,
        "featured": False,
        "in_stock": True,
        "is_active": True,
        "description": "Designed specifically for intense workouts, HIIT, and running. Includes interchangeable sport gel stabilizers that lock the earbuds in place no matter how hard you train. IPX7 waterproof rating withstands full sweat saturation.",
        "gallery_images": [
            f"{IMG}/E45_BLU_IMG1_d64b334f-cb84-48a3-b8fb-9c0a8e264cee.png",
            f"{IMG}/E45_BLA_IMG1_38763fde-0fa4-4df2-9058-ac46da7a1924.png",
            f"{IMG}/E45_Carousel_BLA_IMG2_720x.png",
        ],
        "specs": [
            {"label": "Battery Life", "value": "54 hours playtime with case"},
            {"label": "Waterproof", "value": "IPX7 Submersible Waterproof"},
            {"label": "Stabilizers", "value": "4 sets of sport wings included"},
            {"label": "Sound Modes", "value": "Pure Sound, Balanced Sound, Bass Boost"},
        ],
        "colors": [
            {
                "name": "Carbon Black",
                "swatch": f"{IMG}/swatch-black_200x.png",
                "image": f"{IMG}/E45_BLA_IMG1_38763fde-0fa4-4df2-9058-ac46da7a1924.png",
            },
            {
                "name": "Midnight Blue",
                "swatch": f"{IMG}/swatch-royal-blue_200x.png",
                "image": f"{IMG}/E45_BLU_IMG1_d64b334f-cb84-48a3-b8fb-9c0a8e264cee.png",
            },
        ],
    },
    {
        "id": "everyday-headphones",
        "handle": "the-everyday-h20-headphones",
        "name": "Everyday Headphones",
        "sku": "RYVO-H20-BLK",
        "tagline": "Built for long days, tuned for every sound.",
        "category": "headphones",
        "sub_category": "over-ear-anc",
        "collection_slug": "headphones",
        "image": f"{IMG}/H20_BLA_IMG1_720x.png",
        "price": 1750000.0,
        "compare_at_price": 2490000.0,
        "badge": "30% OFF",
        "rating": 4.8,
        "review_count": 4,
        "featured": False,
        "in_stock": True,
        "is_active": True,
        "description": "Over-ear comfort with memory foam ear cushions and an ultra-flexible lightweight headband. Features active noise cancellation (ANC) and an impressive 38-hour battery for cross-country flights and deep work sessions.",
        "gallery_images": [f"{IMG}/H20_BLA_IMG1_720x.png"],
        "specs": [
            {"label": "Battery Life", "value": "38 hours battery runtime"},
            {"label": "Noise Cancellation", "value": "Active Noise Cancellation (ANC)"},
            {"label": "Driver Size", "value": "40mm High-Definition Drivers"},
            {"label": "Connectivity", "value": "Bluetooth 5.0 + 3.5mm AUX jack"},
        ],
        "colors": [
            {
                "name": "Carbon Black",
                "swatch": f"{IMG}/swatch-black_200x.png",
                "image": f"{IMG}/H20_BLA_IMG1_720x.png",
            },
        ],
    },
    {
        "id": "magic-spin-cable",
        "handle": "magic-spin-cable",
        "name": "Magic Spin Cable",
        "sku": "RYVO-SPN-BLK",
        "tagline": "Ends rotate 180 degrees for frayproof charging.",
        "category": "power-tech",
        "sub_category": "fast-cables",
        "collection_slug": "power-tech",
        "image": f"{IMG}/SPN61C_BLA_CAROUSEL_IMG1_720x.png",
        "price": 490000.0,
        "compare_at_price": 590000.0,
        "badge": None,
        "rating": 4.9,
        "review_count": 3,
        "featured": False,
        "in_stock": True,
        "is_active": True,
        "description": "Tangle-free, heavy-duty braided charging cable featuring a 180-degree rotating pivot head. Eliminates cable strain while gaming or using your device in bed.",
        "gallery_images": [
            f"{IMG}/SPN61C_BLA_CAROUSEL_IMG1_720x.png",
            f"{IMG}/SPN61C_MINT_CAROUSEL_IMG1_360x.png",
        ],
        "specs": [
            {"label": "Length", "value": "6 ft / 1.8m braided nylon"},
            {"label": "Rotation", "value": "180° swivel connector"},
            {"label": "Power Output", "value": "Up to 60W Fast Charging"},
            {"label": "Durability", "value": "20,000+ bend lifespan test"},
        ],
        "colors": [
            {
                "name": "Carbon Black",
                "swatch": f"{IMG}/swatch-black_200x.png",
                "image": f"{IMG}/SPN61C_BLA_CAROUSEL_IMG1_720x.png",
            },
            {
                "name": "Cool Mint",
                "swatch": f"{IMG}/swatch-mint_200x.png",
                "image": f"{IMG}/SPN61C_MINT_CAROUSEL_IMG1_360x.png",
            },
        ],
    },
]

SEED_COUPONS = [
    {
        "code": "RYVO10",
        "discount_type": "percent",
        "discount_value": 10.0,
        "min_order_amount": 0.0,
        "description": "Ưu đãi RYVO: Giảm ngay 10% trên tổng giá trị đơn hàng",
        "is_active": True,
    },
    {
        "code": "RYVO20",
        "discount_type": "percent",
        "discount_value": 20.0,
        "min_order_amount": 1000000.0,
        "description": "Ưu đãi RYVO: Giảm 20% cho đơn hàng từ 1.000.000₫ trở lên",
        "is_active": True,
    },
    {
        "code": "FREESHIP",
        "discount_type": "fixed",
        "discount_value": 30000.0,
        "min_order_amount": 500000.0,
        "description": "Miễn phí cước giao hàng (Giảm 30.000₫ cho đơn từ 500.000₫)",
        "is_active": True,
    },
    {
        "code": "RAYCON10",
        "discount_type": "percent",
        "discount_value": 10.0,
        "min_order_amount": 0.0,
        "description": "Giảm ngay 10% trên tổng giá trị đơn hàng",
        "is_active": True,
    },
    {
        "code": "RAYCON20",
        "discount_type": "percent",
        "discount_value": 20.0,
        "min_order_amount": 1000000.0,
        "description": "Giảm 20% cho đơn hàng từ 1.000.000₫ trở lên",
        "is_active": True,
    },
]

SEED_REVIEWS = [
    {
        "product_id": "everyday-earbuds",
        "author_name": "Minh Quân",
        "author_email": "quan.minh@example.com",
        "rating": 5,
        "title": "Chất âm tuyệt vời, bass sâu uy lực!",
        "comment": "Mình đã dùng qua nhiều dòng tai nghe nhưng chiếc Everyday Earbuds này thực sự gây bất ngờ. Thiết kế nhỏ gọn, đút vừa túi quần, pin dùng cả tuần mới phải sạc một lần.",
    },
    {
        "product_id": "everyday-earbuds",
        "author_name": "Thuỳ Linh",
        "author_email": "linh.thuy@example.com",
        "rating": 5,
        "title": "Đeo rất êm tai, màu xanh cực đẹp",
        "comment": "Tai nghe ôm khít tai không bị rơi khi chạy bộ. Màu Electric Blue ở ngoài nhìn sang và nổi bật hơn trên ảnh nhiều. Rất đáng tiền!",
    },
    {
        "product_id": "everyday-earbuds",
        "author_name": "Tuấn Anh",
        "author_email": "tuan.anh@example.com",
        "rating": 4,
        "title": "Micro đàm thoại rõ ràng, kết nối nhanh",
        "comment": "Mở nắp hộp là tự kết nối với iPhone ngay lập tức. Mic lọc tiếng ồn tốt khi gọi điện ngoài đường. Hài lòng với sản phẩm.",
    },
    {
        "product_id": "everyday-headphones",
        "author_name": "Hoàng Nam",
        "author_email": "nam.hoang@example.com",
        "rating": 5,
        "title": "Chống ồn ANC cực đỉnh trong tầm giá",
        "comment": "Đệm tai bằng mút hoạt tính cực kỳ êm, đeo suốt 4 tiếng làm việc mà không hề bị cấn hay nóng tai. Bật ANC lên là không gian xung quanh tĩnh lặng hoàn toàn.",
    },
    {
        "product_id": "everyday-headphones",
        "author_name": "Bảo Ngọc",
        "author_email": "ngoc.bao@example.com",
        "rating": 5,
        "title": "Pin siêu trâu, thiết kế cao cấp",
        "comment": "Mình dùng cả tuần đi học và làm đồ án mà pin vẫn còn hơn 50%. Âm thanh ấm, nghe podcast và nhạc Lofi cực kỳ dễ chịu.",
    },
    {
        "product_id": "fitness-earbuds",
        "author_name": "Đức Thịnh",
        "author_email": "thinh.duc@example.com",
        "rating": 5,
        "title": "Vũ khí không thể thiếu khi tập Gym và chạy bộ",
        "comment": "Có móc gài thể thao nên tập tạ hay nhảy dây không bao giờ sợ rơi. Khả năng chống nước IPX7 mồ hôi ướt đẫm vẫn nghe ầm ầm.",
    },
    {
        "product_id": "bone-conduction-gen-1",
        "author_name": "Trọng Hiếu",
        "author_email": "hieu.trong@example.com",
        "rating": 5,
        "title": "Vừa nghe nhạc vừa nghe được tiếng xe cộ an toàn",
        "comment": "Công nghệ truyền âm qua xương rất độc đáo, không nhét vào lỗ tai nên tai lúc nào cũng thông thoáng. Đạp xe trên phố rất an tâm.",
    },
    {
        "product_id": "magic-spin-cable",
        "author_name": "Văn Dũng",
        "author_email": "dung.van@example.com",
        "rating": 5,
        "title": "Đầu xoay 180 độ vừa nằm lướt điện thoại vừa sạc cực tiện",
        "comment": "Dây bọc dù dày dặn chống đứt gãy. Đầu cắm xoay linh hoạt không bị cấn tay khi chơi game.",
    },
]

SEED_ABOUT_SECTIONS = [
    {
        "title": "RYVO Audio - Kỷ nguyên Âm thanh Không dây Thông minh",
        "category": "company_overview",
        "content": "Được sáng lập với niềm đam mê âm học hiện đại cùng các chuyên gia hàng đầu ngành âm thanh, RYVO ra đời với sứ mệnh xóa bỏ rào cản giá cả đối với các thiết bị âm thanh không dây cao cấp. Chúng tôi tin rằng âm thanh tuyệt hảo không nhất thiết phải đi kèm mức giá xa xỉ, mà phải đồng hành cùng nhịp sống hàng ngày của tất cả mọi người.",
        "image_url": f"{IMG}/earbuds-lifestyle.png",
        "is_visible": True,
        "sort_order": 1,
    },
    {
        "title": "Hệ sinh thái Sản phẩm & Dịch vụ Âm thanh RYVO",
        "category": "products_services",
        "content": "RYVO cung cấp dải sản phẩm hoàn chỉnh phục vụ cuộc sống năng động: từ dòng tai nghe nhét tai True Wireless siêu nhỏ gọn (Everyday Earbuds), tai nghe truyền âm qua xương (Bone Conduction), tai nghe chụp tai chống ồn chủ động (Everyday Headphones ANC) cho tới cáp sạc nhanh đa năng Magic Spin. Mọi sản phẩm đều đi kèm chính sách đổi trả 30 ngày và bảo hành chính hãng 1 năm.",
        "image_url": f"{IMG}/E25_BLA_IMG1.png",
        "is_visible": True,
        "sort_order": 2,
    },
    {
        "title": "Tầm nhìn & Sứ mệnh Thương hiệu",
        "category": "mission_vision",
        "content": "Sứ mệnh của chúng tôi là truyền cảm hứng cho những con người bận rộn, người sáng tạo và thế hệ trẻ vươn tới mục tiêu mỗi ngày bằng âm thanh giàu năng lượng. Tầm nhìn 2030: Trở thành thương hiệu âm thanh cá nhân số 1 về trải nghiệm người dùng thực tế và độ bền bỉ trong phân khúc dưới 3.500.000₫.",
        "image_url": f"{IMG}/open-audio-lifestyle.png",
        "is_visible": True,
        "sort_order": 3,
    },
    {
        "title": "Cam kết Chất lượng & Trải nghiệm Khách hàng Vượt trội",
        "category": "company_overview",
        "content": "Hơn 2 triệu khách hàng trên toàn thế giới đã tin tưởng RYVO. Mỗi sản phẩm trước khi xuất xưởng đều trải qua quy trình kiểm thử độ bền 10.000 giờ, chuẩn kháng nước IPX4/IPX7 và tinh chỉnh âm học Signature Sound độc quyền mang lại âm bass sâu lắng và giọng hát trong trẻo.",
        "image_url": f"{IMG}/headphones-lifestyle.png",
        "is_visible": True,
        "sort_order": 4,
    },
]

SEED_ARTICLES = [
    {
        "slug": "ryvo-ra-mat-dong-tai-nghe-chong-on-anc-everyday-pro",
        "title": "RYVO chính thức ra mắt tai nghe chống ồn ANC Everyday Pro thế hệ mới",
        "summary": "Dòng tai nghe chụp tai hàng đầu của RYVO nâng cấp công nghệ chống ồn chủ động Hybrid ANC 35dB, thời lượng pin 45 giờ cùng chất âm cân bằng chuyên nghiệp.",
        "content": "Hôm nay, RYVO chính thức công bố thế hệ tai nghe không dây Everyday Pro Headphones với nhiều cải tiến mang tính đột phá dành cho giới làm việc văn phòng và người thường xuyên di chuyển.\n\nĐiểm nhấn lớn nhất là chip xử lý ANC thế hệ 3, giúp triệt tiêu tiếng ồn từ môi trường văn phòng, quán cà phê hoặc trên máy bay lên tới 35dB. Ngoài ra, đệm tai bọc da protein công thái học thoáng khí mang lại cảm giác đeo nhẹ êm suốt cả ngày dài.\n\nSản phẩm được trang bị hệ thống 4 microphone định hướng chùm sóng lọc gió, đàm thoại trong trẻo dù đang đi dạo trên phố hay tham gia các cuộc họp trực tuyến quan trọng. Hiện sản phẩm đã có mặt trên hệ thống RYVO Store với giá bán ưu đãi 2.290.000₫.",
        "thumbnail": f"{IMG}/headphones-lifestyle.png",
        "category": "su-kien",
        "author": "Ban Biên Tập RYVO",
        "is_published": True,
    },
    {
        "slug": "cong-nghe-truyen-am-qua-xuong-bone-conduction-hoat-dong-the-nao",
        "title": "Công nghệ truyền âm qua xương (Bone Conduction) hoạt động như thế nào?",
        "summary": "Khám phá nguyên lý khoa học đằng sau dòng tai nghe Open Ear - nghe nhạc rõ nét mà vẫn cảm nhận trọn vẹn âm thanh xung quanh khi chạy bộ và tập gym.",
        "content": "Khác với tai nghe truyền thống truyền sóng âm qua màng nhĩ, công nghệ Bone Conduction truyền rung động âm thanh thẳng qua xương gò má vào ốc tai.\n\nĐiều này mang lại 3 ưu điểm vượt trội cho người chơi thể thao:\n1. Giữ cho ống tai luôn mở thông thoáng: Không gây bí bách hay tích tụ mồ hôi khi vận động cường độ cao.\n2. Nâng cao an toàn: Bạn có thể nghe rõ tiếng còi xe, tiếng người gọi hoặc thông báo ga tàu trong khi vẫn đang thưởng thức playlist yêu thích.\n3. Bảo vệ thính lực lâu dài: Giảm áp lực trực tiếp lên màng nhĩ nhạy cảm.\n\nDòng RYVO Everyday Bone Conduction Headphones đã được kiểm nghiệm độ bám chắc chắn ngay cả khi bạn chạy nước rút hay nhảy dây.",
        "thumbnail": f"{IMG}/open-audio-lifestyle.png",
        "category": "cong-nghe-am-thanh",
        "author": "Kỹ Sư Âm Học RYVO",
        "is_published": True,
    },
    {
        "slug": "huong-dan-chon-profile-am-thanh-pure-balanced-bass",
        "title": "Hướng dẫn chọn 3 chế độ âm thanh: Pure Sound, Balanced Sound & Bass Boost",
        "summary": "Làm chủ 3 profile âm thanh độc quyền tích hợp sẵn trên tai nghe RYVO chỉ với một chạm để tối ưu cho từng thể loại nhạc và podcast.",
        "content": "Tai nghe RYVO được lập trình sẵn 3 chế độ EQ vật lý mà bạn không cần phải cài thêm bất kỳ ứng dụng nặng nề nào vào điện thoại. Chỉ cần nhấn giữ nút chức năng trong 2 giây để chuyển đổi:\n\n1. Pure Sound (Âm thanh mộc): Tối ưu hóa dải trung, giảm thiểu tạp âm nền, cực kỳ phù hợp cho nghe Podcast, Audio book và đàm thoại rõ ràng.\n2. Balanced Sound (Âm thanh cân bằng): Cân bằng hài hòa giữa dải trung và cao, phù hợp cho nhạc Pop, Jazz, Acoustic và xem phim trực tuyến.\n3. Bass Boost (Tăng cường âm trầm): Đẩy mạnh dải âm siêu trầm, tạo nhịp điệu bùng nổ tràn đầy năng lượng cho các buổi tập Gym, chạy bộ với nhạc EDM, Rock hoặc Hip-hop.\n\nHãy thử nghiệm cả 3 chế độ trên chiếc Everyday Earbuds của bạn ngay hôm nay!",
        "thumbnail": f"{IMG}/earbuds-lifestyle.png",
        "category": "tin-tuc",
        "author": "Ban Biên Tập RYVO",
        "is_published": True,
    },
    {
        "slug": "chuong-trinh-doi-cu-lay-moi-va-bao-ve-moi-truong-2026",
        "title": "RYVO phát động chương trình Thu cũ đổi mới & Tái chế xanh 2026",
        "summary": "Hỗ trợ khách hàng nâng cấp tai nghe cũ lên các dòng sản phẩm RYVO mới nhất với voucher trợ giá lên tới 25%, chung tay giảm thiểu rác thải điện tử.",
        "content": "Nhằm lan tỏa thông điệp sống xanh và phát triển bền vững, RYVO khởi động chiến dịch 'Green Beats 2026' trên toàn hệ thống từ tháng 11/2026.\n\nChính sách chương trình bao gồm:\n- Tiếp nhận mọi thiết bị tai nghe cũ thuộc bất kỳ thương hiệu nào (kể cả đã hỏng).\n- Tặng ngay Voucher giảm giá 20% - 25% khi mua các dòng tai nghe RYVO chính hãng mới.\n- Toàn bộ linh kiện pin Lithium và nhựa thu gom sẽ được chuyển giao cho các đối tác xử lý rác thải công nghệ theo tiêu chuẩn RoHS quốc tế.\n\nHãy cùng RYVO vừa nâng tầm trải nghiệm âm nhạc, vừa bảo vệ môi trường sống của chúng ta!",
        "thumbnail": f"{IMG}/E25_BLU_IMG1.png",
        "category": "khuyen-mai",
        "author": "Phòng Trách Nhiệm Xã Hội RYVO",
        "is_published": True,
    },
]

SEED_CONTACTS = [
    {
        "full_name": "Nguyễn Văn Hùng",
        "email": "hung.nv@gmail.com",
        "phone": "0912345678",
        "address": "128 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh",
        "subject": "Tư vấn mua tai nghe chạy bộ",
        "message": "Chào RYVO, tôi muốn được tư vấn dòng tai nghe Bone Conduction cho người chạy marathon ngoài trời, pin dùng được bao lâu và có chống nước mưa tốt không?",
        "status": "unread",
    },
    {
        "full_name": "Trần Thị Mai Phương",
        "email": "phuong.tran@gmail.com",
        "phone": "0988776655",
        "address": "45 Hoàng Hoa Thám, Phường Liễu Giai, Quận Ba Đình, Hà Nội",
        "subject": "Hợp tác đại lý phân phối sản phẩm RYVO",
        "message": "Công ty chúng tôi có chuỗi cửa hàng phụ kiện công nghệ tại Hà Nội và Đà Nẵng, muốn tìm hiểu chính sách chiết khấu và nhập hàng tai nghe RYVO chính hãng.",
        "status": "read",
    },
    {
        "full_name": "Lê Minh Tuấn",
        "email": "minhtuan.le@outlook.com",
        "phone": "0909112233",
        "address": "72 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng",
        "subject": "Hỏi về bảo hành sản phẩm Everyday Earbuds",
        "message": "Tôi mua Everyday Earbuds được 2 tuần thì hộp sạc báo đèn đỏ liên tục, cho tôi hỏi gửi bảo hành theo địa chỉ nào tại Đà Nẵng?",
        "status": "responded",
    },
]


def seed_database():
    print("[*] Creating database tables if not existing...")
    Base.metadata.create_all(bind=engine)

    # Safe transactional migration for new columns
    print("[*] Checking and running schema migrations...")
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
            print("    [+] Added column 'sku' to products table")
        if "is_active" not in existing_cols:
            conn.execute(text("ALTER TABLE products ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE"))
            print("    [+] Added column 'is_active' to products table")
        if "sub_category" not in existing_cols:
            conn.execute(text("ALTER TABLE products ADD COLUMN sub_category VARCHAR(100) NULL"))
            print("    [+] Added column 'sub_category' to products table")

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
        print("    [+] Expanded currency columns in all tables to DECIMAL(15, 2)")

        # Convert historical orders from USD (< 10000) to VNĐ (x25,000)
        conn.execute(text("""
            UPDATE orders SET 
                subtotal = ROUND(subtotal * 25000, -3),
                total_amount = ROUND(total_amount * 25000, -3),
                shipping_fee = CASE WHEN shipping_fee > 0 THEN 30000.0 ELSE 0.0 END,
                discount_amount = ROUND(discount_amount * 25000, -3)
            WHERE total_amount < 10000
        """))
        conn.execute(text("""
            UPDATE order_items SET
                unit_price = ROUND(unit_price * 25000, -3),
                total_price = ROUND(total_price * 25000, -3)
            WHERE total_price < 10000
        """))
        print("    [+] Migrated historical orders to VNĐ")

        # Rebranding SQL Updates: Case-sensitive and Case-insensitive replacement
        conn.execute(text("""
            UPDATE products SET 
                sku = REPLACE(sku, 'RAY-', 'RYVO-'),
                name = REPLACE(REPLACE(name, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO'),
                description = REPLACE(REPLACE(description, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO')
        """))
        conn.execute(text("""
            UPDATE about_sections SET 
                title = REPLACE(REPLACE(title, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO'),
                content = REPLACE(REPLACE(content, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO')
        """))
        conn.execute(text("""
            UPDATE articles SET 
                slug = REPLACE(slug, 'raycon', 'ryvo'),
                title = REPLACE(REPLACE(title, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO'),
                summary = REPLACE(REPLACE(summary, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO'),
                content = REPLACE(REPLACE(content, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO'),
                author = REPLACE(REPLACE(author, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO')
        """))
        conn.execute(text("""
            UPDATE product_reviews SET 
                title = REPLACE(REPLACE(title, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO'),
                comment = REPLACE(REPLACE(comment, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO')
        """))
        conn.execute(text("""
            UPDATE contacts SET 
                subject = REPLACE(REPLACE(subject, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO'),
                message = REPLACE(REPLACE(message, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO')
        """))
        conn.execute(text("""
            UPDATE coupons SET 
                description = REPLACE(REPLACE(description, 'Raycon', 'RYVO'), 'RAYCON', 'RYVO')
        """))
        conn.execute(text("""
            UPDATE users SET 
                full_name = 'RYVO Administrator'
            WHERE role = 'admin'
        """))
        print("    [+] Rebranding SQL migration applied to all MySQL tables (Raycon -> RYVO)")

    db = SessionLocal()
    try:
        print("[*] Seeding default users (RYVO & Legacy)...")
        # 1. Admin users (RYVO & Raycon legacy)
        for admin_email in ["admin@ryvo.local", "admin@raycon.local"]:
            admin_user = db.query(User).filter(User.email == admin_email).first()
            if not admin_user:
                admin_user = User(
                    email=admin_email,
                    hashed_password=hash_password("admin123"),
                    full_name="RYVO Administrator",
                    phone="0901234567",
                    role=RoleEnum.ADMIN,
                    is_active=True,
                )
                db.add(admin_user)
                print(f"    [+] Created Admin User: {admin_email} / admin123")
            else:
                admin_user.full_name = "RYVO Administrator"
                admin_user.role = RoleEnum.ADMIN
                admin_user.is_active = True
                print(f"    [i] Admin user synchronized: {admin_email}")

        # 2. Customer users (RYVO & Raycon legacy)
        for customer_email in ["user@ryvo.local", "user@raycon.local"]:
            customer_user = db.query(User).filter(User.email == customer_email).first()
            if not customer_user:
                customer_user = User(
                    email=customer_email,
                    hashed_password=hash_password("user123"),
                    full_name="Khách hàng RYVO",
                    phone="0987654321",
                    role=RoleEnum.CUSTOMER,
                    is_active=True,
                )
                db.add(customer_user)
                print(f"    [+] Created Customer User: {customer_email} / user123")
            else:
                customer_user.full_name = "Khách hàng RYVO"
                customer_user.is_active = True
                print(f"    [i] Customer user synchronized: {customer_email}")

        print("[*] Seeding products with SKU & Subcategories...")
        seeded_count = 0
        updated_count = 0
        for p_data in SEED_PRODUCTS:
            existing = db.query(Product).filter(Product.id == p_data["id"]).first()
            if not existing:
                product = Product(**p_data)
                db.add(product)
                seeded_count += 1
            else:
                for k, v in p_data.items():
                    setattr(existing, k, v)
                updated_count += 1

        db.flush()
        print(f"    [+] Products: {seeded_count} new, {updated_count} synchronized.")

        print("[*] Seeding coupons...")
        coupon_count = 0
        for c_data in SEED_COUPONS:
            existing_c = db.query(Coupon).filter(Coupon.code == c_data["code"]).first()
            if not existing_c:
                coupon = Coupon(**c_data)
                db.add(coupon)
                coupon_count += 1
            else:
                for k, v in c_data.items():
                    setattr(existing_c, k, v)
        print(f"    [+] Coupons seeded: {coupon_count} new.")

        print("[*] Seeding reviews...")
        review_count = 0
        for r_data in SEED_REVIEWS:
            existing_r = db.query(ProductReview).filter(
                ProductReview.product_id == r_data["product_id"],
                ProductReview.author_email == r_data["author_email"]
            ).first()
            if not existing_r:
                review = ProductReview(**r_data)
                db.add(review)
                review_count += 1
        print(f"    [+] Reviews seeded: {review_count} new.")

        print("[*] Seeding about sections...")
        about_count = 0
        for a_data in SEED_ABOUT_SECTIONS:
            existing_a = db.query(AboutSection).filter(
                AboutSection.title == a_data["title"]
            ).first()
            if not existing_a:
                sec = AboutSection(**a_data)
                db.add(sec)
                about_count += 1
            else:
                for k, v in a_data.items():
                    setattr(existing_a, k, v)
        print(f"    [+] About sections seeded: {about_count} new/synced.")

        print("[*] Seeding news articles...")
        article_count = 0
        for art_data in SEED_ARTICLES:
            existing_art = db.query(Article).filter(
                Article.slug == art_data["slug"]
            ).first()
            if not existing_art:
                art = Article(**art_data)
                db.add(art)
                article_count += 1
            else:
                for k, v in art_data.items():
                    setattr(existing_art, k, v)
        print(f"    [+] Articles seeded: {article_count} new/synced.")

        print("[*] Seeding sample contacts...")
        contact_count = 0
        for ct_data in SEED_CONTACTS:
            existing_ct = db.query(Contact).filter(
                Contact.email == ct_data["email"],
                Contact.subject == ct_data["subject"]
            ).first()
            if not existing_ct:
                contact = Contact(**ct_data)
                db.add(contact)
                contact_count += 1
            else:
                for k, v in ct_data.items():
                    setattr(existing_ct, k, v)
        print(f"    [+] Contacts seeded: {contact_count} new/synced.")

        print("[*] Seeding site analytics initial state...")
        analytics = db.query(SiteAnalytics).first()
        if not analytics:
            analytics = SiteAnalytics(total_visits=154820)
            db.add(analytics)
            print("    [+] Initialized site_analytics with total_visits = 154820")
        else:
            print(f"    [i] site_analytics exists, total_visits = {analytics.total_visits}")

        db.commit()
        print("[OK] Database migration & seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"[!] Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
