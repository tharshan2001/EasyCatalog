import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: "admin" });

    if (adminExists) {
      console.log("Admin user already exists");
      process.exit();
    }

    const admin = await User.create({
      username: "admin",
      password: "admin123", // default password
      role: "admin",
    });

    console.log("Admin user created:");
    console.log(`Username: ${admin.username}`);
    console.log(`Password: admin123`);
    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();