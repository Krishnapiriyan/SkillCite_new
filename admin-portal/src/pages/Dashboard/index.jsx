import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAnalyticsOverviewApi, 
  getAnalyticsTrendApi, 
  getAnalyticsSpecialtyApi 
} from '../../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Briefcase, UserSquare2, Cpu, Mail, ArrowUpRight, Activity } from 'lucide-react';

import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/ui/StatCard';

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [specialty, setSpecialty] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overRes, trendRes, specRes] = await Promise.all([
          getAnalyticsOverviewApi(),
          getAnalyticsTrendApi(),
          getAnalyticsSpecialtyApi(),
        ]);

        if (overRes.success) setOverview(overRes.data);
        if (trendRes.success) setTrend(trendRes.data);
        if (specRes.success) setSpecialty(specRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

  const getFeedItemDetails = (item) => {
    const details = {
      employer: { label: 'Recruitment Request', color: 'badge-blue', path: `/employers/${item.id}` },
      candidate: { label: 'Candidate Submission', color: 'badge-emerald', path: `/candidates/${item.id}` },
      engineering: { label: 'Engineering Service', color: 'badge-purple', path: `/engineering/${item.id}` },
      contact: { label: 'General Message', color: 'badge-amber', path: `/contacts` },
    };
    return details[item.type] || { label: 'Submission', color: 'text-slate-500 bg-slate-50 border border-slate-100/60', path: '/' };
  };

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard">
        <div className="w-full h-96 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="flex flex-col gap-8">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Employer Requests"
            value={overview?.counts?.employers || 0}
            icon={<Briefcase className="w-5 h-5" />}
            trend="Recruitment Specs"
          />
          <StatCard
            label="Candidate Resumes"
            value={overview?.counts?.candidates || 0}
            icon={<UserSquare2 className="w-5 h-5" />}
            trend="Talent Network"
          />
          <StatCard
            label="Engineering Specs"
            value={overview?.counts?.engineering || 0}
            icon={<Cpu className="w-5 h-5" />}
            trend="Calculations/DWGs"
          />
          <StatCard
            label="Contact Messages"
            value={overview?.counts?.contacts || 0}
            icon={<Mail className="w-5 h-5" />}
            trend="General Enquiries"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Trend Line Chart */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-3xl flex flex-col gap-4 shadow-xl shadow-slate-100/30">
            <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 tracking-tight uppercase">
              <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
              Submission History (Last 30 Days)
            </h2>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '11px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }} />
                  <Line type="monotone" dataKey="total" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 1, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Specialty Pie Chart */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-3xl flex flex-col gap-4 shadow-xl shadow-slate-100/30">
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">
              Specialty Split
            </h2>
            <div className="w-full h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={specialty}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {specialty.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '11px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Pie Legends */}
            <div className="flex flex-col gap-2 mt-2">
              {specialty.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {entry.name}
                  </div>
                  <span className="font-extrabold text-slate-800">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Activity List Feed */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-5 shadow-xl shadow-slate-100/30">
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">
            Recent Intake Activity Feed
          </h2>
          
          <div className="flex flex-col divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-2.5 scrollbar-thin">
            {overview?.recentActivity && overview.recentActivity.length > 0 ? (
              overview.recentActivity.map((activity, idx) => {
                const details = getFeedItemDetails(activity);
                return (
                  <div 
                    key={idx} 
                    onClick={() => navigate(details.path)}
                    className="py-4 flex items-center justify-between hover:bg-blue-50/20 px-3 rounded-2xl transition-all duration-300 cursor-pointer hover:translate-x-1"
                  >
                    <div className="flex items-center gap-4">
                      {/* Submissions Badge */}
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${details.color}`}>
                        {details.label}
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-slate-800">{activity.name}</span>
                        <span className="text-xs text-slate-400 font-semibold mt-0.5">{activity.contact}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <div className="flex flex-col text-right">
                        <span>{(() => {
                          if (!activity.date) return 'N/A';
                          const d = new Date(activity.date);
                          if (isNaN(d.getTime())) return 'N/A';
                          return d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        })()}</span>
                        <span className="text-[10px] text-muted font-medium mt-0.5">{(() => {
                          if (!activity.date) return '';
                          const d = new Date(activity.date);
                          return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
                        })()}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
                No recent activity recorded.
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
