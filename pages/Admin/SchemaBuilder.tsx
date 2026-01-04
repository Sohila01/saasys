
import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowsUpDownIcon,
  ViewColumnsIcon,
  PlusCircleIcon,
  FolderIcon,
  CheckCircleIcon,
  SparklesIcon,
  // Added missing icons used in the template
  RocketLaunchIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { FieldType, SubModule, SubModuleField, MainModule } from '../../types';
import { api } from '../../services/api';
import { notificationService } from '../../services/NotificationService';

const SchemaBuilderPage: React.FC = () => {
  const [mainModules, setMainModules] = useState<MainModule[]>([]);
  const [subModules, setSubModules] = useState<SubModule[]>([]);
  const [selectedSubModule, setSelectedSubModule] = useState<string>('');
  const [fields, setFields] = useState<Partial<SubModuleField>[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewModuleForm, setShowNewModuleForm] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleCode, setNewModuleCode] = useState('');
  const [parentModuleId, setParentModuleId] = useState('');

  useEffect(() => {
    loadStructure();
  }, []);

  const loadStructure = async () => {
    try {
      const [m, s] = await Promise.all([api.getModules(), api.getSubModules()]);
      setMainModules(m);
      setSubModules(s);
      if (s.length > 0 && !selectedSubModule) setSelectedSubModule(s[0].id);
    } catch (err) {
      notificationService.notify('Kernel Access Error', 'Unable to retrieve existing schema structure.', 'error');
    }
  };

  useEffect(() => {
    const loadFields = async () => {
      if (!selectedSubModule) return;
      try {
        const f = await api.getFields(selectedSubModule);
        setFields(f);
      } catch (err) {
        notificationService.notify('Data Sync Failed', 'Sub-module fields could not be fetched.', 'error');
      }
    };
    loadFields();
  }, [selectedSubModule]);

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName || !newModuleCode || !parentModuleId) return;
    
    try {
      const created = await api.createSubModule({
        name: newModuleName,
        code: newModuleCode,
        main_module_id: parentModuleId,
        settings: {}
      });
      await loadStructure();
      setSelectedSubModule(created.id);
      setShowNewModuleForm(false);
      setNewModuleName('');
      setNewModuleCode('');
      notificationService.notify('New Module Initialized', `${newModuleName} protocol has been deployed.`, 'success');
      window.dispatchEvent(new Event('storage')); // Refresh sidebar
    } catch (err) {
      notificationService.notify('Initialization Error', 'The specified module code may already exist within this tenant.', 'error');
    }
  };

  const addField = () => {
    const newField: Partial<SubModuleField> = {
      id: 'temp_' + Math.random().toString(36).substr(2, 9),
      name: 'New Property',
      db_name: 'prop_' + Math.floor(Math.random() * 1000),
      field_type: 'text',
      is_required: false,
      is_visible_in_list: true,
      sort_order: fields.length + 1
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<SubModuleField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSave = async () => {
    if (!selectedSubModule) return;
    setIsSaving(true);
    try {
      await api.saveSchema(selectedSubModule, fields as SubModuleField[]);
      notificationService.notify('Schema Deployment Successful', 'All data structural changes have been synchronized.', 'success');
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      notificationService.notify('Deployment Rejected', 'System kernel refused the structural changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 text-white">
                <RocketLaunchIcon className="h-6 w-6 stroke-[2]" />
             </div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Data Architect</h1>
           </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] mt-1 text-[10px] ml-1">Universal Schema Configuration Engine</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowNewModuleForm(true)}
            className="bg-white border border-slate-200 text-slate-600 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
          >
            Create New Business Unit
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || !selectedSubModule}
            className="bg-slate-900 text-white px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-900/20 active:scale-95 disabled:opacity-50 flex items-center space-x-2"
          >
            {isSaving ? 'Synchronizing Cluster...' : <><CheckIcon className="h-4 w-4 stroke-[3]" /><span>Deploy Changes</span></>}
          </button>
        </div>
      </div>

      {showNewModuleForm && (
        <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500 border border-white/10">
           <div className="relative z-10">
            <h3 className="text-2xl font-black text-white tracking-tight mb-8 italic">New Subsystem Initializer</h3>
            <form onSubmit={handleCreateModule} className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Semantic Name</label>
                <input value={newModuleName} onChange={e => setNewModuleName(e.target.value)} type="text" className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-4 focus:ring-white/10 focus:bg-white/15 transition-all" placeholder="e.g., Asset Intelligence" />
              </div>
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Functional Code (Key)</label>
                <input value={newModuleCode} onChange={e => setNewModuleCode(e.target.value)} type="text" className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-4 focus:ring-white/10 focus:bg-white/15 transition-all" placeholder="e.g., asset_intel" />
              </div>
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Parent Category Cluster</label>
                <select value={parentModuleId} onChange={e => setParentModuleId(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-4 focus:ring-white/10 focus:bg-white/15 transition-all">
                  <option value="" className="text-slate-900">Select Category</option>
                  {mainModules.map(m => <option key={m.id} value={m.id} className="text-slate-900">{m.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-3 flex justify-end items-center space-x-6 pt-4">
                <button type="button" onClick={() => setShowNewModuleForm(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Discard Draft</button>
                <button type="submit" className="bg-white text-slate-900 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-all">Launch Module</button>
              </div>
            </form>
          </div>
          <div className="absolute top-0 right-0 h-64 w-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        </div>
      )}

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
        <div className="px-12 py-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-50 rounded-2xl">
                <ViewColumnsIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="font-black text-slate-900 text-xl tracking-tight uppercase tracking-tighter">Selected Architecture:</h2>
            </div>
            <select 
              value={selectedSubModule}
              onChange={(e) => setSelectedSubModule(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer hover:border-indigo-300"
            >
              {subModules.map(sm => (
                <option key={sm.id} value={sm.id}>{sm.name.toUpperCase()} (/{sm.code})</option>
              ))}
            </select>
          </div>
          <button 
            onClick={addField}
            disabled={!selectedSubModule}
            className="flex items-center space-x-3 text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-all disabled:opacity-30 group"
          >
            <PlusCircleIcon className="h-6 w-6 group-hover:rotate-90 transition-transform" />
            <span className="uppercase tracking-widest">Inject Property</span>
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {fields.map((field) => (
            <div key={field.id} className="px-12 py-10 group hover:bg-slate-50/50 transition-all duration-300">
              <div className="flex items-start space-x-10">
                <div className="pt-10 flex flex-col items-center space-y-4">
                  <ArrowsUpDownIcon className="h-5 w-5 text-slate-200 group-hover:text-indigo-400 cursor-move transition-colors" />
                  <span className="text-[10px] font-black text-slate-100 group-hover:text-slate-300 tabular-nums">#{field.sort_order}</span>
                </div>
                
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-3 space-y-2">
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Display Descriptor</label>
                      <input 
                        type="text" 
                        value={field.name}
                        onChange={(e) => updateField(field.id!, { name: e.target.value })}
                        className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all border-b-2 focus:border-b-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Logical Reference (Key)</label>
                      <input 
                        type="text" 
                        value={field.db_name}
                        onChange={(e) => updateField(field.id!, { db_name: e.target.value })}
                        className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all border-b-2 focus:border-b-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Modality Type</label>
                      <select 
                        value={field.field_type}
                        onChange={(e) => updateField(field.id!, { field_type: e.target.value as FieldType })}
                        className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer border-b-2 focus:border-b-indigo-500"
                      >
                        <option value="text">Character Data</option>
                        <option value="number">Numeric Scalar</option>
                        <option value="date">Temporal Value</option>
                        <option value="select">Categorical Menu</option>
                        <option value="boolean">Logical Binary</option>
                        <option value="attachment">Binary Asset</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 flex items-center justify-between pt-10 px-2">
                      <label className="flex items-center space-x-3 cursor-pointer group/check">
                        <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${field.is_required ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/30' : 'bg-white border-slate-200 hover:border-indigo-400'}`}>
                           <input 
                            type="checkbox" 
                            checked={field.is_required}
                            onChange={(e) => updateField(field.id!, { is_required: e.target.checked })}
                            className="hidden"
                          />
                          {field.is_required && <CheckCircleIcon className="h-4 w-4 text-white" />}
                        </div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Mandatory</span>
                      </label>
                      <button 
                        onClick={() => removeField(field.id!)}
                        className="p-3 text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                      >
                        <TrashIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!selectedSubModule && (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="bg-indigo-50 h-32 w-32 rounded-[3rem] flex items-center justify-center mb-10 border border-indigo-100 shadow-inner">
                <SparklesIcon className="h-16 w-16 text-indigo-200" />
              </div>
              <h3 className="font-black text-slate-900 text-3xl tracking-tight mb-4 italic underline decoration-indigo-200">System Ready for Mapping</h3>
              <p className="text-slate-400 text-sm font-bold max-w-sm mx-auto uppercase tracking-widest leading-loose">Choose an operational cluster or initialize a new unit to begin structural definition.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemaBuilderPage;
