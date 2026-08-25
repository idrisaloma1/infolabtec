import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setProject(null);
    setError(null);
    api
      .get(`/projects/${id}`)
      .then(({ data }) => setProject(data.project))
      .catch(() => setError("This project couldn't be found."));
  }, [id]);

  if (error) {
    return (
      <section className="pt-32 pb-24 text-center px-5">
        <p className="text-white/60">{error}</p>
        <Link to="/portfolio" className="mt-4 inline-block text-cyan-400 hover:underline">
          ← Back to Portfolio
        </Link>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="pt-32 pb-24 text-center">
        <p className="text-white/40">Loading…</p>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <Link to="/portfolio" className="text-sm text-cyan-400 hover:underline">
          ← Back to Portfolio
        </Link>

        {project.image && (
          <div className="mt-6 rounded-2xl overflow-hidden border border-white/10">
            <img src={project.image} alt={project.title} className="w-full aspect-video object-cover" />
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 text-xs text-white/50">
          <span className="text-cyan-400">{project.category}</span>
          {project.technology && (
            <>
              <span aria-hidden="true">•</span>
              <span>{project.technology}</span>
            </>
          )}
        </div>

        <h1 className="mt-2 font-display font-bold text-3xl md:text-4xl">{project.title}</h1>
        <p className="mt-1 text-white/60">By {project.student_name}</p>

        {project.description && <p className="mt-5 text-white/70 leading-relaxed">{project.description}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          {project.project_url && (
            <a href={project.project_url} target="_blank" rel="noopener noreferrer"
              className="rounded-full bg-gradient-to-r from-electric-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:opacity-90 transition">
              View Project
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold hover:bg-white/10 transition">
              Live Demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold hover:bg-white/10 transition">
              View Source
            </a>
          )}
          {project.video_url && (
            <a href={project.video_url} target="_blank" rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold hover:bg-white/10 transition">
              Watch Demo Video
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
