import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { pool } from "../db/pool.js";

const router = Router();

// Slow down brute-force attempts on the login route.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Try again later." },
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { rows } = await pool.query(
    "SELECT * FROM admins WHERE email = $1",
    [email.toLowerCase().trim()]
  );
  const admin = rows[0];

  if (!admin) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.json({
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email },
  });
});

// One-time bootstrap route to create the first admin account.
// Requires SETUP_SECRET to match an env var — remove or disable after first use.
router.post("/setup", async (req, res) => {
  const { name, email, password, setupSecret } = req.body;

  if (!process.env.SETUP_SECRET || setupSecret !== process.env.SETUP_SECRET) {
    return res.status(403).json({ error: "Invalid setup secret" });
  }

  const { rows: existing } = await pool.query("SELECT id FROM admins LIMIT 1");
  if (existing.length > 0) {
    return res.status(400).json({ error: "An admin already exists" });
  }

  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({
      error: "name, email and a password of at least 8 characters are required",
    });
  }

  const password_hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    "INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email.toLowerCase().trim(), password_hash]
  );

  res.status(201).json({ admin: rows[0] });
});

export default router;
