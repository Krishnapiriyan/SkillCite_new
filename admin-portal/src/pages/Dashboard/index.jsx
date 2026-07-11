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
import { Briefcase, UserSquare2, Cpu, Mail, ArrowUpRight, Activity, ChevronLeft, ChevronRight, CheckCheck } from 'lucide-react';

import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/ui/StatCard';

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [specialty, setSpecialty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedPage, setFeedPage] = useState(1);
  const feedPageSize = 5;
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

  const handleMarkAllRead = async () => {
    try {
      const { markAllReadApi } = await import('../../services/api');
      const res = await markAllReadApi();
      if (res.success) {
        // Refetch overview to update the UI
        const overRes = await getAnalyticsOverviewApi();
        if (overRes.success) setOverview(overRes.data);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

  const getFeedItemDetails = (item) => {
    const details = {
      employer: { 
        label: 'Recruitment Request', 
        color: 'badge-blue', 
        path: `/employers/${item.id}`,
        icon: <Briefcase className="w-4 h-4 text-blue-500" />,
        hoverClass: 'hover:bg-blue-50/50 hover:border-blue-200 border-transparent',
      },
      candidate: { 
        label: 'Candidate Submission', 
        color: 'badge-emerald', 
        path: `/candidates/${item.id}`,
        icon: <UserSquare2 className="w-4 h-4 text-emerald-500" />,
        hoverClass: 'hover:bg-emerald-50/50 hover:border-emerald-200 border-transparent',
      },
      engineering: { 
        label: 'Engineering Service', 
        color: 'badge-purple', 
        path: `/engineering/${item.id}`,
        icon: <Cpu className="w-4 h-4 text-purple-500" />,
        hoverClass: 'hover:bg-purple-50/50 hover:border-purple-200 border-transparent',
      },
      contact: { 
        label: 'General Message', 
        color: 'badge-amber', 
        path: `/contacts`,
        icon: <Mail className="w-4 h-4 text-amber-500" />,
        hoverClass: 'hover:bg-amber-50/50 hover:border-amber-200 border-transparent',
      },
    };
    return details[item.type] || { 
      label: 'Submission', 
      color: 'text-slate-500 bg-slate-50 border border-slate-100/60', 
      path: '/',
      icon: <Activity className="w-4 h-4 text-slate-500" />,
      hoverClass: 'hover:bg-slate-50 hover:border-slate-200 border-transparent',
    };
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
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">
              Recent Intake Activity Feed
            </h2>
            <button 
              onClick={handleMarkAllRead}
              className="text-[10px] font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          </div>
          
          <div className="flex flex-col divide-y divide-slate-100 pr-2.5">
            {overview?.recentActivity && overview.recentActivity.length > 0 ? (
              (() => {
                const allActivities = overview.recentActivity;
                const totalFeedPages = Math.max(1, Math.ceil(allActivities.length / feedPageSize));
                const currentFeedData = allActivities.slice((feedPage - 1) * feedPageSize, feedPage * feedPageSize);
                
                return (
                  <>
                    <div className="flex flex-col divide-y divide-slate-100 min-h-[380px]">
                      {currentFeedData.map((activity, idx) => {
                        const details = getFeedItemDetails(activity);
                        return (
                          <div 
                            key={idx} 
                            onClick={() => navigate(details.path)}
                            className={`py-4 px-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:translate-x-1 hover:shadow-md ${details.hoverClass} ${!activity.isRead ? 'bg-blue-50/80 border-l-4 border-l-blue-600 shadow-sm' : 'border-l-4 border-l-transparent border-slate-100'}`}
                          >
                            <div className="grid grid-cols-[auto_130px_1fr_auto] items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                {details.icon}
                              </div>
                              
                              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${details.color} text-center`}>
                                {details.label}
                              </span>
                              
                              <div className="flex flex-col text-left overflow-hidden">
                                <div className="flex items-center gap-2">
                                  {!activity.isRead && <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.6)] animate-pulse shrink-0" />}
                                  <span className={`text-sm truncate ${!activity.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                                    {activity.name}
                                  </span>
                                </div>
                                <span className={`text-xs mt-0.5 truncate ${!activity.isRead ? 'font-bold text-blue-600' : 'font-semibold text-slate-400'}`}>
                                  {activity.contact}
                                </span>
                              </div>
          
                              <div className="flex items-center gap-4 text-xs font-bold justify-end">
                                <div className="flex flex-col text-right">
                                  <span className={!activity.isRead ? 'text-slate-700' : 'text-slate-400'}>{(() => {
                                    if (!activity.date) return 'N/A';
                                    const d = new Date(activity.date);
                                    if (isNaN(d.getTime())) return 'N/A';
                                    return d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                  })()}</span>
                                  <span className={`text-[10px] mt-0.5 ${!activity.isRead ? 'font-bold text-slate-500' : 'font-medium text-slate-300'}`}>{(() => {
                                    if (!activity.date) return '';
                                    const d = new Date(activity.date);
                                    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
                                  })()}</span>
                                </div>
                                {!activity.isRead ? (
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                    <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
                                  </div>
                                ) : (
                                  <ArrowUpRight className="w-4 h-4 text-slate-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Page {feedPage} of {totalFeedPages}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setFeedPage(prev => Math.max(1, prev - 1))}
                          disabled={feedPage === 1}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setFeedPage(prev => Math.min(totalFeedPages, prev + 1))}
                          disabled={feedPage === totalFeedPages}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()
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
