import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useReveal } from "../hooks/useReveal.js";

function Counter({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useReveal();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(Math.floor(progress * value));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-display font-bold text-cyan-400">
      {display}+
    </span>
  );
}

// Fallback figures shown until /api/stats is reachable, so the section
// never renders empty during local development or a cold backend.
const FALLBACK = [
  { key: "students_trained", label: "Students Trained", value: 0 },
  { key: "projects_built", label: "Projects Built", value: 0 },
  { key: "technologies_taught", label: "Technologies Taught", value: 0 },
  { key: "bootcamps_completed", label: "Bootcamps Completed", value: 0 },
];

export default function StatsSection() {
  const [stats, setStats] = useState(FALLBACK);

  useEffect(() => {
    api
      .get("/stats")
      .then(({ data }) => {
        if (data.stats?.length) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="border-y border-white/10 bg-navy-900/60">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.key}>
            <Counter value={s.value} />
            <p className="mt-2 text-xs md:text-sm uppercase tracking-wider text-white/60">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
