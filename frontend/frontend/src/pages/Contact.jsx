import { useState } from "react";
import { api } from "../api.js";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
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
      await api.post("/messages", form);
      setStatus("sent");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-cyan-400 text-sm font-semibold tracking-[0.2em] uppercase">Contact Us</p>
          <h1 className="mt-3 font-display font-bold text-3xl md:text-4xl">Infolab Technology Services Limited</h1>
          <p className="mt-4 text-white/60 max-w-md">
            Questions about the Bootcamp, upcoming events, or partnering with us? Send a message
            and we'll get back to you.
          </p>

          <div className="mt-8 space-y-3 text-sm">
            <p className="text-white/70">📍 Lagos, Nigeria</p>
            <p className="text-white/70">✉️ hello@infolabtechbridge.com</p>
            <p className="text-white/70">📞 +234 XXX XXX XXXX</p>
          </div>

          <a
            href="https://wa.me/234XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-navy-950 hover:opacity-90 transition"
          >
            💬 Chat with INFOLAB on WhatsApp
          </a>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 md:p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" required value={form.name} onChange={update("name")} />
            <Field label="Email" type="email" required value={form.email} onChange={update("email")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone Number" value={form.phone} onChange={update("phone")} />
            <Field label="Subject" value={form.subject} onChange={update("subject")} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={update("message")}
              className="w-full rounded-lg bg-navy-900 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
              placeholder="Tell us how we can help…"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-gradient-to-r from-electric-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-navy-950 hover:opacity-90 transition disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>

          {status === "sent" && <p className="text-sm text-cyan-400 text-center">Message sent — we'll be in touch.</p>}
          {status === "error" && <p className="text-sm text-red-400 text-center">{errorMsg}</p>}
        </form>
      </div>
    </section>
  );
}

function Field({ label, type = "text", required, value, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg bg-navy-900 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
      />
    </div>
  );
}
