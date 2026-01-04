
import React from 'react';
import { 
  WrenchScrewdriverIcon, 
  CpuChipIcon, 
  SignalIcon, 
  CommandLineIcon,
  CircleStackIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const SystemEnginePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-amber-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Core Engine Infrastructure</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Engine Logs</h1>
        </div>
        <div className="flex space-x-4">
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Clear Cache</button>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">Re-Index DB</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'CPU Load', value: '14%', icon: CpuChipIcon, color: 'text-indigo-600' },
          { label: 'Latency', value: '42ms', icon: SignalIcon, color: 'text-emerald-600' },
          { label: 'DB Connections', value: '18/100', icon: CircleStackIcon, color: 'text-blue-600' },
          { label: 'Throughput', value: '1.2k r/s', icon: BoltIcon, color: 'text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] border-slate-100 flex flex-col justify-between h-40 group hover:border-indigo-200 transition-all">
            <stat.icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform`} />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0f172a] rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6 relative z-10">
           <div className="flex items-center space-x-3">
              <CommandLineIcon className="h-6 w-6 text-indigo-400" />
              <h3 className="text-xl font-black text-white tracking-tight">Real-time Runtime Output</h3>
           </div>
           <div className="flex items-center space-x-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streaming Engine v4.2.1</span>
           </div>
        </div>

        <div className="font-mono text-sm space-y-3 relative z-10 max-h-[400px] overflow-y-auto custom-scrollbar">
           <p className="text-slate-500"><span className="text-emerald-400">[SYSTEM]</span> Engine initialized successfully. (Took 142ms)</p>
           <p className="text-slate-500"><span className="text-indigo-400">[AUTH]</span> Tenant isolation layer active: RLS verified.</p>
           <p className="text-slate-500"><span className="text-indigo-400">[API]</span> GET /api/v1/modules - 200 OK (8ms)</p>
           <p className="text-slate-500"><span className="text-amber-400">[WARN]</span> GIN Index on 'data' column is reaching 80% fragmentation.</p>
           <p className="text-slate-500"><span className="text-indigo-400">[API]</span> POST /api/v1/data/assets - 201 Created (44ms)</p>
           <p className="text-slate-500"><span className="text-emerald-400">[DB]</span> Garbage collection completed. Freed 12.4MB.</p>
           <p className="text-slate-400 animate-pulse cursor-default">_</p>
        </div>

        {/* Console Mesh Glow */}
        <div className="absolute bottom-0 right-0 h-96 w-96 bg-indigo-600/10 blur-[100px] rounded-full -mb-48 -mr-48"></div>
      </div>
    </div>
  );
};

export default SystemEnginePage;
