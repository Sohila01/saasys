
import React, { useState, useEffect } from 'react';
import { XMarkIcon, InboxIcon, PaperAirplaneIcon, ClockIcon } from '@heroicons/react/24/outline';
import RecordTabs from './RecordTabs';
import { SubModuleRecord, SubModuleField } from '../types';

interface Comment {
  id: string;
  user: string;
  text: string;
  time: string;
}

interface RecordDetailProps {
  isOpen: boolean;
  onClose: () => void;
  record: SubModuleRecord | null;
  fields: SubModuleField[];
}

const RecordDetail: React.FC<RecordDetailProps> = ({ isOpen, onClose, record, fields }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (record) {
      // Load mocked comments for this specific record
      const key = `nexus_comments_${record.id}`;
      const saved = localStorage.getItem(key);
      setComments(saved ? JSON.parse(saved) : []);
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      user: 'Admin User',
      text: commentText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`nexus_comments_${record.id}`, JSON.stringify(updated));
    setCommentText('');
  };

  const renderValue = (val: any, type: string) => {
    if (val === null || val === undefined) return <span className="text-slate-300 italic">No value provided</span>;
    
    // Check if the value is an object or array to avoid rendering [object Object]
    if (typeof val === 'object' && !(val instanceof Date)) {
      return (
        <pre className="text-slate-900 font-mono text-xs bg-slate-100 p-4 rounded-xl overflow-x-auto border border-slate-200">
          {JSON.stringify(val, null, 2)}
        </pre>
      );
    }

    if (type === 'attachment') return <a href={val as string} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">Open File Asset</a>;

    return <span className="text-slate-900 font-medium whitespace-pre-wrap">{String(val)}</span>;
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-md" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl animate-in slide-in-from-right duration-500">
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Record Intelligence</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase tracking-widest">ID: {record.id.slice(0, 8)}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <XMarkIcon className="h-6 w-6 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <RecordTabs>
              {(activeTab) => (
                <div className="h-full">
                  {activeTab === 'details' && (
                    <div className="grid grid-cols-1 gap-8 animate-in fade-in py-4">
                      {fields.map((f) => (
                        <div key={f.id} className="space-y-2 group">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{f.name}</label>
                          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                            {renderValue(record.data?.[f.db_name], f.field_type)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'comments' && (
                    <div className="flex flex-col h-full space-y-6 animate-in fade-in py-4">
                      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {comments.map((c) => (
                          <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{c.user}</span>
                              <span className="text-[10px] text-slate-400 font-bold">{c.time}</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">{c.text}</p>
                          </div>
                        ))}
                        {comments.length === 0 && (
                          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
                            <InboxIcon className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                            <p className="text-sm text-slate-400 font-bold tracking-tight">No collaborative threads discovered.</p>
                          </div>
                        )}
                      </div>
                      <div className="pt-6 border-t border-slate-100">
                        <div className="relative">
                          <textarea 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add strategic context..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pr-16 text-sm focus:bg-white focus:border-indigo-500 transition-all outline-none resize-none"
                            rows={3}
                          />
                          <button 
                            onClick={handleAddComment}
                            className="absolute right-4 bottom-4 p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-black active:scale-90 transition-all"
                          >
                            <PaperAirplaneIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'history' && (
                    <div className="space-y-8 animate-in fade-in py-4">
                       <div className="flex items-start space-x-6 relative">
                        <div className="absolute left-2.5 top-8 bottom-[-20px] w-0.5 bg-slate-100" />
                        <div className="h-5 w-5 rounded-full bg-emerald-500 border-4 border-white shadow-md z-10 shrink-0" />
                        <div className="flex-1 pb-8">
                          <p className="text-sm font-black text-slate-900 tracking-tight">Ecosystem Sync</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">Record was automatically synchronized with the tenant primary engine.</p>
                          <p className="text-[10px] text-slate-400 font-black mt-2 uppercase tracking-widest">{new Date(record.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </RecordTabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;
