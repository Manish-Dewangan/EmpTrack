import { useCallback, useEffect, useState } from "react";
import {
  DollarSignIcon,
  CalendarIcon,
  TrendingUpIcon,
  FileTextIcon,
  Loader2Icon,
  AlertCircleIcon,
  RefreshCwIcon,
  ReceiptIcon,
  WalletIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "lucide-react";
import PaySlipList from "../components/payslip/PaySlipList";
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const fetchPayslips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/payslips");
      setPayslips(res.data.data || []);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  useEffect(() => {
    if (isAdmin) {
      api
        .get("/employees")
        .then((res) => setEmployees(res.data.filter((e) => !e.isDeleted)))
        .catch(() => {});
    }
  }, [isAdmin]);

  // Stats calculations
  const totalPaid = payslips.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const totalBasic = payslips.reduce((sum, p) => sum + (p.basicSalary || 0), 0);
  const totalAllowances = payslips.reduce(
    (sum, p) => sum + (p.allowances || 0),
    0
  );
  const totalDeductions = payslips.reduce(
    (sum, p) => sum + (p.deductions || 0),
    0
  );
  const latestPayslip = payslips.length > 0 ? payslips[0] : null;

  const colorMap = {
    indigo: {
      bar: "bg-indigo-500",
      iconBg: "bg-indigo-50 group-hover:bg-indigo-100",
      iconText: "text-indigo-600",
    },
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
    rose: {
      bar: "bg-rose-500",
      iconBg: "bg-rose-50 group-hover:bg-rose-100",
      iconText: "text-rose-600",
    },
  };

  const adminStats = [
    {
      label: "Total Payslips",
      value: payslips.length,
      icon: FileTextIcon,
      color: "indigo",
      prefix: "",
    },
    {
      label: "Total Paid Out",
      value: totalPaid.toLocaleString(),
      icon: DollarSignIcon,
      color: "emerald",
      prefix: "$",
    },
    {
      label: "Total Allowances",
      value: totalAllowances.toLocaleString(),
      icon: ArrowUpIcon,
      color: "amber",
      prefix: "$",
    },
    {
      label: "Total Deductions",
      value: totalDeductions.toLocaleString(),
      icon: ArrowDownIcon,
      color: "rose",
      prefix: "$",
    },
  ];

  const employeeStats = [
    {
      label: "Total Payslips",
      value: payslips.length,
      icon: ReceiptIcon,
      color: "indigo",
      prefix: "",
    },
    {
      label: "Total Earned",
      value: totalPaid.toLocaleString(),
      icon: WalletIcon,
      color: "emerald",
      prefix: "$",
    },
    {
      label: "Latest Payout",
      value: latestPayslip
        ? latestPayslip.netSalary?.toLocaleString()
        : "N/A",
      icon: DollarSignIcon,
      color: "amber",
      prefix: latestPayslip ? "$" : "",
    },
  ];

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2Icon className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500">Loading payslips...</p>
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
            Failed to load payslips
          </h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={fetchPayslips}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Payslips
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            {isAdmin
              ? "Generate and manage employee payslips"
              : "Your payslip history and earnings"}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Month badge */}
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 shrink-0">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>

          {isAdmin && (
            <GeneratePayslipForm
              employees={employees}
              onSuccess={fetchPayslips}
            />
          )}
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div
        className={`grid gap-4 sm:gap-5 mb-8 ${
          isAdmin
            ? "grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-3"
        }`}
      >
        {(isAdmin ? adminStats : employeeStats).map((s) => {
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
                    {s.prefix}
                    {s.value}
                  </p>
                </div>

                <div
                  className={`w-11 h-11 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center shrink-0 transition-colors duration-300`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Earnings Breakdown (Employee) ─── */}
      {!isAdmin && payslips.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <TrendingUpIcon className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Earnings Breakdown
              </h3>
              <p className="text-xs text-slate-400">
                Cumulative salary component summary
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <DollarSignIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">
                  Basic Salary
                </span>
              </div>
              <p className="text-xl font-bold text-emerald-700 tabular-nums">
                ${totalBasic.toLocaleString()}
              </p>
            </div>

            <div className="text-center p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <ArrowUpIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-medium text-indigo-600">
                  Allowances
                </span>
              </div>
              <p className="text-xl font-bold text-indigo-700 tabular-nums">
                ${totalAllowances.toLocaleString()}
              </p>
            </div>

            <div className="text-center p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <ArrowDownIcon className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-xs font-medium text-rose-600">
                  Deductions
                </span>
              </div>
              <p className="text-xl font-bold text-rose-700 tabular-nums">
                ${totalDeductions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Admin Quick Stats Bar ─── */}
      {isAdmin && payslips.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <TrendingUpIcon className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Payroll Summary
              </h3>
              <p className="text-xs text-slate-400">
                Overall payroll component breakdown
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                ${totalBasic.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Total Basic</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                ${totalAllowances.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Allowances</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-lg font-bold text-rose-600 tabular-nums">
                -${totalDeductions.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Deductions</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-indigo-50 border border-indigo-100">
              <p className="text-lg font-bold text-indigo-700 tabular-nums">
                ${totalPaid.toLocaleString()}
              </p>
              <p className="text-xs text-indigo-500 mt-0.5">Net Paid</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Payslip List ─── */}
      <PaySlipList payslip={payslips} isAdmin={isAdmin} />
    </div>
  );
};

export default Payslips;