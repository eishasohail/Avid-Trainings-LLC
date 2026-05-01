"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ArrowLeft, 
  ChevronRight, 
  Eye, 
  Save, 
  Plus, 
  Trash2, 
  Home, 
  Layers, 
  Settings, 
  LayoutTemplate,
  CheckCircle2,
  RefreshCcw,
  Copy,
  ArrowUp,
  ArrowDown,
  Monitor,
  Layout,
  Image as ImageIcon,
  MoreVertical,
  X,
  Type,
  Palette,
  Maximize2,
  FileText,
  Clock,
  ChevronLeft,
  Volume2,
  MousePointer2,
  CreditCard,
  MessageSquare,
  PlusCircle,
  Check,
  Zap,
  HelpCircle,
  Video,
  Music,
  Play,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Info,
  GripVertical,
  Link2,
  RemoveFormatting,
  ChevronDown,
  Table as TableIcon,
  Columns,
  Rows,
  PlusSquare,
  MinusSquare,
  MoveUp,
  MoveDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import { saveImage } from "@/lib/utils/imageStorage"
import { useImageSrc } from "@/hooks/useImageSrc"

// Editor imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Link } from '@tiptap/extension-link';
import { Highlight } from '@tiptap/extension-highlight';
import FontSize from 'tiptap-extension-font-size';
import FontFamily from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'

// Components
import { ScrollStack, ScrollStackItem } from "@/components/reactbits/ScrollStack/ScrollStack";
import Dock from "@/components/reactbits/Dock/Dock";
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";
import { MagicBento, MagicCard } from "@/components/reactbits/MagicBento/MagicBento";
import { Popover, PopoverTrigger, PopoverPanel } from '@/components/animate-ui/components/base/popover';
import CrossMatchBlock from '@/components/editor/PageBuilder/blocks/CrossMatchBlock';
import LayoutChooser from '@/components/editor/PageBuilder/LayoutChooser';
import RichTextBlock from '@/components/editor/PageBuilder/blocks/RichTextBlock';
import PageBlockDispatcher from '@/components/editor/PageBuilder/PageBlockDispatcher';

// --- Types ---
interface PageContent {
  text?: any; // JSON for TipTap or string
  title?: string;
  author?: string; // For Quote
  image?: string;
  videoUrl?: string;
  points?: string[];
  items?: { id: string; title: string; content: string }[]; // Acc/Tabs
  pairs?: { id: string; question?: string; answer?: string; term?: string; definition?: string }[]; // Q&A and Cross Match
  quiz?: {
    question?: string;
    options?: string[];
    correct?: any;
    explanation?: string;
  };
  flashcard?: { front: string; back: string };
  triggerLabel?: string;
  popupTitle?: string;
  popupContent?: string;
  popupType?: string;
  popupImage?: string;
  popupImagePosition?: string;
  sequenceItems?: { id: string; text: string }[];
  hotspots?: { id: string; x: number; y: number; label: string; isCorrect: boolean }[];
  intro?: string;
  outro?: string;
  cells?: string[];
  cols?: number;
}

interface PageData {
  id: string;
  lectureId: string;
  title: string;
  heading?: string;
  layout: string | null;
  content: PageContent;
  status: 'draft' | 'published';
  infoPopup?: any;
}



export default function PageBuilderRoot() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lectureId = params.lectureId as string;
  const pageId = params.pageId as string;

  const STORAGE_KEY = `avid-pages-${lectureId}`;

  // Helper to load pages for a specific lecture
  const loadPages = useCallback((lId: string) => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(`avid-pages-${lId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    
    // Fallback
    const fallback = [{
      id: `${lId}-p1`,
      lectureId: lId,
      title: 'Page 1',
      heading: '',
      layout: null,
      content: {},
      status: 'draft',
      infoPopup: null
    }];
    localStorage.setItem(`avid-pages-${lId}`, JSON.stringify(fallback));
    return fallback;
  }, []);

  // State initialization
  const [pages, setPages] = useState<PageData[]>([]);
  const [activePageId, setActivePageId] = useState<string>(pageId);
  const [isPreview, setIsPreview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalCategory, setModalCategory] = useState('All');

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const resolvedPopupImage = useImageSrc(
    activePage?.content?.popupImage
  )

  const openModalWithCategory = useCallback((category: string) => {
    setModalCategory(category);
    setIsModalOpen(true);
  }, []);

  const openModal = useCallback(() => {
    setModalCategory('All');
    setIsModalOpen(true);
  }, []);

  const openInfoModal = useCallback(() => {
    setShowInfoModal(true);
  }, []);

  // CRITICAL FIX: Reset everything when lectureId changes
  useEffect(() => {
    const freshPages = loadPages(lectureId);
    setPages(freshPages);
    // Set active page to the pageId from URL or first page
    const targetPage = freshPages.find(p => p.id === pageId);
    setActivePageId(targetPage?.id || freshPages[0]?.id || pageId);
  }, [lectureId, loadPages]); 

  // Save changes to localStorage whenever they happen
  useEffect(() => {
    if (pages.length > 0 && pages[0].lectureId === lectureId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    }
  }, [pages, STORAGE_KEY, lectureId]);

  const handleUpdateContent = useCallback((content: Partial<PageContent>) => {
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, content: { ...p.content, ...content } } : p));
  }, [activePageId]);

  const handleApplyLayout = (layoutId: string) => {
    // Always reset content completely when changing layout
    let initialContent: Partial<PageContent> = {}
    
    // Set sensible defaults per layout
    switch(layoutId) {
      case 'bullet-points':
        initialContent.text = '<ul><li><p></p></li></ul>'
        break
      case 'key-points':
        initialContent.points = ['', '', '']
        break
      case 'q-a':
        initialContent.pairs = [
          { id: '1', question: '', answer: '' }
        ]
        break
      case 'true-false':
        initialContent.quiz = { 
          question: '', correct: null, explanation: '' 
        }
        break
      case 'mc-quiz':
        initialContent.quiz = { 
          question: '', options: ['', '', '', ''], 
          correct: null, explanation: '' 
        }
        break
      case 'flashcard':
        initialContent.flashcard = { front: '', back: '' }
        break
      case 'sequence':
        initialContent.sequenceItems = [
          { id: '1', text: '' },
          { id: '2', text: '' },
          { id: '3', text: '' }
        ]
        break
      case 'accordion':
        initialContent.items = [
          { id: '1', title: 'Section 1', content: '' }
        ]
        break
      case 'h-tabs':
      case 'v-tabs':
        initialContent.items = [
          { id: '1', title: 'Tab 1', content: '' },
          { id: '2', title: 'Tab 2', content: '' }
        ]
        break
      case 'cross-match':
        initialContent.pairs = [
          { id: '1', term: '', definition: '' },
          { id: '2', term: '', definition: '' },
          { id: '3', term: '', definition: '' }
        ]
        break
      case 'image-stacked':
        initialContent = {
          intro: '',
          outro: '',
          image: '',
          text: ''
        }
        break
      case 'color-grid':
        initialContent = {
          title: '',
          cells: ['', '', '', '', '', ''],
          cols: 3
        }
        break
      default:
        initialContent = {}
    }
    
    // Update page with new layout AND fresh content
    setPages(prev => prev.map(p =>
      p.id === activePageId
        ? { ...p, layout: layoutId, content: initialContent }
        : p
    ))
    setIsModalOpen(false)
    toast.success("Layout applied")
  }

  const handleAddPage = () => {
    const newPage: PageData = {
      id: `${lectureId}-p${Date.now()}`,
      lectureId,
      title: `Page ${pages.length + 1}`,
      heading: '',
      layout: null,
      content: {},
      status: 'draft',
      infoPopup: null
    };
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    setActivePageId(newPage.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPages));
    router.push(`/dashboard/editor/${courseId}/${lectureId}/${newPage.id}`);
    toast.success("Page added");
  };

  const handleDeletePage = (id: string) => {
    if (pages.length === 1) {
      toast.error('Cannot delete the only page');
      return;
    }
    const updatedPages = pages.filter(p => p.id !== id);
    // renumber pages
    const renumbered = updatedPages.map((p, i) => ({ ...p, title: `Page ${i + 1}` }));
    setPages(renumbered);
    
    // switch to first page if deleted page was active
    if (activePageId === id) {
      const nextId = renumbered[0].id;
      setActivePageId(nextId);
      router.push(`/dashboard/editor/${courseId}/${lectureId}/${nextId}`);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(renumbered));
    toast.success("Page deleted");
  };

  const updatePageHeading = useCallback((heading: string) => {
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, heading } : p));
  }, [activePageId]);

  const dockItems = [
    { icon: <Home size={20} className="text-indigo-600" />, label: 'Dashboard', onClick: () => router.push('/dashboard') },
    { icon: <Layers size={20} className="text-amber-600" />, label: 'Section', onClick: () => router.push(`/dashboard/editor/${courseId}`) },
    { icon: <Eye size={20} className="text-purple-600" />, label: isPreview ? 'Editor' : 'Preview', onClick: () => setIsPreview(!isPreview) },
    { icon: <Save size={20} className="text-emerald-600" />, label: 'Save Draft', onClick: () => toast.success("Draft saved") },
  ];

  const handlePageNav = useCallback((id: string) => {
    setActivePageId(id);
    router.push(`/dashboard/editor/${courseId}/${lectureId}/${id}`);
  }, [courseId, lectureId, router]);

  return (
    <div className="fixed inset-0 bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans overflow-hidden antialiased">
      <Toaster position="top-center" />
      
      {/* TEAL BANNER FOR PREVIEW MODE */}
      {isPreview && (
        <div className="bg-[#00685f] text-white text-center py-2 text-sm font-medium flex items-center justify-center gap-3 shrink-0">
          <Eye className="w-4 h-4" />
          You are previewing this page as a Learner
          <button 
            onClick={() => setIsPreview(false)}
            className="ml-4 px-3 py-1 bg-white/20 rounded-lg text-xs hover:bg-white/30 transition-colors"
          >
            Exit Preview
          </button>
        </div>
      )}

      {!isPreview && (
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 z-[100] shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => router.push(`/dashboard/editor/${courseId}`)} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[#00685f]"><ArrowLeft size={18} strokeWidth={3} /></button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00685f]/50">
              <span className="hover:text-[#00685f] cursor-pointer transition-colors" onClick={() => router.push('/dashboard')}>Dashboard</span>
              <ChevronRight size={10} />
              <span className="hover:text-[#00685f] cursor-pointer transition-colors" onClick={() => router.push(`/dashboard/editor/${courseId}`)}>Section</span>
              <ChevronRight size={10} />
              <span className="text-slate-400">Page Builder</span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-[#131b2e] tracking-tight whitespace-normal break-words">{activePage?.title || 'Drafting Page'}</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsPreview(!isPreview)} className="px-6 py-2 rounded-xl border text-[10px] font-black uppercase bg-white text-slate-500 border-slate-200 hover:text-[#00685f]">{isPreview ? 'Editor' : 'Preview'}</button>
          <button onClick={() => toast.success("Saved successfully")} className="px-8 py-2 bg-[#00685f] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#00685f]/15">Save Page</button>
        </div>
      </header>
      )}

      <div className="flex-1 flex overflow-hidden">
        {!isPreview && (
          <aside className="w-72 bg-white border-r border-slate-200 flex flex-col z-[50]">
            <div className="flex items-center justify-between px-6 py-8 pb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00685f]">
                PAGES
              </span>
              <button 
                onClick={handleAddPage} 
                className="w-8 h-8 flex items-center justify-center bg-[#00685f]/5 text-[#00685f] rounded-xl hover:bg-[#00685f]/10 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-24 scrollbar-hide space-y-2">
              <ScrollStack>
                {pages.map((p, index) => (
                  <ScrollStackItem 
                    key={p.id} 
                    onClick={() => {
                      setActivePageId(p.id);
                      router.push(`/dashboard/editor/${courseId}/${lectureId}/${p.id}`);
                    }} 
                    className={`relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all group ${
                      activePageId === p.id
                        ? 'border-2 border-[#00685f] bg-[#00685f]/5 shadow-sm'
                        : 'border-2 border-transparent hover:border-slate-200 bg-[#fafcfc]'
                    }`}
                  >
                    {/* Page number badge */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0 transition-colors ${
                      activePageId === p.id
                        ? 'bg-[#00685f] text-white'
                        : 'bg-slate-100 text-[#6d7a77] group-hover:bg-slate-200'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Page info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-[#131b2e] uppercase tracking-tight whitespace-normal break-words">
                        {p.title}
                      </p>
                      <p className="text-[10px] font-bold text-[#6d7a77] uppercase tracking-tighter mt-0.5">
                        {p.layout ? p.layout.replace(/-/g, ' ') : 'No layout'}
                      </p>
                    </div>

                    {/* Delete button - show on hover */}
                    {pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePage(p.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-50"
                      >
                        <X size={14} className="text-red-400 hover:text-red-600 transition-colors" />
                      </button>
                    )}
                  </ScrollStackItem>
                ))}
              </ScrollStack>
            </div>
          </aside>
        )}

        <main className="flex-1 relative flex flex-col overflow-hidden bg-[#f7f9fb]">
           <CanvasRenderer 
             key={`${activePage?.id || 'loading'}-${activePage?.layout || 'none'}`} 
             activePage={activePage} 
             isPreview={isPreview} 
             openModal={openModal} 
             openModalWithCategory={openModalWithCategory}
             openInfoModal={openInfoModal} 
             onUpdateContent={handleUpdateContent} 
             updatePageHeading={updatePageHeading} 
             pages={pages} 
             onPageChange={handlePageNav} 
           />
           {!isPreview && (
             <div className="absolute bottom-6 w-full flex justify-center z-50">
               <Dock items={dockItems} panelHeight={68} baseItemSize={50} magnification={70} />
             </div>
           )}
        </main>
      </div>

      {/* --- INFOMODAL --- */}
      <AnimatePresence>
        {showInfoModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[1000]" onClick={() => setShowInfoModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', duration: 0.4 }} className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-[#131b2e]">Page Info Popup</h3>
                  <button onClick={() => setShowInfoModal(false)}><X size={20} className="text-[#6d7a77]" /></button>
                </div>
                {isPreview ? (
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-[#131b2e] uppercase tracking-widest">
                        {activePage.content.popupTitle || 'Exclusive Insight'}
                      </h4>
                    </div>
                    {resolvedPopupImage && (
                      <img src={resolvedPopupImage} className="w-full h-40 object-contain rounded-xl border border-slate-100" />
                    )}
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {activePage.content.popupContent || 'No details provided.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-[#6d7a77] mb-4">Add contextual information that learners can access on this page</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-[#6d7a77] uppercase tracking-wide">Popup Image (Optional)</label>
                        <div className="mt-2">
                          {activePage.content.popupImage ? (
                            <div className="relative group">
                              <img src={resolvedPopupImage} className="w-full h-40 object-contain rounded-xl border border-slate-100" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 rounded-xl transition-opacity">
                                <label className="cursor-pointer flex flex-col items-center text-white">
                                  <input type="file" accept="image/*" className="hidden"
                                    onChange={async (e) => {
                                      if (e.target.files?.[0]) {
                                        const key = await saveImage(e.target.files[0])
                                        handleUpdateContent({ popupImage: key })
                                      }
                                    }} />
                                  <ImageIcon size={20} className="mb-1" />
                                  <span className="text-[9px] font-black uppercase">Change</span>
                                </label>
                                <button onClick={() => handleUpdateContent({ popupImage: '' })}
                                  className="flex flex-col items-center text-red-400">
                                  <Trash2 size={20} className="mb-1" />
                                  <span className="text-[9px] font-black uppercase">Remove</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#00685f]/40 transition-colors min-h-[120px]">
                              <input type="file" accept="image/*" className="hidden"
                                onChange={async (e) => {
                                  if (e.target.files?.[0]) {
                                    const key = await saveImage(e.target.files[0])
                                    handleUpdateContent({ popupImage: key })
                                  }
                                }} />
                              <ImageIcon size={24} className="text-slate-300" />
                              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Add Image (Optional)</span>
                            </label>
                          )}
                          
                          {activePage.content.popupImage && (
                            <div className="flex gap-2 justify-center mt-2">
                              {['left','right','top','bottom','center'].map(pos => (
                                <button
                                  key={pos}
                                  onClick={() => handleUpdateContent({ popupImagePosition: pos })}
                                  className={`w-8 h-8 rounded-lg text-[9px] font-black uppercase transition-all
                                    ${(activePage.content.popupImagePosition || 'left') === pos
                                      ? 'bg-[#00685f] text-white'
                                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                    }`}
                                >
                                  {pos[0].toUpperCase()}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#6d7a77] uppercase tracking-wide">Title</label>
                        <input value={activePage.content.popupTitle || ''} onChange={(e) => handleUpdateContent({ popupTitle: e.target.value })} placeholder="Enter popup title..." className="w-full mt-1 border border-[#bcc9c6] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00685f]" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#6d7a77] uppercase tracking-wide">Content</label>
                        <textarea value={activePage.content.popupContent || ''} onChange={(e) => handleUpdateContent({ popupContent: e.target.value })} placeholder="Enter the information content..." className="w-full mt-1 border border-[#bcc9c6] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00685f] resize-none" rows={4} />
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setShowInfoModal(false)} className="flex-1 py-2 border border-[#bcc9c6] rounded-lg text-sm font-medium text-[#6d7a77]">Cancel</button>
                  {!isPreview && <button onClick={() => { setShowInfoModal(false); toast.success("Popup saved"); }} className="flex-1 py-2 bg-[#00685f] text-white rounded-lg text-sm font-medium">Save</button>}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LayoutChooser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleApplyLayout}
        defaultCategory={modalCategory}
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&display=swap');
        :root { --font-sans: 'Outfit', sans-serif !important; }
        body { background: #f7f9fb; font-family: 'Outfit', sans-serif !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .prose ul { list-style-type: disc !important; padding-left: 1.5rem !important; }
        .backface-hidden { backface-visibility: hidden; }
        .ProseMirror { outline: none; min-height: 350px; }
        .ProseMirror p { margin: 0.5rem 0; }
        .ProseMirror:focus { outline: none; }
        .bg-dot-pattern {
          background-image: radial-gradient(#e2e8f0 1.5px, transparent 0);
          background-size: 32px 32px;
          background-position: -16px -16px;
          background-color: #f7f9fb;
          position: relative;
        }
        .bg-dot-pattern::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 0%, #f7f9fb 80%);
          pointer-events: none;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        /* TipTap Placeholder Styles */
        .prose p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #bcc9c6;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}

// --- CORE RENDERER ---
const CanvasRenderer = React.memo(function CanvasRenderer({ activePage, isPreview, openModal, openModalWithCategory, openInfoModal, onUpdateContent, updatePageHeading, pages, onPageChange }: any) {
  const [focusedEditor, setFocusedEditor] = useState<any>(null);
  const [styleOpen, setStyleOpen] = useState(false);
  const [showTableConfirm, setShowTableConfirm] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Color,
      TextStyle,
      Link.configure({ openOnClick: false }),
      Highlight.configure({ multicolor: true }),
      FontSize as any,
      FontFamily as any,
      FontSize as any,
      FontFamily as any,
      Table.configure({
        HTMLAttributes: { class: 'avid-table' },
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: activePage?.content?.text || '',
    onUpdate: ({ editor }) => onUpdateContent({ text: editor.getHTML() }),
    onFocus: ({ editor }) => setFocusedEditor(editor),
    editable: !isPreview,
    immediatelyRender: false,
  });

  const headingEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Color,
      TextStyle,
      Link.configure({ openOnClick: false }),
      Highlight.configure({ multicolor: true }),
      FontSize as any,
      FontFamily as any,
      FontSize as any,
      FontFamily as any,
      Table.configure({
        HTMLAttributes: { class: 'avid-table' },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder: 'Page heading...' }),
    ],
    content: activePage?.heading || '',
    onUpdate: ({ editor }) => updatePageHeading(editor.getHTML()),
    onFocus: ({ editor }) => setFocusedEditor(editor),
    editable: !isPreview,
    immediatelyRender: false,
  });

  useEffect(() => { 
    if (editor && activePage?.content?.text !== editor.getHTML()) {
      editor.commands.setContent(activePage?.content?.text || '');
    } 
  }, [activePage?.id, activePage?.content?.text, editor]);

  useEffect(() => { 
    if (headingEditor && activePage?.heading !== headingEditor.getHTML()) {
      headingEditor.commands.setContent(activePage?.heading || '');
    } 
  }, [activePage?.id, activePage?.heading, headingEditor]);

  const isTextLayout = ['text-only', 'bullet-points', 'quote-block', 'image-text-left', 'image-text-right', 'image-stacked', 'video-text', 'audio-text'].includes(activePage?.layout || '');
  const toolbarVisible = isTextLayout || (focusedEditor === headingEditor);
  const activeEditor = focusedEditor || editor || headingEditor;

  const radialMenuItems = [
    { id: 1, label: 'Bold', icon: Bold },
    { id: 2, label: 'Bullets', icon: List },
    { id: 3, label: 'Layout', icon: LayoutTemplate },
    { id: 4, label: 'Info', icon: Info },
    { id: 5, label: 'Heading', icon: Type },
  ]

  const handleRadialSelect = (item: any) => {
    switch(item.id) {
      case 1: 
        activeEditor?.chain().focus().toggleBold().run()
        break
      case 2: 
        activeEditor?.chain().focus().toggleBulletList().run()
        break
      case 3: 
        openModal()
        break
      case 4: 
        openInfoModal()
        break
      case 5: 
        activeEditor?.chain().focus().toggleHeading({ level: 2 }).run()
        break
    }
  }

  return (
    <div className={`w-full h-full p-8 flex flex-col items-center overflow-y-auto relative custom-scrollbar ${!activePage?.layout ? 'bg-dot-pattern' : ''}`} style={{ paddingBottom: '120px' }}>
      <div className="relative w-full h-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!activePage?.layout ? (
          <motion.div
            key="p"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full min-h-[60vh] w-full max-w-4xl mx-auto gap-8 relative"
          >
            <GravityStarsBackground />
            
            <div className="text-center relative z-10">
              <h2 className="text-2xl font-black text-[#131b2e] tracking-tighter">
                Choose a Layout
              </h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                Click a category below to browse layouts
              </p>
            </div>

            <MagicBento className="grid grid-cols-3 gap-4 w-full relative z-10">
              {[
                { icon: Type, title: 'Text', desc: 'Paragraphs & bullets', cat: 'Text' },
                { icon: ImageIcon, title: 'Media', desc: 'Image & video layouts', cat: 'Media' },
                { icon: Music, title: 'Audio', desc: 'Voiceover', cat: 'Audio' },
                { icon: LayoutTemplate, title: 'Tabs', desc: 'Organized content', cat: 'Tabs' },
                { icon: MousePointer2, title: 'Interactive', desc: 'Quizzes & activities', cat: 'Interactive' },
              ].map((item) => (
                <MagicCard 
                  key={item.title}
                  onClick={() => openModalWithCategory(item.cat)}
                  className="col-span-1"
                >
                  <div className="flex flex-col gap-3 p-2">
                    <item.icon className="w-6 h-6 text-[#00685f]" />
                    <h3 className="font-black text-[#131b2e] text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </MagicCard>
              ))}
            </MagicBento>
          </motion.div>
        ) : (
          <motion.div key={`canvas-${activePage?.id}-${activePage?.layout}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
             {!isPreview ? (
               <div className="bg-white rounded-2xl shadow-lg p-8 relative min-h-[500px]">
                     {/* 1. CHANGE LAYOUT button */}
                     <div className="flex justify-end mb-4">
                       <button
                         onClick={openModal}
                         className="flex items-center gap-2 
                           text-xs text-[#6d7a77] hover:text-[#00685f] 
                           border border-[#bcc9c6] rounded-xl 
                           px-4 py-2 transition-colors 
                           hover:border-[#00685f] font-black uppercase
                           tracking-widest"
                       >
                         <LayoutTemplate className="w-4 h-4" />
                         Change Layout
                       </button>
                     </div>
                     {/* 2. PAGE HEADING */}
                     {!isPreview && headingEditor ? (
                       <EditorContent
                         editor={headingEditor}
                         className="w-full text-2xl font-bold text-[#191c1e] outline-none border-b-2 border-transparent focus-within:border-[#00685f] transition-colors pb-2 mb-6 bg-transparent prose prose-lg min-h-[40px] [&_p]:m-0 focus-within:bg-[#fafcfc] [&_.ProseMirror]:!min-h-0"
                       />
                     ) : (
                       activePage?.heading && <div className="text-2xl font-bold text-[#191c1e] mb-6 prose prose-lg [&_p]:m-0" dangerouslySetInnerHTML={{ __html: activePage.heading }} />
                     )}

                     {/* 3. CONTENT BLOCK */}
                     <PageBlockDispatcher layout={activePage.layout!} content={activePage.content} onUpdate={onUpdateContent} editor={editor} isPreview={isPreview} />
                     
                     {/* 4. INFO POPUP BUTTON */}
                     <div className="absolute bottom-4 right-4">
                       <button 
                         onClick={openInfoModal} 
                         className="w-10 h-10 rounded-full bg-[#00685f] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                       >
                         <Info size={20} />
                       </button>
                     </div>
                  </div>
             ) : (
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
                  {activePage?.heading && (
                    <div className="w-full bg-[#00685f] px-12 py-5 shrink-0 z-10" style={{ width: '100%' }}>
                      <h1 className="text-white font-black text-xl uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: activePage.heading }} />
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto px-12 py-10 custom-scrollbar">
                    <PageBlockDispatcher layout={activePage.layout!} content={activePage.content} onUpdate={onUpdateContent} editor={editor} isPreview={isPreview} />
                  </div>
                  
                  {/* 4. INFO POPUP BUTTON */}
                  <div className="absolute bottom-4 right-4">
                    <button 
                      onClick={openInfoModal} 
                      className="w-10 h-10 rounded-full bg-[#00685f] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Info size={20} />
                    </button>
                  </div>
               </div>
             )}

             {/* 5. Page navigation in preview */}
             {isPreview && pages && onPageChange && (
               <div className="flex justify-between mt-8 pt-4 border-t border-[#bcc9c6]/30 px-4">
                 <button
                   onClick={() => {
                     const currentIndex = pages.findIndex((p: any) => p.id === activePage.id)
                     if (currentIndex > 0) onPageChange(pages[currentIndex - 1].id)
                   }}
                   disabled={pages.findIndex((p: any) => p.id === activePage.id) === 0}
                   className="flex items-center gap-2 px-4 py-2 border border-[#bcc9c6] rounded-lg text-sm bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors"
                 >
                   <ChevronLeft className="w-4 h-4" /> Previous Page
                 </button>
                 <span className="text-sm text-[#6d7a77] mt-2 font-bold">
                   Page {pages.findIndex((p: any) => p.id === activePage.id) + 1} of {pages.length}
                 </span>
                 <button
                   onClick={() => {
                     const currentIndex = pages.findIndex((p: any) => p.id === activePage.id)
                     if (currentIndex < pages.length - 1) onPageChange(pages[currentIndex + 1].id)
                   }}
                   disabled={pages.findIndex((p: any) => p.id === activePage.id) === pages.length - 1}
                   className="flex items-center gap-2 px-4 py-2 bg-[#00685f] text-white rounded-lg text-sm disabled:opacity-40 hover:bg-[#00685f]/90 transition-colors"
                 >
                   Next Page <ChevronRight className="w-4 h-4" />
                 </button>
               </div>
             )}

             {/* Floating Style Panel */}
             {!isPreview && activePage?.layout && (
                <div className="absolute top-4 right-4 z-50">
                  
                  {/* Floating Toggle Button */}
                  <motion.button
                    onClick={() => setStyleOpen(!styleOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 
                      rounded-2xl shadow-lg text-[10px] font-black 
                      uppercase tracking-widest transition-all border
                      ${styleOpen 
                        ? 'bg-[#00685f] border-[#00685f] text-white' 
                        : 'bg-white border-slate-200 text-[#131b2e] hover:border-[#00685f] hover:text-[#00685f]'
                      }`}
                  >
                    {styleOpen 
                      ? <X className="w-4 h-4" /> 
                      : <Palette className="w-4 h-4" />
                    }
                    {styleOpen ? 'Close' : 'Style'}
                  </motion.button>

                  {/* Floating Panel */}
                  <AnimatePresence>
                    {styleOpen && (focusedEditor || editor) && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 300, 
                          damping: 25 
                        }}
                        className="absolute top-16 right-0 
                          bg-white rounded-[2rem] shadow-2xl 
                          border border-slate-100 p-4 w-[220px]
                          overflow-hidden"
                      >
                        {(() => {
                          const targetEditor = focusedEditor || editor;
                          return (
                            <>
                        {/* Panel Header */}
                        <div className="flex items-center justify-between 
                          mb-4 pb-3 border-b border-slate-100">
                          <span className="text-[10px] font-black 
                            uppercase tracking-widest text-[#00685f]">
                            Style
                          </span>
                          <button 
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setStyleOpen(false)}
                            className="p-1 hover:bg-slate-100 rounded-lg"
                          >
                            <X className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>

                        {/* Text Style Row */}
                        <div className="mb-3">
                          <p className="text-[9px] font-black uppercase 
                            tracking-widest text-slate-400 mb-2">
                            Text
                          </p>
                          <div className="flex gap-1 flex-wrap">
                            <button
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => {
                                targetEditor?.view.focus();
                                targetEditor?.chain().focus().toggleBold().run();
                              }}
                              className={`w-8 h-8 rounded-xl flex 
                                items-center justify-center text-sm 
                                font-black transition-all
                                ${targetEditor?.isActive('bold') 
                                  ? 'bg-[#00685f] text-white' 
                                  : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'
                                }`}
                            >B</button>

                            <button
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => {
                                targetEditor?.view.focus();
                                targetEditor?.chain().focus().toggleItalic().run();
                              }}
                              className={`w-8 h-8 rounded-xl flex 
                                items-center justify-center text-sm 
                                font-black transition-all
                                ${targetEditor?.isActive('italic') 
                                  ? 'bg-[#00685f] text-white' 
                                  : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'
                                }`}
                            >I</button>

                            <button
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => {
                                targetEditor?.view.focus();
                                targetEditor?.chain().focus().toggleUnderline().run();
                              }}
                              className={`w-8 h-8 rounded-xl flex 
                                items-center justify-center text-sm 
                                font-black transition-all underline
                                ${targetEditor?.isActive('underline') 
                                  ? 'bg-[#00685f] text-white' 
                                  : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'
                                }`}
                            >U</button>

                            <button
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => {
                                targetEditor?.view.focus();
                                targetEditor?.chain().focus().toggleStrike().run();
                              }}
                              className={`w-8 h-8 rounded-xl flex 
                                items-center justify-center text-sm 
                                font-black transition-all line-through
                                ${targetEditor?.isActive('strike') 
                                  ? 'bg-[#00685f] text-white' 
                                  : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'
                                }`}
                            >S</button>
                          </div>
                        </div>

                        {/* Headings Row */}
                        <div className="mb-3">
                          <p className="text-[9px] font-black uppercase 
                            tracking-widest text-slate-400 mb-2">
                            Heading
                          </p>
                          <div className="flex gap-1">
                            {[1,2,3].map(level => (
                              <button
                                key={level}
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => {
                                  targetEditor?.view.focus();
                                  targetEditor?.chain().focus().toggleHeading({ level: level as any }).run();
                                }}
                                className={`w-8 h-8 rounded-xl flex 
                                  items-center justify-center 
                                  text-[10px] font-black transition-all
                                  ${targetEditor?.isActive('heading', 
                                    { level }) 
                                    ? 'bg-[#00685f] text-white' 
                                    : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'
                                  }`}
                              >
                                H{level}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Lists Row */}
                        <div className="mb-3">
                          <p className="text-[9px] font-black uppercase 
                            tracking-widest text-slate-400 mb-2">
                            List
                          </p>
                          <div className="flex gap-1">
                            <button
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => {
                                targetEditor?.view.focus();
                                targetEditor?.chain().focus().toggleBulletList().run();
                              }}
                              className={`w-8 h-8 rounded-xl flex 
                                items-center justify-center transition-all
                                ${targetEditor?.isActive('bulletList') 
                                  ? 'bg-[#00685f] text-white' 
                                  : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'
                                }`}
                            >
                              <List className="w-4 h-4" />
                            </button>

                            <button
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => {
                                targetEditor?.view.focus();
                                targetEditor?.chain().focus().toggleOrderedList().run();
                              }}
                              className={`w-8 h-8 rounded-xl flex 
                                items-center justify-center transition-all
                                ${targetEditor?.isActive('orderedList') 
                                  ? 'bg-[#00685f] text-white' 
                                  : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'
                                }`}
                            >
                              <ListOrdered className="w-4 h-4" />
                            </button>

                            <button
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => {
                                targetEditor?.view.focus();
                                targetEditor?.chain().focus().toggleBlockquote().run();
                              }}
                              className={`w-8 h-8 rounded-xl flex 
                                items-center justify-center transition-all
                                ${targetEditor?.isActive('blockquote') 
                                  ? 'bg-[#00685f] text-white' 
                                  : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'
                                }`}
                            >
                              <Quote className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Contextual Table Section */}
                        <div className="mb-4">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            Table {targetEditor?.isActive('table') ? 'Management' : ''}
                          </p>
                          
                          {!targetEditor?.isActive('table') ? (
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-1">
                                <button
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => setShowTableConfirm(!showTableConfirm)}
                                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all
                                    ${showTableConfirm ? 'bg-[#00685f]/20 text-[#00685f]' : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'}`}
                                >
                                  <TableIcon className="w-4 h-4" />
                                </button>
                              </div>
                              <AnimatePresence>
                                {showTableConfirm && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-col gap-1.5 overflow-hidden"
                                  >
                                    <button
                                      onMouseDown={e => e.preventDefault()}
                                      onClick={() => {
                                        targetEditor?.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run();
                                        setShowTableConfirm(false);
                                        toast.success("2x2 Table inserted");
                                      }}
                                      className="w-full py-1.5 bg-slate-100 text-[#00685f] rounded-lg text-[8px] font-black uppercase hover:bg-[#00685f]/10 transition-colors"
                                    >
                                      Create 2x2 Table
                                    </button>
                                    <button
                                      onMouseDown={e => e.preventDefault()}
                                      onClick={() => {
                                        targetEditor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                                        setShowTableConfirm(false);
                                        toast.success("3x3 Table inserted");
                                      }}
                                      className="w-full py-2 bg-[#00685f] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#00685f]/90 transition-colors shadow-lg shadow-[#00685f]/20"
                                    >
                                      Create 3x3 Table
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <div className="space-y-4 animate-fade-in">
                              <div className="flex items-center justify-between">
                                <span className="text-[8px] font-bold text-[#00685f] uppercase bg-[#00685f]/10 px-2 py-0.5 rounded-full">Active</span>
                                <button
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => targetEditor?.chain().focus().deleteTable().run()}
                                  className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                  Delete Table
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <p className="text-[7px] font-black text-slate-400 uppercase">Rows</p>
                                  <div className="flex gap-1">
                                    <button onClick={() => targetEditor?.chain().focus().addRowBefore().run()} className="flex-1 py-1.5 bg-slate-50 rounded-lg text-[8px] font-black hover:bg-slate-100"><PlusSquare className="w-3 h-3 mx-auto" /></button>
                                    <button onClick={() => targetEditor?.chain().focus().addRowAfter().run()} className="flex-1 py-1.5 bg-slate-50 rounded-lg text-[8px] font-black hover:bg-slate-100"><PlusSquare className="w-3 h-3 mx-auto" /></button>
                                    <button onClick={() => targetEditor?.chain().focus().deleteRow().run()} className="flex-1 py-1.5 bg-red-50 text-red-400 rounded-lg text-[8px] font-black hover:bg-red-100"><MinusSquare className="w-3 h-3 mx-auto" /></button>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[7px] font-black text-slate-400 uppercase">Cols</p>
                                  <div className="flex gap-1">
                                    <button onClick={() => targetEditor?.chain().focus().addColumnBefore().run()} className="flex-1 py-1.5 bg-slate-50 rounded-lg text-[8px] font-black hover:bg-slate-100"><PlusSquare className="w-3 h-3 mx-auto" /></button>
                                    <button onClick={() => targetEditor?.chain().focus().addColumnAfter().run()} className="flex-1 py-1.5 bg-slate-50 rounded-lg text-[8px] font-black hover:bg-slate-100"><PlusSquare className="w-3 h-3 mx-auto" /></button>
                                    <button onClick={() => targetEditor?.chain().focus().deleteColumn().run()} className="flex-1 py-1.5 bg-red-50 text-red-400 rounded-lg text-[8px] font-black hover:bg-red-100"><MinusSquare className="w-3 h-3 mx-auto" /></button>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => targetEditor?.chain().focus().insertContentAt(targetEditor.state.selection.$from.before(-1), { type: 'paragraph' }).run()}
                                  className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[8px] font-black uppercase hover:bg-slate-200 transition-colors"
                                >
                                  <ArrowUp className="w-2.5 h-2.5" /> Space Above
                                </button>
                                <button
                                  onClick={() => targetEditor?.chain().focus().insertContentAt(targetEditor.state.selection.$from.after(-1), { type: 'paragraph' }).run()}
                                  className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[8px] font-black uppercase hover:bg-slate-200 transition-colors"
                                >
                                  <ArrowDown className="w-2.5 h-2.5" /> Space Below
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Alignment Row */}
                        <div className="mb-3">
                          <p className="text-[9px] font-black uppercase 
                            tracking-widest text-slate-400 mb-2">
                            Align
                          </p>
                          <div className="flex gap-1">
                            {[
                              { align: 'left', icon: AlignLeft },
                              { align: 'center', icon: AlignCenter },
                              { align: 'right', icon: AlignRight },
                            ].map(({ align, icon: Icon }) => (
                              <button
                                key={align}
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => {
                                  targetEditor?.view.focus();
                                  targetEditor?.chain().focus().setTextAlign(align).run();
                                }}
                                className={`w-8 h-8 rounded-xl flex 
                                  items-center justify-center transition-all
                                  ${targetEditor?.isActive(
                                    { textAlign: align }
                                  ) 
                                    ? 'bg-[#00685f] text-white' 
                                    : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'
                                  }`}
                              >
                                <Icon className="w-4 h-4" />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Colors Row */}
                        <div className="mb-3">
                          <p className="text-[9px] font-black uppercase 
                            tracking-widest text-slate-400 mb-2">
                            Color
                          </p>
                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col items-center gap-1">
                              <input 
                                type="color"
                                title="Text Color"
                                onChange={(e) => {
                                  targetEditor?.view.focus();
                                  targetEditor?.chain().focus().setColor(e.target.value).run();
                                }}
                                className="w-8 h-8 rounded-xl cursor-pointer 
                                  border border-slate-200 p-0.5"
                              />
                              <span className="text-[8px] text-slate-400 
                                font-black uppercase">Text</span>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                              <input 
                                type="color"
                                title="Highlight"
                                onChange={(e) => {
                                  targetEditor?.view.focus();
                                  targetEditor?.chain().focus().setHighlight({ color: e.target.value }).run();
                                }}
                                className="w-8 h-8 rounded-xl cursor-pointer 
                                  border border-slate-200 p-0.5"
                              />
                              <span className="text-[8px] text-slate-400 
                                font-black uppercase">Highlight</span>
                            </div>
                          </div>
                        </div>

                        {/* Link + Clear Row */}
                        <div className="pt-3 border-t border-slate-100 
                          flex gap-2">
                          <button
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => {
                              const url = window.prompt('Enter URL:')
                              if (url) {
                                targetEditor?.view.focus();
                                targetEditor?.chain().focus().setLink({ href: url }).run();
                              }
                            }}
                            className={`flex-1 h-8 rounded-xl flex 
                              items-center justify-center gap-1 
                              text-[9px] font-black uppercase transition-all
                              ${targetEditor?.isActive('link') 
                                ? 'bg-[#00685f] text-white' 
                                : 'bg-slate-100 text-[#131b2e] hover:bg-slate-200'
                              }`}
                          >
                            <Link2 className="w-3 h-3" /> Link
                          </button>

                          <button
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => {
                              targetEditor?.view.focus();
                              targetEditor?.chain().focus().clearNodes().unsetAllMarks().run();
                            }}
                            className="flex-1 h-8 rounded-xl flex 
                              items-center justify-center gap-1
                              text-[9px] font-black uppercase
                              bg-slate-100 text-[#131b2e] 
                              hover:bg-red-50 hover:text-red-500 
                              transition-all"
                          >
                            <RemoveFormatting className="w-3 h-3" /> 
                            Clear
                          </button>
                        </div>

                            </>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
});

