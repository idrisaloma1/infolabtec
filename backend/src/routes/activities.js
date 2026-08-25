import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload, mediaTypeFromMime } from "../middleware/upload.js";

const router = Router();

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

async function uniqueSlug(title, excludeId = null) {
  let base = slugify(title) || "activity";
  let slug = base;
  let n = 1;
  while (true) {
    const { rows } = await pool.query(
      excludeId
        ? "SELECT id FROM activities WHERE slug = $1 AND id != $2"
        : "SELECT id FROM activities WHERE slug = $1",
      excludeId ? [slug, excludeId] : [slug]
    );
    if (rows.length === 0) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

/* ---------- PUBLIC ---------- */

// GET /api/activities?category=&featured=&page=&limit=
router.get("/", async (req, res) => {
  const { category, featured, page = 1, limit = 12 } = req.query;
  const conditions = ["status = 'published'"];
  const params = [];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (featured === "true") {
    conditions.push("featured = true");
  }

  const offset = (Number(page) - 1) * Number(limit);
  params.push(Number(limit), offset);

  const { rows } = await pool.query(
    `SELECT a.*,
        (SELECT count(*) FROM media m WHERE m.activity_id = a.id AND m.media_type = 'photo') AS photo_count,
        (SELECT count(*) FROM media m WHERE m.activity_id = a.id AND m.media_type = 'video') AS video_count
     FROM activities a
     WHERE ${conditions.join(" AND ")}
     ORDER BY date DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  res.json({ activities: rows });
});

// GET /api/activities/:slug — full detail with media
router.get("/:slug", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM activities WHERE slug = $1 AND status = 'published'",
    [req.params.slug]
  );
  const activity = rows[0];
  if (!activity) return res.status(404).json({ error: "Activity not found" });

  const { rows: media } = await pool.query(
    "SELECT * FROM media WHERE activity_id = $1 ORDER BY display_order ASC, id ASC",
    [activity.id]
  );

  res.json({ activity, media });
});

/* ---------- ADMIN ---------- */

// GET /api/activities/admin/all — includes drafts, for dashboard listing
router.get("/admin/all", requireAdmin, async (req, res) => {
  const { status, category, q } = req.query;
  const conditions = [];
  const params = [];

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    conditions.push(`title ILIKE $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await pool.query(
    `SELECT * FROM activities ${where} ORDER BY created_at DESC`,
    params
  );
  res.json({ activities: rows });
});

// POST /api/activities — create (defaults to draft)
router.post("/", requireAdmin, async (req, res) => {
  const {
    title, description, date, category, trainer,
    technologies = [], activity_link, featured = false, status = "draft",
  } = req.body;

  if (!title || !date || !category) {
    return res.status(400).json({ error: "title, date and category are required" });
  }

  const slug = await uniqueSlug(title);

  const { rows } = await pool.query(
    `INSERT INTO activities
       (title, slug, description, date, category, trainer, technologies, activity_link, featured, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [title, slug, description, date, category, trainer, technologies, activity_link, featured, status]
  );

  res.status(201).json({ activity: rows[0] });
});

// PUT /api/activities/:id — edit (any field, incl. status transitions draft→review→published)
router.put("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    title, description, date, category, trainer,
    technologies, activity_link, featured, status, cover_image,
  } = req.body;

  const { rows: existingRows } = await pool.query("SELECT * FROM activities WHERE id = $1", [id]);
  if (!existingRows[0]) return res.status(404).json({ error: "Activity not found" });

  const slug = title ? await uniqueSlug(title, id) : existingRows[0].slug;

  const { rows } = await pool.query(
    `UPDATE activities SET
       title = COALESCE($1, title),
       slug = $2,
       description = COALESCE($3, description),
       date = COALESCE($4, date),
       category = COALESCE($5, category),
       trainer = COALESCE($6, trainer),
       technologies = COALESCE($7, technologies),
       activity_link = COALESCE($8, activity_link),
       featured = COALESCE($9, featured),
       status = COALESCE($10, status),
       cover_image = COALESCE($11, cover_image),
       updated_at = now()
     WHERE id = $12
     RETURNING *`,
    [title, slug, description, date, category, trainer, technologies, activity_link, featured, status, cover_image, id]
  );

  res.json({ activity: rows[0] });
});

// DELETE /api/activities/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM activities WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

// POST /api/activities/:id/media — upload one or more photos/videos
router.post("/:id/media", requireAdmin, upload.array("files", 20), async (req, res) => {
  const { id } = req.params;
  const captions = req.body.captions ? JSON.parse(req.body.captions) : {};

  const inserted = [];
  for (const [i, file] of req.files.entries()) {
    const media_type = mediaTypeFromMime(file.mimetype);
    const file_url = `/uploads/${file.filename}`;
    const { rows } = await pool.query(
      `INSERT INTO media (activity_id, file_url, media_type, caption, display_order)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id, file_url, media_type, captions[file.originalname] || null, i]
    );
    inserted.push(rows[0]);
  }

  // If activity has no cover image yet, use the first uploaded photo.
  const firstPhoto = inserted.find((m) => m.media_type === "photo");
  if (firstPhoto) {
    await pool.query(
      "UPDATE activities SET cover_image = COALESCE(cover_image, $1) WHERE id = $2",
      [firstPhoto.file_url, id]
    );
  }

  res.status(201).json({ media: inserted });
});

// PUT /api/media/:mediaId — update caption / display_order
router.put("/media/:mediaId", requireAdmin, async (req, res) => {
  const { caption, display_order } = req.body;
  const { rows } = await pool.query(
    `UPDATE media SET
       caption = COALESCE($1, caption),
       display_order = COALESCE($2, display_order)
     WHERE id = $3 RETURNING *`,
    [caption, display_order, req.params.mediaId]
  );
  res.json({ media: rows[0] });
});

// DELETE /api/media/:mediaId
router.delete("/media/:mediaId", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM media WHERE id = $1", [req.params.mediaId]);
  res.status(204).send();
});

export default router;
