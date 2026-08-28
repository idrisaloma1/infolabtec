import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";

// Uploaded files are served from our own /uploads path — anything else
// (YouTube, Vimeo, external link) is treated as an outbound link instead.
function isUploadedVideo(url) {
  return typeof url === "string" && url.startsWith("/uploads/");
}

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
        <p className="text-brand-ink/60">{error}</p>
        <Link to="/portfolio" className="mt-4 inline-block text-brand-green-600 hover:underline">
          ← Back to Portfolio
        </Link>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="pt-32 pb-24 text-center">
        <p className="text-brand-ink/40">Loading…</p>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <Link to="/portfolio" className="text-sm text-brand-green-600 hover:underline">
          ← Back to Portfolio
        </Link>

        {project.image && (
          <div className="mt-6 rounded-2xl overflow-hidden border border-black/10">
            <img src={project.image} alt={project.title} className="w-full aspect-video object-cover" />
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 text-xs text-brand-ink/50">
          <span className="text-brand-green-600">{project.category}</span>
          {project.technology && (
            <>
              <span aria-hidden="true">•</span>
              <span>{project.technology}</span>
            </>
          )}
        </div>

        <h1 className="mt-2 font-display font-bold text-3xl md:text-4xl">{project.title}</h1>
        <p className="mt-1 text-brand-ink/60">By {project.student_name}</p>

        {project.description && <p className="mt-5 text-brand-ink/70 leading-relaxed">{project.description}</p>}

        {isUploadedVideo(project.video_url) && (
          <div className="mt-6 rounded-xl overflow-hidden bg-black">
            <video src={project.video_url} controls className="w-full aspect-video object-contain bg-black" />
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {project.project_url && (
            <a href={project.project_url} target="_blank" rel="noopener noreferrer"
              className="rounded-full bg-gradient-to-r from-brand-green-500 to-brand-red-500 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
              View Project
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
              className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold hover:bg-black/5 transition">
              Live Demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold hover:bg-black/5 transition">
              View Source
            </a>
          )}
          {project.video_url && !isUploadedVideo(project.video_url) && (
            <a href={project.video_url} target="_blank" rel="noopener noreferrer"
              className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold hover:bg-black/5 transition">
              Watch Demo Video
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
