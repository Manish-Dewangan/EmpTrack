import { Link, Navigate } from "react-router-dom";
import LoginLeftSide from "../components/LoginLeftSide";
import {
  ArrowRightIcon,
  ShieldIcon,
  UserIcon,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const LoginLanding = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (user) return <Navigate to="/" />;

  const portalOptions = [
    {
      to: "/login/admin",
      title: "Admin Portal",
      description:
        "Manage employees, attendance, payroll, and organizational settings.",
      icon: ShieldIcon,
      gradient: "from-indigo-500 to-violet-500",
      bgHover: "hover:border-indigo-300 hover:shadow-indigo-100",
      iconBg: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",
      badge: "Full Access",
    },
    {
      to: "/login/employee",
      title: "Employee Portal",
      description:
        "Access personal information, attendance records, and payroll details.",
      icon: UserIcon,
      gradient: "from-emerald-500 to-teal-500",
      bgHover: "hover:border-emerald-300 hover:shadow-emerald-100",
      iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
      badge: "Self Service",
    },
  ];

  return (
    <div className="h-screen max-h-screen flex flex-col md:flex-row overflow-hidden bg-white">
      <LoginLeftSide />

      {/* Right side */}
      <div className="w-full md:w-1/2 h-full max-h-screen min-h-0 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-50/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Content wrapper */}
        <div className="relative z-10 min-h-full flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-16">
          {/* Top spacer on desktop */}
          <div className="shrink-0" />

          {/* Main content */}
          <div className="w-full max-w-md mx-auto shrink-0">
            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 mb-6 md:hidden">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-sm bg-white" />
              </div>
              <span className="text-indigo-900 font-semibold text-lg tracking-wide">
                EmpTrack
              </span>
            </div>

            {/* Header */}
            <div className="mb-8 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                Secure Login
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm lg:text-base leading-relaxed">
                Select your portal to securely access the system.
              </p>
            </div>

            {/* Portal cards */}
            <div className="space-y-3">
              {portalOptions.map((portal, index) => (
                <Link
                  key={portal.to}
                  to={portal.to}
                  className={`group block bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-lg ${portal.bgHover}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${portal.iconBg} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}
                    >
                      <portal.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-medium text-slate-800 group-hover:text-slate-900 transition-colors">
                          {portal.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline-flex text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-slate-200 transition-colors">
                            {portal.badge}
                          </span>
                          <ArrowRightIcon className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed group-hover:text-slate-500 transition-colors">
                        {portal.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover gradient line */}
                  <div
                    className={`h-0.5 bg-gradient-to-r ${portal.gradient} rounded-full mt-4 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  />
                </Link>
              ))}
            </div>

            {/* Help text */}
            <div className="mt-6 text-center md:text-left">
              <p className="text-sm text-slate-400">
                Having trouble logging in?{" "}
                <a
                  href="#"
                  className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full max-w-md mx-auto shrink-0 mt-8">
            {/* Divider */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] text-slate-400 font-medium tracking-wider">
                EMPTRACK
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="text-center md:text-left">
              <p className="text-slate-400 text-xs">
                © {new Date().getFullYear()} EmpTrack. All rights reserved.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-1.5">
                <a
                  href="#"
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Privacy Policy
                </a>
                <span className="text-slate-300">·</span>
                <a
                  href="#"
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLanding;