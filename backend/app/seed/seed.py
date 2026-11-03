"""
Database seeding script for Raycon E-commerce.
Populates MySQL with default Admin/Customer users and the 7 Raycon products.
"""
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models.user import User, RoleEnum
from app.models.product import Product

IMG = "/sites/raycon/images"

SEED_PRODUCTS = [
    {
        "id": "everyday-earbuds",
        "handle": "the-everyday-earbuds",
        "name": "Everyday Earbuds",
        "tagline": "Pocket-size sound for active days.",
        "category": "earbuds",
        "collection_slug": "earbuds",
        "image": f"{IMG}/E25_BLA_IMG1.png",
        "price": 63.99,
        "compare_at_price": 79.98,
        "badge": "20% OFF",
        "rating": 4.4,
        "review_count": 232893,
        "featured": True,
        "in_stock": True,
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
        "tagline": "Total awareness for bud-free listening.",
        "category": "headphones",
        "collection_slug": "headphones",
        "image": f"{IMG}/bc-blue.png",
        "price": 69.99,
        "compare_at_price": 99.98,
        "badge": "30% OFF",
        "rating": 4.2,
        "review_count": 3617,
        "featured": True,
        "in_stock": True,
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
        "tagline": "Minimalist design for all day comfort.",
        "category": "open-audio",
        "collection_slug": "open-audio",
        "image": f"{IMG}/515.2514_6e551754-ab11-46e0-9eca-d9cb9a6e0ea6.png",
        "price": 47.99,
        "compare_at_price": 79.98,
        "badge": "40% OFF",
        "rating": 4.5,
        "review_count": 4777,
        "featured": True,
        "in_stock": True,
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
        "tagline": "Lightweight, clip-on sound that never gets in the way.",
        "category": "open-audio",
        "collection_slug": "open-audio",
        "image": f"{IMG}/O55_bla_002_V1.png",
        "price": 69.99,
        "compare_at_price": 99.98,
        "badge": "30% OFF",
        "rating": 4.5,
        "review_count": 685,
        "featured": True,
        "in_stock": True,
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
        "tagline": "A perfect fit to keep you in the zone.",
        "category": "earbuds",
        "collection_slug": "earbuds",
        "image": f"{IMG}/E45_BLU_IMG1_d64b334f-cb84-48a3-b8fb-9c0a8e264cee.png",
        "price": 83.99,
        "compare_at_price": 119.98,
        "badge": "NEW - 30% OFF",
        "rating": 4.6,
        "review_count": 91738,
        "featured": False,
        "in_stock": True,
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
        "tagline": "Built for long days, tuned for every sound.",
        "category": "headphones",
        "collection_slug": "headphones",
        "image": f"{IMG}/H20_BLA_IMG1_720x.png",
        "price": 69.99,
        "compare_at_price": 99.98,
        "badge": "30% OFF",
        "rating": 4.5,
        "review_count": 18400,
        "featured": False,
        "in_stock": True,
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
        "tagline": "Ends rotate 180 degrees for frayproof charging.",
        "category": "power-tech",
        "collection_slug": "power-tech",
        "image": f"{IMG}/SPN61C_BLA_CAROUSEL_IMG1_720x.png",
        "price": 19.99,
        "compare_at_price": 24.98,
        "badge": None,
        "rating": 4.7,
        "review_count": 2100,
        "featured": False,
        "in_stock": True,
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


def seed_database():
    print("[*] Creating database tables if not existing...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("[*] Seeding default users...")
        # 1. Admin user
        admin_email = "admin@raycon.local"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            admin_user = User(
                email=admin_email,
                hashed_password=hash_password("admin123"),
                full_name="Raycon Administrator",
                phone="0901234567",
                role=RoleEnum.ADMIN,
                is_active=True,
            )
            db.add(admin_user)
            print("    [+] Created Admin User: admin@raycon.local / admin123")
        else:
            print("    [i] Admin user already exists")

        # 2. Customer user
        customer_email = "user@raycon.local"
        customer_user = db.query(User).filter(User.email == customer_email).first()
        if not customer_user:
            customer_user = User(
                email=customer_email,
                hashed_password=hash_password("user123"),
                full_name="Nguyễn Văn Raycon",
                phone="0987654321",
                role=RoleEnum.CUSTOMER,
                is_active=True,
            )
            db.add(customer_user)
            print("    [+] Created Customer User: user@raycon.local / user123")
        else:
            print("    [i] Customer user already exists")

        print("[*] Seeding products...")
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

        db.commit()
        print(f"    [+] Products seeded: {seeded_count} new, {updated_count} synchronized.")
        print("[OK] Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"[!] Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
