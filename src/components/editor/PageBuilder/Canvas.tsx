"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutTemplate, 
  MoreHorizontal, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Copy,
  PlusCircle,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  CheckCircle2,
  HelpCircle,
  Hash,
  FlipHorizontal,
  Info as InfoIcon,
  Quote,
  X,
  Type,
  Monitor,
  Layout,
  Code,
  History,
  Settings,
  AppWindow,
  MoreVertical
} from 'lucide-react';
import RichTextBlock from './blocks/RichTextBlock';
import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from '@/components/animate-ui/components/base/accordion';
import { Popover, PopoverTrigger, PopoverPanel } from '@/components/animate-ui/components/base/popover';

interface Page {
  id: string;
  title: string;
  layout: string;
  content: any;
}

interface CanvasProps {
  page: Page;
  onUpdatePage: (updates: Partial<Page>) => void;
  onOpenLayoutChooser: () => void;
}

export default function Canvas({ page, onUpdatePage, onOpenLayoutChooser }: CanvasProps) {
  const [activeTab, setActiveTab] = useState('TEXT');

  const TABS = ['TEXT', 'MEDIA', 'INTERACTIVE', 'TABS'];
  
  const QUICK_ACTIONS = [
    { label: 'CANVAS', icon: AppWindow },
    { label: 'PROPERTIES', icon: Settings },
    { label: 'CODE', icon: Code, active: true },
    { label: 'VERSION', icon: History },
    { label: 'SETUP', icon: Settings },
  ];

  const renderLayoutContent = () => {
    switch (page.layout) {
      case 'image-text-right':
        return (
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <RichTextBlock 
                content={page.content?.text || ""}
                onChange={(html) => onUpdatePage({ content: { ...page.content, text: html } })}
              />
            </div>
            <div className="w-full md:w-[45%] shrink-0">
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="aspect-square rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 overflow-hidden relative group"
               >
                  {page.content?.image ? (
                    <img src={page.content.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                       <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-[#00685f]" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#131b2e]">Upload Image</p>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <button className="p-2 bg-white rounded-xl shadow-lg hover:bg-slate-50 transition-colors">
                      <MoreVertical className="w-4 h-4 text-[#131b2e]" />
                    </button>
                  </div>
               </motion.div>
            </div>
          </div>
        );

      case 'key-points':
        return (
          <div className="space-y-12">
            <h1 className="text-4xl font-black text-[#131b2e] tracking-tighter uppercase leading-none">
              {page.content?.title || "Key Takeaways"}
            </h1>
            <div className="grid gap-4">
               {(page.content?.points || ['', '', '']).map((point: string, idx: number) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-[#00685f]/20 hover:bg-white transition-all group"
                 >
                    <div className="w-12 h-12 rounded-2xl bg-[#00685f] shadow-lg shadow-[#00685f]/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <input 
                      type="text" 
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...(page.content?.points || [])];
                        newPoints[idx] = e.target.value;
                        onUpdatePage({ content: { ...page.content, points: newPoints } });
                      }}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-black text-[#131b2e] placeholder-slate-200"
                      placeholder="Enter a key point..."
                    />
                 </motion.div>
               ))}
            </div>
          </div>
        );

      // Other layouts remain similar but wrapped in the new canvas style in the return
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
             <LayoutTemplate className="w-20 h-20 text-slate-100 mb-6" />
             <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Select a block to begin</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-12 pb-40">
      {/* --- Actual Canvas Sheet --- */}
      <div className="bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-200 relative">
        <div className="h-2 w-full bg-[#00685f]" />
        
        <div className="p-16">
          {/* Header Area */}
          <div className="mb-12">
            <input 
              type="text"
              value={page.title}
              onChange={(e) => onUpdatePage({ title: e.target.value })}
              className="w-full text-5xl font-black text-[#131b2e] bg-transparent border-none focus:ring-0 p-0 tracking-tighter"
            />
            <div className="w-24 h-1 bg-[#00685f] mt-4 rounded-full" />
          </div>

          <div className="relative min-h-[400px]">
            {renderLayoutContent()}
          </div>
        </div>
      </div>

      {/* --- MagicBento Layout Section (Add New Block) --- */}
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center space-y-2">
           <h2 className="text-xl font-black text-[#131b2e] uppercase tracking-tighter">MagicBento Layout</h2>
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select a pattern to add a new content block</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-2 flex items-center shadow-lg border border-slate-100">
           {TABS.map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all
                 ${activeTab === tab 
                   ? 'bg-[#00685f] text-white shadow-lg shadow-[#00685f]/20' 
                   : 'text-slate-400 hover:text-[#131b2e]'
                 }
               `}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* Bottom Quick Actions Dock */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-4 flex items-center gap-2 shadow-2xl">
           {QUICK_ACTIONS.map((action) => (
             <button 
               key={action.label}
               className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all group
                 ${action.active 
                   ? 'bg-[#00685f] text-white shadow-xl shadow-[#00685f]/20' 
                   : 'hover:bg-slate-50 text-slate-400 hover:text-[#131b2e]'
                 }
               `}
             >
               <action.icon className={`w-5 h-5 ${action.active ? 'text-white' : 'group-hover:text-[#00685f]'}`} />
               <span className={`text-[9px] font-black uppercase tracking-widest ${action.active ? 'text-white' : 'text-slate-400'}`}>
                 {action.label}
               </span>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
