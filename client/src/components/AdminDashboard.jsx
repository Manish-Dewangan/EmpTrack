import {
  Building2Icon,
  CalendarIcon,
  FileTextIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

const AdminDashboard = ({ data }) => {
  const stats = [
    {
      icon: UsersIcon,
      value: data.totalEmployees,
      label: "Total Employees",
      description: "Active workforce",
      color: "indigo",
    },
    {
      icon: Building2Icon,
      value: data.totalDepartment,
      label: "Departments",
      description: "Organization units",
      color: "violet",
    },
    {
      icon: CalendarIcon,
      value: data.todayAttendance,
      label: "Today's Attendance",
      description: "Checked in today",
      color: "emerald",
    },
    {
      icon: FileTextIcon,
      value: data.pendingLeaves,
      label: "Pending Leaves",
      description: "Awaiting approval",
      color: "amber",
    },
  ];

  const colorMap = {
    indigo: {
      bar: "bg-indigo-500",
      iconBg: "bg-indigo-50 group-hover:bg-indigo-100",
      iconText: "text-indigo-600",
      badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    violet: {
      bar: "bg-violet-500",
      iconBg: "bg-violet-50 group-hover:bg-violet-100",
      iconText: "text-violet-600",
      badge: "bg-violet-50 text-violet-600 border-violet-100",
    },
    emerald: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
      iconText: "text-emerald-600",
      badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    amber: {
      bar: "bg-amber-500",
      iconBg: "bg-amber-50 group-hover:bg-amber-100",
      iconText: "text-amber-600",
      badge: "bg-amber-50 text-amber-600 border-amber-100",
    },
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Welcome back, Admin — here's your overview
            </p>
          </div>

          {/* Date badge */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {stats.map((s) => {
          const colors = colorMap[s.color];

          return (
            <div
              key={s.label}
              className="group relative bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300"
            >
              {/* Left color bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${colors.bar} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500 truncate">
                    {s.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{s.description}</p>
                </div>

                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick overview bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <TrendingUpIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Quick Summary
            </h3>
            <p className="text-xs text-slate-400">Today's overview at a glance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-xl bg-slate-50">
            <p className="text-lg font-bold text-slate-900">
              {data.todayAttendance > 0 && data.totalEmployees > 0
                ? Math.round((data.todayAttendance / data.totalEmployees) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Attendance Rate</p>
          </div>

          <div className="text-center p-3 rounded-xl bg-slate-50">
            <p className="text-lg font-bold text-slate-900">
              {data.totalEmployees - data.todayAttendance}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Absent Today</p>
          </div>

          <div className="text-center p-3 rounded-xl bg-slate-50">
            <p className="text-lg font-bold text-slate-900">
              {data.totalDepartment}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Active Depts</p>
          </div>

          <div className="text-center p-3 rounded-xl bg-slate-50">
            <p className="text-lg font-bold text-amber-600 font-bold">
              {data.pendingLeaves}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Needs Action</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;