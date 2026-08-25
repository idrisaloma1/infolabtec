import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload, mediaTypeFromMime } from "../middleware/upload.js";

const router = Router();

// GET /api/gallery — published albums with their media
router.get("/", async (req, res) => {
  const { rows: albums } = await pool.query(
    "SELECT * FROM gallery_albums WHERE published = true ORDER BY created_at DESC"
  );
  const { rows: media } = await pool.query(
    `SELECT * FROM media WHERE gallery_id = ANY($1::int[]) ORDER BY display_order ASC`,
    [albums.map((a) => a.id)]
  );
  const byAlbum = albums.map((a) => ({
    ...a,
    media: media.filter((m) => m.gallery_id === a.id),
  }));
  res.json({ albums: byAlbum });
});

router.get("/admin/all", requireAdmin, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM gallery_albums ORDER BY created_at DESC");
  res.json({ albums: rows });
});

router.post("/", requireAdmin, async (req, res) => {
  const { title, category, published = false } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });
  const { rows } = await pool.query(
    "INSERT INTO gallery_albums (title, category, published) VALUES ($1,$2,$3) RETURNING *",
    [title, category, published]
  );
  res.status(201).json({ album: rows[0] });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const { title, category, published } = req.body;
  const { rows } = await pool.query(
    `UPDATE gallery_albums SET
       title = COALESCE($1, title), category = COALESCE($2, category),
       published = COALESCE($3, published)
     WHERE id = $4 RETURNING *`,
    [title, category, published, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Album not found" });
  res.json({ album: rows[0] });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM gallery_albums WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

router.post("/:id/media", requireAdmin, upload.array("files", 20), async (req, res) => {
  const inserted = [];
  for (const [i, file] of req.files.entries()) {
    const media_type = mediaTypeFromMime(file.mimetype);
    const { rows } = await pool.query(
      `INSERT INTO media (gallery_id, file_url, media_type, display_order)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.params.id, `/uploads/${file.filename}`, media_type, i]
    );
    inserted.push(rows[0]);
  }
  res.status(201).json({ media: inserted });
});

export default router;
