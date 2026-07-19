import {
  CalendarDays,
  FileText,
  Loader2,
  Send,
  X,
  ThermometerIcon,
  UmbrellaIcon,
  PalmtreeIcon,
  AlertCircleIcon,
  InfoIcon,
} from "lucide-react";
import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const LEAVE_TYPES = [
  {
    value: "SICK",
    label: "Sick Leave",
    description: "Medical illness or health-related absence",
    icon: ThermometerIcon,
    color: "rose",
  },
  {
    value: "CASUAL",
    label: "Casual Leave",
    description: "Personal or casual short-term leave",
    icon: UmbrellaIcon,
    color: "amber",
  },
  {
    value: "ANNUAL",
    label: "Annual Leave",
    description: "Planned yearly vacation or time off",
    icon: PalmtreeIcon,
    color: "emerald",
  },
];

const colorMap = {
  rose: {
    selected:
      "border-rose-400 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500",
    icon: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
    label: "text-rose-700 dark:text-rose-300",
  },
  amber: {
    selected:
      "border-amber-400 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500",
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    label: "text-amber-700 dark:text-amber-300",
  },
  emerald: {
    selected:
      "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500",
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    label: "text-emerald-700 dark:text-emerald-300",
  },
};

const ApplyLeaveModel = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("SICK");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Calculate number of days selected
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const totalDays = calculateDays();

  const handleStartDateChange = (val) => {
    setStartDate(val);
    setDateError("");
    if (endDate && val > endDate) {
      setDateError("Start date cannot be after end date.");
    }
  };

  const handleEndDateChange = (val) => {
    setEndDate(val);
    setDateError("");
    if (startDate && val < startDate) {
      setDateError("End date cannot be before start date.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dateError) return;
    if (endDate < startDate) {
      setDateError("End date cannot be before start date.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.post("/leaves", data);
      toast.success("Leave applied successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setSelectedType("SICK");
    setStartDate("");
    setEndDate("");
    setDateError("");
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Apply for Leave
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Submit your leave request for approval
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Leave Type Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
              <FileText className="w-4 h-4 text-slate-400" />
              Leave Type
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {LEAVE_TYPES.map((type) => {
                const isSelected = selectedType === type.value;
                const colors = colorMap[type.color];

                return (
                  <label
                    key={type.value}
                    className={`relative flex flex-col gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? colors.selected
                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={isSelected}
                      onChange={() => setSelectedType(type.value)}
                      className="sr-only"
                    />

                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? colors.icon
                          : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <type.icon className="w-4 h-4" />
                    </div>

                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isSelected
                            ? colors.label
                            : "text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {type.label}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                        {type.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              Duration
              {totalDays > 0 && (
                <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                  {totalDays} {totalDays === 1 ? "day" : "days"}
                </span>
              )}
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                  From
                </span>
                <input
                  type="date"
                  name="startDate"
                  required
                  min={minDate}
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className={`w-full h-11 px-4 rounded-xl border text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 outline-none transition focus:ring-4 ${
                    dateError
                      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-600 focus:border-indigo-400 focus:ring-indigo-100 dark:focus:ring-indigo-500/20"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                  To
                </span>
                <input
                  type="date"
                  name="endDate"
                  required
                  min={startDate || minDate}
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className={`w-full h-11 px-4 rounded-xl border text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 outline-none transition focus:ring-4 ${
                    dateError
                      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-600 focus:border-indigo-400 focus:ring-indigo-100 dark:focus:ring-indigo-500/20"
                  }`}
                />
              </div>
            </div>

            {/* Date error */}
            {dateError && (
              <div className="mt-2.5 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertCircleIcon className="w-4 h-4 shrink-0" />
                <p className="text-xs">{dateError}</p>
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Reason
            </label>
            <textarea
              name="reason"
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 resize-none"
              placeholder="Briefly describe the reason for your leave..."
            />
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            <InfoIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Leaves are subject to manager approval. You will be notified once
              your request is reviewed.
            </p>
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
              disabled={loading || !!dateError}
              className="flex-1 h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModel;