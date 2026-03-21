import Product from "../models/Product.js";
import { uploadToS3 } from "../middleware/uploadMiddleware.js";
import slugify from "slug";

// ---------------- Create Product ----------------
export const createProduct = async (req, res) => {
  try {
    const { code, name, tags, archived } = req.body;
    let image_url = "";

    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
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
      archived: archived === "true" || archived === true,
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
    const limit = parseInt(req.query.limit) || 10;
    const lastCreatedAt = req.query.lastCreatedAt ? new Date(req.query.lastCreatedAt) : null;

    // Filter for unarchived products
    const filter = { archived: false };
    if (lastCreatedAt) filter.createdAt = { $lt: lastCreatedAt };

    const products = await Product.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .select("_id name slug image_url tags") // return minimal fields
      .limit(limit);

    res.json({
      products,
      hasMore: products.length === limit, // tells client if more products exist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Get Products for admin (cursor-based infinite scroll) ----------------
export const getProductsAdmin = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const lastCreatedAt = req.query.lastCreatedAt ? new Date(req.query.lastCreatedAt) : null;

    // Filter for all products
    const filter = {};
    if (lastCreatedAt) filter.createdAt = { $lt: lastCreatedAt };

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .select("_id code name slug image_url tags archived createdAt") // minimal fields + archived
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
    const { code, name, slug, tags, archived } = req.body;
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
      ...(image_url && { image_url }),
    };

    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Archive Product ----------------
export const archiveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { archived: true }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product archived", product });
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