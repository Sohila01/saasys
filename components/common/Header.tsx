
import React, { useState } from 'react';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { User } from '../../types';
import NotificationCenter from '../NotificationCenter';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      <header className="h-20 flex items-center justify-between px-10 z-40 shrink-0 bg-white/40 backdrop-blur-md border-b border-white/50">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search intelligence, records, or entities..."
              className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none placeholder:text-slate-400 placeholder:font-semibold"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 opacity-0 group-focus-within:opacity-100 transition-opacity">
               <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">⌘K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all active:scale-95 group">
            <SparklesIcon className="h-5 w-5 group-hover:animate-pulse" />
          </button>
          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all active:scale-95">
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => setIsNotifOpen(true)}
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all active:scale-95 relative"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-3.5 right-3.5 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white animate-bounce shadow-sm"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200/60 mx-3"></div>

          <button className="flex items-center space-x-3 pl-2 pr-4 py-2 hover:bg-white rounded-2xl transition-all group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                <UserCircleIcon className="h-8 w-8 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-black text-slate-900 tracking-tight">{user.full_name}</p>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{user.role.replace('_', ' ')}</p>
            </div>
          </button>
        </div>
      </header>
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};

export default Header;
