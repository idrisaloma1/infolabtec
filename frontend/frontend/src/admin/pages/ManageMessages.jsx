import { useEffect, useState } from "react";
import { adminApi } from "../../api.js";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);

  function loadList() {
    adminApi.get("/messages").then(({ data }) => setMessages(data.messages));
  }
  useEffect(loadList, []);

  async function markRead(id) {
    await adminApi.put(`/messages/${id}/read`);
    loadList();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this message?")) return;
    await adminApi.delete(`/messages/${id}`);
    loadList();
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl">Contact Messages</h1>
      <p className="mt-1 text-sm text-white/50">Messages submitted through the Contact Us form.</p>

      <div className="mt-8 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`rounded-xl border p-5 ${m.read_status ? "border-white/10 bg-navy-800/30" : "border-cyan-400/40 bg-cyan-400/5"}`}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-medium">{m.name} {!m.read_status && <span className="ml-2 text-[10px] uppercase tracking-wide text-cyan-400">New</span>}</p>
                <p className="text-xs text-white/40">{m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                {m.subject && <p className="mt-1 text-sm font-medium text-white/80">{m.subject}</p>}
                <p className="mt-1 text-sm text-white/60">{m.message}</p>
                <p className="mt-2 text-[11px] text-white/30">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {!m.read_status && (
                  <button onClick={() => markRead(m.id)} className="text-xs text-cyan-400 hover:underline">
                    Mark Read
                  </button>
                )}
                <button onClick={() => handleDelete(m.id)} className="text-xs text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-white/30">No messages yet.</p>}
      </div>
    </div>
  );
}
