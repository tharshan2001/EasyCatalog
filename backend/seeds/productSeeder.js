import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const productNames = {
  kitchen: [
    'Coffee Maker Pro', 'Electric Kettle', 'Blender X500', 'Food Processor', 'Microwave Oven',
    'Toaster Deluxe', 'Rice Cooker', 'Dishwasher Mini', 'Ice Maker', 'Water Filter System',
    'Hand Mixer', 'Juicer Extractor', 'Bread Maker', 'Sous Vide', 'Air Fryer XL',
    'Electric Grinder', 'Coffee Grinder', 'Egg Cooker', 'Food Scale', 'Kitchen Timer'
  ],
  laundry: [
    'Washing Machine', 'Dryer Machine', 'Iron Steam Pro', 'Clothes Steamer', 'Foldly Laundry',
    'Spin Cleaner', 'Washing Bag', 'Drying Rack', 'Laundry Basket', 'Fabric Shaver',
    'Stain Remover', 'Detergent Dispenser', 'Washing Balls', 'Laundry Softener', 'Ironing Board',
    'Steam Iron', 'Handheld Steamer', 'Lint Roller', 'Laundry Hamper', 'Clothesline'
  ],
  cleaning: [
    'Vacuum Cleaner', 'Robot Vacuum', 'Carpet Cleaner', 'Steam Mop', 'Floor Polisher',
    'Window Cleaner', 'Pressure Washer', 'Air Purifier', 'Humidifier', 'Dehumidifier',
    'Dust Buster', 'Sweep Mop', 'Broom Set', 'Mop Bucket', 'Cleaning Kit',
    'Scrub Brush', 'Sponge Set', 'Microfiber Cloth', 'Dust Pan', 'Trash Can'
  ],
  hvac: [
    'Air Conditioner', 'Heater Portable', 'Fan Oscillating', 'Dehumidifier Pro', 'Thermostat Smart',
    'AC Remote', 'Air Filter', 'Heater Oil', 'Radiator Cover', 'Vent Cover',
    'Duct Tape', 'Insulation Kit', 'Cooling Pad', 'Heating Element', 'Thermometer Digital',
    'HVAC Tool Kit', 'Refrigerant Gauge', 'Vacuum Pump', 'Manifold Set', 'Flue Pipe'
  ],
  cooking: [
    'Gas Stove', 'Induction Cooker', 'Electric Stove', 'Hot Plate', 'BBQ Grill',
    'Grill Pan', 'Wok Pan', 'Frying Pan', 'Sauce Pot', 'Dutch Oven',
    'Pressure Cooker', 'Slow Cooker', 'Crock Pot', 'Double Boiler', 'Stock Pot',
    'Sauté Pan', 'Crepe Pan', 'Tajine Pot', 'Roasting Pan', 'Baking Sheet'
  ]
};

const generateCode = (prefix, index) => {
  return `${prefix.toUpperCase()}-${String(index).padStart(4, '0')}`;
};

const seedProducts = async () => {
  try {
    const defaultCategories = [
      { name: "Kitchen Appliances", slug: "kitchen" },
      { name: "Laundry", slug: "laundry" },
      { name: "Cleaning", slug: "cleaning" },
      { name: "Climate Control", slug: "hvac" },
      { name: "Cooking", slug: "cooking" }
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      }
    }

    const categories = await Category.find({ slug: { $in: defaultCategories.map(c => c.slug) } });
    
    const categoryMap = {};
    for (const cat of categories) {
      categoryMap[cat.slug] = cat._id;
    }

    const totalToCreate = 100;
    const productsPerCategory = Math.ceil(totalToCreate / categories.length);
    
    const productsToCreate = [];
    let globalIndex = 1;
    
    for (const [slug, names] of Object.entries(productNames)) {
      const categoryId = categoryMap[slug];
      if (!categoryId) continue;
      
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const price = Math.floor(Math.random() * 50000) + 1000;
        
        productsToCreate.push({
          code: generateCode(slug, globalIndex),
          name: name,
          slug: name.toLowerCase().replace(/\s+/g, '-') + '-' + globalIndex,
          price: price,
          category: categoryId,
          tags: [slug, name.toLowerCase().split(' ')[0]],
          archived: false
        });
        
        globalIndex++;
        
        if (productsToCreate.length >= totalToCreate) break;
      }
      
      if (productsToCreate.length >= totalToCreate) break;
    }

    await Product.insertMany(productsToCreate);
    
    console.log(`Created ${productsToCreate.length} products`);
    process.exit();
  } catch (error) {
    console.error("Error seeding products:", error.message);
    process.exit(1);
  }
};

seedProducts();