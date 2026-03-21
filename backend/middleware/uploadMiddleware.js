// middleware/uploadMiddleware.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// ---------------- Configure AWS S3 (v3) ----------------
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ---------------- Multer Memory Storage ----------------
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ---------------- S3 Upload Helper ----------------
export const uploadToS3 = async (file, folder = "") => {
  if (!file) throw new Error("No file provided");

  const timestamp = Date.now();
  const fileKey = `${folder}${timestamp}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL removed because bucket has "Bucket owner enforced"
  });

  await s3.send(command);

  // Return the object URL
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
};

// ---------------- Middleware: Single Resume Upload ----------------
export const singleResumeUpload = (fieldName = "resume") => {
  return (req, res, next) => {
    const multerSingle = upload.single(fieldName);

    multerSingle(req, res, (err) => {
      if (err instanceof multer.MulterError)
        return res.status(400).json({ message: err.message });
      if (err) return res.status(400).json({ message: err.message });

      // File type validation (PDF / DOC / DOCX)
      if (
        req.file &&
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(req.file.mimetype)
      ) {
        return res.status(400).json({ message: "Invalid file type, only PDF/DOC allowed" });
      }

      next();
    });
  };
};

export default upload;
