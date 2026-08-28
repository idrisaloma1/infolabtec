import { useEffect, useCallback } from "react";

export default function Lightbox({ photos, index, onClose, onNavigate }) {
  const photo = photos[index];

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + photos.length) % photos.length);
    },
    [index, photos.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-brand-ink/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl"
      >
        ✕
      </button>

      {photos.length > 1 && (
        <>
          <button
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + photos.length) % photos.length);
            }}
            className="absolute left-3 md:left-6 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl"
          >
            ‹
          </button>
          <button
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % photos.length);
            }}
            className="absolute right-3 md:right-6 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl"
          >
            ›
          </button>
        </>
      )}

      <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.file_url}
          alt={photo.caption || "Activity photo"}
          className="w-full max-h-[80vh] object-contain rounded-lg"
        />
        {photo.caption && <p className="mt-3 text-center text-sm text-white/70">{photo.caption}</p>}
        <p className="mt-1 text-center text-xs text-white/40">
          {index + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}
