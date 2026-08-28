import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-black/10 bg-white/70 hover:border-brand-green-500/50 transition-colors flex flex-col">
      <Link to={`/portfolio/${project.id}`} className="relative aspect-video bg-brand-mist overflow-hidden block">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-brand-ink/30 text-4xl">💻</div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-brand-green-600">{project.category}</span>
        <Link to={`/portfolio/${project.id}`}>
          <h3 className="mt-1 font-display font-semibold text-lg leading-snug hover:text-brand-green-600 transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-xs text-brand-ink/50 mt-1">By {project.student_name}</p>
        {project.description && <p className="mt-2 text-sm text-brand-ink/60 line-clamp-2">{project.description}</p>}

        <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-black/10">
          <Link
            to={`/portfolio/${project.id}`}
            className="text-xs font-semibold text-brand-green-600 hover:underline"
          >
            View Project
          </Link>
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-brand-ink/60 hover:text-brand-ink"
            >
              Live Demo ↗
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-brand-ink/60 hover:text-brand-ink"
            >
              View Source ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
