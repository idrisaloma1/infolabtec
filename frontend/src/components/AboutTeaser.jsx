import { useReveal } from "../hooks/useReveal.js";

export default function AboutTeaser() {
  const ref = useReveal();
  return (
    <section className="py-20 md:py-28 bg-navy-900/40">
      <div ref={ref} className="reveal mx-auto max-w-4xl px-5 lg:px-8 text-center">
        <p className="text-cyan-400 text-sm font-semibold tracking-[0.2em] uppercase">Who We Are</p>
        <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl">
          They came to learn technology.<br className="hidden md:block" /> They left as young technology creators.
        </h2>
        <p className="mt-6 text-white/60 leading-relaxed">
          INFOLAB TECH BRIDGE is an educational technology initiative focused on practical
          technology education, coding, artificial intelligence, digital creativity and
          innovation — bridging the gap between learning and real-world application.
        </p>
      </div>
    </section>
  );
}
