import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductsAdmin,
  updateProduct,
  archiveProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

/* ---------------- Public Routes ---------------- */
// GET products - unarchived for normal users
router.get("/", getProducts);

/* ---------------- Admin Routes ---------------- */
// All routes below require: logged-in user + admin role

// GET all products (including archived)
router.get("/admin", protect, authorizeRoles("admin"), getProductsAdmin);

// POST create product
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  createProduct
);

// PUT update product
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  updateProduct
);

// PUT archive product
router.put("/:id/archive", protect, authorizeRoles("admin"), archiveProduct);

// DELETE product
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);

export default router;