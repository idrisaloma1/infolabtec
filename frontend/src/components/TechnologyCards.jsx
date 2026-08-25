import { useReveal } from "../hooks/useReveal.js";

const TECHS = [
  { icon: "🐍", title: "Python Programming", desc: "Programming logic, automation and application development." },
  { icon: "🧩", title: "Scratch Programming", desc: "Creative coding, games, animations and computational thinking." },
  { icon: "🤖", title: "Artificial Intelligence", desc: "Introduction to AI concepts and practical AI-assisted development." },
  { icon: "📱", title: "Mobile App Development", desc: "Building practical mobile applications using modern, AI-assisted tools." },
  { icon: "💻", title: "Web Development", desc: "Introduction to websites, interfaces and web technologies." },
  { icon: "🤖", title: "Robotics", desc: "Hands-on technology, automation and problem solving." },
  { icon: "🧠", title: "Computational Thinking", desc: "Logical thinking, algorithms and structured problem solving." },
  { icon: "💡", title: "Digital Creativity", desc: "Turning ideas into digital products and experiences." },
];

function Card({ tech, delay }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal rounded-2xl border border-white/10 bg-navy-800/60 p-6 hover:border-cyan-400/40 hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-3xl">{tech.icon}</span>
      <h3 className="mt-4 font-display font-semibold text-lg">{tech.title}</h3>
      <p className="mt-2 text-sm text-white/60 leading-relaxed">{tech.desc}</p>
    </div>
  );
}

export default function TechnologyCards() {
  const headingRef = useReveal();
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div ref={headingRef} className="reveal text-center max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl">What We Teach</h2>
          <p className="mt-3 text-white/60">
            Practical, hands-on technology education — built around doing, not just watching.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TECHS.map((t, i) => (
            <Card key={t.title} tech={t} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}
