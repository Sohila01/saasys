
import React from 'react';
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  EyeIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';

const SecurityAuditPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Zero Trust Architecture</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Security Core Intelligence</h1>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95">
          Revoke All Sessions
        </button>
      </div>

      {/* Security Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-[2rem] border-emerald-100 flex items-center space-x-6">
          <div className="h-16 w-16 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center">
            <ShieldCheckIcon className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">Reinforced</p>
          </div>
        </div>
        <div className="glass-card p-8 rounded-[2rem] border-blue-100 flex items-center space-x-6">
          <div className="h-16 w-16 rounded-[1.25rem] bg-blue-50 flex items-center justify-center">
            <LockClosedIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RLS Compliance</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">100% Active</p>
          </div>
        </div>
        <div className="glass-card p-8 rounded-[2rem] border-rose-100 flex items-center space-x-6">
          <div className="h-16 w-16 rounded-[1.25rem] bg-rose-50 flex items-center justify-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-rose-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anomalies Detected</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">0 Resolved</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Threat Map / Access Logs */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Access Protocol</h3>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">Live Feed</span>
           </div>
           <div className="space-y-6">
              {[
                { user: 'Admin User', action: 'Schema Modified', ip: '192.168.1.1', time: '2m ago', status: 'success' },
                { user: 'Admin User', action: 'Data Exported', ip: '192.168.1.1', time: '15m ago', status: 'success' },
                { user: 'System', action: 'Automatic Backup', ip: 'Internal', time: '1h ago', status: 'success' },
                { user: 'Guest', action: 'Failed Auth Attempt', ip: '45.122.1.9', time: '4h ago', status: 'failed' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${log.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      <FingerPrintIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 tracking-tight">{log.action}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{log.user} • {log.ip}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Security Controls */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black tracking-tight mb-2">Encryption Keys</h3>
                <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">Your data is currently encrypted using AES-256 at the application layer with tenant-specific salt.</p>
                <div className="flex flex-col space-y-4">
                   <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10">Rotate Master Key</button>
                   <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">Download Key Backup</button>
                </div>
              </div>
              <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-600/20 blur-3xl rounded-full -mr-10 -mt-10"></div>
           </div>

           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">RLS Validation</h3>
              <div className="space-y-4">
                 {[
                   { table: 'sub_modules', status: 'Enforced' },
                   { table: 'sub_module_fields', status: 'Enforced' },
                   { table: 'sub_module_records', status: 'Enforced' },
                   { table: 'main_modules', status: 'Public/Read-Only' },
                 ].map((t, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <span className="text-sm font-bold text-slate-600">{t.table}</span>
                     <div className="flex items-center space-x-2">
                       <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                       <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">{t.status}</span>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditPage;
