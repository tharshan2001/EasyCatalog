import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
  next();
};