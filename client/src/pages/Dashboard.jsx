import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import EmployeeDashboard from "../components/EmployeeDashboard";
import AdminDashboard from "../components/AdminDashboard";
import api from "../api/axios";
import toast from "react-hot-toast";
import { AlertCircle, RefreshCwIcon } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = () => {
    setLoading(true);
    setError(null);

    api
      .get("/dashboard")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err?.message ||
          "Failed to load dashboard";

        toast.error(message);
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Loading />;

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          {/* Error icon */}
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-6 h-6 text-rose-500" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Failed to load dashboard
          </h2>

          {/* Error message */}
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            {error || "Something went wrong while fetching dashboard data."}
          </p>

          {/* Retry button */}
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            <RefreshCwIcon className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (data.role === "ADMIN") {
    return <AdminDashboard data={data} />;
  }

  return <EmployeeDashboard data={data} />;
};

export default Dashboard;