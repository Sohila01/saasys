
import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { supabase } from '../services/supabase';
import { notificationService } from '../services/NotificationService';

interface AttachmentUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
}

const AttachmentUpload: React.FC<AttachmentUploadProps> = ({ value, onChange, label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      notificationService.notify('Asset Synchronized', `${file.name} uploaded successfully.`, 'success');
    } catch (err: any) {
      console.error('Upload error:', err);
      notificationService.notify('Upload Failed', 'Storage cluster rejected the file.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
      
      {!value ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all cursor-pointer group bg-slate-50/50 ${
            isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-400 hover:bg-white'
          }`}
          onClick={() => {
            if (uploading) return;
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e: any) => { if (e.target.files[0]) handleFile(e.target.files[0]); };
            input.click();
          }}
        >
          {uploading ? (
            <ArrowPathIcon className="h-10 w-10 text-indigo-600 mx-auto mb-4 animate-spin" />
          ) : (
            <CloudArrowUpIcon className="h-10 w-10 text-slate-300 mx-auto mb-4 group-hover:text-indigo-600 transition-colors" />
          )}
          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
            {uploading ? 'Processing Signal...' : 'Transmit Binary Asset'}
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest italic">PDF, PNG, JPG (LIMIT 5MB)</p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-5 bg-indigo-50 border border-indigo-100 rounded-[1.5rem] animate-in zoom-in-95">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <DocumentIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-xs font-black text-indigo-900 truncate block max-w-[200px] uppercase tracking-tight">
                {value.split('/').pop()?.slice(0, 20)}...
              </span>
              <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Asset Active</p>
            </div>
          </div>
          <button 
            onClick={() => onChange('')} 
            className="p-3 hover:bg-rose-100 text-rose-400 rounded-xl transition-all active:scale-90"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AttachmentUpload;
