import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("itb_admin_token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-hero-gradient">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-navy-900/80 p-8">
        <p className="font-display font-bold text-lg text-center">
          INFOLAB <span className="text-cyan-400">ADMIN</span>
        </p>
        <p className="mt-1 text-center text-xs text-white/40">Sign in to manage the site</p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-navy-950 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-navy-950 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-electric-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-navy-950 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
