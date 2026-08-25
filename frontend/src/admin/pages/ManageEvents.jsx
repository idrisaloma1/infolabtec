import { useEffect, useState } from "react";
import { adminApi } from "../../api.js";

const emptyForm = {
  title: "", description: "", date: "", time: "", venue: "", age_range: "",
  registration_deadline: "", registration_fee: "", available_seats: "",
  registration_url: "", published: false,
};

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function loadList() {
    adminApi.get("/events/admin/all").then(({ data }) => setEvents(data.events));
  }
  useEffect(loadList, []);

  function startNew() {
    setSelected("new");
    setForm(emptyForm);
    setError("");
  }

  function startEdit(ev) {
    setSelected(ev.id);
    setForm({
      title: ev.title, description: ev.description || "", date: ev.date?.slice(0, 10),
      time: ev.time || "", venue: ev.venue || "", age_range: ev.age_range || "",
      registration_deadline: ev.registration_deadline?.slice(0, 10) || "",
      registration_fee: ev.registration_fee || "", available_seats: ev.available_seats ?? "",
      registration_url: ev.registration_url || "", published: ev.published,
    });
    setError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, available_seats: form.available_seats === "" ? null : Number(form.available_seats) };
    try {
      let id = selected;
      if (selected === "new") {
        const { data } = await adminApi.post("/events", payload);
        id = data.event.id;
      } else {
        await adminApi.put(`/events/${selected}`, payload);
      }
      if (banner) {
        const fd = new FormData();
        fd.append("file", banner);
        await adminApi.post(`/events/${id}/banner`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        setBanner(null);
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
    if (!confirm("Delete this event?")) return;
    await adminApi.delete(`/events/${id}`);
    if (selected === id) setSelected(null);
    loadList();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Events</h1>
          <p className="mt-1 text-sm text-white/50">Manage upcoming events and the homepage countdown.</p>
        </div>
        <button onClick={startNew} className="rounded-full bg-cyan-400 text-navy-950 text-sm font-semibold px-4 py-2">
          + New Event
        </button>
      </div>

      <div className="mt-8 grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => startEdit(ev)}
              className={`w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                selected === ev.id ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-navy-800/40 hover:bg-white/5"
              }`}
            >
              <p className="font-medium truncate">{ev.title}</p>
              <p className="mt-0.5 text-xs text-white/40">{new Date(ev.date).toLocaleDateString()} · {ev.published ? "Published" : "Unpublished"}</p>
            </button>
          ))}
          {events.length === 0 && <p className="text-sm text-white/30">No events yet.</p>}
        </div>

        {selected && (
          <form onSubmit={handleSave} className="rounded-xl border border-white/10 bg-navy-800/40 p-6 space-y-4">
            <Field label="Event Name" required value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Program Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-lg bg-navy-950 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Date" type="date" required value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} />
              <Field label="Time" type="time" value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} />
              <Field label="Venue" value={form.venue} onChange={(v) => setForm((f) => ({ ...f, venue: v }))} />
              <Field label="Age Range" value={form.age_range} onChange={(v) => setForm((f) => ({ ...f, age_range: v }))} />
              <Field label="Registration Deadline" type="date" value={form.registration_deadline} onChange={(v) => setForm((f) => ({ ...f, registration_deadline: v }))} />
              <Field label="Registration Fee" value={form.registration_fee} onChange={(v) => setForm((f) => ({ ...f, registration_fee: v }))} />
              <Field label="Available Seats" type="number" value={form.available_seats} onChange={(v) => setForm((f) => ({ ...f, available_seats: v }))} />
              <Field label="Registration Link" value={form.registration_url} onChange={(v) => setForm((f) => ({ ...f, registration_url: v }))} />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Event Banner</label>
              <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} className="text-xs text-white/50" />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
              Published
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="rounded-full bg-gradient-to-r from-electric-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-navy-950 disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
              {selected !== "new" && (
                <button type="button" onClick={() => handleDelete(selected)} className="text-sm text-red-400 hover:underline">
                  Delete Event
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
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
