
import React, { useState, useEffect } from 'react';
import { 
  BoltIcon, 
  PlusIcon, 
  TrashIcon, 
  PlayIcon,
  PauseIcon,
  PuzzlePieceIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { notificationService } from '../../services/NotificationService';
import { SubModule, Workflow } from '../../types';

const WorkflowBuilder: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [subModules, setSubModules] = useState<SubModule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Workflow State
  const [newWf, setNewWf] = useState<Partial<Workflow>>({
    name: '',
    trigger_event: 'on_create',
    action_type: 'notification',
    is_active: true
  });

  const loadData = async () => {
    try {
      const [subs, wfs] = await Promise.all([api.getSubModules(), api.getWorkflows()]);
      setSubModules(subs);
      setWorkflows(wfs);
    } catch (err) {
      notificationService.notify('Kernel Error', 'Failed to synchronize workflow engine.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWf.name || !newWf.trigger_module_id) return;
    try {
      await api.saveWorkflow(newWf);
      setIsModalOpen(false);
      loadData();
      notificationService.notify('Protocol Defined', `${newWf.name} has been deployed.`, 'success');
    } catch (err) {
      notificationService.notify('Deployment Failed', 'Logic engine rejected the new rule.', 'error');
    }
  };

  const toggleWorkflow = async (wf: Workflow) => {
    try {
      await api.saveWorkflow({ ...wf, is_active: !wf.is_active });
      loadData();
    } catch (err) {
      notificationService.notify('State Error', 'Failed to toggle protocol state.', 'error');
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Logic Orchestrator</h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] mt-2 text-[10px]">Workflow Automation Kernel</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center space-x-3"
        >
          <PlusIcon className="h-4 w-4 stroke-[3]" />
          <span>Define New Automation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {workflows.map((wf) => (
          <div key={wf.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex items-center justify-between group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all">
            <div className="flex items-center space-x-8">
               <div className={`p-4 rounded-2xl transition-all ${wf.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  <BoltIcon className={`h-8 w-8 ${wf.is_active ? 'animate-pulse' : ''}`} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{wf.name}</h3>
                  <div className="flex items-center space-x-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg">Trigger: {wf.trigger_event}</span>
                    <ArrowRightIcon className="h-3 w-3" />
                    <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg">Action: {wf.action_type}</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => toggleWorkflow(wf)}
                className={`p-3 rounded-xl transition-all ${wf.is_active ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
              >
                {wf.is_active ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        ))}

        {workflows.length === 0 && (
          <div className="py-40 text-center bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <div className="p-8 bg-white rounded-full shadow-lg inline-block mb-8">
               <PuzzlePieceIcon className="h-16 w-16 text-slate-200" />
             </div>
             <p className="text-xl font-black text-slate-900 tracking-tight">No Automation Cycles Active</p>
             <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-2">Connect data signals to actions to begin orchestrating logic.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">New Automation Rule</h3>
               <button onClick={() => setIsModalOpen(false)}><XMarkIcon className="h-6 w-6 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rule Name</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold"
                  value={newWf.name} onChange={e => setNewWf({...newWf, name: e.target.value})}
                  placeholder="e.g. Notify Manager on High Value Order"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trigger Source (Module)</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold"
                  value={newWf.trigger_module_id} onChange={e => setNewWf({...newWf, trigger_module_id: e.target.value})}
                >
                  <option value="">Select Module...</option>
                  {subModules.map(sm => <option key={sm.id} value={sm.id}>{sm.name}</option>)}
                </select>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold" value={newWf.trigger_event} onChange={e => setNewWf({...newWf, trigger_event: e.target.value as any})}>
                    <option value="on_create">On Create</option>
                    <option value="on_update">On Update</option>
                    <option value="on_delete">On Delete</option>
                  </select>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold" value={newWf.action_type} onChange={e => setNewWf({...newWf, action_type: e.target.value as any})}>
                    <option value="notification">Notification</option>
                    <option value="email">Email</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 mt-4">Deploy Logic Chain</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
