
import React from 'react';
import { SubModuleField } from '../types';
import AttachmentUpload from './AttachmentUpload';

interface DynamicFormProps {
  fields: SubModuleField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialData);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderField = (field: SubModuleField) => {
    const commonClasses = "block w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-slate-900 placeholder-slate-300";
    
    const safeValue = (val: any) => {
      if (val === undefined || val === null) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return val;
    };

    switch (field.field_type) {
      case 'attachment':
        return (
          <div className="p-1">
             <AttachmentUpload 
              label={field.name}
              value={formData[field.db_name]}
              onChange={(url) => handleChange(field.db_name, url)}
            />
          </div>
        );
      case 'select':
        return (
          <select 
            className={commonClasses}
            value={safeValue(formData[field.db_name])}
            onChange={(e) => handleChange(field.db_name, e.target.value)}
            required={field.is_required}
          >
            <option value="">Select Option</option>
            {field.options?.map(opt => {
              const optVal = typeof opt === 'object' ? JSON.stringify(opt) : String(opt);
              const optLabel = typeof opt === 'object' ? (opt.label || optVal) : String(opt);
              return (
                <option key={optVal} value={optVal}>{optLabel}</option>
              );
            })}
          </select>
        );
      case 'boolean':
        return (
          <div 
            className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${
              formData[field.db_name] ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50/30 border-slate-100 hover:border-slate-200'
            }`}
            onClick={() => handleChange(field.db_name, !formData[field.db_name])}
          >
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 tracking-tight">{field.name}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formData[field.db_name] ? 'Active State' : 'Disabled'}</span>
            </div>
            <div className={`h-7 w-12 rounded-full p-1 transition-all duration-300 ${formData[field.db_name] ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30' : 'bg-slate-200'}`}>
              <div className={`bg-white h-5 w-5 rounded-full shadow-md transition-transform duration-300 transform ${formData[field.db_name] ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
        );
      case 'date':
        return (
          <input 
            type="date"
            className={commonClasses}
            value={safeValue(formData[field.db_name])}
            onChange={(e) => handleChange(field.db_name, e.target.value)}
            required={field.is_required}
          />
        );
      case 'number':
        return (
          <input 
            type="number"
            className={commonClasses}
            value={formData[field.db_name] ?? ''}
            onChange={(e) => handleChange(field.db_name, e.target.value === '' ? null : parseFloat(e.target.value))}
            required={field.is_required}
            placeholder="0.00"
          />
        );
      default:
        return (
          <input 
            type="text"
            className={commonClasses}
            value={safeValue(formData[field.db_name])}
            onChange={(e) => handleChange(field.db_name, e.target.value)}
            required={field.is_required}
            placeholder={`Enter ${field.name.toLowerCase()}...`}
          />
        );
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {fields.sort((a,b) => a.sort_order - b.sort_order).map(field => (
          <div key={field.id} className={(field.field_type === 'boolean' || field.field_type === 'attachment') ? 'md:col-span-2' : ''}>
            {field.field_type !== 'boolean' && field.field_type !== 'attachment' && (
              <div className="flex items-center justify-between mb-3 px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {field.name}
                </label>
                {field.is_required && (
                  <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded">Required</span>
                )}
              </div>
            )}
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end space-x-6 pt-10 border-t border-slate-100 mt-12">
        <button 
          type="button"
          onClick={onCancel}
          className="text-xs font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] active:scale-95"
        >
          Discard Changes
        </button>
        <button 
          type="submit"
          className="px-12 py-4 text-xs font-black text-white bg-slate-900 rounded-[1.25rem] hover:bg-black shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-95 transition-all uppercase tracking-[0.3em]"
        >
          {initialData.id ? 'Push Update' : 'Initialize Data'}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
