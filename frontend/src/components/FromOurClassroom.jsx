import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useReveal } from "../hooks/useReveal.js";
import ActivityCard from "./ActivityCard.jsx";

export default function FromOurClassroom() {
  const [activities, setActivities] = useState([]);
  const ref = useReveal();

  useEffect(() => {
    api.get("/activities", { params: { featured: "true", limit: 6 } })
      .then(({ data }) => setActivities(data.activities))
      .catch(() => {});
  }, []);

  if (activities.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto">
          <p className="text-brand-green-600 text-sm font-semibold tracking-[0.2em] uppercase">From Our Classroom</p>
          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl">Real Learning. Real Projects. Real Creativity.</h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/gallery" className="inline-flex rounded-full border border-black/15 px-6 py-3 text-sm font-semibold hover:bg-black/5 transition">
            Explore Class Activities
          </Link>
        </div>
      </div>
    </section>
  );
}
