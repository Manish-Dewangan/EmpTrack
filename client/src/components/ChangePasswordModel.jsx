import {
  LockIcon,
  X,
  Loader2,
  EyeIcon,
  EyeOffIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  KeyRoundIcon,
} from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

const ChangePasswordModel = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password strength checker
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { label: "Weak", color: "bg-rose-500", width: "w-1/4", text: "text-rose-600" };
    if (score === 2) return { label: "Fair", color: "bg-amber-500", width: "w-2/4", text: "text-amber-600" };
    if (score === 3) return { label: "Good", color: "bg-indigo-500", width: "w-3/4", text: "text-indigo-600" };
    return { label: "Strong", color: "bg-emerald-500", width: "w-full", text: "text-emerald-600" };
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword && newPassword !== confirmPassword;

  const handleClose = () => {
    if (loading) return;
    setMessage({ type: "", text: "" });
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword");
    const newPwd = formData.get("newPassword");
    const confirmPwd = formData.get("confirmPassword");

    // Validations
    if (currentPassword === newPwd) {
      setMessage({
        type: "error",
        text: "New password must be different from your current password.",
      });
      return;
    }

    if (newPwd !== confirmPwd) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPwd.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/change-password", {
        currentPassword,
        newPassword: newPwd,
      });

      if (!data.success) throw new Error(data.error || "Failed");

      setMessage({
        type: "success",
        text: "Password changed successfully! You're all set.",
      });

      e.target.reset();
      setNewPassword("");
      setConfirmPassword("");

      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <KeyRoundIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Change Password
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Update your account password securely
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            aria-label="Close modal"
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Form ─── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Message */}
          {message.text && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${
                message.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                  : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2Icon className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircleIcon className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Current Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                required
                placeholder="Enter your current password"
                className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-700"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              New Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-700"
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword && passwordStrength && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Password strength
                  </span>
                  <span className={`text-xs font-semibold ${passwordStrength.text}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${passwordStrength.color} ${passwordStrength.width}`}
                  />
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                  {[
                    { label: "8+ characters", met: newPassword.length >= 8 },
                    { label: "Uppercase letter", met: /[A-Z]/.test(newPassword) },
                    { label: "Number", met: /[0-9]/.test(newPassword) },
                    { label: "Special character", met: /[^A-Za-z0-9]/.test(newPassword) },
                  ].map((rule) => (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-[11px] ${
                        rule.met
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      <CheckCircle2Icon className="w-3 h-3 shrink-0" />
                      {rule.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Confirm New Password
            </label>
            <div className="relative">
              <ShieldCheckIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className={`w-full h-11 pl-10 pr-11 rounded-xl border text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:ring-4 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 text-slate-800 dark:text-slate-200 ${
                  passwordsMismatch
                    ? "border-rose-300 dark:border-rose-500 focus:border-rose-400 focus:ring-rose-100 dark:focus:ring-rose-500/20"
                    : passwordsMatch
                      ? "border-emerald-300 dark:border-emerald-500 focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-600 focus:border-indigo-400 focus:ring-indigo-100 dark:focus:ring-indigo-500/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Match indicator */}
            {confirmPassword && (
              <p
                className={`flex items-center gap-1.5 text-xs mt-1 ${
                  passwordsMatch
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {passwordsMatch ? (
                  <CheckCircle2Icon className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircleIcon className="w-3.5 h-3.5" />
                )}
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 h-11 inline-flex items-center justify-center px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || passwordsMismatch}
              className="flex-1 h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <LockIcon className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModel;