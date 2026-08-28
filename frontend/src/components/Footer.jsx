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
    <footer className="bg-brand-mist border-t border-black/10 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 grid gap-10 md:grid-cols-4">
        <div>
          <img src="/infolab-logo.jpg" alt="INFOLAB Technology Services" className="h-10 w-auto rounded" />
          <p className="mt-3 text-sm font-display font-semibold">
            TECH <span className="text-brand-red-500">BRIDGE</span>
          </p>
          <p className="mt-2 text-sm text-brand-ink/60">From Learning to Building.</p>
          <div className="mt-5 flex gap-4 text-brand-ink/60">
            <a href="#" aria-label="Facebook" className="hover:text-brand-green-600">FB</a>
            <a href="#" aria-label="Instagram" className="hover:text-brand-green-600">IG</a>
            <a href="#" aria-label="X" className="hover:text-brand-green-600">X</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-brand-green-600">IN</a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-brand-ink/90 tracking-wide">Quick Links</h4>
          <ul className="mt-4 space-y-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-brand-ink/60 hover:text-brand-green-600">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-brand-ink/90 tracking-wide">Programs</h4>
          <ul className="mt-4 space-y-2">
            {PROGRAMS.map((p) => (
              <li key={p} className="text-sm text-brand-ink/60">{p}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-brand-ink/90 tracking-wide">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-brand-ink/60">
            <li>Infolab Technology Services Limited</li>
            <li>Lagos, Nigeria</li>
            <li><a href="mailto:hello@infolabtechbridge.com" className="hover:text-brand-green-600">hello@infolabtechbridge.com</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-black/10 pt-6 text-center text-xs text-brand-ink/40">
        © 2026 INFOLAB TECH BRIDGE. All Rights Reserved.
      </div>
    </footer>
  );
}
