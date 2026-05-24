export default function StatCard({ label, value, icon, trend, trendType = 'neutral' }) {
  const trends = {
    up: "text-emerald-600 bg-emerald-50 border border-emerald-100/60",
    down: "text-red-600 bg-red-50 border border-red-100/60",
    neutral: "text-slate-500 bg-slate-50 border border-slate-100/60"
  };

  return (
    <div className="glass-panel glass-panel-hover stat-card-glow p-6 rounded-3xl flex items-center justify-between select-none cursor-pointer">
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-3xl font-extrabold font-display text-slate-800 leading-none">
          {value}
        </span>
        {trend && (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold w-fit mt-1 uppercase tracking-wide ${trends[trendType]}`}>
            {trend}
          </span>
        )}
      </div>

      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10 transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>
    </div>
  );
}
