import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight } from 'lucide-react';
import { geographyData } from '../data/geography';
import { biologyData } from '../data/biology';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (subject: 'geo' | 'bio', volumeId: string, sectionId: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onResultClick }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const all = [
      ...geographyData.map(v => ({ ...v, subject: 'geo' as const })),
      ...biologyData.map(v => ({ ...v, subject: 'bio' as const }))
    ];

    const matched = [];
    for (const vol of all) {
      for (const sec of vol.sections) {
        if (
          sec.title.toLowerCase().includes(q) ||
          sec.content.toLowerCase().includes(q) ||
          sec.tags.some(t => t.toLowerCase().includes(q))
        ) {
          matched.push({
            subject: vol.subject,
            volumeId: vol.id,
            volumeName: vol.name,
            sectionId: sec.id,
            sectionTitle: sec.title
          });
        }
      }
    }
    return matched.slice(0, 8);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-4 border-b border-slate-100 flex items-center gap-4">
              <Search className="text-slate-400" size={20} />
              <input
                autoFocus
                placeholder="搜索知识点、关键词、章节..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-slate-800 placeholder:text-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((res) => (
                    <button
                      key={`${res.volumeId}-${res.sectionId}`}
                      onClick={() => onResultClick(res.subject, res.volumeId, res.sectionId)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group text-left"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter",
                            res.subject === 'geo' ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"
                          )}>
                            {res.subject === 'geo' ? '地理' : '生物'}
                          </span>
                          <span className="text-xs text-slate-400">{res.volumeName}</span>
                        </div>
                        <div className="text-slate-800 font-medium">{res.sectionTitle}</div>
                      </div>
                      <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </button>
                  ))}
                </div>
              ) : query ? (
                <div className="p-12 text-center text-slate-400">
                  未找到相关内容，请尝试其他关键词
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  输入关键词开始搜索...
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Helper for SearchOverlay
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
