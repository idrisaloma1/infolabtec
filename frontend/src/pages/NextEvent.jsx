import { useEffect, useState } from "react";
import { api } from "../api.js";
import Countdown from "../components/Countdown.jsx";

// The backend may return `date` as a bare "YYYY-MM-DD" or as a full ISO
// timestamp (e.g. "2026-08-29T00:00:00.000Z") depending on the DB driver's
// serialization — slice(0, 10) normalizes either case before combining
// with the separate "HH:MM" time field, avoiding an invalid concatenated
// string like "...T00:00:00.000ZT10:00" (which parses to Invalid Date/NaN).
function buildEventDateTime(date, time) {
  const datePart = String(date).slice(0, 10);
  return time ? `${datePart}T${time}` : datePart;
}

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
        <p className="text-brand-green-600 text-sm font-semibold tracking-[0.2em] uppercase">Next INFOLAB TECH BRIDGE Event</p>

        {event === undefined && !error && <p className="mt-10 text-brand-ink/40">Loading…</p>}
        {error && <p className="mt-10 text-brand-ink/40">{error}</p>}

        {event === null && !error && (
          <>
            <h1 className="mt-3 font-display font-bold text-3xl md:text-4xl">No Event Scheduled Yet</h1>
            <p className="mt-4 text-brand-ink/60">Check back soon, or follow our channels for the next announcement.</p>
          </>
        )}

        {event && (
          <>
            <h1 className="mt-3 font-display font-bold text-3xl md:text-5xl">{event.title}</h1>

            {event.banner && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-black/10">
                <img src={event.banner} alt={event.title} className="w-full aspect-video object-cover" />
              </div>
            )}

            <div className="mt-10">
              <Countdown targetDate={buildEventDateTime(event.date, event.time)} />
            </div>

            {event.description && <p className="mt-8 text-brand-ink/70 leading-relaxed max-w-2xl mx-auto">{event.description}</p>}

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
                className="mt-10 inline-flex items-center rounded-full bg-gradient-to-r from-brand-green-500 to-brand-red-500 px-10 py-4 text-base font-semibold text-white hover:opacity-90 transition"
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
    <div className="rounded-xl border border-black/10 bg-white/60 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wider text-brand-ink/40">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
