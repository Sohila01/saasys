
import { useState, useEffect } from 'react';
// Link is DOM-specific, while useLocation is core routing logic
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import * as OutlineIcons from '@heroicons/react/24/outline';
import { 
  HomeIcon, 
  Squares2X2Icon, 
  ChevronRightIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ArrowLeftStartOnRectangleIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { User, MainModule, SubModule, UserRole } from '../../types';
import { api } from '../../services/api';

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();
  const [modules, setModules] = useState<MainModule[]>([]);
  const [subModules, setSubModules] = useState<SubModule[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [m, s] = await Promise.all([api.getModules(), api.getSubModules()]);
        setModules(m.sort((a,b) => a.sort_order - b.sort_order));
        setSubModules(s);
      } catch (err: any) {
        console.error("Failed to load sidebar modules:", err?.message || err);
      }
    };
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label, color = 'text-slate-400' }: { to: string, icon: any, label: string, color?: string }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 relative group ${
          active 
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 translate-x-1' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {active && (
          <div className="absolute -left-2 w-1.5 h-6 bg-indigo-400 rounded-full shadow-[0_0_12px_#818cf8]" />
        )}
        <Icon className={`h-5 w-5 transition-colors duration-300 ${active ? 'text-white' : `${color} group-hover:text-indigo-400`}`} />
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </Link>
    );
  };

  const getModuleIcon = (iconName: string) => {
    const Icon = (OutlineIcons as any)[iconName] || Squares2X2Icon;
    return Icon;
  };

  return (
    <div className="w-[300px] bg-[#020617] flex flex-col hidden lg:flex border-r border-white/5 relative z-50">
      <div className="p-8 pb-10">
        <div className="flex items-center space-x-4 group cursor-pointer">
          <div className="mesh-gradient p-2.5 rounded-[1.25rem] shadow-2xl shadow-indigo-600/40 group-hover:scale-110 transition-transform duration-500">
            <Squares2X2Icon className="h-6 w-6 text-white stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Nexus</span>
            <span className="text-[10px] font-black text-indigo-400/80 uppercase tracking-[0.4em] mt-1.5">Enterprise</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-9 overflow-y-auto custom-scrollbar pb-10">
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Central Hub</p>
          <NavLink to="/" icon={HomeIcon} label="Intelligence" />
          <NavLink to="/supplier/profile" icon={UserGroupIcon} label="Supplier Portal" />
        </div>

        {/* Display all sub-modules in a single "Modules" section */}
        {subModules.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center space-x-3 px-4 mb-4">
              <Squares2X2Icon className="h-3.5 w-3.5 text-indigo-500/60" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Business Modules</p>
            </div>
            <div className="space-y-0.5">
              {subModules.map((sm) => {
                const active = isActive(`/modules/${sm.code}`);
                return (
                  <Link
                    key={sm.id}
                    to={`/modules/${sm.code}`}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group border border-transparent ${
                      active 
                        ? 'bg-white/5 text-indigo-400 border-indigo-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-1 w-1 rounded-full transition-all duration-500 ${active ? 'bg-indigo-400 shadow-[0_0_8px_#818cf8] scale-125' : 'bg-slate-700'}`}></div>
                      <span className={`text-[13px] font-bold tracking-tight ${active ? 'text-white' : ''}`}>{sm.name}</span>
                    </div>
                    <ChevronRightIcon className={`h-3 w-3 transition-all duration-300 ${active ? 'rotate-90 text-indigo-400' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {user.role === UserRole.TENANT_ADMIN && (
          <div className="pt-6 border-t border-white/5 space-y-1">
             <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Ecosystem Configuration</p>
            <NavLink to="/admin/schema" icon={RocketLaunchIcon} label="Data Architect" color="text-indigo-400/80" />
            <NavLink to="/admin/dashboard" icon={ChartBarIcon} label="UI Designer" color="text-violet-400/80" />
            <NavLink to="/admin/workflows" icon={BoltIcon} label="Workflow Engine" color="text-amber-400/80" />
            <NavLink to="/admin/settings" icon={BuildingOffice2Icon} label="Tenant Context" color="text-blue-400/80" />
            <NavLink to="/admin/security" icon={ShieldCheckIcon} label="Security Policy" color="text-emerald-400/80" />
            <NavLink to="/admin/system" icon={WrenchScrewdriverIcon} label="Kernel Logs" color="text-amber-400/80" />
          </div>
        )}
      </nav>

      <div className="p-6 bg-slate-950/40 border-t border-white/5">
        <div className="group flex items-center justify-between p-3.5 bg-white/5 rounded-[1.5rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-sm font-black text-white shadow-xl ring-1 ring-white/10">
              {user.full_name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate tracking-tight">{user.full_name}</p>
              <p className="text-[9px] text-slate-500 truncate font-black uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
