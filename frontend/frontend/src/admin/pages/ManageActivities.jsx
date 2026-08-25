import { useEffect, useState } from "react";
import { adminApi } from "../../api.js";

const CATEGORIES = [
  "Python Programming", "Scratch Programming", "Artificial Intelligence", "Mobile App Development",
  "Web Development", "Robotics", "Coding Activities", "Team Projects", "Presentation",
  "Mentorship", "Award Ceremony", "Graduation", "Other Activities",
];

const emptyForm = {
  title: "", description: "", date: "", category: CATEGORIES[0], trainer: "",
  technologies: "", activity_link: "", featured: false, status: "draft",
};

export default function ManageActivities() {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null); // activity being edited, or "new"
  const [form, setForm] = useState(emptyForm);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function loadList() {
    adminApi.get("/activities/admin/all").then(({ data }) => setActivities(data.activities));
  }

  useEffect(loadList, []);

  function startNew() {
    setSelected("new");
    setForm(emptyForm);
    setMedia([]);
    setError("");
  }

  async function startEdit(activity) {
    setSelected(activity.id);
    setForm({
      title: activity.title, description: activity.description || "",
      date: activity.date?.slice(0, 10), category: activity.category,
      trainer: activity.trainer || "", technologies: (activity.technologies || []).join(", "),
      activity_link: activity.activity_link || "", featured: activity.featured, status: activity.status,
    });
    setError("");
    const { data } = await adminApi.get(`/activities/${activity.slug}`).catch(() => ({ data: { media: [] } }));
    setMedia(data.media || []);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (selected === "new") {
        const { data } = await adminApi.post("/activities", payload);
        loadList();
        startEdit(data.activity);
      } else {
        await adminApi.put(`/activities/${selected}`, payload);
        loadList();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this activity and all its media? This cannot be undone.")) return;
    await adminApi.delete(`/activities/${id}`);
    if (selected === id) setSelected(null);
    loadList();
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length || selected === "new" || !selected) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    try {
      const { data } = await adminApi.post(`/activities/${selected}/media`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMedia((m) => [...m, ...data.media]);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDeleteMedia(mediaId) {
    await adminApi.delete(`/activities/media/${mediaId}`);
    setMedia((m) => m.filter((item) => item.id !== mediaId));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Class Activities</h1>
          <p className="mt-1 text-sm text-white/50">Create, edit and publish classroom activities.</p>
        </div>
        <button onClick={startNew} className="rounded-full bg-cyan-400 text-navy-950 text-sm font-semibold px-4 py-2">
          + New Activity
        </button>
      </div>

      <div className="mt-8 grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {activities.map((a) => (
            <button
              key={a.id}
              onClick={() => startEdit(a)}
              className={`w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                selected === a.id ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-navy-800/40 hover:bg-white/5"
              }`}
            >
              <p className="font-medium truncate">{a.title}</p>
              <p className="mt-0.5 text-xs text-white/40 flex items-center gap-2">
                <StatusBadge status={a.status} />
                {a.category}
              </p>
            </button>
          ))}
          {activities.length === 0 && <p className="text-sm text-white/30">No activities yet.</p>}
        </div>

        {selected && (
          <div className="rounded-xl border border-white/10 bg-navy-800/40 p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <Field label="Title" required value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-lg bg-navy-950 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Date" type="date" required value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} />
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-lg bg-navy-950 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Trainer" value={form.trainer} onChange={(v) => setForm((f) => ({ ...f, trainer: v }))} />
                <Field label="Technologies (comma separated)" value={form.technologies} onChange={(v) => setForm((f) => ({ ...f, technologies: v }))} />
              </div>
              <Field label="Optional Activity Link" value={form.activity_link} onChange={(v) => setForm((f) => ({ ...f, activity_link: v }))} />

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
                  Featured
                </label>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="rounded-lg bg-navy-950 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={saving} className="rounded-full bg-gradient-to-r from-electric-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-navy-950 disabled:opacity-50">
                  {saving ? "Saving…" : "Save"}
                </button>
                {selected !== "new" && (
                  <button type="button" onClick={() => handleDelete(selected)} className="text-sm text-red-400 hover:underline">
                    Delete Activity
                  </button>
                )}
              </div>
            </form>

            {selected !== "new" && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="font-display font-semibold text-sm">Photos & Videos</h3>
                <label className="mt-3 inline-block cursor-pointer rounded-lg border border-dashed border-white/20 px-4 py-3 text-xs text-white/50 hover:border-cyan-400">
                  {uploading ? "Uploading…" : "Click to upload photos or videos"}
                  <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                </label>

                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {media.map((m) => (
                    <div key={m.id} className="relative rounded-lg overflow-hidden bg-navy-900 aspect-square group">
                      {m.media_type === "photo" ? (
                        <img src={m.file_url} alt={m.caption || ""} className="h-full w-full object-cover" />
                      ) : (
                        <video src={m.file_url} className="h-full w-full object-cover" muted />
                      )}
                      <button
                        onClick={() => handleDeleteMedia(m.id)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500/90 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {media.length === 0 && <p className="text-xs text-white/30 col-span-full">No media uploaded yet.</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    draft: "bg-white/10 text-white/50",
    review: "bg-yellow-400/20 text-yellow-300",
    published: "bg-cyan-400/20 text-cyan-300",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${colors[status]}`}>{status}</span>;
}

function Field({ label, required, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-navy-950 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400"
      />
    </div>
  );
}
