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
          <p className="text-brand-green-600 text-sm font-semibold tracking-[0.2em] uppercase">Contact Us</p>
          <h1 className="mt-3 font-display font-bold text-3xl md:text-4xl">Infolab Technology Services Limited</h1>
          <p className="mt-4 text-brand-ink/60 max-w-md">
            Questions about the Bootcamp, upcoming events, or partnering with us? Send a message
            and we'll get back to you.
          </p>

          <div className="mt-8 space-y-3 text-sm">
            <p className="text-brand-ink/70">📍 Lagos, Nigeria</p>
            <p className="text-brand-ink/70">✉️ hello@infolabtechbridge.com</p>
            <p className="text-brand-ink/70">📞 +234 XXX XXX XXXX</p>
          </div>

          <a
            href="https://wa.me/234XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-brand-ink hover:opacity-90 transition"
          >
            💬 Chat with INFOLAB on WhatsApp
          </a>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-black/10 bg-white/60 p-6 md:p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" required value={form.name} onChange={update("name")} />
            <Field label="Email" type="email" required value={form.email} onChange={update("email")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone Number" value={form.phone} onChange={update("phone")} />
            <Field label="Subject" value={form.subject} onChange={update("subject")} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-brand-ink/50 mb-1.5">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={update("message")}
              className="w-full rounded-lg bg-brand-mist border border-black/10 px-4 py-3 text-sm text-brand-ink placeholder-brand-ink/40 focus:outline-none focus:border-brand-green-600"
              placeholder="Tell us how we can help…"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-gradient-to-r from-brand-green-500 to-brand-red-500 px-6 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>

          {status === "sent" && <p className="text-sm text-brand-green-600 text-center">Message sent — we'll be in touch.</p>}
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
