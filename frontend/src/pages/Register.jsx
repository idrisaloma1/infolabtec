import { useState } from "react";
import { api } from "../api.js";

const EVENT_TYPES = ["Bootcamp", "Anniversary", "Online Meeting"];

const initialForm = {
  full_name: "",
  address: "",
  school: "",
  age: "",
  email: "",
  is_club_member: "",
  parent_phone: "",
  event_type: "",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.post("/registrations", {
        ...form,
        age: form.age ? Number(form.age) : null,
        is_club_member: form.is_club_member === "yes",
      });
      setStatus("sent");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-2xl px-5 lg:px-8">
        <p className="text-brand-green-600 text-sm font-semibold tracking-[0.2em] uppercase">Register</p>
        <h1 className="mt-3 font-display font-bold text-3xl md:text-4xl">Event Registration</h1>
        <p className="mt-4 text-brand-ink/60">
          Fill in your details below to register for an upcoming INFOLAB Tech Bridge event.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-black/10 bg-white/60 p-6 md:p-8 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-brand-ink/50 mb-1.5">Event</label>
            <select
              required
              value={form.event_type}
              onChange={update("event_type")}
              className="w-full rounded-lg bg-brand-mist border border-black/10 px-4 py-2.5 text-sm text-brand-ink focus:outline-none focus:border-brand-green-600"
            >
              <option value="" disabled>Select an event…</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" required value={form.full_name} onChange={update("full_name")} />
            <Field label="Email" type="email" required value={form.email} onChange={update("email")} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="School" value={form.school} onChange={update("school")} />
            <Field label="Age" type="number" value={form.age} onChange={update("age")} />
          </div>

          <Field label="Address" value={form.address} onChange={update("address")} />

          <Field label="Parent's Phone Number" value={form.parent_phone} onChange={update("parent_phone")} />

          <div>
            <label className="block text-xs uppercase tracking-wider text-brand-ink/50 mb-2">
              Are you a member of the club?
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-brand-ink/80">
                <input
                  type="radio"
                  name="is_club_member"
                  value="yes"
                  required
                  checked={form.is_club_member === "yes"}
                  onChange={update("is_club_member")}
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm text-brand-ink/80">
                <input
                  type="radio"
                  name="is_club_member"
                  value="no"
                  required
                  checked={form.is_club_member === "no"}
                  onChange={update("is_club_member")}
                />
                No
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-gradient-to-r from-brand-green-500 to-brand-red-500 px-6 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {status === "sending" ? "Submitting…" : "Submit Registration"}
          </button>

          {status === "sent" && <p className="text-sm text-brand-green-600 text-center">Registration submitted — see you there!</p>}
          {status === "error" && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}
        </form>
      </div>
    </section>
  );
}

function Field({ label, type = "text", required, value, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-brand-ink/50 mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg bg-brand-mist border border-black/10 px-4 py-2.5 text-sm text-brand-ink placeholder-brand-ink/40 focus:outline-none focus:border-brand-green-600"
      />
    </div>
  );
}