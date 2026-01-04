
import React, { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  PaintBrushIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const TenantSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tenant Settings</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage organization profile and system preferences</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
          Save Changes
        </button>
      </div>

      <div className="flex bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Navigation */}
        <div className="w-64 border-r border-gray-100 p-4 shrink-0">
          {[
            { id: 'general', label: 'Organization', icon: BuildingOfficeIcon },
            { id: 'branding', label: 'Branding', icon: PaintBrushIcon },
            { id: 'domain', label: 'Domain & SSL', icon: GlobeAltIcon },
            { id: 'security', label: 'Security', icon: ShieldCheckIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all mb-1 ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600 font-bold' 
                  : 'text-gray-500 hover:bg-gray-50 font-medium'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Form Area */}
        <div className="flex-1 p-8">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Organization Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium" defaultValue="Nexus Global Corp" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Support Email</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium" defaultValue="support@nexus.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Timezone</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium">
                    <option>UTC (London)</option>
                    <option>EST (New York)</option>
                    <option>PST (Los Angeles)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Platform Logo</label>
                <div className="flex items-center space-x-6">
                  <div className="h-24 w-24 bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <PaintBrushIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <button className="px-6 py-2 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50">Upload New</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input type="color" className="h-10 w-10 border-none rounded-lg cursor-pointer" defaultValue="#4f46e5" />
                    <span className="text-sm font-bold text-gray-700">#4F46E5</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="space-y-6">
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center space-x-3 text-indigo-600 mb-2">
                  <GlobeAltIcon className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">Active Subdomain</span>
                </div>
                <p className="text-2xl font-black text-indigo-900">nexus-global.nexusplatform.io</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Custom Domain (CNAME)</label>
                <div className="flex space-x-3">
                  <input type="text" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium" placeholder="app.yourdomain.com" />
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold">Connect</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantSettings;
