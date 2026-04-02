import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    image_url: { type: String, trim: true },
    tags: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    archived: { type: Boolean, default: false },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);