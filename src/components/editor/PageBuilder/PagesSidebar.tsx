"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, FileText, HelpCircle, BookOpen, Clock, Layout } from 'lucide-react';
import { ScrollStack, ScrollStackItem } from '@/components/reactbits/ScrollStack/ScrollStack';

interface Page {
  id: string;
  title: string;
}

interface PagesSidebarProps {
  pages: Page[];
  activePageId: string;
  onPageSelect: (id: string) => void;
  onAddPage: () => void;
  onDeletePage: (id: string) => void;
}

export default function PagesSidebar({
  pages,
  activePageId,
  onPageSelect,
  onAddPage,
  onDeletePage,
}: PagesSidebarProps) {
  return (
    <div className="w-[280px] flex-shrink-0 bg-white border-r border-slate-200 h-full flex flex-col z-20">
      {/* Sidebar Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[12px] font-black tracking-[0.2em] text-[#131b2e] uppercase">
            PAGES
          </h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
            {pages.length} Total
          </span>
        </div>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {pages.map((page, index) => {
          const isActive = page.id === activePageId;
          return (
            <div key={page.id} className="relative group">
              <motion.div
                onClick={() => onPageSelect(page.id)}
                className={`
                  flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 relative
                  ${isActive 
                    ? 'bg-[#ebfaf8]' 
                    : 'hover:bg-slate-50'
                  }
                `}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div 
                    layoutId="activeBar"
                    className="absolute right-0 top-1 bottom-1 w-1 bg-[#00685f] rounded-full"
                  />
                )}

                {/* Thumbnail */}
                <div className={`
                  w-14 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border
                  ${isActive ? 'bg-[#00685f]/10 border-[#00685f]/20' : 'bg-slate-100 border-slate-200'}
                `}>
                  <Layout className={`w-5 h-5 ${isActive ? 'text-[#00685f]' : 'text-slate-400'}`} />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <h4 className={`text-[13px] font-black truncate leading-tight ${isActive ? 'text-[#00685f]' : 'text-[#131b2e]'}`}>
                    {page.title}
                  </h4>
                  <p className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                    <Clock className="w-3 h-3" /> Modified 2m ago
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePage(page.id);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all text-slate-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-6 space-y-4 border-t border-slate-100">
        <button
          onClick={onAddPage}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-slate-100 rounded-xl text-[#131b2e] text-[12px] font-black hover:border-[#00685f]/30 hover:bg-[#ebfaf8]/20 transition-all uppercase tracking-widest shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#00685f]" />
          Add New Page
        </button>

        <div className="space-y-4 pt-4">
           <button className="flex items-center gap-3 w-full text-slate-400 hover:text-[#131b2e] transition-colors group">
              <HelpCircle className="w-5 h-5 group-hover:text-[#00685f]" />
              <span className="text-[11px] font-black uppercase tracking-widest">Support</span>
           </button>
           <button className="flex items-center gap-3 w-full text-slate-400 hover:text-[#131b2e] transition-colors group">
              <BookOpen className="w-5 h-5 group-hover:text-[#00685f]" />
              <span className="text-[11px] font-black uppercase tracking-widest">User Guide</span>
           </button>
        </div>
      </div>
    </div>
  );
}
