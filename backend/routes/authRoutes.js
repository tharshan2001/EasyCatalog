import express from "express";
import { loginUser, logoutUser, authMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, authMe); // new endpoint

export default router;