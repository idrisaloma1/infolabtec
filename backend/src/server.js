import express from "express";
import "express-async-errors"; // must load before route files, so their handlers get wrapped
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import activitiesRoutes from "./routes/activities.js";
import projectsRoutes from "./routes/projects.js";
import eventsRoutes from "./routes/events.js";
import galleryRoutes from "./routes/gallery.js";
import messagesRoutes from "./routes/messages.js";
import statsRoutes from "./routes/stats.js";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json({ limit: "2mb" }));

// Serve uploaded media. Swap for Supabase Storage / S3 URLs in production.
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/activities", activitiesRoutes); // also handles /api/activities/media/:id
app.use("/api/projects", projectsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/stats", statsRoutes);

// Serve built frontend (Vite output copied into backend/public at build time)
const frontendDist = path.join(__dirname, "..", "public");
app.use(express.static(frontendDist));

// SPA fallback: any non-API, non-upload GET request returns index.html
app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// Centralized error handler (e.g. multer file-type/size rejections, DB errors
// from express-async-errors, or anything else thrown in a route)
app.use((err, req, res, next) => {
  console.error(err);
  // Postgres: invalid input syntax (e.g. an empty string sent for a date/number column)
  if (err.code === "22P02") {
    return res.status(400).json({ error: "One of the fields has an invalid value — check dates and numbers." });
  }
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`INFOLAB TECH BRIDGE API listening on port ${PORT}`);
});