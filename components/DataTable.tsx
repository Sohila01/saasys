
import React from 'react';
import { SubModuleField, SubModuleRecord } from '../types';
import { 
  EllipsisVerticalIcon, 
  ChevronRightIcon, 
  PaperClipIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';

interface DataTableProps {
  fields: SubModuleField[];
  records: SubModuleRecord[];
  onRowClick?: (record: SubModuleRecord) => void;
  onEdit?: (record: SubModuleRecord) => void;
}

const DataTable: React.FC<DataTableProps> = ({ fields, records, onRowClick, onEdit }) => {
  const visibleFields = fields
    .filter(f => f.is_visible_in_list)
    .sort((a, b) => a.sort_order - b.sort_order);

  const renderCellValue = (record: SubModuleRecord, field: SubModuleField) => {
    const value = record.data?.[field.db_name];
    
    if (value === undefined || value === null) return <span className="text-slate-300">—</span>;

    // PREVENT [object Object]: Check for objects/arrays before specific type rendering
    if (typeof value === 'object' && !(value instanceof Date)) {
      return (
        <div className="flex items-center space-x-2">
           <span className="text-[9px] font-black bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-widest border border-slate-200">JSON</span>
           <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{JSON.stringify(value)}</span>
        </div>
      );
    }
    
    if (field.field_type === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          value ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${value ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
          {value ? 'Active' : 'Inactive'}
        </span>
      );
    }
    
    if (field.field_type === 'date') {
      try {
        const date = new Date(value as string);
        if (isNaN(date.getTime())) return <span className="text-slate-600 font-semibold">{String(value)}</span>;
        return (
          <span className="text-slate-600 font-semibold tabular-nums">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        );
      } catch {
        return <span className="text-slate-600 font-semibold">{String(value)}</span>;
      }
    }

    if (field.field_type === 'attachment' && typeof value === 'string' && value.length > 0) {
      return (
        <div className="flex items-center space-x-2 text-indigo-600 font-bold bg-indigo-50/50 px-2 py-1 rounded-lg w-fit">
          <PaperClipIcon className="h-3.5 w-3.5" />
          <span className="text-[11px] uppercase tracking-tight">View File</span>
        </div>
      );
    }
    
    return <span className="text-slate-900 font-bold tracking-tight truncate block max-w-xs">{String(value)}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Table Header Wrapper */}
      <div className="hidden lg:grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))_100px] gap-4 px-10 py-5 bg-white/50 rounded-2xl border border-slate-200/60 mb-2">
        {visibleFields.map(field => (
          <div key={field.id} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
            {field.name}
          </div>
        ))}
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-right pr-4">Commands</div>
      </div>

      <div className="space-y-3">
        {records.length > 0 ? (
          records.map(record => (
            <div 
              key={record.id}
              onClick={() => onRowClick?.(record)}
              className="group glass-card hover:bg-white hover:border-indigo-200/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer rounded-[1.75rem] relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))_100px] gap-4 items-center px-10 py-6">
                {visibleFields.map(field => (
                  <div key={field.id} className="flex flex-col lg:block overflow-hidden">
                    <span className="lg:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{field.name}</span>
                    <div className="truncate">{renderCellValue(record, field)}</div>
                  </div>
                ))}
                
                <div className="flex items-center justify-end space-x-3 pr-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(record);
                    }}
                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                  <ChevronRightIcon className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1.5 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[3rem] border border-slate-100 py-32 text-center flex flex-col items-center justify-center space-y-6 shadow-sm">
            <div className="p-8 bg-slate-50 rounded-[2rem] animate-pulse">
              <CircleStackIcon className="h-16 w-16 text-slate-200" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-slate-900 tracking-tight">Ecosystem Dormant</p>
              <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">No records were discovered within the specified module parameters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
