import { useReveal } from "../hooks/useReveal.js";

const STEPS = [
  { title: "Learn", desc: "Students acquire foundational technology knowledge." },
  { title: "Practice", desc: "Students apply concepts through guided exercises." },
  { title: "Build", desc: "Students create their own applications and digital projects." },
  { title: "Present", desc: "Students demonstrate and explain their projects." },
  { title: "Celebrate", desc: "Students receive recognition for their effort and achievements." },
];

export default function LearningJourney() {
  const ref = useReveal();
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl">Infolab Bootcamp</h2>
          <p className="mt-3 text-brand-ink/60">
            Project-based learning — students built real applications using Python, Scratch,
            Artificial Intelligence, Hercules AI, mobile app development, web technology and robotics.
          </p>
        </div>

        <div className="mt-14 flex flex-col md:flex-row items-stretch justify-between gap-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex-1 flex items-center gap-4 md:flex-col md:text-center">
              <div className="flex flex-col items-center md:contents">
                <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-brand-green-500 to-brand-red-500 flex items-center justify-center font-display font-bold text-white">
                  {i + 1}
                </div>
              </div>
              <div>
                <h3 className="font-display font-semibold text-base md:mt-4">{step.title}</h3>
                <p className="mt-1 text-xs md:text-sm text-brand-ink/50 max-w-[16rem]">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
