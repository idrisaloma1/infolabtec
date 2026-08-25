import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/stats — public animated-counter figures for the homepage
router.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT key, label, value FROM site_stats");
  res.json({ stats: rows });
});

router.put("/:key", requireAdmin, async (req, res) => {
  const { value } = req.body;
  if (typeof value !== "number") {
    return res.status(400).json({ error: "value must be a number" });
  }
  const { rows } = await pool.query(
    "UPDATE site_stats SET value = $1, updated_at = now() WHERE key = $2 RETURNING *",
    [value, req.params.key]
  );
  if (!rows[0]) return res.status(404).json({ error: "Unknown stat key" });
  res.json({ stat: rows[0] });
});

// GET /api/stats/dashboard — admin dashboard summary counts
router.get("/dashboard/summary", requireAdmin, async (req, res) => {
  const queries = await Promise.all([
    pool.query("SELECT count(*) FROM activities"),
    pool.query("SELECT count(*) FROM media WHERE media_type = 'photo'"),
    pool.query("SELECT count(*) FROM media WHERE media_type = 'video'"),
    pool.query("SELECT count(*) FROM projects"),
    pool.query("SELECT count(*) FROM projects WHERE featured = true"),
    pool.query("SELECT count(*) FROM events WHERE published = true AND date >= CURRENT_DATE"),
    pool.query("SELECT count(*) FROM messages WHERE read_status = false"),
  ]);

  const [activities, photos, videos, projects, featuredProjects, upcomingEvents, unreadMessages] =
    queries.map((r) => Number(r.rows[0].count));

  res.json({
    totalActivities: activities,
    totalPhotos: photos,
    totalVideos: videos,
    totalProjects: projects,
    featuredProjects,
    upcomingEvents,
    unreadMessages,
  });
});

export default router;
