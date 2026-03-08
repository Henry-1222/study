import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Map, Microscope, ChevronRight, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { geographyData } from '../data/geography';
import { biologyData } from '../data/biology';

interface SidebarProps {
  activeSubject: 'geo' | 'bio';
  activeVolumeId: string;
  onSelect: (subject: 'geo' | 'bio', volumeId: string) => void;
  onSearchClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSubject,
  activeVolumeId,
  onSelect,
  onSearchClick,
}) => {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <BookOpen size={20} />
          </div>
          <h1 className="font-bold text-xl tracking-tight">生地会考助手</h1>
        </div>

        <button
          onClick={onSearchClick}
          className="w-full flex items-center gap-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors text-sm"
        >
          <Search size={16} />
          <span>搜索知识点...</span>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-8">
        {/* Geography Section */}
        <div>
          <div className="flex items-center gap-2 px-2 mb-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">
            <Map size={14} />
            <span>地理 (湘教版)</span>
          </div>
          <div className="space-y-1">
            {geographyData.map((vol) => (
              <button
                key={vol.id}
                onClick={() => onSelect('geo', vol.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group",
                  activeSubject === 'geo' && activeVolumeId === vol.id
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <span>{vol.name}</span>
                <ChevronRight
                  size={14}
                  className={cn(
                    "transition-transform",
                    activeSubject === 'geo' && activeVolumeId === vol.id ? "rotate-90" : "opacity-0 group-hover:opacity-100"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Biology Section */}
        <div>
          <div className="flex items-center gap-2 px-2 mb-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">
            <Microscope size={14} />
            <span>生物 (人教版)</span>
          </div>
          <div className="space-y-1">
            {biologyData.map((vol) => (
              <button
                key={vol.id}
                onClick={() => onSelect('bio', vol.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group",
                  activeSubject === 'bio' && activeVolumeId === vol.id
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <span>{vol.name}</span>
                <ChevronRight
                  size={14}
                  className={cn(
                    "transition-transform",
                    activeSubject === 'bio' && activeVolumeId === vol.id ? "rotate-90" : "opacity-0 group-hover:opacity-100"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
        © 2024 生地会考全能复习助手
      </div>
    </aside>
  );
};
