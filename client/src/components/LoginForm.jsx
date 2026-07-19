import {
  ArrowLeftIcon,
  EyeOffIcon,
  EyeIcon,
  Loader2Icon,
  ShieldCheckIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LoginLeftSide from "./LoginLeftSide";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginForm = ({ role, title, subtitle }) => {
  const [email, setEmail] = useState(role === "admin" ? "admin@emptrack.com" : "emp1@emptrack.com");
  const [password, setPassword] = useState(role === "admin" ? "admin123" : "emp123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password, role);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed";

      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen flex flex-col md:flex-row overflow-hidden bg-white">
      <LoginLeftSide />

      {/* Right Side */}
      <div className="w-full md:w-1/2 h-full min-h-0 relative overflow-y-auto bg-white">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-50/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 min-h-full flex items-center justify-center px-6 py-8 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="flex items-center gap-2.5 mb-6 md:hidden">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-sm bg-white" />
              </div>
              <span className="text-indigo-900 font-semibold text-lg tracking-wide">
                EmpTrack
              </span>
            </div>

            {/* Back link */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-8 transition-colors"
            >
              <ArrowLeftIcon size={16} />
              Back to portals
            </Link>

            {/* Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium mb-4">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  Secure Access
                </div>

                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                  {title}
                </h1>
                <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOffIcon size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading && (
                    <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                  )}
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              {/* Footer text */}
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-400">
                  Protected by secure authentication and encrypted access.
                </p>
              </div>
            </div>

            {/* Bottom small footer */}
            <div className="mt-6 text-center md:text-left">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} EmpTrack. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;