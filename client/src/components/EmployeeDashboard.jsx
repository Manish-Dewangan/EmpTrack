import {
  ArrowRightIcon,
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
  UserCircle2Icon,
} from "lucide-react";
import { Link } from "react-router-dom";

const EmployeeDashboard = ({ data }) => {
  const emp = data.employee;

  const cards = [
    {
      icon: CalendarIcon,
      value: data.currentMonthAttendance,
      title: "Days Present",
      subtitle: "This month",
      color: "emerald",
    },
    {
      icon: FileTextIcon,
      value: data.pendingLeaves,
      title: "Pending Leaves",
      subtitle: "Awaiting approval",
      color: "amber",
    },
    {
      icon: DollarSignIcon,
      value: data.latestPayslip
        ? `$${data.latestPayslip.netSalary?.toLocaleString()}`
        : "N/A",
      title: "Latest Payslip",
      subtitle: "Most recent payout",
      color: "indigo",
    },
  ];

  const colorMap = {
    emerald: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
      iconText: "text-emerald-600",
    },
    amber: {
      bar: "bg-amber-500",
      iconBg: "bg-amber-50 group-hover:bg-amber-100",
      iconText: "text-amber-600",
    },
    indigo: {
      bar: "bg-indigo-500",
      iconBg: "bg-indigo-50 group-hover:bg-indigo-100",
      iconText: "text-indigo-600",
    },
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20 shrink-0">
              {emp?.firstName?.charAt(0)}
              {emp?.lastName?.charAt(0)}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                Welcome, {emp?.firstName}!
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-500 text-sm sm:text-base">
                  {emp?.position}
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {emp?.department || "No Department"}
                </span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 shrink-0">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {cards.map((card, index) => {
          const colors = colorMap[card.color];

          return (
            <div
              key={index}
              className="group relative bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300"
            >
              {/* Left color bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${colors.bar} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500 truncate">
                    {card.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums">
                    {card.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>
                </div>

                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}
                >
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <UserCircle2Icon className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Quick Actions
            </h3>
            <p className="text-xs text-slate-400">
              Common tasks you can do right now
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/attendance"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            <CalendarIcon className="w-4 h-4" />
            Mark Attendance
            <ArrowRightIcon className="w-4 h-4" />
          </Link>

          <Link
            to="/leave"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-[0.98]"
          >
            <FileTextIcon className="w-4 h-4" />
            Apply for Leave
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;