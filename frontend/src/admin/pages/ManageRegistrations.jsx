import { useEffect, useState } from "react";
import { adminApi } from "../../api.js";

export default function ManageRegistrations() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    adminApi.get("/registrations").then(({ data }) => setRegistrations(data.registrations));
  }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl">Event Registrations</h1>
      <p className="mt-1 text-sm text-brand-ink/50">Registrations submitted through the Register For Next Event form.</p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-black/10 bg-white/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-brand-ink/50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">School</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Club Member</th>
              <th className="px-4 py-3">Parent's Phone</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium">{r.full_name}</td>
                <td className="px-4 py-3">{r.event_type}</td>
                <td className="px-4 py-3 text-brand-ink/60">{r.email}</td>
                <td className="px-4 py-3 text-brand-ink/60">{r.school || "—"}</td>
                <td className="px-4 py-3 text-brand-ink/60">{r.age ?? "—"}</td>
                <td className="px-4 py-3">{r.is_club_member ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-brand-ink/60">{r.parent_phone || "—"}</td>
                <td className="px-4 py-3 text-brand-ink/60">{r.address || "—"}</td>
                <td className="px-4 py-3 text-[11px] text-brand-ink/40">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {registrations.length === 0 && (
          <p className="px-4 py-6 text-sm text-brand-ink/40">No registrations yet.</p>
        )}
      </div>
    </div>
  );
}