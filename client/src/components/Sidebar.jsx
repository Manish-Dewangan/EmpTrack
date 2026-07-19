import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  CalendarIcon,
  ChevronRightIcon,
  DollarSignIcon,
  FileTextIcon,
  LayoutGridIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
  UserIcon,
  XIcon,
  Loader2Icon,
  SparklesIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, loading, logout } = useAuth();

  useEffect(() => {
    api
      .get("/profile")
      .then(({ data }) => {
        if (data.firstName) {
          setUserName(`${data.firstName} ${data.lastName || ""}`.trim());
        }
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const role = user?.role;

  const mainNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
    role === "ADMIN"
      ? { name: "Employees", href: "/employees", icon: UserIcon }
      : { name: "Attendance", href: "/attendance", icon: CalendarIcon },
    { name: "Leave", href: "/leave", icon: FileTextIcon },
    { name: "Payslips", href: "/payslips", icon: DollarSignIcon },
  ];

  const secondaryNav = [
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      toast.success("Logged out successfully");
      window.location.href = "/login";
    }, 500);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  // Reusable NavLink
  const NavLink = ({ item }) => {
    const isActive = pathname.startsWith(item.href);

    return (
      <Link
        to={item.href}
        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
          isActive
            ? "bg-indigo-500/[0.12] text-indigo-300"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
        }`}
      >
        {/* Active bar */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500 transition-all duration-300 ${
            isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          }`}
        />

        <item.icon
          className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200 ${
            isActive
              ? "text-indigo-400"
              : "text-slate-500 group-hover:text-slate-300"
          }`}
        />

        <span className="flex-1 truncate">{item.name}</span>

        <ChevronRightIcon
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            isActive
              ? "text-indigo-500/60 opacity-100 translate-x-0"
              : "opacity-0 -translate-x-1 text-slate-600"
          }`}
        />
      </Link>
    );
  };

  // Skeleton for profile
  const ProfileSkeleton = () => (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-3 w-24 bg-slate-800 rounded-md animate-pulse" />
          <div className="h-2.5 w-16 bg-slate-800/70 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );

  // Skeleton for nav
  const NavSkeleton = () => (
    <div className="space-y-1 px-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-[18px] h-[18px] rounded bg-slate-800 animate-pulse" />
          <div
            className="h-3 bg-slate-800 rounded-md animate-pulse"
            style={{ width: `${50 + Math.random() * 40}%` }}
          />
        </div>
      ))}
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ─── Brand Header ─── */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-white tracking-wide">
                EmpTrack
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                 EMS System
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label="Close menu"
          >
            <XIcon size={18} />
          </button>
        </div>
      </div>

      {/* ─── Profile Card ─── */}
      <div className="mx-3 mt-4 mb-2 shrink-0">
        {profileLoading ? (
          <ProfileSkeleton />
        ) : userName ? (
          <div className="group p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.08] transition-all duration-300 cursor-default">
            <div className="flex items-center gap-3">
              {/* Gradient Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                  <span className="text-white text-xs font-bold">
                    {getInitials(userName)}
                  </span>
                </div>
                {/* Online dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-slate-200 truncate">
                  {userName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      role === "ADMIN" ? "bg-amber-400" : "bg-indigo-400"
                    }`}
                  />
                  <p className="text-[11px] text-slate-500 truncate">
                    {role === "ADMIN" ? "Administrator" : "Employee"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* ─── Main Navigation ─── */}
      <div className="px-5 pt-4 pb-2 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
          Main Menu
        </p>
      </div>

      <nav className="px-3 space-y-0.5 shrink-0">
        {loading ? (
          <NavSkeleton />
        ) : (
          mainNav.map((item) => <NavLink key={item.name} item={item} />)
        )}
      </nav>

      {/* ─── Secondary Navigation ─── */}
      <div className="px-5 pt-6 pb-2 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
          Preferences
        </p>
      </div>

      <nav className="px-3 space-y-0.5 shrink-0">
        {loading ? (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-[18px] h-[18px] rounded bg-slate-800 animate-pulse" />
            <div className="h-3 w-20 bg-slate-800 rounded-md animate-pulse" />
          </div>
        ) : (
          secondaryNav.map((item) => <NavLink key={item.name} item={item} />)
        )}
      </nav>

      {/* ─── Spacer ─── */}
      <div className="flex-1 min-h-0" />

      {/* ─── Upgrade / Info Card ─── */}
      <div className="mx-3 mb-3 shrink-0">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/[0.08] to-violet-500/[0.08] border border-indigo-500/[0.12]">
          <div className="flex items-center gap-2 mb-2">
            <SparklesIcon className="w-4 h-4 text-indigo-400" />
            <p className="text-xs font-semibold text-indigo-300">
              Need Help?
            </p>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Check our documentation or contact support for assistance.
          </p>
          <button className="w-full py-2 px-3 rounded-lg bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold hover:bg-indigo-500/30 transition-colors duration-200 border border-indigo-500/20">
            View Documentation
          </button>
        </div>
      </div>

      {/* ─── Logout ─── */}
      <div className="p-3 border-t border-white/[0.06] shrink-0">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loggingOut ? (
            <Loader2Icon className="w-[17px] h-[17px] animate-spin" />
          ) : (
            <LogOutIcon className="w-[17px] h-[17px]" />
          )}
          <span>{loggingOut ? "Logging out..." : "Log out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Mobile Hamburger ─── */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900/95 backdrop-blur-sm text-white rounded-xl shadow-lg border border-white/10 hover:bg-slate-800 transition-all duration-300 ${
          mobileOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
        }`}
        aria-label="Open menu"
      >
        <MenuIcon size={20} />
      </button>

      {/* ─── Mobile Overlay ─── */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex h-full w-[260px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/[0.06]">
        {sidebarContent}
      </aside>

      {/* ─── Mobile Sidebar ─── */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-[280px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 transform transition-all duration-300 ease-out shadow-2xl shadow-black/50 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;