
import React, { useState } from 'react';
// useParams is core routing logic, available in react-router
import { useParams } from 'react-router';
import { 
  PlusIcon, XMarkIcon, MagnifyingGlassIcon, FunnelIcon,
  SparklesIcon, ArrowPathIcon
} from '@heroicons/react/24/outline';
import DataTable from '../components/DataTable';
import DynamicForm from '../components/DynamicForm';
import RecordDetail from '../components/RecordDetail';
import { useSchema } from '../hooks/useSchema';
import { useDynamicData } from '../hooks/useDynamicData';
import { geminiService } from '../services/gemini';
import { SubModuleRecord } from '../types';

const GenericModulePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { subModule, fields, loading: schemaLoading } = useSchema(code);
  const { records, addRecord, updateRecord, loading: dataLoading, error } = useDynamicData(code);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SubModuleRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<SubModuleRecord | null>(null);
  
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const analyzeData = async () => {
    if (!subModule) return;
    setIsAiLoading(true);
    try {
      const prompt = `Analyze these records for the module "${subModule.name}". 
      Schema includes fields: ${fields.map(f => f.name).join(', ')}.
      Records: ${JSON.stringify(records.map(r => r.data))}.
      Please provide 3 specific business insights or potential risks detected in this data.`;
      
      const insight = await geminiService.getCustomAnalysis(prompt);
      setAiInsight(insight || "Analysis complete but no insights generated.");
    } catch {
      setAiInsight("Unable to connect to intelligence core.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingRecord) {
        await updateRecord(editingRecord.id, data);
      } else {
        await addRecord(data);
      }
      setIsModalOpen(false);
      setEditingRecord(null);
    } catch (err) {
      console.error("Operation failed:", err);
    }
  };

  const handleRowClick = (record: SubModuleRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleEdit = (record: SubModuleRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  if (schemaLoading || (dataLoading && records.length === 0)) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="h-20 w-20 border-4 border-indigo-100 rounded-full animate-ping absolute inset-0"></div>
        <div className="h-20 w-20 border-t-4 border-indigo-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-10 text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Decrypting Protocol...</p>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
             <div className="mesh-gradient p-2.5 rounded-2xl shadow-lg shadow-indigo-600/20">
              <PlusIcon className="h-5 w-5 text-white stroke-[3]" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{subModule?.name || code}</h1>
          </div>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest pl-12">Organization Data Repository</p>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={analyzeData}
            disabled={isAiLoading || records.length === 0}
            className="flex items-center space-x-3 px-6 py-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] hover:bg-indigo-100 transition-all border border-indigo-100 active:scale-95 disabled:opacity-50"
          >
            {isAiLoading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <SparklesIcon className="h-4 w-4" />}
            <span className="text-[10px] font-black uppercase tracking-widest">AI Intelligence</span>
          </button>
          <button 
            className="flex items-center space-x-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] hover:bg-black transition-all shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/20 active:scale-95" 
            onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
          >
            <PlusIcon className="h-4 w-4 stroke-[4]" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">New Record</span>
          </button>
        </div>
      </div>

      {aiInsight && (
        <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white animate-in slide-in-from-top-4 duration-500 border border-white/10 relative overflow-hidden group">
           <button onClick={() => setAiInsight(null)} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors">
              <XMarkIcon className="h-6 w-6" />
           </button>
           <div className="flex items-start space-x-6 relative z-10">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30">
                 <SparklesIcon className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-2">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Nexus AI Intelligence Report</p>
                 <div className="text-sm font-medium leading-relaxed italic text-slate-200">
                    {aiInsight}
                 </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700"></div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="pb-20">
        <DataTable 
          fields={fields} 
          records={records} 
          onRowClick={handleRowClick}
          onEdit={handleEdit}
        />
      </div>

      <RecordDetail 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        record={selectedRecord} 
        fields={fields} 
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-white/20">
            <div className="px-12 py-10 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="space-y-1">
                 <div className="flex items-center space-x-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${editingRecord ? 'bg-amber-400 animate-pulse' : 'bg-indigo-600'}`}></span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      {editingRecord ? `Data Modification` : `Data Integration`}
                    </h2>
                 </div>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] ml-6">
                   Subsystem: {subModule?.name || code}
                 </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-4 hover:bg-slate-100 rounded-[1.25rem] transition-all active:scale-90"
              >
                <XMarkIcon className="h-7 w-7 text-slate-400" />
              </button>
            </div>
            
            <div className="p-12 overflow-y-auto custom-scrollbar bg-white/50">
              <DynamicForm 
                fields={fields} 
                initialData={editingRecord?.data}
                onSubmit={handleSubmit}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericModulePage;
