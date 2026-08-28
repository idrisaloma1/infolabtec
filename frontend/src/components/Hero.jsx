import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-hero-gradient pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 relative z-10 text-center">
        <p className="reveal in-view text-brand-green-600 text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
          From Learning to Building
        </p>
        <h1 className="reveal in-view mt-4 font-display font-bold text-4xl sm:text-5xl md:text-7xl leading-[1.05]">
          INFOLAB <span className="bg-gradient-to-r from-brand-green-600 to-brand-red-500 bg-clip-text text-transparent">TECH BRIDGE</span>
        </h1>
        <p className="reveal in-view mt-6 max-w-2xl mx-auto text-brand-ink/70 text-base md:text-lg" style={{ animationDelay: "0.15s" }}>
          Empowering young minds to learn technology, solve problems, create digital products
          and transform ideas into real-world applications.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/portfolio"
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-brand-green-500 to-brand-red-500 px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Explore Our Projects
          </Link>
          <Link
            to="/next-event"
            className="w-full sm:w-auto rounded-full border border-black/15 px-8 py-3.5 text-sm font-semibold text-brand-ink hover:bg-black/5 transition"
          >
            Join Our Next Event
          </Link>
        </div>
      </div>

      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-green-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-red-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-ict-pattern opacity-60" />
    </section>
  );
}
