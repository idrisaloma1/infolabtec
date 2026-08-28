import { useRef, useState } from "react";

export default function VideoPlayer({ video }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="rounded-xl overflow-hidden bg-black relative group">
      <video
        ref={ref}
        src={video.file_url}
        poster={video.thumbnail_url || undefined}
        className="w-full aspect-video object-contain bg-black"
        muted
        playsInline
        controls={playing}
        onClick={toggle}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button
          onClick={toggle}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
        >
          <span className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center text-2xl text-brand-ink">
            ▶
          </span>
        </button>
      )}
      {video.caption && <p className="px-3 py-2 text-xs text-white/60 bg-black">{video.caption}</p>}
    </div>
  );
}
