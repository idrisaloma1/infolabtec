import { useEffect, useState } from "react";
import { api } from "../api.js";
import ProjectCard from "../components/ProjectCard.jsx";

const CATEGORIES = ["All", "Python", "Scratch", "Artificial Intelligence", "Mobile Apps", "Web Development", "Games", "Educational Apps", "Other"];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get("/projects", { params: category === "All" ? {} : { category } })
      .then(({ data }) => setProjects(data.projects))
      .catch(() => setError("Couldn't load student projects right now."))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-cyan-400 text-sm font-semibold tracking-[0.2em] uppercase">Student Project Portfolio</p>
          <h1 className="mt-3 font-display font-bold text-3xl md:text-5xl">What Our Students Built</h1>
          <p className="mt-4 text-white/60">
            Real applications built with Python, Scratch, Artificial Intelligence and Hercules AI.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                category === c ? "bg-cyan-400 text-navy-950" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="mt-16 text-center text-white/40">Loading projects…</p>}
        {error && <p className="mt-16 text-center text-white/40">{error}</p>}
        {!loading && !error && projects.length === 0 && (
          <p className="mt-16 text-center text-white/40">No projects published in this category yet.</p>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
