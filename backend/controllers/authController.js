import User from "../models/User.js";
import jwt from "jsonwebtoken";

// generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// send token in cookie
const sendToken = (res, user) => {
  const token = generateToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// login user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");

  if (user && (await user.matchPassword(password))) {
    sendToken(res, user);
    return res.json({ message: "Logged in successfully" });
  }

  res.status(401).json({ message: "Invalid username or password" });
};

// logout user
export const logoutUser = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out successfully" });
};

// check auth
export const authMe = (req, res) => {
  if (req.user) {
    const { username, role } = req.user;
    return res.json({ username, role });
  }
  res.status(401).json({ message: "Not authenticated" });
};