import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = crypto.randomBytes(8).toString("hex");
    cb(null, `${Date.now()}-${unique}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);
  if (!isImage && !isVideo) {
    return cb(new Error("Unsupported file type. Allowed: jpg, png, webp, mp4, webm, mov"));
  }
  cb(null, true);
}

// 25MB photos are generous already; videos capped higher but bounded.
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB hard ceiling, tighten per-route if needed
});

export function mediaTypeFromMime(mimetype) {
  return ALLOWED_VIDEO_TYPES.includes(mimetype) ? "video" : "photo";
}

// NOTE: this stores files on local disk (fine for a single Railway instance
// with a persistent volume). Swap `storage` for a Supabase Storage / S3
// upload in production per spec section 30 — see README for the swap-in point.
