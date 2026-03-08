import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Tag, Hash } from 'lucide-react';
import { TextbookVolume } from '../data/geography';

interface ContentAreaProps {
  volume: TextbookVolume;
}

export const ContentArea: React.FC<ContentAreaProps> = ({ volume }) => {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={volume.id}
        className="space-y-12"
      >
        <header className="border-b border-slate-200 pb-8">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-2">
            <Hash size={16} />
            <span>{volume.id.startsWith('geo') ? '地理' : '生物'}</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{volume.name}</h2>
          <p className="text-slate-500 mt-2">点击下方章节查看详细知识点</p>
        </header>

        <div className="space-y-16">
          {volume.sections.map((section, idx) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  {section.title}
                </h3>
                <div className="flex gap-2">
                  {section.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider rounded-md">
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 markdown-body">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </section>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
