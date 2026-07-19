import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import {
  Check,
  Loader2,
  X,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  InboxIcon,
  ThermometerIcon,
  UmbrellaIcon,
  PalmtreeIcon,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

// ─── Helpers ───────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2Icon,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircleIcon,
    className:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  PENDING: {
    label: "Pending",
    icon: ClockIcon,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
};

const TYPE_CONFIG = {
  SICK: {
    label: "Sick Leave",
    icon: ThermometerIcon,
    className:
      "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  CASUAL: {
    label: "Casual Leave",
    icon: UmbrellaIcon,
    className:
      "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  ANNUAL: {
    label: "Annual Leave",
    icon: PalmtreeIcon,
    className:
      "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
};

// ─── Status Badge ───────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

// ─── Type Badge ─────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const config = TYPE_CONFIG[type] || {
    label: type,
    icon: FileTextIcon,
    className:
      "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────
const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
  const [processing, setProcessing] = useState(null);
  const [actionType, setActionType] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    setProcessing(id);
    setActionType(status);
    try {
      await api.patch(`/leaves/${id}`, { status });
      toast.success(
        `Leave ${status === "APPROVED" ? "approved" : "rejected"} successfully`
      );
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setProcessing(null);
      setActionType(null);
    }
  };

  const getDuration = (startDate, endDate) => {
    const days = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
    return `${days} ${days === 1 ? "day" : "days"}`;
  };

  // ─── Empty State ───
  if (leaves.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
            <InboxIcon className="w-7 h-7 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
            No leave applications found
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
            {isAdmin
              ? "No employees have submitted leave applications yet."
              : "You haven't submitted any leave applications yet."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      {/* ─── Table Header ─── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <FileTextIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
              Leave Applications
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {leaves.length} {leaves.length === 1 ? "record" : "records"} found
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3">
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  key === "APPROVED"
                    ? "bg-emerald-500"
                    : key === "REJECTED"
                      ? "bg-rose-500"
                      : "bg-amber-500"
                }`}
              />
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {val.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Desktop Table ─── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
              {isAdmin && (
                <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5" />
                    Employee
                  </div>
                </th>
              )}
              <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <FileTextIcon className="w-3.5 h-3.5" />
                  Type
                </div>
              </th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Duration
                </div>
              </th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Reason
              </th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              {isAdmin && (
                <th className="text-center py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {leaves.map((leave) => {
              const leaveId = leave._id || leave.id;
              const isProcessing = processing === leaveId;

              return (
                <tr
                  key={leaveId}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                >
                  {/* Employee */}
                  {isAdmin && (
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {leave.employee?.firstName?.[0]}
                          {leave.employee?.lastName?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {leave.employee?.firstName}{" "}
                            {leave.employee?.lastName}
                          </p>
                          {leave.employee?.department && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                              {leave.employee.department}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Type */}
                  <td className="py-4 px-5">
                    <TypeBadge type={leave.type} />
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-5">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {format(new Date(leave.startDate), "MMM dd")} —{" "}
                        {format(new Date(leave.endDate), "MMM dd, yyyy")}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {getDuration(leave.startDate, leave.endDate)}
                      </p>
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="py-4 px-5 max-w-[200px]">
                    <p
                      className="text-sm text-slate-500 dark:text-slate-400 truncate"
                      title={leave.reason}
                    >
                      {leave.reason || "—"}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5">
                    <StatusBadge status={leave.status} />
                  </td>

                  {/* Actions */}
                  {isAdmin && (
                    <td className="py-4 px-5">
                      {leave.status === "PENDING" ? (
                        <div className="flex gap-2 justify-center">
                          {/* Approve */}
                          <button
                            disabled={!!processing}
                            onClick={() =>
                              handleStatusUpdate(leaveId, "APPROVED")
                            }
                            title="Approve"
                            className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 transition-all duration-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing && actionType === "APPROVED" ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            Approve
                          </button>

                          {/* Reject */}
                          <button
                            disabled={!!processing}
                            onClick={() =>
                              handleStatusUpdate(leaveId, "REJECTED")
                            }
                            title="Reject"
                            className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 transition-all duration-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing && actionType === "REJECTED" ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <X className="w-3.5 h-3.5" />
                            )}
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <StatusBadge status={leave.status} />
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Mobile Cards ─── */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
        {leaves.map((leave) => {
          const leaveId = leave._id || leave.id;
          const isProcessing = processing === leaveId;

          return (
            <div
              key={leaveId}
              className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  {isAdmin && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {leave.employee?.firstName?.[0]}
                      {leave.employee?.lastName?.[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    {isAdmin && (
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        {leave.employee?.firstName} {leave.employee?.lastName}
                      </p>
                    )}
                    <TypeBadge type={leave.type} />
                  </div>
                </div>
                <StatusBadge status={leave.status} />
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 mb-2 text-sm text-slate-600 dark:text-slate-400">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {format(new Date(leave.startDate), "MMM dd")} —{" "}
                  {format(new Date(leave.endDate), "MMM dd, yyyy")}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  ({getDuration(leave.startDate, leave.endDate)})
                </span>
              </div>

              {/* Reason */}
              {leave.reason && (
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mb-3">
                  {leave.reason}
                </p>
              )}

              {/* Admin Actions */}
              {isAdmin && leave.status === "PENDING" && (
                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    disabled={!!processing}
                    onClick={() => handleStatusUpdate(leaveId, "APPROVED")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isProcessing && actionType === "APPROVED" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Approve
                  </button>
                  <button
                    disabled={!!processing}
                    onClick={() => handleStatusUpdate(leaveId, "REJECTED")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isProcessing && actionType === "REJECTED" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaveHistory;