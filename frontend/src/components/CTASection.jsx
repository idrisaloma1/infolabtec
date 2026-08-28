import { Link } from "react-router-dom";
import { useReveal } from "../hooks/useReveal.js";

export default function CTASection() {
  const ref = useReveal();
  return (
    <section className="py-20 md:py-28">
      <div
        ref={ref}
        className="reveal mx-auto max-w-5xl px-5 lg:px-8 rounded-3xl bg-gradient-to-br from-brand-green-500/15 to-brand-red-500/15 border border-black/10 py-16 text-center"
      >
        <h2 className="font-display font-bold text-3xl md:text-4xl">From Learning to Building.</h2>
        <p className="mt-4 text-brand-ink/70 max-w-xl mx-auto">
          Empowering the next generation of technology creators — see what's next for INFOLAB TECH BRIDGE.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/next-event" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-brand-green-500 to-brand-red-500 px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition">
            Register For Next Event
          </Link>
          <Link to="/contact" className="w-full sm:w-auto rounded-full border border-black/15 px-8 py-3.5 text-sm font-semibold hover:bg-black/5 transition">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
