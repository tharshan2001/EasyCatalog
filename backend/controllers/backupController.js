import { ZipArchive } from "archiver";
import { stringify } from "csv-stringify/sync";
import { parse as csvParse } from "csv-parse/sync";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUPS_DIR = path.join(__dirname, "..", "backups");

if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

function formatTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

function toCSV(data, columns) {
  if (!data || data.length === 0) {
    return columns.join(",") + "\n";
  }
  const records = data.map((item) => {
    const row = {};
    for (const col of columns) {
      let val = item[col];
      if (Array.isArray(val)) {
        if (col === "tags") {
          val = val.join("; ");
        } else {
          val = val.join(",");
        }
      } else if (typeof val === "object" && val !== null) {
        if (col === "category") {
          val = val.name || val._id?.toString?.() || "";
        } else if (typeof val.toString === "function") {
          val = val.toString();
        } else {
          val = "";
        }
      }
      row[col] = val ?? "";
    }
    return row;
  });
  return stringify(records, { header: true, columns });
}

function parseCSV(text, transform) {
  const records = csvParse(text, { columns: true, skip_empty_lines: true, relax_column_count: true });
  return records.map(transform);
}

export const createBackup = async (req, res) => {
  try {
    const [products, categories, users] = await Promise.all([
      Product.find({})
        .populate("category", "name slug")
        .lean(),
      Category.find({}).lean(),
      User.find({}).select("-password").lean(),
    ]);

    const archiveName = `backup-${formatTimestamp()}.zip`;
    const archivePath = path.join(BACKUPS_DIR, archiveName);

    const output = fs.createWriteStream(archivePath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    archive.pipe(output);

    const productColumns = ["_id", "code", "name", "slug", "image_url", "tags", "category", "archived", "price", "createdAt", "updatedAt"];
    const categoryColumns = ["_id", "name", "slug", "createdAt", "updatedAt"];
    const userColumns = ["_id", "username", "role", "createdAt", "updatedAt"];

    archive.append(toCSV(products, productColumns), { name: "products.csv" });
    archive.append(toCSV(categories, categoryColumns), { name: "categories.csv" });
    archive.append(toCSV(users, userColumns), { name: "users.csv" });

    archive.finalize();

    output.on("close", () => {
      res.download(archivePath, archiveName, (err) => {
        if (err) {
          console.error("Download error:", err);
        }
      });
    });

    archive.on("error", (err) => {
      console.error("Archive error:", err);
      res.status(500).json({ message: "Backup failed", error: err.message });
    });
  } catch (error) {
    console.error("Backup error:", error);
    res.status(500).json({ message: "Backup failed", error: error.message });
  }
};

export const restoreBackup = async (req, res) => {
  let tempPath;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Backup ZIP file is required" });
    }

    tempPath = path.join(BACKUPS_DIR, `restore-temp-${Date.now()}.zip`);
    fs.writeFileSync(tempPath, req.file.buffer);

    const zip = new AdmZip(tempPath);

    const productCsv = zip.getEntry("products.csv")?.getData().toString("utf-8");
    const categoryCsv = zip.getEntry("categories.csv")?.getData().toString("utf-8");

    if (!productCsv && !categoryCsv) {
      fs.unlinkSync(tempPath);
      return res.status(400).json({ message: "Invalid backup: no products.csv or categories.csv found" });
    }

    const result = { categories: 0, products: 0 };

    if (categoryCsv) {
      await Category.deleteMany({});
      const categories = parseCSV(categoryCsv, (row) => ({
        name: row.name?.trim(),
        slug: row.slug?.trim(),
      })).filter((c) => c.name && c.slug);

      for (const cat of categories) {
        await Category.create(cat);
      }
      result.categories = categories.length;
    }

    if (productCsv) {
      const categoryMap = {};
      const allCats = await Category.find({}).lean();
      for (const c of allCats) {
        categoryMap[c.name.toLowerCase()] = c._id;
      }

      await Product.deleteMany({});
      const products = parseCSV(productCsv, (row) => {
        const tags = row.tags ? row.tags.split("; ").map((t) => t.trim()).filter(Boolean) : [];
        let catId = null;
        const catName = row.category?.trim().toLowerCase();
        if (catName && categoryMap[catName]) {
          catId = categoryMap[catName];
        }
        return {
          code: row.code?.trim(),
          name: row.name?.trim(),
          slug: row.slug?.trim(),
          image_url: row.image_url?.trim() || "",
          tags,
          category: catId,
          archived: row.archived?.trim().toLowerCase() === "true",
          price: parseFloat(row.price) || 0,
        };
      }).filter((p) => p.code && p.name);

      for (const prod of products) {
        await Product.create(prod);
      }
      result.products = products.length;
    }

    fs.unlinkSync(tempPath);

    res.json({
      message: "Database restored successfully",
      categoriesRestored: result.categories,
      productsRestored: result.products,
    });
  } catch (error) {
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    console.error("Restore error:", error);
    res.status(500).json({ message: "Restore failed", error: error.message });
  }
};
