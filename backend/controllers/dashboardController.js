import Product from "../models/Product.js";

// ---------------- Recently Added Products ----------------
export const getRecentProducts = async (req, res) => {
  try {
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id code name slug image_url tags price archived createdAt"); // select relevant fields

    res.json(recentProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Total Products Count ----------------
export const getTotalProductsCount = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    res.json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Archived Products Count ----------------
export const getArchivedProductsCount = async (req, res) => {
  try {
    const archived = await Product.countDocuments({ archived: true });
    res.json({ archived });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};