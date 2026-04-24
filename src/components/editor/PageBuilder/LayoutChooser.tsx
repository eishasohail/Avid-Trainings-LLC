"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Check,
  Type, List, Quote, CheckCircle2, Image as ImageIcon,
  Video, Music, LayoutTemplate, ChevronDown,
  HelpCircle, CheckSquare, CreditCard, GripVertical,
  MousePointer2, Shuffle, Plus, ArrowRight
} from 'lucide-react';

const LAYOUTS = [
  {
    id: 'text-only', name: 'Text Only', category: 'Text',
    desc: 'Standard reading experience', color: '#00685f',
    icon: Type, size: 'wide'
  },
  {
    id: 'bullet-points', name: 'Bullet Points', category: 'Text',
    desc: 'Organized list format', color: '#00685f',
    icon: List, size: 'normal'
  },
  {
    id: 'quote-block', name: 'Quote Block', category: 'Text',
    desc: 'Emphasized statement', color: '#00685f',
    icon: Quote, size: 'normal'
  },
  {
    id: 'key-points', name: 'Key Points', category: 'Text',
    desc: 'Checkmark highlights', color: '#00685f',
    icon: CheckCircle2, size: 'normal'
  },
  {
    id: 'image-text-left', name: 'Image Left', category: 'Image',
    desc: 'Visual on left side', color: '#131b2e',
    icon: ImageIcon, size: 'wide'
  },
  {
    id: 'image-text-right', name: 'Image Right', category: 'Image',
    desc: 'Visual on right side', color: '#131b2e',
    icon: ImageIcon, size: 'normal'
  },
  {
    id: 'image-stacked', name: 'Image Stacked', category: 'Image',
    desc: 'Full width visual', color: '#131b2e',
    icon: ImageIcon, size: 'normal'
  },
  {
    id: 'video-text', name: 'Video + Text', category: 'Image',
    desc: 'Multimedia instruction', color: '#131b2e',
    icon: Video, size: 'wide'
  },
  {
    id: 'audio-text', name: 'Audio + Text', category: 'Audio',
    desc: 'Voiceover narrative', color: '#6B21A8',
    icon: Music, size: 'normal'
  },
  {
    id: 'h-tabs', name: 'Horizontal Tabs', category: 'Tabs',
    desc: 'Top navigation tabs', color: '#B45309',
    icon: LayoutTemplate, size: 'wide'
  },
  {
    id: 'v-tabs', name: 'Vertical Tabs', category: 'Tabs',
    desc: 'Side navigation tabs', color: '#B45309',
    icon: LayoutTemplate, size: 'normal'
  },
  {
    id: 'accordion', name: 'Accordion', category: 'Interactive',
    desc: 'Expandable sections', color: '#3730A3',
    icon: ChevronDown, size: 'normal'
  },
  {
    id: 'q-a', name: 'Q&A', category: 'Interactive',
    desc: 'Question and answer', color: '#3730A3',
    icon: HelpCircle, size: 'normal'
  },
  {
    id: 'true-false', name: 'True or False', category: 'Interactive',
    desc: 'Binary choice quiz', color: '#3730A3',
    icon: Check, size: 'wide'
  },
  {
    id: 'mc-quiz', name: 'Multiple Choice', category: 'Interactive',
    desc: 'Single choice quiz', color: '#3730A3',
    icon: CheckSquare, size: 'normal'
  },
  {
    id: 'flashcard', name: 'Flashcard', category: 'Interactive',
    desc: 'Click to flip card', color: '#3730A3',
    icon: CreditCard, size: 'normal'
  },
  {
    id: 'sequence', name: 'Sequence', category: 'Interactive',
    desc: 'Drag to order steps', color: '#3730A3',
    icon: GripVertical, size: 'normal'
  },
  {
    id: 'hotspot', name: 'Hotspot', category: 'Interactive',
    desc: 'Click on image areas', color: '#3730A3',
    icon: MousePointer2, size: 'wide'
  },
  {
    id: 'cross-match', name: 'Cross Match', category: 'Interactive',
    desc: 'Drag and drop matching', color: '#3730A3',
    icon: Shuffle, size: 'normal'
  },
];

const CATEGORIES = [
  'All', 'Text', 'Media', 'Audio', 'Tabs', 'Interactive'
];

interface LayoutChooserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  defaultCategory?: string;
}

export default function LayoutChooser({ isOpen, onClose, onSelect, defaultCategory }: LayoutChooserProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);

  const filteredLayouts = useMemo(() => {
    if (activeCategory === 'All') return LAYOUTS;
    if (activeCategory === 'Media') return LAYOUTS.filter(l => l.category === 'Image');
    return LAYOUTS.filter(l => l.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (isOpen && defaultCategory) {
      // Handle consolidated 'Media' category which maps to layouts tagged as 'Image'
      setActiveCategory(defaultCategory);
      setCurrentIndex(0);
    }
  }, [isOpen, defaultCategory]);

  useEffect(() => {
    setCurrentIndex(0);
    // Auto select first item in category if none selected or if switching categories
    if (filteredLayouts.length > 0) {
      // Optional: setSelectedLayoutId(filteredLayouts[0].id);
    }
  }, [activeCategory, filteredLayouts]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredLayouts.length);
  }, [filteredLayouts.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredLayouts.length) % filteredLayouts.length);
  }, [filteredLayouts.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && selectedLayoutId) onSelect(selectedLayoutId);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose, selectedLayoutId, onSelect]);

  const selectedLayout = useMemo(() => {
    return LAYOUTS.find(l => l.id === selectedLayoutId) || filteredLayouts[currentIndex];
  }, [selectedLayoutId, filteredLayouts, currentIndex]);

  // Update selection when carousel moves
  useEffect(() => {
    if (filteredLayouts[currentIndex]) {
      setSelectedLayoutId(filteredLayouts[currentIndex].id);
    }
  }, [currentIndex, filteredLayouts]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#131b2e]/80 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full min-h-[100dvh] flex flex-col items-center justify-between py-6 px-6 pointer-events-none"
        >
          {/* Header */}
          <div className="w-full max-w-6xl flex justify-between items-center pointer-events-auto">
            <div className="w-12" /> {/* Spacer */}
            <h2 className="text-4xl font-black text-white tracking-tighter">Choose a Layout</h2>
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="w-full max-w-3xl pointer-events-auto mt-4">
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                      px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                      ${activeCategory === cat
                      ? 'bg-[#00685f] text-white shadow-xl shadow-[#00685f]/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                    }
                    `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Carousel Section */}
          <div className="flex-1 w-full flex items-center justify-center relative pointer-events-auto">
            {filteredLayouts.length > 0 ? (
              <>
                {/* Navigation Arrows */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-12 z-20 pointer-events-none">
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="w-16 h-16 flex items-center justify-center bg-white shadow-2xl rounded-full text-[#131b2e] hover:scale-110 active:scale-90 transition-all pointer-events-auto"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="w-16 h-16 flex items-center justify-center bg-white shadow-2xl rounded-full text-[#131b2e] hover:scale-110 active:scale-90 transition-all pointer-events-auto"
                  >
                    <ChevronRight size={32} />
                  </button>
                </div>

                {/* Cards Display */}
                <div className="relative w-full max-w-4xl h-[440px] flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {filteredLayouts.map((layout, index) => {
                      // Calculate circular distance and offset
                      const len = filteredLayouts.length;
                      let displayOffset = index - currentIndex;
                      if (displayOffset > len / 2) displayOffset -= len;
                      if (displayOffset < -len / 2) displayOffset += len;

                      const absOffset = Math.abs(displayOffset);
                      const isCenter = index === currentIndex;
                      const isSide = absOffset === 1;

                      // Only render cards close to the center for performance
                      if (absOffset > 2) return null;

                      return (
                        <motion.div
                          key={layout.id}
                          initial={{ scale: 0.7, opacity: 0, x: displayOffset * 400 }}
                          animate={{
                            scale: isCenter ? 1.05 : isSide ? 0.85 : 0.75,
                            opacity: isCenter ? 1 : isSide ? 0.6 : 0.4,
                            x: displayOffset * 300,
                            zIndex: isCenter ? 10 : isSide ? 5 : 1,
                            filter: isCenter ? 'blur(0px)' : 'blur(2px)'
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          onClick={() => setCurrentIndex(index)}
                          className="absolute flex-shrink-0 cursor-pointer pointer-events-auto"
                        >
                          <div className={`
                              relative w-[280px] h-[360px] bg-white rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-500
                              ${isCenter
                              ? 'ring-2 ring-[#00685f] ring-offset-2'
                              : 'border border-slate-200/20'
                            }
                            `}>
                            {/* Top Half */}
                            <div
                              className="h-[180px] relative flex items-center justify-center"
                              style={{ backgroundColor: layout.color }}
                            >
                              {/* Dot Pattern Overlay */}
                              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                              <layout.icon
                                className={`w-16 h-16 relative z-10 transition-all duration-500 text-white ${isCenter ? 'opacity-100' : 'opacity-30'
                                  }`}
                                strokeWidth={1.5}
                              />

                              {isCenter && (
                                <div className="absolute top-6 right-6 bg-[#00685f] px-4 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5 shadow-lg">
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Selected ✓</span>
                                </div>
                              )}
                            </div>

                            {/* Bottom Half */}
                            <div className="h-[180px] bg-white p-8 flex flex-col justify-center">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-[#00685f]/10 text-[#00685f] text-[9px] font-black uppercase tracking-widest rounded-md">
                                  {layout.category}
                                </span>
                              </div>
                              <h3 className="text-2xl font-black text-[#131b2e] leading-tight mb-1">{layout.name}</h3>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed">{layout.desc}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 text-white/40"
              >
                <Plus className="w-16 h-16 opacity-20" />
                <p className="text-xl font-bold tracking-tight">No layouts in this category</p>
              </motion.div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="w-full max-w-2xl flex flex-col items-center gap-4 pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLayout?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <h4 className="text-white text-xl font-black tracking-tight">{selectedLayout?.name}</h4>
                <p className="text-white/60 text-sm font-medium mt-1">{selectedLayout?.category} • {selectedLayout?.desc}</p>
              </motion.div>
            </AnimatePresence>

            <button
              disabled={!selectedLayoutId}
              onClick={() => selectedLayoutId && onSelect(selectedLayoutId)}
              className={`
                 group relative flex items-center gap-3 px-10 py-5 bg-[#00685f] text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all
                 ${selectedLayoutId ? 'hover:scale-105 active:scale-95 shadow-[#00685f]/30' : 'opacity-50 cursor-not-allowed'}
               `}
            >
              Apply Layout
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
