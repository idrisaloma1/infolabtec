import { Link } from "react-router-dom";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Photo Gallery" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/next-event", label: "Next Event" },
  { to: "/contact", label: "Contact Us" },
];

const PROGRAMS = ["Python", "Scratch", "Artificial Intelligence", "Mobile Apps", "Web Development", "Robotics"];

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-white/10 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 grid gap-10 md:grid-cols-4">
        <div>
          <p className="font-display font-bold text-xl">
            INFOLAB <span className="text-cyan-400">TECH BRIDGE</span>
          </p>
          <p className="mt-2 text-sm text-white/60">From Learning to Building.</p>
          <div className="mt-5 flex gap-4 text-white/60">
            <a href="#" aria-label="Facebook" className="hover:text-cyan-400">FB</a>
            <a href="#" aria-label="Instagram" className="hover:text-cyan-400">IG</a>
            <a href="#" aria-label="X" className="hover:text-cyan-400">X</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-cyan-400">IN</a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/90 tracking-wide">Quick Links</h4>
          <ul className="mt-4 space-y-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-white/60 hover:text-cyan-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/90 tracking-wide">Programs</h4>
          <ul className="mt-4 space-y-2">
            {PROGRAMS.map((p) => (
              <li key={p} className="text-sm text-white/60">{p}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/90 tracking-wide">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>Infolab Technology Services Limited</li>
            <li>Lagos, Nigeria</li>
            <li><a href="mailto:hello@infolabtechbridge.com" className="hover:text-cyan-400">hello@infolabtechbridge.com</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40">
        © 2026 INFOLAB TECH BRIDGE. All Rights Reserved.
      </div>
    </footer>
  );
}
