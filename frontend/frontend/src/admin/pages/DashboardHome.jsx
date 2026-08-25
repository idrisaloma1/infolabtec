import { useEffect, useState } from "react";
import { adminApi } from "../../api.js";

const CARDS = [
  { key: "totalActivities", label: "Total Activities" },
  { key: "totalPhotos", label: "Total Photos" },
  { key: "totalVideos", label: "Total Videos" },
  { key: "totalProjects", label: "Total Projects" },
  { key: "featuredProjects", label: "Featured Projects" },
  { key: "upcomingEvents", label: "Upcoming Events" },
  { key: "unreadMessages", label: "Unread Messages" },
];

export default function DashboardHome() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .get("/stats/dashboard/summary")
      .then(({ data }) => setSummary(data))
      .catch(() => setError("Couldn't load dashboard summary."));
  }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">Overview of everything on the site.</p>

      {error && <p className="mt-8 text-white/40 text-sm">{error}</p>}

      {summary && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {CARDS.map((c) => (
            <div key={c.key} className="rounded-xl border border-white/10 bg-navy-800/50 p-5">
              <p className="text-3xl font-display font-bold text-cyan-400">{summary[c.key]}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/50">{c.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
