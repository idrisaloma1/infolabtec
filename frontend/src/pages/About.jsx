export default function About() {
  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <p className="text-brand-green-600 text-sm font-semibold tracking-[0.2em] uppercase text-center">About Us</p>
        <h1 className="mt-3 font-display font-bold text-3xl md:text-5xl text-center">
          They came to learn technology.<br className="hidden md:block" /> They left as young technology creators.
        </h1>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="font-display font-semibold text-xl text-brand-green-600">Who We Are</h2>
            <p className="mt-3 text-brand-ink/70 leading-relaxed text-sm">
              INFOLAB TECH BRIDGE is an educational technology initiative focused on practical
              technology education, coding, artificial intelligence, digital creativity and innovation.
            </p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-xl text-brand-green-600">Our Mission</h2>
            <p className="mt-3 text-brand-ink/70 leading-relaxed text-sm">
              To bridge the gap between technology education and practical application by giving
              young learners opportunities to create, experiment, build and solve real-world problems.
            </p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-xl text-brand-green-600">Our Vision</h2>
            <p className="mt-3 text-brand-ink/70 leading-relaxed text-sm">
              To raise a generation of confident young technology creators, problem solvers and innovators.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
