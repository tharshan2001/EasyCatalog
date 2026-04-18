import dotenv from "dotenv";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const products = [
  {
    code: "EMO-001",
    name: "Apple iPhone 15 Pro Max",
    slug: "apple-iphone-15-pro-max",
    image_url: "https://placehold.co/400x400/yellow/222?text=iPhone+15",
    tags: ["smartphone", "apple", "ios", "phone"],
    categoryName: "Electronics",
    price: 549900,
  },
  {
    code: "EMO-002",
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    image_url: "https://placehold.co/400x400/yellow/222?text=Galaxy+S24",
    tags: ["smartphone", "samsung", "android", "phone"],
    categoryName: "Electronics",
    price: 449900,
  },
  {
    code: "EMO-003",
    name: "Google Pixel 8 Pro",
    slug: "google-pixel-8-pro",
    image_url: "https://placehold.co/400x400/yellow/222?text=Pixel+8",
    tags: ["smartphone", "google", "android", "phone"],
    categoryName: "Electronics",
    price: 399900,
  },
  {
    code: "EMO-004",
    name: "MacBook Pro 14-inch M3",
    slug: "macbook-pro-14-m3",
    image_url: "https://placehold.co/400x400/yellow/222?text=MacBook+Pro",
    tags: ["laptop", "apple", "mac", "computer"],
    categoryName: "Electronics",
    price: 399900,
  },
  {
    code: "EMO-005",
    name: "Dell XPS 15",
    slug: "dell-xps-15",
    image_url: "https://placehold.co/400x400/yellow/222?text=Dell+XPS+15",
    tags: ["laptop", "dell", "windows", "computer"],
    categoryName: "Electronics",
    price: 349900,
  },
  {
    code: "EMO-006",
    name: "Sony WH-1000XM5",
    slug: "sony-wh1000xm5",
    image_url: "https://placehold.co/400x400/yellow/222?text=Sony+XM5",
    tags: ["headphone", "sony", "audio", "bluetooth"],
    categoryName: "Electronics",
    price: 99900,
  },
  {
    code: "EMO-007",
    name: "AirPods Pro 2",
    slug: "airpods-pro-2",
    image_url: "https://placehold.co/400x400/yellow/222?text=AirPods+Pro",
    tags: ["headphone", "apple", "audio", "bluetooth"],
    categoryName: "Electronics",
    price: 79000,
  },
  {
    code: "EMO-008",
    name: "iPad Pro 12.9-inch",
    slug: "ipad-pro-12-9",
    image_url: "https://placehold.co/400x400/yellow/222?text=iPad+Pro",
    tags: ["tablet", "apple", "ipad"],
    categoryName: "Electronics",
    price: 299900,
  },
  {
    code: "EMO-009",
    name: "Apple Watch Series 9",
    slug: "apple-watch-series-9",
    image_url: "https://placehold.co/400x400/yellow/222?text=Apple+Watch",
    tags: ["watch", "apple", "wearable"],
    categoryName: "Electronics",
    price: 149900,
  },
  {
    code: "EMO-010",
    name: "Samsung Galaxy Watch 6",
    slug: "samsung-galaxy-watch-6",
    image_url: "https://placehold.co/400x400/yellow/222?text=Galaxy+Watch",
    tags: ["watch", "samsung", "wearable"],
    categoryName: "Electronics",
    price: 129900,
  },
  {
    code: "EMO-011",
    name: "PlayStation 5",
    slug: "playstation-5",
    image_url: "https://placehold.co/400x400/yellow/222?text=PS5",
    tags: ["gaming", "sony", "playstation"],
    categoryName: "Electronics",
    price: 229900,
  },
  {
    code: "EMO-012",
    name: "Xbox Series X",
    slug: "xbox-series-x",
    image_url: "https://placehold.co/400x400/yellow/222?text=Xbox+Series+X",
    tags: ["gaming", "microsoft", "xbox"],
    categoryName: "Electronics",
    price: 199900,
  },
  {
    code: "EMO-013",
    name: "Nintendo Switch OLED",
    slug: "nintendo-switch-oled",
    image_url: "https://placehold.co/400x400/yellow/222?text=Nintendo+Switch",
    tags: ["gaming", "nintendo", "switch"],
    categoryName: "Electronics",
    price: 99900,
  },
  {
    code: "EMO-014",
    name: "Canon EOS R50",
    slug: "canon-eos-r50",
    image_url: "https://placehold.co/400x400/yellow/222?text=Canon+R50",
    tags: ["camera", "canon", "dslr"],
    categoryName: "Electronics",
    price: 179900,
  },
  {
    code: "EMO-015",
    name: "DJI Mini 4 Pro",
    slug: "dji-mini-4-pro",
    image_url: "https://placehold.co/400x400/yellow/222?text=DJI+Mini",
    tags: ["drone", "dji", "camera"],
    categoryName: "Electronics",
    price: 249900,
  },
  {
    code: "EMO-016",
    name: "LG C3 55-inch OLED TV",
    slug: "lg-c3-55-oled",
    image_url: "https://placehold.co/400x400/yellow/222?text=LG+OLED",
    tags: ["tv", "lg", "oled", "smart"],
    categoryName: "Electronics",
    price: 449900,
  },
  {
    code: "EMO-017",
    name: "Sony PlayStation VR2",
    slug: "sony-playstation-vr2",
    image_url: "https://placehold.co/400x400/yellow/222?text=PS+VR2",
    tags: ["vr", "sony", "gaming", "virtual reality"],
    categoryName: "Electronics",
    price: 199900,
  },
  {
    code: "EMO-018",
    name: "Razer Blade 15",
    slug: "razer-blade-15",
    image_url: "https://placehold.co/400x400/yellow/222?text=Razer+Blade",
    tags: ["laptop", "gaming", "razer"],
    categoryName: "Electronics",
    price: 399900,
  },
  {
    code: "EMO-019",
    name: "Logitech MX Master 3S",
    slug: "logitech-mx-master-3s",
    image_url: "https://placehold.co/400x400/yellow/222?text=MX+Master",
    tags: ["mouse", "logitech", "accessory"],
    categoryName: "Electronics",
    price: 15900,
  },
  {
    code: "EMO-020",
    name: "Mechanical Keyboard RGB",
    slug: "mechanical-keyboard-rgb",
    image_url: "https://placehold.co/400x400/yellow/222?text=Mech+Keyboard",
    tags: ["keyboard", "mechanical", "gaming"],
    categoryName: "Electronics",
    price: 24900,
  },
];

const seedProducts = async () => {
  try {
    await Product.deleteMany({});
    console.log("Deleted all products");

    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });
    console.log("Found categories:", categoryMap);

    const productsWithCategory = products.map((p) => ({
      ...p,
      category: categoryMap[p.categoryName] || null,
    }));

    await Product.insertMany(productsWithCategory);
    console.log(`Inserted ${productsWithCategory.length} products`);

    const total = await Product.countDocuments();
    console.log(`Total products in DB: ${total}`);

    process.exit();
  } catch (error) {
    console.error("Error seeding products:", error.message);
    process.exit(1);
  }
};

seedProducts();