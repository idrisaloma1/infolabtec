import { useEffect, useState } from "react";
import { adminApi } from "../../api.js";

export default function ManageGallery() {
  const [albums, setAlbums] = useState([]);
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function loadList() {
    adminApi.get("/gallery/admin/all").then(({ data }) => setAlbums(data.albums));
  }
  useEffect(loadList, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await adminApi.post("/gallery", { title, category, published });
      setTitle("");
      setCategory("");
      setPublished(false);
      loadList();
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't create album");
    }
  }

  async function togglePublished(album) {
    await adminApi.put(`/gallery/${album.id}`, { published: !album.published });
    loadList();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this album and its media?")) return;
    await adminApi.delete(`/gallery/${id}`);
    loadList();
  }

  async function handleUpload(albumId, e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    try {
      await adminApi.post(`/gallery/${albumId}/media`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl">Gallery</h1>
      <p className="mt-1 text-sm text-white/50">Manage standalone photo/video albums (separate from Class Activities).</p>

      <form onSubmit={handleCreate} className="mt-6 flex flex-wrap gap-3 items-end rounded-xl border border-white/10 bg-navy-800/40 p-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Album Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required
            className="rounded-lg bg-navy-950 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-cyan-400" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg bg-navy-950 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-cyan-400" />
        </div>
        <label className="flex items-center gap-2 text-sm pb-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published
        </label>
        <button type="submit" className="rounded-full bg-cyan-400 text-navy-950 text-sm font-semibold px-4 py-2">
          Create Album
        </button>
        {error && <p className="text-sm text-red-400 w-full">{error}</p>}
      </form>

      <div className="mt-6 space-y-3">
        {albums.map((a) => (
          <div key={a.id} className="rounded-xl border border-white/10 bg-navy-800/40 p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-white/40">{a.category || "Uncategorized"} · {a.published ? "Published" : "Unpublished"}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer text-xs text-cyan-400 hover:underline">
                  {uploading ? "Uploading…" : "Upload media"}
                  <input type="file" multiple accept="image/*,video/*" onChange={(e) => handleUpload(a.id, e)} className="hidden" disabled={uploading} />
                </label>
                <button onClick={() => togglePublished(a)} className="text-xs text-white/60 hover:text-white">
                  {a.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => handleDelete(a.id)} className="text-xs text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {albums.length === 0 && <p className="text-sm text-white/30">No albums yet.</p>}
      </div>
    </div>
  );
}
