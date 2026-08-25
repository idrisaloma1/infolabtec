import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

function isValidUrl(value) {
  if (!value) return true; // optional fields are allowed to be empty
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function validateUrls(body) {
  const fields = ["project_url", "demo_url", "github_url", "video_url"];
  for (const f of fields) {
    if (body[f] && !isValidUrl(body[f])) {
      return `${f} is not a valid URL`;
    }
  }
  return null;
}

/* ---------- PUBLIC ---------- */

// GET /api/projects?category=&featured=&page=&limit=
router.get("/", async (req, res) => {
  const { category, featured, page = 1, limit = 12 } = req.query;
  const conditions = ["published = true"];
  const params = [];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (featured === "true") conditions.push("featured = true");

  const offset = (Number(page) - 1) * Number(limit);
  params.push(Number(limit), offset);

  const { rows } = await pool.query(
    `SELECT * FROM projects WHERE ${conditions.join(" AND ")}
     ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  res.json({ projects: rows });
});

router.get("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM projects WHERE id = $1 AND published = true",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Project not found" });
  res.json({ project: rows[0] });
});

/* ---------- ADMIN ---------- */

router.get("/admin/all", requireAdmin, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
  res.json({ projects: rows });
});

router.post("/", requireAdmin, async (req, res) => {
  const {
    title, student_name, description, technology, category,
    image, project_url, demo_url, github_url, video_url,
    featured = false, published = false,
  } = req.body;

  if (!title || !student_name || !category) {
    return res.status(400).json({ error: "title, student_name and category are required" });
  }
  const urlError = validateUrls(req.body);
  if (urlError) return res.status(400).json({ error: urlError });

  const { rows } = await pool.query(
    `INSERT INTO projects
       (title, student_name, description, technology, category, image,
        project_url, demo_url, github_url, video_url, featured, published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [title, student_name, description, technology, category, image,
     project_url, demo_url, github_url, video_url, featured, published]
  );
  res.status(201).json({ project: rows[0] });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const urlError = validateUrls(req.body);
  if (urlError) return res.status(400).json({ error: urlError });

  const {
    title, student_name, description, technology, category, image,
    project_url, demo_url, github_url, video_url, featured, published,
  } = req.body;

  const { rows } = await pool.query(
    `UPDATE projects SET
       title = COALESCE($1, title),
       student_name = COALESCE($2, student_name),
       description = COALESCE($3, description),
       technology = COALESCE($4, technology),
       category = COALESCE($5, category),
       image = COALESCE($6, image),
       project_url = COALESCE($7, project_url),
       demo_url = COALESCE($8, demo_url),
       github_url = COALESCE($9, github_url),
       video_url = COALESCE($10, video_url),
       featured = COALESCE($11, featured),
       published = COALESCE($12, published)
     WHERE id = $13 RETURNING *`,
    [title, student_name, description, technology, category, image,
     project_url, demo_url, github_url, video_url, featured, published, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Project not found" });
  res.json({ project: rows[0] });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

// POST /api/projects/:id/screenshot — upload/replace the project screenshot
router.post("/:id/screenshot", requireAdmin, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ error: "That file isn't an image. Use the video uploader for video files." });
  }
  const file_url = `/uploads/${req.file.filename}`;
  const { rows } = await pool.query(
    "UPDATE projects SET image = $1 WHERE id = $2 RETURNING *",
    [file_url, req.params.id]
  );
  res.json({ project: rows[0] });
});

// POST /api/projects/:id/video — upload a demo video file, stored in video_url
router.post("/:id/video", requireAdmin, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  if (!req.file.mimetype.startsWith("video/")) {
    return res.status(400).json({ error: "That file isn't a video. Use the screenshot uploader for images." });
  }
  const file_url = `/uploads/${req.file.filename}`;
  const { rows } = await pool.query(
    "UPDATE projects SET video_url = $1 WHERE id = $2 RETURNING *",
    [file_url, req.params.id]
  );
  res.json({ project: rows[0] });
});

export default router;
