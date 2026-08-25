import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Photo Gallery" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/next-event", label: "Next Event" },
  { to: "/contact", label: "Contact Us" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-navy-950/90 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-display font-bold text-lg md:text-xl tracking-tight">
          INFOLAB <span className="text-cyan-400">TECH BRIDGE</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? "text-cyan-400" : "text-white/80 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/next-event"
          className="hidden lg:inline-flex items-center rounded-full bg-gradient-to-r from-electric-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:opacity-90 transition"
        >
          Register For Next Event
        </Link>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block h-0.5 w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-navy-900 border-t border-white/10 px-5 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-white/90 text-base font-medium"
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/next-event"
            onClick={() => setOpen(false)}
            className="block text-center rounded-full bg-gradient-to-r from-electric-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-navy-950"
          >
            Register For Next Event
          </Link>
        </div>
      )}
    </header>
  );
}
