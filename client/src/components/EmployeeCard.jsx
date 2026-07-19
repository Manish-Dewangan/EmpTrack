import {
  BriefcaseIcon,
  BuildingIcon,
  MailIcon,
  PencilIcon,
  Trash2Icon,
  AlertTriangleIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const EmployeeCard = ({ employee, onDelete, onEdit }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    setDeleting(true);
    try {
      await api.delete(`/employees/${employee.id}`);
      onDelete();
      toast.success("Employee deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = () => {
    return `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`.toUpperCase();
  };

  const getGradient = () => {
    const gradients = [
      "from-indigo-500 to-violet-500",
      "from-emerald-500 to-teal-500",
      "from-amber-500 to-orange-500",
      "from-rose-500 to-pink-500",
      "from-cyan-500 to-blue-500",
      "from-fuchsia-500 to-purple-500",
    ];
    const index =
      (employee.firstName?.charCodeAt(0) || 0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5">
      {/* ─── Top Section / Avatar Area ─── */}
      <div className="relative h-36 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Avatar */}
        <div
          className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105`}
        >
          <span className="text-2xl font-bold text-white tracking-wide">
            {getInitials()}
          </span>
        </div>

        {/* Department Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-slate-600 rounded-lg shadow-sm border border-slate-100">
            <BuildingIcon className="w-3 h-3 text-slate-400" />
            {employee.department || "Unassigned"}
          </span>
        </div>

        {/* Deleted Badge */}
        {employee.isDeleted && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 bg-rose-500/90 backdrop-blur-sm text-white px-2.5 py-1 text-[11px] font-semibold rounded-lg">
              <AlertTriangleIcon className="w-3 h-3" />
              Deleted
            </span>
          </div>
        )}

        {/* Hover Action Buttons */}
        {!employee.isDeleted && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4 gap-2">
            <button
              onClick={() => onEdit(employee)}
              className="p-2.5 bg-white/95 backdrop-blur-sm text-slate-700 hover:text-indigo-600 rounded-xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Edit employee"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2.5 bg-white/95 backdrop-blur-sm text-slate-700 hover:text-rose-600 rounded-xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Delete employee"
            >
              <Trash2Icon
                className={`w-4 h-4 ${deleting ? "animate-pulse" : ""}`}
              />
            </button>
          </div>
        )}
      </div>

      {/* ─── Info Section ─── */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900 truncate">
          {employee.firstName} {employee.lastName}
        </h3>

        <div className="flex items-center gap-1.5 mt-1.5">
          <BriefcaseIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <p className="text-sm text-slate-500 truncate">
            {employee.position || "No Position"}
          </p>
        </div>

        {employee.user?.email && (
          <div className="flex items-center gap-1.5 mt-1">
            <MailIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <p className="text-xs text-slate-400 truncate">
              {employee.user.email}
            </p>
          </div>
        )}

        {/* Bottom separator + meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                employee.isDeleted ? "bg-rose-400" : "bg-emerald-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                employee.isDeleted ? "text-rose-500" : "text-emerald-600"
              }`}
            >
              {employee.isDeleted ? "Inactive" : "Active"}
            </span>
          </div>

          {employee.salary && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              ${employee.salary.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;