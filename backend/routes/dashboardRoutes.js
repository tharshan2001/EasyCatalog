import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getRecentProducts,
  getTotalProductsCount,
  getArchivedProductsCount
} from "../controllers/dashboardController.js";

const router = express.Router();

// All routes require admin
router.use(protect, authorizeRoles("admin"));

// GET recently added products
router.get("/recent-products", getRecentProducts);

// GET total products count
router.get("/total-products", getTotalProductsCount);

// GET archived products count
router.get("/archived-products", getArchivedProductsCount);

export default router;