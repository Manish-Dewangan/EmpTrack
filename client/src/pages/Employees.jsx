import React, { useCallback, useEffect, useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import {
  Plus,
  Search,
  X,
  UsersIcon,
  FilterIcon,
  Loader2Icon,
  SearchXIcon,
  UserPlusIcon,
} from "lucide-react";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Employees = () => {
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const url = selectedDept
        ? `/employees?department=${selectedDept}`
        : "/employees";
      const res = await api.get(url);
      setEmployee(res.data);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedDept]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filtered = employee.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.position}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Reusable Modal
  const Modal = ({ title, subtitle, onClose, children }) => (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <UserPlusIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {title}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Employees
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Manage your team members and their information
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* ─── Filters Bar ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department filter */}
          <div className="relative">
            <FilterIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-11 pl-10 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((deptName) => (
                <option key={deptName} value={deptName}>
                  {deptName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters / Results count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <span className="font-semibold text-slate-700">
                    {filtered.length}
                  </span>{" "}
                  {filtered.length === 1 ? "employee" : "employees"} found
                </>
              )}
            </span>
          </div>

          {/* Active filter badges */}
          <div className="flex items-center gap-2">
            {selectedDept && (
              <button
                onClick={() => setSelectedDept("")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                {selectedDept}
                <X className="w-3 h-3" />
              </button>
            )}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 hover:bg-slate-200 transition-colors"
              >
                "{search}"
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Employee Grid ─── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2Icon className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading employees...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <SearchXIcon className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            No employees found
          </h3>
          <p className="text-sm text-slate-500 mb-5 text-center max-w-sm">
            {search || selectedDept
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first employee."}
          </p>
          {!search && !selectedDept && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Employee
            </button>
          )}
          {(search || selectedDept) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedDept("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onDelete={fetchEmployees}
              onEdit={(e) => setEditEmployee(e)}
            />
          ))}
        </div>
      )}

      {/* ─── Create Modal ─── */}
      {showCreateModal && (
        <Modal
          title="Add New Employee"
          subtitle="Create a user account and employee profile"
          onClose={() => setShowCreateModal(false)}
        >
          <EmployeeForm
            onSuccess={() => {
              setShowCreateModal(false);
              fetchEmployees();
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}

      {/* ─── Edit Modal ─── */}
      {editEmployee && (
        <Modal
          title="Edit Employee"
          subtitle={`Update details for ${editEmployee.firstName} ${editEmployee.lastName}`}
          onClose={() => setEditEmployee(null)}
        >
          <EmployeeForm
            initialData={editEmployee}
            onSuccess={() => {
              setEditEmployee(null);
              fetchEmployees();
            }}
            onCancel={() => setEditEmployee(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Employees;