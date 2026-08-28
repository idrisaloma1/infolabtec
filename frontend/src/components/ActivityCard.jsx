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
      className="group rounded-2xl overflow-hidden border border-black/10 bg-white/70 hover:border-brand-green-500/50 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-brand-mist overflow-hidden">
        {activity.cover_image ? (
          <img
            src={activity.cover_image}
            alt={activity.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-brand-ink/30 text-4xl">🖼</div>
        )}
        {Number(activity.video_count) > 0 && (
          <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold flex items-center gap-1">
            ▶ Video
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-brand-ink/50">
          <span>{dateLabel}</span>
          <span aria-hidden="true">•</span>
          <span className="text-brand-green-600">{activity.category}</span>
        </div>
        <h3 className="mt-2 font-display font-semibold text-lg leading-snug">{activity.title}</h3>
        {activity.description && (
          <p className="mt-2 text-sm text-brand-ink/60 line-clamp-2">{activity.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-brand-ink/40">
          <span>{activity.photo_count || 0} photos</span>
          <span className="text-brand-green-600 font-semibold group-hover:underline">View Activity →</span>
        </div>
      </div>
    </Link>
  );
}
