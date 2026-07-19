import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Moon,
  Palette,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sun,
  UserCircle2,
} from "lucide-react";
import Loading from "../components/Loading";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordModel from "../components/ChangePasswordModel";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/profile");

      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to load profile";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id || user) {
      fetchProfile();
    }
  }, [user?.id, fetchProfile]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center">
            <Settings2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Settings
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              Manage your account, security, and preferences
            </p>
          </div>
        </div>

        {/* Role Badge */}
        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {user?.role === "ADMIN" ? "Administrator" : "Employee Account"}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />

          <div className="flex-1">
            <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
              Unable to load your profile
            </p>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProfile}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Profile Section */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <UserCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">
              Profile Information
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Update your personal and contact details
            </p>
          </div>
        </div>

        {profile ? (
          <ProfileForm initialData={profile} onSuccess={fetchProfile} />
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
            <UserCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Profile information is currently unavailable.
            </p>

            <button
              type="button"
              onClick={fetchProfile}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Load Profile
            </button>
          </div>
        )}
      </section>

      {/* Preferences and Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Password Card */}
        <section className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                <LockKeyhole className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Password & Security
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Keep your account secure by regularly updating your password.
                </p>
              </div>
            </div>

            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              Account protected
            </div>

            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </section>

        {/* Theme Card */}
        <section className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  theme === "light"
                    ? "bg-amber-50 dark:bg-amber-500/10"
                    : "bg-indigo-50 dark:bg-indigo-500/10"
                }`}
              >
                {theme === "light" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-400" />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Appearance
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Choose the appearance that works best for you.
                </p>
              </div>
            </div>

            <Palette className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {theme === "light" ? "Light Mode" : "Dark Mode"}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Currently active
              </p>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
              aria-pressed={theme === "dark"}
              className="relative inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  Light Mode
                </>
              )}
            </button>
          </div>
        </section>
      </div>

      {/* Security Notice */}
      <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />

        <div>
          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
            Your information is secure
          </p>
          <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-1 leading-relaxed">
            Your profile information and account settings are protected using
            secure authentication.
          </p>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModel
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Settings;