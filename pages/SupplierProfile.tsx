
import React from 'react';
import { 
  StarIcon, 
  CheckBadgeIcon, 
  TruckIcon, 
  DocumentTextIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/solid';

const SupplierProfile: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden relative">
        <div className="h-56 mesh-gradient relative">
           <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="px-12 pb-12">
          <div className="relative flex flex-col md:flex-row md:items-end -mt-20 mb-10 gap-8">
            <div className="h-40 w-40 rounded-[2.5rem] bg-white p-3 shadow-2xl ring-4 ring-white relative z-10">
              <div className="h-full w-full bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-5xl tracking-tighter shadow-inner">
                SC
              </div>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Swift Components Inc.</h1>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center">
                  <CheckBadgeIcon className="h-4 w-4 mr-2" />
                  Elite Tier
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                   <StarIcon className="h-5 w-5 text-amber-400" />
                   <span className="text-lg font-black text-slate-900">4.98</span>
                   <span className="text-slate-400 font-bold text-sm">(1,240 Reviews)</span>
                </div>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex items-center space-x-2 text-indigo-600 font-black text-sm uppercase tracking-widest">
                   <ShieldCheckIcon className="h-5 w-5" />
                   <span>Verified Enterprise</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"><EnvelopeIcon className="h-6 w-6 text-slate-600" /></button>
              <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95">Send Order</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Pipeline', value: '42', icon: TruckIcon, trend: '+4' },
              { label: 'Open Valuation', value: '$840k', icon: DocumentTextIcon, trend: '+12%' },
              { label: 'Reliability Index', value: '99.8%', icon: ShieldCheckIcon, trend: 'stable' },
              { label: 'Network Reach', value: '14 Countries', icon: GlobeAltIcon, trend: '+1' },
            ].map((card, i) => (
              <div key={i} className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-indigo-100 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{card.trend}</span>
                </div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10">Performance Benchmarking</h3>
          <div className="space-y-8">
            {[
              { label: 'Strategic Quality Rating', value: 96, color: 'bg-emerald-500' },
              { label: 'Communication Latency', value: 92, color: 'bg-indigo-500' },
              { label: 'ESG Compliance Score', value: 100, color: 'bg-emerald-500' },
              { label: 'Supply Chain Resiliency', value: 88, color: 'bg-violet-500' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                  <span>{stat.label}</span>
                  <span className="bg-slate-50 px-2 py-1 rounded-lg">{stat.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`${stat.color} h-full rounded-full shadow-[0_0_12px_rgba(0,0,0,0.1)] transition-all duration-1000`} style={{ width: `${stat.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10">Operational Milestones</h3>
          <div className="space-y-6">
            {[
              { title: 'Global Contract Renewal', date: 'Oct 24, 2024', status: 'Pending', type: 'Administrative' },
              { title: 'ISO 9001 Recertification', date: 'Nov 12, 2024', status: 'Verified', type: 'Compliance' },
              { title: 'High-Value Shipment Delta', date: 'Oct 15, 2024', status: 'Urgent', type: 'Logistics' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:border-indigo-100 transition-all">
                <div className="flex items-center space-x-5">
                   <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
                      <DocumentTextIcon className="h-6 w-6" />
                   </div>
                   <div>
                     <p className="font-black text-slate-900 tracking-tight">{item.title}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.type} • {item.date}</p>
                   </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  item.status === 'Urgent' ? 'bg-rose-100 text-rose-700' : item.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;
