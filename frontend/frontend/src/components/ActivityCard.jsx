import { Link } from "react-router-dom";

export default function ActivityCard({ activity }) {
  const dateLabel = new Date(activity.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      to={`/activities/${activity.slug}`}
      className="group rounded-2xl overflow-hidden border border-white/10 bg-navy-800/60 hover:border-cyan-400/40 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-navy-700 overflow-hidden">
        {activity.cover_image ? (
          <img
            src={activity.cover_image}
            alt={activity.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white/20 text-4xl">🖼</div>
        )}
        {Number(activity.video_count) > 0 && (
          <span className="absolute top-3 right-3 rounded-full bg-navy-950/80 px-2.5 py-1 text-xs font-semibold flex items-center gap-1">
            ▶ Video
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>{dateLabel}</span>
          <span aria-hidden="true">•</span>
          <span className="text-cyan-400">{activity.category}</span>
        </div>
        <h3 className="mt-2 font-display font-semibold text-lg leading-snug">{activity.title}</h3>
        {activity.description && (
          <p className="mt-2 text-sm text-white/60 line-clamp-2">{activity.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-white/40">
          <span>{activity.photo_count || 0} photos</span>
          <span className="text-cyan-400 font-semibold group-hover:underline">View Activity →</span>
        </div>
      </div>
    </Link>
  );
}
