
import React, { useState } from 'react';
import { 
  PaperClipIcon, 
  ChatBubbleLeftRightIcon, 
  InformationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface TabProps {
  id: string;
  label: string;
  icon: React.ElementType;
}

const tabs: TabProps[] = [
  { id: 'details', label: 'Details', icon: InformationCircleIcon },
  { id: 'attachments', label: 'Attachments', icon: PaperClipIcon },
  { id: 'comments', label: 'Comments', icon: ChatBubbleLeftRightIcon },
  { id: 'history', label: 'Activity', icon: ClockIcon },
];

interface RecordTabsProps {
  children: (activeTab: string) => React.ReactNode;
}

const RecordTabs: React.FC<RecordTabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        {children(activeTab)}
      </div>
    </div>
  );
};

export default RecordTabs;
