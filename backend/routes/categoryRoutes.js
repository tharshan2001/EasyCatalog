import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

/* ---------------- Public Routes ---------------- */
router.get("/", getCategories);
router.get("/:id", getCategoryById);

/* ---------------- Admin Routes ---------------- */
router.post("/", protect, authorizeRoles("admin"), createCategory);
router.put("/:id", protect, authorizeRoles("admin"), updateCategory);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCategory);

export default router;