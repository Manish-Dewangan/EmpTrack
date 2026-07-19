import { useState, useCallback, useEffect } from "react";
import {
  ThermometerIcon,
  PalmtreeIcon,
  PlusIcon,
  UmbrellaIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  Loader2Icon,
  RefreshCwIcon,
  FileTextIcon,
} from "lucide-react";
import LeaveHistory from "../components/leave/LeaveHistory";
import ApplyLeaveModel from "../components/leave/ApplyLeaveModel";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Leave = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/leaves");
      setLeaves(res.data.data || []);
      if (res.data.employee?.isDeleted) setIsDeleted(true);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Stats calculations
  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const pendingLeaves = leaves.filter((l) => l.status === "PENDING");
  const rejectedLeaves = leaves.filter((l) => l.status === "REJECTED");
  const sickCount = approvedLeaves.filter((l) => l.type === "SICK").length;
  const casualCount = approvedLeaves.filter((l) => l.type === "CASUAL").length;
  const annualCount = approvedLeaves.filter((l) => l.type === "ANNUAL").length;

  const leaveTypeStats = [
    {
      label: "Sick Leave",
      count: sickCount,
      icon: ThermometerIcon,
      color: "rose",
    },
    {
      label: "Casual Leave",
      count: casualCount,
      icon: UmbrellaIcon,
      color: "amber",
    },
    {
      label: "Annual Leave",
      count: annualCount,
      icon: PalmtreeIcon,
      color: "emerald",
    },
  ];

  const summaryStats = [
    {
      label: "Total Requests",
      value: leaves.length,
      icon: FileTextIcon,
      color: "indigo",
    },
    {
      label: "Approved",
      value: approvedLeaves.length,
      icon: CheckCircle2Icon,
      color: "emerald",
    },
    {
      label: "Pending",
      value: pendingLeaves.length,
      icon: ClockIcon,
      color: "amber",
    },
    {
      label: "Rejected",
      value: rejectedLeaves.length,
      icon: XCircleIcon,
      color: "rose",
    },
  ];

  const colorMap = {
    rose: {
      bar: "bg-rose-500",
      iconBg: "bg-rose-50 group-hover:bg-rose-100",
      iconText: "text-rose-600",
      badge: "bg-rose-50 text-rose-600 border-rose-100",
    },
    amber: {
      bar: "bg-amber-500",
      iconBg: "bg-amber-50 group-hover:bg-amber-100",
      iconText: "text-amber-600",
      badge: "bg-amber-50 text-amber-600 border-amber-100",
    },
    emerald: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
      iconText: "text-emerald-600",
      badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    indigo: {
      bar: "bg-indigo-500",
      iconBg: "bg-indigo-50 group-hover:bg-indigo-100",
      iconText: "text-indigo-600",
      badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  };

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2Icon className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500">Loading leave data...</p>
      </div>
    );
  }

  // ─── Error State ───
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-5">
            <AlertCircleIcon className="w-6 h-6 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Failed to load leaves
          </h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={fetchLeaves}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            <RefreshCwIcon className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Leave Management
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            {isAdmin
              ? "Review and manage team leave applications"
              : "Your leave history and requests"}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Date badge */}
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 shrink-0">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>

          {!isAdmin && !isDeleted && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] w-full sm:w-auto"
            >
              <PlusIcon className="w-4 h-4" />
              Apply for Leave
            </button>
          )}
        </div>
      </div>

      {/* ─── Deleted Warning ─── */}
      {isDeleted && !isAdmin && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <AlertCircleIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Account Deactivated
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Your account has been deactivated. You cannot apply for new
              leaves. Contact your administrator for more details.
            </p>
          </div>
        </div>
      )}

      {/* ─── Summary Stats (Admin) ─── */}
      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {summaryStats.map((s) => {
            const colors = colorMap[s.color];
            return (
              <div
                key={s.label}
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${colors.bar} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {s.label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums">
                      {s.value}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center shrink-0 transition-colors duration-300`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Leave Type Stats (Employee) ─── */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {leaveTypeStats.map((s) => {
            const colors = colorMap[s.color];
            return (
              <div
                key={s.label}
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${colors.bar} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center shrink-0 transition-colors duration-300`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500 truncate">
                      {s.label}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-2xl font-bold text-slate-900 tabular-nums">
                        {s.count}
                      </p>
                      <span className="text-xs font-medium text-slate-400">
                        taken
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Quick Overview (Employee) ─── */}
      {!isAdmin && leaves.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <FileTextIcon className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Request Overview
              </h3>
              <p className="text-xs text-slate-400">
                Your leave request status breakdown
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <CheckCircle2Icon className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">
                  Approved
                </span>
              </div>
              <p className="text-xl font-bold text-emerald-700 tabular-nums">
                {approvedLeaves.length}
              </p>
            </div>

            <div className="text-center p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <ClockIcon className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium text-amber-600">
                  Pending
                </span>
              </div>
              <p className="text-xl font-bold text-amber-700 tabular-nums">
                {pendingLeaves.length}
              </p>
            </div>

            <div className="text-center p-3 rounded-xl bg-rose-50 border border-rose-100">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <XCircleIcon className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-xs font-medium text-rose-600">
                  Rejected
                </span>
              </div>
              <p className="text-xl font-bold text-rose-700 tabular-nums">
                {rejectedLeaves.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Leave History ─── */}
      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />

      {/* ─── Apply Modal ─── */}
      <ApplyLeaveModel
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchLeaves}
      />
    </div>
  );
};

export default Leave;