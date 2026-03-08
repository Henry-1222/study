import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { SearchOverlay } from './components/SearchOverlay';
import { geographyData } from './data/geography';
import { biologyData } from './data/biology';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, Sparkles } from 'lucide-react';

export default function App() {
  const [activeSubject, setActiveSubject] = useState<'geo' | 'bio'>('geo');
  const [activeVolumeId, setActiveVolumeId] = useState<string>(geographyData[0].id);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const activeVolume = useMemo(() => {
    const data = activeSubject === 'geo' ? geographyData : biologyData;
    return data.find((v) => v.id === activeVolumeId) || data[0];
  }, [activeSubject, activeVolumeId]);

  const handleSelect = (subject: 'geo' | 'bio', volumeId: string) => {
    setActiveSubject(subject);
    setActiveVolumeId(volumeId);
    setShowWelcome(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchResult = (subject: 'geo' | 'bio', volumeId: string, sectionId: string) => {
    setActiveSubject(subject);
    setActiveVolumeId(volumeId);
    setIsSearchOpen(false);
    setShowWelcome(false);
    
    // Small delay to allow content to render before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar
        activeSubject={activeSubject}
        activeVolumeId={activeVolumeId}
        onSelect={handleSelect}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-indigo-200">
                <GraduationCap size={48} />
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
                生地会考全能复习助手
              </h1>
              <p className="text-xl text-slate-500 max-w-xl leading-relaxed mb-12">
                整合湘教版地理与人教版生物核心知识点，<br />
                为你提供结构化、沉浸式的复习体验。
              </p>
              
              <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                <button
                  onClick={() => handleSelect('geo', geographyData[0].id)}
                  className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">地理复习</h3>
                  <p className="text-slate-500 text-sm">湘教版七上至八下全覆盖，包含经纬网、气候、区域地理等核心考点。</p>
                </button>

                <button
                  onClick={() => handleSelect('bio', biologyData[0].id)}
                  className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-50 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">生物复习</h3>
                  <p className="text-slate-500 text-sm">人教版七上至八下全覆盖，包含细胞、人体系统、遗传进化等核心考点。</p>
                </button>
              </div>
            </motion.div>
          ) : (
            <ContentArea key={activeVolume.id} volume={activeVolume} />
          )}
        </AnimatePresence>
      </main>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onResultClick={handleSearchResult}
      />

      {/* Quick Navigation Floating Button (Mobile/Small screens) */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          <BookOpen size={24} />
        </button>
      </div>
    </div>
  );
}
