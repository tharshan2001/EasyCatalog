import Product from "../models/Product.js";
import { uploadToS3 } from "../middleware/uploadMiddleware.js";
import slugify from "slug";

// ---------------- Create Product ----------------
export const createProduct = async (req, res) => {
  try {
    const { code, name, tags, price, category } = req.body;
    let image_url = "";

    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    if (price === undefined || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ message: "Valid product price is required" });
    }

    if (req.file) {
      image_url = await uploadToS3(req.file, "products/");
    }

    // Generate a slug from the name
    let generatedSlug = slugify(name, { lower: true });

    // Ensure uniqueness of slug
    let slugExists = await Product.findOne({ slug: generatedSlug });
    let counter = 1;
    while (slugExists) {
      generatedSlug = `${slugify(name, { lower: true })}-${counter}`;
      slugExists = await Product.findOne({ slug: generatedSlug });
      counter++;
    }

    // Check for duplicate code
    const codeExists = await Product.findOne({ code });
    if (codeExists) {
      return res.status(400).json({ message: "Product code already exists" });
    }

    const product = await Product.create({
      code,
      name,
      slug: generatedSlug,
      image_url,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      price: Number(price),
      archived: false,
      category: category || null,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Get Products for normal users (cursor-based infinite scroll) ----------------
export const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const cursor = req.query.cursor || null;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
    const search = req.query.search ? req.query.search.trim() : null;
    const categoryId = req.query.category || null;

    let filter = { archived: { $ne: true } };
    const filterParts = [];

    if (cursor) {
      filterParts.push({ _id: { $lt: cursor } });
    }

    if (minPrice !== null || maxPrice !== null) {
      const priceFilter = {};
      if (minPrice !== null) priceFilter.$gte = minPrice;
      if (maxPrice !== null) priceFilter.$lte = maxPrice;
      filterParts.push({ price: priceFilter });
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filterParts.push({
        $or: [
          { name: searchRegex },
          { code: searchRegex },
          { tags: searchRegex }
        ]
      });
    }

    if (categoryId) {
      filterParts.push({ category: categoryId });
    }

    if (filterParts.length > 0) {
      filter = { ...filter, $and: filterParts };
    }

    const products = await Product.find(filter)
      .sort({ _id: -1 })
      .select('_id code name slug image_url tags price category') 
      .populate('category', 'name slug')
      .limit(limit + 1);
    
    const hasMore = products.length > limit;
    if (hasMore) products.pop();
    
    res.json({
      products,
      hasMore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- Get Products for admin (cursor-based infinite scroll) ----------------
export const getProductsAdmin = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const lastCreatedAt = req.query.lastCreatedAt ? new Date(req.query.lastCreatedAt) : null;

    const filter = {};
    if (lastCreatedAt) filter.createdAt = { $lt: lastCreatedAt };

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .select("_id code name slug image_url tags archived price createdAt category")
      .populate('category', 'name slug')
      .limit(limit);

    res.json({
      products,
      hasMore: products.length === limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Update Product ----------------
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, slug, tags, archived, price, category } = req.body;
    let image_url;

    if (req.file) {
      image_url = await uploadToS3(req.file, "products/");
    }

    const updatedData = {
      ...(code && { code }),
      ...(name && { name }),
      ...(slug && { slug }),
      ...(tags && { tags: tags.split(",").map((t) => t.trim()) }),
      ...(archived !== undefined && { archived }),
      ...(price !== undefined && { price: Number(price) }),
      ...(image_url && { image_url }),
      ...(category !== undefined && { category: category || null }),
    };

    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Archive Product ----------------
// ---------------- Archive / Unarchive Product ----------------
export const archiveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { archived } = req.body;

    if (archived === undefined) {
      return res.status(400).json({ message: "Archived status is required" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { archived: Boolean(archived) },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: `Product ${archived ? "archived" : "unarchived"}`, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Delete Product ----------------
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Advanced Search Products ----------------
export const advancedSearchProducts = async (req, res) => {
  try {
    const {
      limit = 12,
      cursor = null,
      search = null,
      category = null,
      tags = null,
      minPrice = null,
      maxPrice = null,
      archived = "false",
      sortBy = "_id",
      sortOrder = "desc",
    } = req.query;

    const parsedLimit = parseInt(limit) || 12;
    const parsedMinPrice = minPrice ? Number(minPrice) : null;
    const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;
    const isArchived = archived === "true";

    let filter = { archived: isArchived };
    const filterParts = [];

    if (cursor) {
      const sortField = sortBy || "_id";
      const sortDir = sortOrder === "asc" ? "$gt" : "$lt";
      filterParts.push({ [sortField]: { [sortDir]: cursor } });
    }

    if (parsedMinPrice !== null || parsedMaxPrice !== null) {
      const priceFilter = {};
      if (parsedMinPrice !== null) priceFilter.$gte = parsedMinPrice;
      if (parsedMaxPrice !== null) priceFilter.$lte = parsedMaxPrice;
      filterParts.push({ price: priceFilter });
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filterParts.push({
        $or: [
          { name: searchRegex },
          { code: searchRegex },
          { tags: searchRegex },
          { slug: searchRegex }
        ]
      });
    }

    if (category) {
      filterParts.push({ category });
    }

    if (tags) {
      const tagArray = tags.split(",").map(t => t.trim());
      filterParts.push({ tags: { $in: tagArray } });
    }

    if (filterParts.length > 0) {
      filter = { ...filter, $and: filterParts };
    }

    const sortOptions = { [sortBy || "_id"]: sortOrder === "asc" ? 1 : -1 };

    const products = await Product.find(filter)
      .sort(sortOptions)
      .select('_id code name slug image_url tags price category archived createdAt')
      .populate('category', 'name slug')
      .limit(parsedLimit + 1);

    const hasMore = products.length > parsedLimit;
    if (hasMore) products.pop();

    const nextCursor = hasMore && products.length > 0 
      ? products[products.length - 1][sortBy || "_id"] 
      : null;

res.json({
      products,
      hasMore,
      nextCursor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- Get Product Stats (min/max price, count) ----------------
export const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { archived: { $ne: true } } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          count: { $sum: 1 }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({ minPrice: 0, maxPrice: 100000, count: 0 });
    }

    res.json(stats[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};