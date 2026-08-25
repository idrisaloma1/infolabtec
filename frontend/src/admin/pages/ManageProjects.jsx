import { useEffect, useState } from "react";
import { adminApi } from "../../api.js";

const CATEGORIES = ["Python", "Scratch", "Artificial Intelligence", "Mobile Apps", "Web Development", "Games", "Educational Apps", "Other"];

const emptyForm = {
  title: "", student_name: "", description: "", technology: "", category: CATEGORIES[0],
  project_url: "", demo_url: "", github_url: "", video_url: "", featured: false, published: false,
};

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [screenshot, setScreenshot] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function loadList() {
    adminApi.get("/projects/admin/all").then(({ data }) => setProjects(data.projects));
  }
  useEffect(loadList, []);

  function startNew() {
    setSelected("new");
    setForm(emptyForm);
    setError("");
  }

  function startEdit(p) {
    setSelected(p.id);
    setForm({
      title: p.title, student_name: p.student_name, description: p.description || "",
      technology: p.technology || "", category: p.category, project_url: p.project_url || "",
      demo_url: p.demo_url || "", github_url: p.github_url || "", video_url: p.video_url || "",
      featured: p.featured, published: p.published,
    });
    setError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let id = selected;
      if (selected === "new") {
        const { data } = await adminApi.post("/projects", form);
        id = data.project.id;
      } else {
        await adminApi.put(`/projects/${selected}`, form);
      }
      if (screenshot) {
        const fd = new FormData();
        fd.append("file", screenshot);
        await adminApi.post(`/projects/${id}/screenshot`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        setScreenshot(null);
      }
      if (videoFile) {
        const fd = new FormData();
        fd.append("file", videoFile);
        await adminApi.post(`/projects/${id}/video`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        setVideoFile(null);
      }
      loadList();
      setSelected(id);
    } catch (err) {
      setError(err.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    await adminApi.delete(`/projects/${id}`);
    if (selected === id) setSelected(null);
    loadList();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Portfolio</h1>
          <p className="mt-1 text-sm text-white/50">Manage student projects shown on the site.</p>
        </div>
        <button onClick={startNew} className="rounded-full bg-cyan-400 text-navy-950 text-sm font-semibold px-4 py-2">
          + New Project
        </button>
      </div>

      <div className="mt-8 grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => startEdit(p)}
              className={`w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                selected === p.id ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-navy-800/40 hover:bg-white/5"
              }`}
            >
              <p className="font-medium truncate">{p.title}</p>
              <p className="mt-0.5 text-xs text-white/40">{p.student_name} · {p.published ? "Published" : "Unpublished"}</p>
            </button>
          ))}
          {projects.length === 0 && <p className="text-sm text-white/30">No projects yet.</p>}
        </div>

        {selected && (
          <form onSubmit={handleSave} className="rounded-xl border border-white/10 bg-navy-800/40 p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Project Title" required value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
              <Field label="Student Name" required value={form.student_name} onChange={(v) => setForm((f) => ({ ...f, student_name: v }))} />
            </div>
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
              <Field label="Technology" value={form.technology} onChange={(v) => setForm((f) => ({ ...f, technology: v }))} />
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
              <Field label="Live Project URL" value={form.project_url} onChange={(v) => setForm((f) => ({ ...f, project_url: v }))} />
              <Field label="Demo URL" value={form.demo_url} onChange={(v) => setForm((f) => ({ ...f, demo_url: v }))} />
              <Field label="GitHub URL" value={form.github_url} onChange={(v) => setForm((f) => ({ ...f, github_url: v }))} />
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">
                  Video Demo URL <span className="normal-case text-white/30">(paste a YouTube/Vimeo link)</span>
                </label>
                <input
                  value={form.video_url}
                  onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                  className="w-full rounded-lg bg-navy-950 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Screenshot (image)</label>
                <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files[0])} className="text-xs text-white/50" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">
                  Or Upload a Video File <span className="normal-case text-white/30">(mp4, webm, mov — replaces the URL above)</span>
                </label>
                <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => setVideoFile(e.target.files[0])} className="text-xs text-white/50" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
                Published
              </label>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="rounded-full bg-gradient-to-r from-electric-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-navy-950 disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
              {selected !== "new" && (
                <button type="button" onClick={() => handleDelete(selected)} className="text-sm text-red-400 hover:underline">
                  Delete Project
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, value, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-navy-950 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400"
      />
    </div>
  );
}
