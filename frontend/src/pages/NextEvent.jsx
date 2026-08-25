import { useEffect, useState } from "react";
import { api } from "../api.js";
import Countdown from "../components/Countdown.jsx";

export default function NextEvent() {
  const [event, setEvent] = useState(undefined); // undefined = loading, null = none found
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/events/next")
      .then(({ data }) => setEvent(data.event))
      .catch(() => setError("Couldn't load the next event right now."));
  }, []);

  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8 text-center">
        <p className="text-cyan-400 text-sm font-semibold tracking-[0.2em] uppercase">Next INFOLAB TECH BRIDGE Event</p>

        {event === undefined && !error && <p className="mt-10 text-white/40">Loading…</p>}
        {error && <p className="mt-10 text-white/40">{error}</p>}

        {event === null && !error && (
          <>
            <h1 className="mt-3 font-display font-bold text-3xl md:text-4xl">No Event Scheduled Yet</h1>
            <p className="mt-4 text-white/60">Check back soon, or follow our channels for the next announcement.</p>
          </>
        )}

        {event && (
          <>
            <h1 className="mt-3 font-display font-bold text-3xl md:text-5xl">{event.title}</h1>

            {event.banner && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-white/10">
                <img src={event.banner} alt={event.title} className="w-full aspect-video object-cover" />
              </div>
            )}

            <div className="mt-10">
              <Countdown targetDate={event.time ? `${event.date}T${event.time}` : event.date} />
            </div>

            {event.description && <p className="mt-8 text-white/70 leading-relaxed max-w-2xl mx-auto">{event.description}</p>}

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
              <Detail label="Date" value={new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
              {event.time && <Detail label="Time" value={event.time} />}
              {event.venue && <Detail label="Venue" value={event.venue} />}
              {event.age_range && <Detail label="Age Range" value={event.age_range} />}
              {event.registration_deadline && (
                <Detail label="Registration Deadline" value={new Date(event.registration_deadline).toLocaleDateString("en-US", { month: "long", day: "numeric" })} />
              )}
              {event.registration_fee && <Detail label="Registration Fee" value={event.registration_fee} />}
              {event.available_seats != null && <Detail label="Available Seats" value={event.available_seats} />}
            </div>

            {event.registration_url && (
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center rounded-full bg-gradient-to-r from-electric-500 to-cyan-400 px-10 py-4 text-base font-semibold text-navy-950 hover:opacity-90 transition"
              >
                Register Now
              </a>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-navy-800/50 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
