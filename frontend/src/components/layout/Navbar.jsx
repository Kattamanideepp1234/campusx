import { Link, NavLink } from "react-router-dom";
import { Building2, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Assets", to: "/assets" },
  { label: "Dashboard", to: "/dashboard" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 py-4 md:px-8">
      <div className="glass-card mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3">
        <Link to="/" className="flex items-center gap-3 font-display text-xl font-semibold text-white">
          <div className="rounded-2xl bg-white/10 p-2 text-neon">
            <Building2 size={20} />
          </div>
          CampusX
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">{user.role}</span>
              <Link to="/dashboard" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20">
                <LayoutDashboard className="mr-2 inline" size={16} />
                Dashboard
              </Link>
              <button onClick={logout} className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-neon/60 hover:text-white">
                <LogOut className="mr-2 inline" size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-200 transition hover:text-white">Login</Link>
              <Link to="/signup" className="rounded-full bg-gradient-to-r from-skywave to-pulse px-5 py-2 text-sm font-semibold text-white">Get Started</Link>
            </>
          )}
        </div>

        <button className="text-white md:hidden" onClick={() => setOpen((current) => !current)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="glass-card mx-auto mt-3 max-w-7xl rounded-3xl p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="rounded-2xl px-4 py-3 text-slate-200 hover:bg-white/5" onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <button onClick={logout} className="rounded-2xl border border-white/15 px-4 py-3 text-left text-slate-200">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="rounded-2xl px-4 py-3 text-slate-200" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/signup" className="rounded-2xl bg-gradient-to-r from-skywave to-pulse px-4 py-3 text-white" onClick={() => setOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
