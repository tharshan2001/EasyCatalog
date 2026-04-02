import Category from "../models/Category.js";
import slugify from "slug";

// ---------------- Create Category ----------------
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const nameExists = await Category.findOne({ name });
    if (nameExists) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    let generatedSlug = slugify(name, { lower: true });

    let slugExists = await Category.findOne({ slug: generatedSlug });
    let counter = 1;
    while (slugExists) {
      generatedSlug = `${slugify(name, { lower: true })}-${counter}`;
      slugExists = await Category.findOne({ slug: generatedSlug });
      counter++;
    }

    const category = await Category.create({
      name,
      slug: generatedSlug,
    });

    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Get All Categories ----------------
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Get Category by ID ----------------
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Update Category ----------------
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const nameExists = await Category.findOne({ name, _id: { $ne: id } });
    if (nameExists) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    let generatedSlug = slugify(name, { lower: true });

    let slugExists = await Category.findOne({ slug: generatedSlug, _id: { $ne: id } });
    let counter = 1;
    while (slugExists) {
      generatedSlug = `${slugify(name, { lower: true })}-${counter}`;
      slugExists = await Category.findOne({ slug: generatedSlug, _id: { $ne: id } });
      counter++;
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: generatedSlug },
      { new: true }
    );

    res.json({ message: "Category updated", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- Delete Category ----------------
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};