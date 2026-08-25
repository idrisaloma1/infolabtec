import { useEffect, useRef } from "react";

// Adds "in-view" once an element enters the viewport, triggering the
// .reveal CSS animation defined in index.css. Respects prefers-reduced-motion
// implicitly since the CSS keyframe duration collapses in that case.
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
