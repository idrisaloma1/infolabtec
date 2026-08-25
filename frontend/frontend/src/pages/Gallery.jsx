import { useEffect, useState } from "react";
import { api } from "../api.js";
import ActivityCard from "../components/ActivityCard.jsx";
import Lightbox from "../components/Lightbox.jsx";
import VideoPlayer from "../components/VideoPlayer.jsx";

const CATEGORIES = [
  "All",
  "Python Programming",
  "Scratch Programming",
  "Artificial Intelligence",
  "Mobile App Development",
  "Web Development",
  "Robotics",
  "Coding Activities",
  "Team Projects",
  "Presentation",
  "Mentorship",
  "Award Ceremony",
  "Graduation",
  "Other Activities",
];

export default function Gallery() {
  const [activities, setActivities] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get("/activities", { params: category === "All" ? {} : { category } })
      .then(({ data }) => setActivities(data.activities))
      .catch(() => setError("Couldn't load class activities right now."))
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    api.get("/gallery").then(({ data }) => setAlbums(data.albums)).catch(() => {});
  }, []);

  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-cyan-400 text-sm font-semibold tracking-[0.2em] uppercase">Class Activities</p>
          <h1 className="mt-3 font-display font-bold text-3xl md:text-5xl">See Our Young Tech Creators in Action</h1>
          <p className="mt-4 text-white/60">
            Photos and short video clips from the classroom — real learning, real projects, real creativity.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                category === c
                  ? "bg-cyan-400 text-navy-950"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="mt-16 text-center text-white/40">Loading activities…</p>}
        {error && <p className="mt-16 text-center text-white/40">{error}</p>}
        {!loading && !error && activities.length === 0 && (
          <p className="mt-16 text-center text-white/40">No activities published in this category yet.</p>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>

        {albums.length > 0 && (
          <div className="mt-20">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-cyan-400 text-sm font-semibold tracking-[0.2em] uppercase">More Photos & Videos</p>
              <h2 className="mt-2 font-display font-bold text-2xl md:text-3xl">Gallery Albums</h2>
            </div>
            <div className="mt-10 space-y-14">
              {albums.map((album) => (
                <AlbumSection key={album.id} album={album} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function AlbumSection({ album }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const photos = album.media.filter((m) => m.media_type === "photo");
  const videos = album.media.filter((m) => m.media_type === "video");

  return (
    <div>
      <h3 className="font-display font-semibold text-lg">{album.title}</h3>
      {album.category && <p className="text-xs text-cyan-400 mt-1">{album.category}</p>}

      {videos.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoPlayer key={v.id} video={v} />
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setLightboxIndex(i)}
              className="aspect-square rounded-lg overflow-hidden bg-navy-800 hover:opacity-80 transition-opacity"
            >
              <img src={p.file_url} alt={p.caption || album.title} loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {photos.length === 0 && videos.length === 0 && (
        <p className="mt-3 text-sm text-white/30">No media in this album yet.</p>
      )}

      {lightboxIndex !== null && (
        <Lightbox photos={photos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      )}
    </div>
  );
}
