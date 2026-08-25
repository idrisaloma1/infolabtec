import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/activities", label: "Class Activities" },
  { to: "/admin/projects", label: "Portfolio" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/stats", label: "Homepage Stats" },
];

export function isAdminAuthed() {
  return Boolean(localStorage.getItem("itb_admin_token"));
}

export function AdminGuard({ children }) {
  if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("itb_admin_token");
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-navy-950">
      <aside className="w-56 shrink-0 border-r border-white/10 bg-navy-900/60 pt-8 hidden md:flex md:flex-col">
        <div className="px-5 pb-6">
          <p className="font-display font-bold text-sm">
            INFOLAB <span className="text-cyan-400">ADMIN</span>
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-cyan-400/10 text-cyan-400" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="m-3 rounded-lg px-3 py-2 text-sm text-left text-white/50 hover:bg-white/5 hover:text-white">
          Log Out
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="font-display font-bold text-sm">INFOLAB ADMIN</p>
          <button onClick={logout} className="text-xs text-white/50">Log Out</button>
        </header>
        <nav className="md:hidden flex gap-2 overflow-x-auto px-4 py-2 border-b border-white/10">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1 text-xs ${isActive ? "bg-cyan-400 text-navy-950" : "bg-white/5 text-white/60"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="p-5 md:p-8 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
