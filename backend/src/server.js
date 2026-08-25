import express from "express";
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

// Centralized error handler (e.g. multer file-type/size rejections)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`INFOLAB TECH BRIDGE API listening on port ${PORT}`);
});
