import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useReveal } from "../hooks/useReveal.js";
import ProjectCard from "./ProjectCard.jsx";

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const ref = useReveal();

  useEffect(() => {
    api.get("/projects", { params: { featured: "true", limit: 6 } })
      .then(({ data }) => setProjects(data.projects))
      .catch(() => {});
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-brand-mist/60">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl">Featured Student Projects</h2>
          <p className="mt-3 text-brand-ink/60">Real applications, built by real students.</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/portfolio" className="inline-flex rounded-full border border-black/15 px-6 py-3 text-sm font-semibold hover:bg-black/5 transition">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
