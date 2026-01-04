
import React, { useEffect, useState } from 'react';
// Link is DOM-specific, available in react-router-dom
import { Link } from 'react-router-dom';
import { 
  CurrencyDollarIcon, ShoppingBagIcon, UsersIcon, CubeIcon, SparklesIcon,
  RocketLaunchIcon, ChartBarIcon,
  BuildingOffice2Icon, UserGroupIcon, Squares2X2Icon
} from '@heroicons/react/24/solid';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar
} from 'recharts';
import { geminiService } from '../services/gemini';
import { api } from '../services/api';
import { Dashboard as DashboardType } from '../types';

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback data if DB is empty
  const defaultChartData = [
    { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 }, { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4780 }, { name: 'May', value: 5890 }, { name: 'Jun', value: 6390 },
    { name: 'Jul', value: 7490 },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashes = await api.getDashboards();
        if (dashes.length > 0) {
          setDashboard(dashes[0]);
        }
        
        setLoadingInsights(true);
        const text = await geminiService.getDashboardInsights(defaultChartData);
        setInsights(text || "AI Engine currently processing cluster metrics.");
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoadingInsights(false);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const launchpadItems = [
    { title: 'Schema Builder', desc: 'Structural Architect', icon: RocketLaunchIcon, path: '/admin/schema', color: 'bg-indigo-500' },
    { title: 'Layout Architect', desc: 'Visual UI Designer', icon: ChartBarIcon, path: '/admin/dashboard', color: 'bg-violet-500' },
    { title: 'Tenant Settings', desc: 'Organization Context', icon: BuildingOffice2Icon, path: '/admin/settings', color: 'bg-blue-500' },
    { title: 'Supplier Hub', desc: 'Supply Chain Portal', icon: UserGroupIcon, path: '/supplier/profile', color: 'bg-emerald-500' },
  ];

  if (loading) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Platform Core</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ecosystem Intelligence</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Volume', value: '$248,392', trend: '+14.2%', icon: CurrencyDollarIcon, color: 'text-indigo-600', bg: 'from-indigo-500/10 to-transparent' },
          { label: 'Active Pipeline', value: '842 Units', trend: '+5.4%', icon: ShoppingBagIcon, color: 'text-violet-600', bg: 'from-violet-500/10 to-transparent' },
          { label: 'Network Entities', value: '1,204', trend: '+1.2%', icon: UsersIcon, color: 'text-blue-600', bg: 'from-blue-500/10 to-transparent' },
          { label: 'Stored Assets', value: '42,901', trend: '-2.4%', icon: CubeIcon, color: 'text-slate-600', bg: 'from-slate-500/10 to-transparent' },
        ].map((stat, i) => (
          <div key={i} className="group bg-white p-7 rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden transition-all hover:shadow-xl hover:border-indigo-100">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bg} -mr-16 -mt-16 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-4">
                <div className={`p-3.5 rounded-2xl bg-slate-50 inline-block shadow-sm group-hover:bg-white transition-colors`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                   <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">{stat.label}</h3>
                   <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm min-h-[500px] flex flex-col">
          {dashboard && dashboard.widgets.length > 0 ? (
            dashboard.widgets.slice(0, 1).map((w) => (
              <div key={w.id} className="h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{w.title}</h3>
                  <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Active Data Synthesis</p>
                </div>
                <div className="flex-1 min-h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {w.widget_type === 'bar' ? (
                      <BarChart data={defaultChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    ) : (
                      <AreaChart data={defaultChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                        <Tooltip contentStyle={{ borderRadius: '20px' }} />
                        <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={4} fillOpacity={0.1} fill="#4f46e5" />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="p-10 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <Squares2X2Icon className="h-16 w-16 text-slate-200" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-slate-900 italic">No Visual Protocol Defined</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Access Layout Architect to configure dashboard components.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mesh-gradient rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl group flex flex-col">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-500">
                <SparklesIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight uppercase leading-none">Nexus AI</h3>
                <p className="text-[9px] font-black text-white/50 tracking-[0.3em] uppercase mt-1">Strategic Advisor</p>
              </div>
            </div>
            <div className="flex-1 text-sm font-semibold text-white/90 leading-[1.8] italic bg-white/5 p-6 rounded-[1.5rem] border border-white/10 overflow-y-auto custom-scrollbar">
              {loadingInsights ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-3 bg-white/20 rounded w-full"></div>
                  <div className="h-3 bg-white/20 rounded w-5/6"></div>
                  <div className="h-3 bg-white/20 rounded w-4/6"></div>
                </div>
              ) : insights}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        </div>
      </div>

      <section>
        <div className="flex items-center space-x-3 mb-8 px-2">
            <Squares2X2Icon className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">System Launchpad</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {launchpadItems.map((item, idx) => (
            <Link key={idx} to={item.path} className="group bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 flex items-center space-x-5">
              <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-xl shadow-indigo-600/10 group-hover:scale-110 transition-transform duration-500`}>
                <item.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">{item.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
