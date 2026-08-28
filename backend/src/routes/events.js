import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// Empty strings from a blank <input type="date"> should mean "no value",
// not literal text — Postgres rejects "" for a date/numeric column outright.
function emptyToNull(value) {
  return value === "" || value === undefined ? null : value;
}

// GET /api/events/next — the soonest upcoming published event
router.get("/next", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM events
     WHERE published = true AND date >= CURRENT_DATE
     ORDER BY date ASC LIMIT 1`
  );
  res.json({ event: rows[0] || null });
});

router.get("/", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM events WHERE published = true ORDER BY date DESC"
  );
  res.json({ events: rows });
});

router.get("/admin/all", requireAdmin, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM events ORDER BY date DESC");
  res.json({ events: rows });
});

router.post("/", requireAdmin, async (req, res) => {
  const {
    title, description, date, time, venue, age_range,
    registration_deadline, registration_fee, available_seats,
    registration_url, published = false,
  } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: "title and date are required" });
  }

  const { rows } = await pool.query(
    `INSERT INTO events
       (title, description, date, time, venue, age_range, registration_deadline,
        registration_fee, available_seats, registration_url, published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [title, description, date, emptyToNull(time), venue, age_range, emptyToNull(registration_deadline),
     registration_fee, emptyToNull(available_seats), registration_url, published]
  );
  res.status(201).json({ event: rows[0] });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const {
    title, description, date, time, venue, age_range,
    registration_deadline, registration_fee, available_seats,
    registration_url, published,
  } = req.body;

  const { rows } = await pool.query(
    `UPDATE events SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       date = COALESCE($3, date),
       time = $4,
       venue = COALESCE($5, venue),
       age_range = COALESCE($6, age_range),
       registration_deadline = $7,
       registration_fee = COALESCE($8, registration_fee),
       available_seats = $9,
       registration_url = COALESCE($10, registration_url),
       published = COALESCE($11, published)
     WHERE id = $12 RETURNING *`,
    [title, description, date, emptyToNull(time), venue, age_range, emptyToNull(registration_deadline),
     registration_fee, emptyToNull(available_seats), registration_url, published, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Event not found" });
  res.json({ event: rows[0] });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM events WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

router.post("/:id/banner", requireAdmin, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const file_url = `/uploads/${req.file.filename}`;
  const { rows } = await pool.query(
    "UPDATE events SET banner = $1 WHERE id = $2 RETURNING *",
    [file_url, req.params.id]
  );
  res.json({ event: rows[0] });
});

export default router;
