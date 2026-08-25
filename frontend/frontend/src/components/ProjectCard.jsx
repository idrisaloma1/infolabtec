import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-white/10 bg-navy-800/60 hover:border-cyan-400/40 transition-colors flex flex-col">
      <Link to={`/portfolio/${project.id}`} className="relative aspect-video bg-navy-700 overflow-hidden block">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white/20 text-4xl">💻</div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-cyan-400">{project.category}</span>
        <Link to={`/portfolio/${project.id}`}>
          <h3 className="mt-1 font-display font-semibold text-lg leading-snug hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-xs text-white/50 mt-1">By {project.student_name}</p>
        {project.description && <p className="mt-2 text-sm text-white/60 line-clamp-2">{project.description}</p>}

        <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-white/10">
          <Link
            to={`/portfolio/${project.id}`}
            className="text-xs font-semibold text-cyan-400 hover:underline"
          >
            View Project
          </Link>
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-white/60 hover:text-white"
            >
              Live Demo ↗
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-white/60 hover:text-white"
            >
              View Source ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
