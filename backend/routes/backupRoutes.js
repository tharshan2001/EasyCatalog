import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { createBackup, restoreBackup } from "../controllers/backupController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), createBackup);
router.post("/restore", protect, authorizeRoles("admin"), upload.single("backup"), restoreBackup);

export default router;
