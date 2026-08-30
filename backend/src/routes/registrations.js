import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const VALID_EVENT_TYPES = ["Bootcamp", "Anniversary", "Online Meeting"];

// POST /api/registrations — public, submit a new registration
router.post("/", async (req, res) => {
  const {
    full_name, address, school, age, email,
    is_club_member, parent_phone, event_type,
  } = req.body;

  if (!full_name || !email || !event_type) {
    return res.status(400).json({ error: "full_name, email and event_type are required" });
  }

  if (!VALID_EVENT_TYPES.includes(event_type)) {
    return res.status(400).json({ error: "Invalid event_type" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO event_registrations
         (full_name, address, school, age, email, is_club_member, parent_phone, event_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [full_name, address, school, age || null, email.toLowerCase().trim(),
       !!is_club_member, parent_phone, event_type]
    );
    res.status(201).json({ registration: rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "This email has already registered for this event" });
    }
    throw err;
  }
});

// GET /api/registrations — admin-only, list all registrations
router.get("/", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM event_registrations ORDER BY created_at DESC"
  );
  res.json({ registrations: rows });
});

export default router;