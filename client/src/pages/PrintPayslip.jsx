import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  PrinterIcon,
  ArrowLeftIcon,
  Loader2Icon,
  AlertCircleIcon,
  BuildingIcon,
  UserIcon,
  BriefcaseIcon,
  MailIcon,
  CalendarIcon,
  HashIcon,
  CheckCircle2Icon,
} from "lucide-react";
import api from "../api/axios";

const PrintPayslip = () => {
  const { id } = useParams();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/payslips/${id}`)
      .then((res) => setPayslip(res.data))
      .catch((err) => {
        setError(err.response?.data?.error || err.message || "Failed to load payslip");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Loading ───
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2Icon className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500">Loading payslip...</p>
      </div>
    );
  }

  // ─── Error ───
  if (error || !payslip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-5">
            <AlertCircleIcon className="w-6 h-6 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Payslip Not Found
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {error || "This payslip could not be found or may have been removed."}
          </p>
          <Link
            to="/payslips"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Payslips
          </Link>
        </div>
      </div>
    );
  }

  const period = format(
    new Date(payslip.year, payslip.month - 1),
    "MMMM yyyy"
  );

  const netIsPositive = (payslip.netSalary || 0) > 0;

  const employeeDetails = [
    {
      icon: UserIcon,
      label: "Employee Name",
      value: `${payslip.employee?.firstName || ""} ${payslip.employee?.lastName || ""}`.trim(),
    },
    {
      icon: BriefcaseIcon,
      label: "Position",
      value: payslip.employee?.position || "—",
    },
    {
      icon: MailIcon,
      label: "Work Email",
      value: payslip.employee?.email || "—",
    },
    {
      icon: BuildingIcon,
      label: "Department",
      value: payslip.employee?.department || "—",
    },
    {
      icon: CalendarIcon,
      label: "Pay Period",
      value: period,
    },
    {
      icon: HashIcon,
      label: "Payslip ID",
      value: `#${id}`,
    },
  ];

  const salaryRows = [
    {
      label: "Basic Salary",
      amount: payslip.basicSalary || 0,
      type: "base",
      prefix: "$",
    },
    {
      label: "Allowances",
      amount: payslip.allowances || 0,
      type: "positive",
      prefix: "+$",
    },
    {
      label: "Deductions",
      amount: payslip.deductions || 0,
      type: "negative",
      prefix: "-$",
    },
  ];

  return (
    <>
      {/* ─── Print Styles ─── */}
      <style>{`
        @media print {
          body { margin: 0; background: white; }
          .print-hidden { display: none !important; }
          .print-container { 
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* ─── Page Wrapper ─── */}
      <div className="min-h-screen bg-slate-50 py-8 px-4 print:bg-white print:py-0">
        {/* Back + Print action bar */}
        <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between print-hidden">
          <Link
            to="/payslips"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Payslips
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            <PrinterIcon className="w-4 h-4" />
            Print Payslip
          </button>
        </div>

        {/* ─── Payslip Card ─── */}
        <div className="print-container max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          {/* ─── Header ─── */}
          <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 px-8 py-10 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-sm bg-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg tracking-wide">
                    EmpTrack
                  </p>
                  <p className="text-indigo-300/70 text-xs">
                    Management System
                  </p>
                </div>
              </div>

              {/* Title */}
              <div className="text-left sm:text-right">
                <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-1">
                  Official Document
                </p>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  PAYSLIP
                </h1>
                <p className="text-indigo-200/80 text-sm mt-1">{period}</p>
              </div>
            </div>
          </div>

          {/* ─── Body ─── */}
          <div className="px-6 sm:px-8 py-8">
            {/* Employee Details Grid */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                Employee Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {employeeDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <detail.icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-0.5">
                        {detail.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary Breakdown Table */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                Salary Breakdown
              </h2>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="text-right py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryRows.map((row, index) => (
                      <tr
                        key={row.label}
                        className={`border-t border-slate-100 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }`}
                      >
                        <td className="py-3.5 px-5 text-slate-700 font-medium">
                          {row.label}
                        </td>
                        <td
                          className={`text-right py-3.5 px-5 font-semibold ${
                            row.type === "positive"
                              ? "text-emerald-600"
                              : row.type === "negative"
                                ? "text-rose-600"
                                : "text-slate-800"
                          }`}
                        >
                          {row.prefix}
                          {row.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}

                    {/* Net Salary Row */}
                    <tr className="border-t-2 border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2Icon className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold text-slate-900">
                            Net Salary
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-4 px-5">
                        <span
                          className={`text-xl font-bold tabular-nums ${
                            netIsPositive ? "text-indigo-700" : "text-rose-700"
                          }`}
                        >
                          ${payslip.netSalary?.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─── Note / Footer ─── */}
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 mb-6">
              <p className="text-xs text-amber-700 leading-relaxed">
                <span className="font-semibold">Note:</span> This is a
                computer-generated payslip and does not require a physical
                signature. For any discrepancies, please contact your HR
                administrator.
              </p>
            </div>

            {/* ─── Bottom Branding ─── */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-sm bg-white" />
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  EmpTrack
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generated on{" "}
                {format(new Date(), "dd MMM yyyy, HH:mm")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintPayslip;