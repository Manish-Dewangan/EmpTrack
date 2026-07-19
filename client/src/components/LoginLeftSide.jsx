import { Users, BarChart3, Clock, Shield } from "lucide-react";

const LoginLeftSide = () => {
  const features = [
    { icon: Users, label: "Team Management" },
    { icon: Clock, label: "Attendance Tracking" },
    { icon: BarChart3, label: "Payroll & Analytics" },
    { icon: Shield, label: "Secure Access" },
  ];

  return (
    <div className="hidden md:flex w-1/2 h-screen max-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Right edge line */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-400/20 to-transparent" />

      {/* Content - flex column, no absolute positioning */}
      <div className="relative z-10 flex flex-col justify-between w-full h-full px-10 lg:px-16 xl:px-20 py-8 lg:py-10 min-h-0 overflow-y-auto">
        {/* Top - Logo */}
        <div className="shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center backdrop-blur-sm">
              <div className="w-3 h-3 rounded-sm bg-indigo-400" />
            </div>
            <span className="text-indigo-300 font-medium text-lg tracking-wide">
              EmpTrack
            </span>
          </div>
        </div>

        {/* Middle - Main content */}
        <div className="shrink-0 py-6">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-white mb-4 lg:mb-6 leading-[1.1] tracking-tight">
            Employee
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              Management
            </span>
            <br />
            System
          </h1>

          <p className="text-slate-400 text-base lg:text-lg max-w-sm leading-relaxed mb-8 lg:mb-10">
            Streamline your workforce operations, track attendance, manage
            payroll, and empower your team securely.
          </p>

          <div className="grid grid-cols-2 gap-2.5 lg:gap-3 w-full max-w-sm">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
              >
                <feature.icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs lg:text-sm">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom - Stats */}
        <div className="shrink-0">
          <div className="flex flex-wrap items-center gap-5 lg:gap-8">
            <div>
              <div className="text-xl lg:text-2xl font-semibold text-white">
                10k+
              </div>
              <div className="text-[11px] lg:text-xs text-slate-500 mt-0.5">
                Active Users
              </div>
            </div>

            <div className="w-px h-7 lg:h-8 bg-slate-700" />

            <div>
              <div className="text-xl lg:text-2xl font-semibold text-white">
                99.9%
              </div>
              <div className="text-[11px] lg:text-xs text-slate-500 mt-0.5">
                Uptime
              </div>
            </div>

            <div className="w-px h-7 lg:h-8 bg-slate-700" />

            <div>
              <div className="text-xl lg:text-2xl font-semibold text-white">
                256-bit
              </div>
              <div className="text-[11px] lg:text-xs text-slate-500 mt-0.5">
                Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLeftSide;