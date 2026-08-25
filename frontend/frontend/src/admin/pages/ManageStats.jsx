import { useEffect, useState } from "react";
import { adminApi } from "../../api.js";

export default function ManageStats() {
  const [stats, setStats] = useState([]);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    adminApi.get("/stats").then(({ data }) => setStats(data.stats));
  }, []);

  function updateLocal(key, value) {
    setStats((s) => s.map((stat) => (stat.key === key ? { ...stat, value } : stat)));
  }

  async function save(key, value) {
    setSaving(key);
    try {
      await adminApi.put(`/stats/${key}`, { value: Number(value) });
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl">Homepage Stats</h1>
      <p className="mt-1 text-sm text-white/50">These power the animated counters on the homepage.</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
        {stats.map((s) => (
          <div key={s.key} className="rounded-xl border border-white/10 bg-navy-800/40 p-5">
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">{s.label}</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={s.value}
                onChange={(e) => updateLocal(s.key, e.target.value)}
                className="w-full rounded-lg bg-navy-950 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => save(s.key, s.value)}
                disabled={saving === s.key}
                className="rounded-lg bg-cyan-400 text-navy-950 text-sm font-semibold px-4 disabled:opacity-50"
              >
                {saving === s.key ? "…" : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
