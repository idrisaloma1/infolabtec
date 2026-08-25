import { Router } from "express";
import rateLimit from "express-rate-limit";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many messages sent. Please try again later." },
});

// POST /api/messages — public contact form submission
router.post("/", contactLimiter, async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }

  const { rows } = await pool.query(
    `INSERT INTO messages (name, email, phone, subject, message)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [name, email, phone, subject, message]
  );

  res.status(201).json({ id: rows[0].id, message: "Message received. We'll be in touch." });
});

router.get("/", requireAdmin, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
  res.json({ messages: rows });
});

router.put("/:id/read", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE messages SET read_status = true WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  res.json({ message: rows[0] });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM messages WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

export default router;
