import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import Lightbox from "../components/Lightbox.jsx";
import VideoPlayer from "../components/VideoPlayer.jsx";

export default function ActivityDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    api
      .get(`/activities/${slug}`)
      .then(({ data }) => setData(data))
      .catch(() => setError("This activity couldn't be found."));
  }, [slug]);

  if (error) {
    return (
      <section className="pt-32 pb-24 text-center px-5">
        <p className="text-white/60">{error}</p>
        <Link to="/gallery" className="mt-4 inline-block text-cyan-400 hover:underline">
          ← Back to Class Activities
        </Link>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="pt-32 pb-24 text-center">
        <p className="text-white/40">Loading…</p>
      </section>
    );
  }

  const { activity, media } = data;
  const photos = media.filter((m) => m.media_type === "photo");
  const videos = media.filter((m) => m.media_type === "video");
  const dateLabel = new Date(activity.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Link to="/gallery" className="text-sm text-cyan-400 hover:underline">
          ← Back to Class Activities
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/50">
          <span>{dateLabel}</span>
          <span aria-hidden="true">•</span>
          <span className="text-cyan-400">{activity.category}</span>
          {activity.trainer && (
            <>
              <span aria-hidden="true">•</span>
              <span>Trainer: {activity.trainer}</span>
            </>
          )}
        </div>

        <h1 className="mt-3 font-display font-bold text-3xl md:text-4xl">{activity.title}</h1>
        {activity.description && <p className="mt-4 text-white/70 leading-relaxed max-w-3xl">{activity.description}</p>}

        {activity.technologies?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activity.technologies.map((t) => (
              <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                {t}
              </span>
            ))}
          </div>
        )}

        {activity.activity_link && (
          <a
            href={activity.activity_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-cyan-400 hover:underline"
          >
            View related link ↗
          </a>
        )}

        {videos.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display font-semibold text-xl">Class Video</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {videos.map((v) => (
                <VideoPlayer key={v.id} video={v} />
              ))}
            </div>
          </div>
        )}

        {photos.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display font-semibold text-xl">Photo Gallery</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setLightboxIndex(i)}
                  className="aspect-square rounded-lg overflow-hidden bg-navy-800 hover:opacity-80 transition-opacity"
                >
                  <img src={p.file_url} alt={p.caption || activity.title} loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
