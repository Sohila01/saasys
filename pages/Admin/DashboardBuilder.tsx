
import React, { useState, useEffect } from 'react';
import { 
  SquaresPlusIcon, ChartBarIcon, TableCellsIcon, PresentationChartLineIcon,
  TrashIcon, AdjustmentsHorizontalIcon, EyeIcon, CubeTransparentIcon, CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { notificationService } from '../../services/NotificationService';
import { Dashboard, Widget } from '../../types';

const DashboardBuilder: React.FC = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingWidget, setEditingWidget] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const dashes = await api.getDashboards();
      setDashboard(dashes[0]);
    };
    load();
  }, []);

  const addWidget = () => {
    if (!dashboard) return;
    const newWidget: Widget = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Global Analytics Element',
      widget_type: 'bar',
      query_config: { subModuleId: '', metric: '', aggregation: 'count' },
      layout_config: { w: 1, h: 1 }
    };
    setDashboard({ ...dashboard, widgets: [...dashboard.widgets, newWidget] });
  };

  const removeWidget = (id: string) => {
    if (!dashboard) return;
    setDashboard({ ...dashboard, widgets: dashboard.widgets.filter(w => w.id !== id) });
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    if (!dashboard) return;
    setDashboard({
      ...dashboard,
      widgets: dashboard.widgets.map(w => w.id === id ? { ...w, ...updates } : w)
    });
  };

  const save = async () => {
    if (!dashboard) return;
    setIsSaving(true);
    try {
      await api.saveDashboard(dashboard);
      notificationService.notify('UI Architecture Synced', 'Global dashboard layout has been pushed to production.', 'success');
    } catch (err) {
      notificationService.notify('Sync Failed', 'Unable to persist layout changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!dashboard) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Layout Architect</h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] mt-2 text-[10px]">Visual Experience Design Core</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-8 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center space-x-2">
            <EyeIcon className="h-4 w-4" />
            <span>Preview Mode</span>
          </button>
          <button 
            onClick={save}
            className="bg-indigo-600 text-white px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 flex items-center space-x-2"
          >
            {isSaving ? "Pushing Kernel..." : <><CheckIcon className="h-4 w-4 stroke-[3]" /><span>Push to Production</span></>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Visual Workspace */}
        <div className="lg:col-span-2 space-y-8 bg-slate-100/50 p-12 rounded-[4rem] border-2 border-dashed border-slate-200 min-h-[800px] relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {dashboard.widgets.map((w) => (
              <div 
                key={w.id} 
                onClick={() => setEditingWidget(w.id)}
                className={`group bg-white rounded-[3rem] border transition-all duration-500 cursor-pointer overflow-hidden ${
                  editingWidget === w.id ? 'ring-4 ring-indigo-500/10 border-indigo-500 shadow-2xl scale-[1.02]' : 'border-slate-100 hover:border-indigo-200 shadow-xl shadow-slate-200/20'
                }`}
              >
                <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                      {w.widget_type === 'bar' ? <ChartBarIcon className="h-5 w-5" /> : <PresentationChartLineIcon className="h-5 w-5" />}
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Widget: {w.widget_type}</p>
                       <h4 className="font-black text-slate-900 tracking-tight">{w.title}</h4>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeWidget(w.id); }} className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-10 flex flex-col items-center justify-center space-y-6 opacity-40 group-hover:opacity-100 transition-opacity">
                   <div className="h-32 w-full bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex items-center justify-center">
                      <CubeTransparentIcon className="h-10 w-10 text-slate-200" />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Visual Fragment Preview</p>
                </div>
              </div>
            ))}
            
            <button onClick={addWidget} className="h-[320px] rounded-[3rem] border-4 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-white transition-all flex flex-col items-center justify-center space-y-6 group bg-white/30 backdrop-blur-md">
              <div className="p-6 bg-slate-100 rounded-[2rem] group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg group-hover:shadow-indigo-600/30">
                <SquaresPlusIcon className="h-10 w-10 text-slate-400 group-hover:text-white" />
              </div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-[0.4em]">Inject Component</p>
            </button>
          </div>
          
          {/* Subtle Workspace Decoration */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
            <div className="absolute top-10 left-10 h-64 w-64 border-2 border-indigo-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 h-64 w-64 border-2 border-violet-600 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="space-y-8">
           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 sticky top-10">
              <div className="flex items-center space-x-4 mb-10 border-b border-slate-50 pb-8">
                 <div className="p-3 bg-slate-900 rounded-2xl text-white">
                    <AdjustmentsHorizontalIcon className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Component Config</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Fragment level adjustments</p>
                 </div>
              </div>

              {editingWidget ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Display Title</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                      value={dashboard.widgets.find(w => w.id === editingWidget)?.title}
                      onChange={(e) => updateWidget(editingWidget, { title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Visualization Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['bar', 'line', 'pie', 'stat'].map((type) => (
                        <button
                          key={type}
                          onClick={() => updateWidget(editingWidget, { widget_type: type as any })}
                          className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            dashboard.widgets.find(w => w.id === editingWidget)?.widget_type === type 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30' 
                              : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Width (Columns)</label>
                    <input 
                      type="range" min="1" max="2"
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      value={dashboard.widgets.find(w => w.id === editingWidget)?.layout_config.w}
                      onChange={(e) => updateWidget(editingWidget, { layout_config: { ...dashboard.widgets.find(w => w.id === editingWidget)!.layout_config, w: parseInt(e.target.value) } })}
                    />
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mt-1">
                      <span>Standard</span>
                      <span>Extended</span>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-50">
                     <button 
                       onClick={() => setEditingWidget(null)}
                       className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                     >
                       Close Panel
                     </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 px-4">
                   <div className="bg-slate-50 h-20 w-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                      <AdjustmentsHorizontalIcon className="h-8 w-8 text-slate-200" />
                   </div>
                   <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">No Component Target</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">Select a fragment from the workspace to begin configuration.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBuilder;
