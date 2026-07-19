import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../assets/assets";
import {
  Loader2Icon,
  UserIcon,
  BriefcaseIcon,
  ShieldIcon,
  Building2Icon,
  MailIcon,
  LockIcon,
  SaveIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    if (isEditMode) {
      const pwd = formData.get("password");
      if (!pwd) formData.delete("password");
    }

    try {
      const url = isEditMode ? `/employees/${initialData.id}` : `/employees`;
      const method = isEditMode ? "put" : "post";
      await api[method](url, formData);
      toast.success(
        isEditMode ? "Employee updated successfully" : "Employee created successfully"
      );
      onSuccess ? onSuccess() : navigate("/employees");
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reusable input wrapper for consistency
  const InputWrapper = ({ label, name, required, children }) => (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ─── Personal Information ─── */}
      <section className="card p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Personal Information
            </h3>
            <p className="text-xs text-slate-400">Basic identity details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputWrapper label="First Name" name="firstName" required>
            <input
              id="firstName"
              name="firstName"
              required
              defaultValue={initialData?.firstName || ""}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
              placeholder="John"
            />
          </InputWrapper>

          <InputWrapper label="Last Name" name="lastName" required>
            <input
              id="lastName"
              name="lastName"
              required
              defaultValue={initialData?.lastName || ""}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
              placeholder="Doe"
            />
          </InputWrapper>

          <InputWrapper label="Phone Number" name="phone" required>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              defaultValue={initialData?.phone || ""}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
              placeholder="+123 456 7890"
            />
          </InputWrapper>

          <InputWrapper label="Join Date" name="joinDate" required>
            <input
              id="joinDate"
              type="date"
              name="joinDate"
              required
              defaultValue={
                initialData?.joinDate
                  ? new Date(initialData.joinDate).toISOString().split("T")[0]
                  : ""
              }
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
            />
          </InputWrapper>

          <div className="sm:col-span-2">
            <InputWrapper label="Bio (Optional)" name="bio">
              <textarea
                id="bio"
                name="bio"
                rows={3}
                defaultValue={initialData?.bio || ""}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white resize-none"
                placeholder="Brief professional description..."
              />
            </InputWrapper>
          </div>
        </div>
      </section>

      {/* ─── Employment Details ─── */}
      <section className="card p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <BriefcaseIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Employment Details
            </h3>
            <p className="text-xs text-slate-400">Role, salary & department</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputWrapper label="Department" name="department">
            <div className="relative">
              <Building2Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <select
                id="department"
                name="department"
                defaultValue={initialData?.department || ""}
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((deptName) => (
                  <option key={deptName} value={deptName}>
                    {deptName}
                  </option>
                ))}
              </select>
            </div>
          </InputWrapper>

          <InputWrapper label="Position" name="position" required>
            <input
              id="position"
              name="position"
              required
              defaultValue={initialData?.position || ""}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
              placeholder="Senior Developer"
            />
          </InputWrapper>

          <InputWrapper label="Basic Salary (USD)" name="basicSalary" required>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                $
              </span>
              <input
                id="basicSalary"
                type="number"
                name="basicSalary"
                required
                min="0"
                step="0.01"
                defaultValue={initialData?.basicSalary || 0}
                className="w-full h-11 pl-8 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
              />
            </div>
          </InputWrapper>

          <InputWrapper label="Allowances" name="allowances" required>
            <input
              id="allowances"
              type="number"
              name="allowances"
              required
              min="0"
              step="0.01"
              defaultValue={initialData?.allowances || 0}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
            />
          </InputWrapper>

          <InputWrapper label="Deductions" name="deductions" required>
            <input
              id="deductions"
              type="number"
              name="deductions"
              required
              min="0"
              step="0.01"
              defaultValue={initialData?.deductions || 0}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
            />
          </InputWrapper>

          {isEditMode && (
            <InputWrapper label="Status" name="employmentStatus">
              <select
                id="employmentStatus"
                name="employmentStatus"
                defaultValue={initialData?.employmentStatus || "ACTIVE"}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </InputWrapper>
          )}
        </div>
      </section>

      {/* ─── Account Setup ─── */}
      <section className="card p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <ShieldIcon className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Account Setup
            </h3>
            <p className="text-xs text-slate-400">
              Login credentials and access level
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <InputWrapper label="Work Email" name="email" required>
              <div className="relative">
                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  defaultValue={initialData?.email || ""}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
                  placeholder="john@company.com"
                />
              </div>
            </InputWrapper>
          </div>

          {!isEditMode && (
            <InputWrapper label="Temporary Password" name="password" required>
              <div className="relative">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
                  placeholder="Min. 8 characters"
                />
              </div>
            </InputWrapper>
          )}

          {isEditMode && (
            <InputWrapper label="New Password (optional)">
              <div className="relative">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Leave blank to keep current"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white"
                />
              </div>
            </InputWrapper>
          )}

          <InputWrapper label="System Role" name="role">
            <select
              id="role"
              name="role"
              defaultValue={initialData?.user?.role || "EMPLOYEE"}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </InputWrapper>
        </div>
      </section>

      {/* ─── Form Actions ─── */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : navigate(-1))}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-[0.98]"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : (
            <SaveIcon className="w-4 h-4" />
          )}
          {loading
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Employee"
              : "Create Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;