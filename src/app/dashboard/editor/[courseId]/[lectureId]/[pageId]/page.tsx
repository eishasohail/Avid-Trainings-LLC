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
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

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
  sequenceItems?: { id: string; text: string }[];
  hotspots?: { id: string; x: number; y: number; label: string; isCorrect: boolean }[];
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

  const openModalWithCategory = (category: string) => {
    setModalCategory(category);
    setIsModalOpen(true);
  };

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
  const activePage = pages.find(p => p.id === activePageId) || pages[0];

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

  const updatePageHeading = (heading: string) => {
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, heading } : p));
  };

  const dockItems = [
    { icon: <Home size={20} className="text-indigo-600" />, label: 'Dashboard', onClick: () => router.push('/dashboard') },
    { icon: <Layers size={20} className="text-amber-600" />, label: 'Section', onClick: () => router.push(`/dashboard/editor/${courseId}`) },
    { icon: <Eye size={20} className="text-purple-600" />, label: isPreview ? 'Editor' : 'Preview', onClick: () => setIsPreview(!isPreview) },
    { icon: <Save size={20} className="text-emerald-600" />, label: 'Save Draft', onClick: () => toast.success("Draft saved") },
  ];

  const handlePageNav = (id: string) => {
    setActivePageId(id);
    router.push(`/dashboard/editor/${courseId}/${lectureId}/${id}`);
  };

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
              <h1 className="text-sm font-black text-[#131b2e] tracking-tight">{activePage?.title || 'Drafting Page'}</h1>
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
                      <p className="text-xs font-black text-[#131b2e] truncate uppercase tracking-tight">
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
             openModal={() => { setModalCategory('All'); setIsModalOpen(true); }} 
             openModalWithCategory={openModalWithCategory}
             openInfoModal={() => setShowInfoModal(true)} 
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
                    <div className="flex items-center gap-2"><span className="text-xl">{activePage.content.popupType?.split(' ')[0] || '💡'}</span><h4 className="font-black text-[#131b2e]">{activePage.content.popupTitle || 'Exclusive Insight'}</h4></div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{activePage.content.popupContent || 'No details provided.'}</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-[#6d7a77] mb-4">Add contextual information that learners can access on this page</p>
                    <div className="space-y-4">
                      <div><label className="text-xs font-bold text-[#6d7a77] uppercase tracking-wide">Popup Type</label>
                        <select value={activePage.content.popupType || 'did-you-know'} onChange={(e) => handleUpdateContent({ popupType: e.target.value })} className="w-full mt-1 border border-[#bcc9c6] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00685f]">
                          <option value="did-you-know">💡 Did You Know</option>
                          <option value="important-note">⚠️ Important Note</option>
                          <option value="related-fact">📚 Related Fact</option>
                        </select>
                      </div>
                      <div><label className="text-xs font-bold text-[#6d7a77] uppercase tracking-wide">Title</label>
                        <input value={activePage.content.popupTitle || ''} onChange={(e) => handleUpdateContent({ popupTitle: e.target.value })} placeholder="Enter popup title..." className="w-full mt-1 border border-[#bcc9c6] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00685f]" />
                      </div>
                      <div><label className="text-xs font-bold text-[#6d7a77] uppercase tracking-wide">Content</label>
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
function CanvasRenderer({ activePage, isPreview, openModal, openModalWithCategory, openInfoModal, onUpdateContent, updatePageHeading, pages, onPageChange }: any) {
  const [focusedEditor, setFocusedEditor] = useState<any>(null);
  const [styleOpen, setStyleOpen] = useState(false);

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
               <div className="bg-white rounded-2xl shadow-lg p-8 relative min-h-[500px]">
                  {/* 2. PAGE HEADING */}
                  {activePage?.heading && <div className="text-2xl font-bold text-[#191c1e] mb-6 prose prose-lg [&_p]:m-0" dangerouslySetInnerHTML={{ __html: activePage.heading }} /> }

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
}

const getVideoEmbed = (url: string) => {
  if (!url) return null
  
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
  )
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }
  
  // Vimeo
  const vimeoMatch = url.match(
    /vimeo\.com\/(\d+)/
  )
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  // Direct video file
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return url
  }
  
  return null
}

function AccordionBlock({ items, onUpdate, isPreview }: any) {
  const [openIds, setOpenIds] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item: any, idx: number) => {
        const isOpen = openIds.includes(item.id)
        
        return (
          <div 
            key={item.id}
            className="border-2 border-slate-100 
              rounded-2xl overflow-hidden
              hover:border-[#00685f]/20 transition-colors"
          >
            {/* Header */}
            <div 
              className={`flex items-center justify-between 
                p-5 cursor-pointer transition-colors
                ${isOpen 
                  ? 'bg-[#00685f]/5 border-b-2 border-[#00685f]/10' 
                  : 'bg-white hover:bg-slate-50'
                }`}
              onClick={() => toggleItem(item.id)}
            >
              {isPreview ? (
                <h3 className="font-black text-[#131b2e] 
                  text-lg">
                  {item.title || 'Section Title'}
                </h3>
              ) : (
                <input
                  value={item.title}
                  onChange={(e) => {
                    const n = [...items]
                    n[idx].title = e.target.value
                    onUpdate({ items: n })
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="font-black text-[#131b2e] 
                    text-lg bg-transparent border-none 
                    outline-none flex-1"
                  placeholder="Section title..."
                />
              )}
              
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className={`w-5 h-5 
                  transition-colors
                  ${isOpen 
                    ? 'text-[#00685f]' 
                    : 'text-slate-400'
                  }`} 
                />
              </motion.div>
            </div>

            {/* Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 bg-white">
                    <RichTextBlock 
                      content={item.content} 
                      onChange={(html) => { 
                        const n = [...items]; 
                        n[idx].content = html; 
                        onUpdate({ items: n }); 
                      }} 
                      isPreview={isPreview}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* Add new section — editor only */}
      {!isPreview && (
        <button
          onClick={() => onUpdate({ 
            items: [...items, { 
              id: Date.now().toString(), 
              title: `Section ${items.length + 1}`, 
              content: '' 
            }] 
          })}
          className="flex items-center gap-2 
            text-[#00685f] font-black text-[10px] 
            uppercase tracking-widest mt-4
            hover:opacity-70 transition-opacity"
        >
          <Plus size={16} /> Add Section
        </button>
      )}

      {/* Delete buttons — editor only */}
      {!isPreview && items.length > 1 && (
        <div className="space-y-2 mt-2">
          {items.map((item: any, idx: number) => (
            <button
              key={item.id}
              onClick={() => onUpdate({ 
                items: items.filter(
                  (_: any, i: number) => i !== idx
                ) 
              })}
              className="flex items-center gap-1 
                text-red-400 text-[10px] font-black 
                uppercase hover:text-red-600 
                transition-colors"
            >
              <Trash2 size={12} /> 
              Remove "{item.title}"
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PageBlockDispatcher({ layout, content, onUpdate, editor, isPreview }: any) {
  const proseClasses = `prose prose-slate max-w-none 
    prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-[#131b2e]
    prose-p:text-[#191c1e] prose-p:font-medium prose-p:leading-relaxed prose-p:text-lg
    prose-strong:text-[#131b2e] prose-strong:font-black
    prose-ul:list-disc prose-ul:pl-5
    prose-ol:list-decimal prose-ol:pl-5
    prose-li:text-[#191c1e]
    prose-blockquote:border-l-4 prose-blockquote:border-[#00685f] prose-blockquote:bg-transparent prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:font-bold`;

  switch (layout) {
    case 'text-only':
    case 'bullet-points':
      return editor ? (<div className="w-full min-h-[350px]"><EditorContent editor={editor} className={`${proseClasses} outline-none min-h-[350px] px-4 py-3 cursor-text`} /></div>) : null;
    case 'quote-block':
      return editor ? (<div className="border-l-8 border-[#00685f] pl-10 py-6 max-w-3xl mx-auto"><p className="text-7xl text-[#00685f] font-black opacity-20 -mb-8">"</p><EditorContent editor={editor} className="prose italic text-2xl font-bold text-[#131b2e] outline-none" /><input placeholder="— Author name" value={content.author || ''} onChange={(e) => onUpdate({ author: e.target.value })} className="mt-8 text-lg text-[#6d7a77] font-black italic bg-transparent border-none outline-none w-full" /></div>) : null;
    case 'key-points':
      return (<div className="max-w-3xl mx-auto"><input placeholder="Section Title" value={content.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} className="text-4xl font-black text-[#131b2e] tracking-tighter w-full outline-none mb-10 border-none p-0" /><div className="space-y-4">{(content.points || ['Key point 1', 'Key point 2']).map((p: any, i: any) => (<div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group/item"><CheckCircle2 className="text-[#00685f] w-6 h-6" /><input value={p} onChange={(e) => { const n = [...(content.points || [])]; n[i] = e.target.value; onUpdate({ points: n }); }} className="flex-1 outline-none bg-transparent font-bold text-[#3d4947]" /><Trash2 className="w-5 h-5 text-red-300 cursor-pointer opacity-0 group-hover/item:opacity-100" onClick={() => onUpdate({ points: (content.points || []).filter((_: any, idx: any) => idx !== i) })} /></div>))}<button onClick={() => onUpdate({ points: [...(content.points || []), ''] })} className="mt-6 flex items-center gap-2 text-[#00685f] font-black uppercase text-[10px] tracking-widest"><PlusCircle size={18}/> Add Key Point</button></div></div>);
    case 'image-text-left':
    case 'image-text-right':
      return editor ? (
        <div className={`flex gap-12 w-full items-center ${layout === 'image-text-right' ? 'flex-row-reverse' : ''}`}>
          <div className="w-1/2 aspect-square border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer relative overflow-hidden group">
            {content.image ? (
              <>
                <img src={content.image} className="w-full h-full object-cover" />
                {!isPreview && (
                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) onUpdate({ image: URL.createObjectURL(e.target.files[0]) }) }} />
                    <ImageIcon size={32} className="text-white mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Image</span>
                  </label>
                )}
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) onUpdate({ image: URL.createObjectURL(e.target.files[0]) }) }} />
                <ImageIcon size={48} className="text-slate-200 mb-4 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#00685f] transition-colors">Deploy Image</span>
              </label>
            )}
          </div>
          <div className="flex-1"><EditorContent editor={editor} className={`${proseClasses} outline-none min-h-[350px] px-4 py-3`} /></div>
        </div>
      ) : null;
    case 'image-stacked':
    case 'video-text':
      return editor ? (
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="aspect-video w-full bg-slate-50 
            border-4 border-dashed border-slate-100 
            rounded-[3.5rem] overflow-hidden relative">
            
            {(layout === 'video-text' && content.videoUrl && getVideoEmbed(content.videoUrl)) ? (
              // Show embedded video
              content.videoUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                <video 
                  src={content.videoUrl}
                  controls
                  className="w-full h-full object-cover rounded-[3rem]"
                />
              ) : (
                <iframe
                  src={getVideoEmbed(content.videoUrl)!}
                  className="w-full h-full rounded-[3rem]"
                  allowFullScreen
                  allow="accelerometer; autoplay; 
                    clipboard-write; encrypted-media; 
                    gyroscope; picture-in-picture"
                />
              )
            ) : layout === 'video-text' ? (
              // Empty state
              <div className="absolute inset-0 flex flex-col 
                items-center justify-center gap-4">
                <Video size={48} className="text-slate-200" />
                {!isPreview && (
                  <input 
                    placeholder="Paste YouTube, Vimeo or video URL here..."
                    value={content.videoUrl || ''}
                    onChange={(e) => onUpdate({ 
                      videoUrl: e.target.value 
                    })}
                    className="mt-2 px-6 py-3 bg-white 
                      border border-slate-200 rounded-full 
                      text-xs w-80 text-center outline-none
                      focus:border-[#00685f]"
                  />
                )}
              </div>
            ) : (
              // Image Stacked logic
              <>
                {content.image ? (
                  <>
                    <img src={content.image} className="w-full h-full object-cover" />
                    {!isPreview && (
                      <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) onUpdate({ image: URL.createObjectURL(e.target.files[0]) }) }} />
                        <ImageIcon size={32} className="text-white mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Image</span>
                      </label>
                    )}
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) onUpdate({ image: URL.createObjectURL(e.target.files[0]) }) }} />
                    <ImageIcon size={48} className="text-slate-200 mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#00685f] transition-colors">Deploy Image</span>
                  </label>
                )}
              </>
            )}

            {/* Change video button when video exists */}
            {layout === 'video-text' && content.videoUrl && !isPreview && (
              <button
                onClick={() => onUpdate({ videoUrl: '' })}
                className="absolute top-4 right-4 
                  px-3 py-1.5 bg-white/90 backdrop-blur-sm
                  rounded-xl text-xs font-black text-slate-500
                  hover:text-red-500 border border-slate-200
                  transition-colors shadow-sm"
              >
                Remove Video
              </button>
            )}
          </div>

          <EditorContent 
            editor={editor}
            className={`${proseClasses} outline-none min-h-[200px] px-4 py-3`}
          />

          {/* URL input when video exists - editor only */}
          {layout === 'video-text' && !isPreview && content.videoUrl && (
            <input 
              placeholder="Change video URL..."
              value={content.videoUrl || ''}
              onChange={(e) => onUpdate({ 
                videoUrl: e.target.value 
              })}
              className="px-4 py-2 border border-slate-200 
                rounded-xl text-xs outline-none w-full
                focus:border-[#00685f] text-slate-500"
            />
          )}
        </div>
      ) : null;
    case 'audio-text':
      return editor ? (
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          
          {/* Audio Player Area */}
          <div className="bg-slate-50 border-2 border-slate-100 
            rounded-[2.5rem] p-8 flex flex-col gap-6 
            items-center relative">
            
            <Music size={36} className="text-[#00685f]" />

            {content.audioUrl ? (
              <>
                {/* Real audio player */}
                <audio 
                  controls
                  src={content.audioUrl}
                  className="w-full"
                />
                
                {/* Remove button */}
                {!isPreview && (
                  <button
                    onClick={() => onUpdate({ audioUrl: '' })}
                    className="text-xs font-black text-red-400 
                      hover:text-red-600 uppercase tracking-widest
                      transition-colors"
                  >
                    Remove Audio
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Empty state waveform */}
                <div className="flex gap-1 items-end h-8">
                  {[3,5,4,7,6,4,8,5,3,6,7,4,5,3,6].map(
                    (h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-[#00685f]/20 
                        rounded-full"
                      style={{ height: `${h * 4}px` }}
                    />
                  ))}
                </div>

                <p className="text-[10px] font-black uppercase 
                  tracking-widest text-slate-400">
                  No audio uploaded yet
                </p>

                {/* Upload button */}
                {!isPreview && (
                  <label className="flex items-center gap-2 
                    px-6 py-3 bg-white border-2 
                    border-[#00685f]/20 rounded-2xl 
                    text-xs font-black text-[#00685f] 
                    uppercase tracking-widest cursor-pointer
                    hover:bg-[#00685f]/5 transition-colors">
                    <Music className="w-4 h-4" />
                    Upload Audio File
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          onUpdate({
                            audioUrl: URL.createObjectURL(
                              e.target.files[0]
                            )
                          })
                        }
                      }}
                    />
                  </label>
                )}
              </>
            )}
          </div>

          {/* Text Editor Below */}
          <EditorContent
            editor={editor}
            className={`${proseClasses} outline-none min-h-[200px] px-4 py-3 cursor-text text-[#191c1e] font-medium leading-relaxed`}
          />
        </div>
      ) : null;
    case 'accordion': {
      const items = content.items || [
        { id: '1', title: 'Section 1', content: '' }
      ]
      
      return (
        <AccordionBlock
          items={items}
          onUpdate={onUpdate}
          isPreview={isPreview}
        />
      )
    }
    case 'h-tabs':
    case 'v-tabs':
      return <TabsBlock layout={layout} content={content} onUpdate={onUpdate} isPreview={isPreview} />;
    case 'q-a':
      { 
        const pa = (content.pairs && content.pairs.length > 0) ? content.pairs : [{ id: '1', question: 'Question?', answer: '' }]; 
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            {pa.map((pair: any, idx: any) => (
              <div key={pair.id} className="group bg-[#fafcfc] border border-slate-200 rounded-[30px] p-8 hover:border-[#00685f]/30">
                <div className="flex justify-between mb-4">
                  <span className="text-[10px] font-black text-[#00685f] uppercase">Inquiry {idx+1}</span>
                  <Trash2 size={16} className="text-red-300 hover:text-red-500 cursor-pointer" onClick={() => onUpdate({ pairs: pa.filter((p:any) => p.id !== pair.id) })} />
                </div>
                <input 
                  value={pair.question} 
                  onChange={(e) => { const n = [...pa]; n[idx].question = e.target.value; onUpdate({ pairs: n }); }} 
                  className="w-full text-xl font-black text-[#131b2e] border-none p-0 outline-none bg-transparent mb-4" 
                />
                <textarea 
                  value={pair.answer} 
                  onChange={(e) => { const n = [...pa]; n[idx].answer = e.target.value; onUpdate({ pairs: n }); }} 
                  className="w-full text-base font-medium text-slate-500 border-none p-0 outline-none bg-transparent resize-none leading-relaxed" 
                  rows={3} 
                />
              </div>
            ))}
            <button onClick={() => onUpdate({ pairs: [...pa, { id: Date.now().toString(), question: '', answer: '' }] })} className="flex items-center gap-2 text-[#00685f] font-black text-[10px] uppercase">
              <PlusCircle size={20}/> New Q&A
            </button>
          </div>
        ); 
      }
    case 'true-false':
      return <TrueFalseBlock content={content} onUpdate={onUpdate} isPreview={isPreview} />;
    case 'mc-quiz':
      return <MCQuizBlock content={content} onUpdate={onUpdate} isPreview={isPreview} />;
    case 'flashcard':
      return <FlashcardBlock content={content} onUpdate={onUpdate} />;
    case 'sequence':
      return <SequenceBlock content={content} onUpdate={onUpdate} isPreview={isPreview} />;
    case 'cross-match':
      return (
        <CrossMatchBlock
          content={content}
          onUpdate={onUpdate}
          isPreview={isPreview}
        />
      );
    case 'hotspot':
      return <HotspotBlock content={content} onUpdate={onUpdate} isPreview={isPreview} />;
    default:
      return (<div className="w-full min-h-[400px] border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center bg-slate-50/20"><div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-200 mb-6"><Maximize2 size={32}/></div><p className="text-slate-400 text-sm font-black uppercase tracking-widest opacity-40">Blank Canvas</p></div>);
  }
}

function SequenceBlock({ content, onUpdate, isPreview }: any) {
  const items = (content.sequenceItems && content.sequenceItems.length > 0) 
    ? content.sequenceItems 
    : [
        { id: '1', text: 'Step 1 — Enter text here' },
        { id: '2', text: 'Step 2 — Enter text here' },
        { id: '3', text: 'Step 3 — Enter text here' },
      ];

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i: any) => i.id === active.id);
      const newIndex = items.findIndex((i: any) => i.id === over.id);
      onUpdate({ sequenceItems: arrayMove(items, oldIndex, newIndex) });
    }
  };

  const [sub, setSub] = useState(false);

  if (isPreview) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-xs font-black uppercase text-[#00685f] mb-6 tracking-widest text-center">Arrange in correct order</p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item: any) => (
              <SortableItem key={item.id} id={item.id} text={item.text} isPreview={true} />
            ))}
          </SortableContext>
        </DndContext>
        {!sub ? (
           <button onClick={() => setSub(true)} className="w-full mt-10 py-4 bg-[#131b2e] hover:bg-[#00685f] text-teal-400 font-black tracking-widest uppercase text-xs rounded-[2rem] transition-colors">Submit Sequence</button>
        ) : (
           <div className="mt-8 p-6 bg-slate-50 text-center rounded-[2rem]">
             <p className="font-bold text-[#00685f]">Sequence submitted for review!</p>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item: any, idx: number) => (
            <SortableItem 
              key={item.id} 
              id={item.id} 
              text={item.text} 
              onTextChange={(val: string) => {
                const n = [...items];
                n[idx].text = val;
                onUpdate({ sequenceItems: n });
              }}
              onDelete={() => onUpdate({ sequenceItems: items.filter((i: any) => i.id !== item.id) })}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button 
        onClick={() => onUpdate({ sequenceItems: [...items, { id: Date.now().toString(), text: '' }] })}
        className="flex items-center gap-2 text-[#00685f] font-black text-[10px] uppercase tracking-widest mt-6"
      >
        <PlusCircle size={18}/> Add Step
      </button>
    </div>
  );
}

function SortableItem({ id, text, onTextChange, onDelete, isPreview }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 0 };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-4 bg-[#fafcfc] border border-slate-100 p-4 rounded-2xl group ${isDragging ? 'shadow-2xl' : ''}`}>
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-[#00685f]"><GripVertical size={20}/></div>
      {isPreview ? (
        <div className="flex-1 font-bold text-[#3d4947]">{text}</div>
      ) : (
        <input value={text} onChange={(e) => onTextChange(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-bold text-[#3d4947]" placeholder="Enter step text..." />
      )}
      {!isPreview && <Trash2 size={16} className="text-red-200 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100" onClick={onDelete} />}
    </div>
  );
}

function HotspotBlock({ content, onUpdate, isPreview }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const spots = content.hotspots || [];

  const handleImageClick = (e: any) => {
    if (!isAdding) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newSpot = { id: Date.now().toString(), x, y, label: '', isCorrect: false };
    onUpdate({ hotspots: [...spots, newSpot] });
    setIsAdding(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpdate({ image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const setDefaultImage = () => {
    onUpdate({ image: 'https://images.unsplash.com/photo-1454165833767-027ffea9e4ae?q=80&w=2070&auto=format&fit=crop' });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Question input */}
      {!isPreview ? (
        <input 
          value={content.question || ''}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your hotspot question..."
          className="w-full text-lg font-semibold outline-none border-b-2 border-[#bcc9c6] pb-2 focus:border-[#00685f]"
        />
      ) : (
        content.question && (
          <h2 className="w-full text-lg font-semibold border-b-2 border-[#bcc9c6] pb-2 text-[#191c1e]">
            {content.question}
          </h2>
        )
      )}

      {/* Image area - fixed height not full screen */}
      <div className="relative w-full h-64 border-2 border-dashed border-[#bcc9c6] rounded-lg overflow-hidden">
        {content.image ? (
          <div className="w-full h-full relative" onClick={handleImageClick}>
            <img src={content.image} className="w-full h-full object-cover" />
            {isAdding && (
              <div className="absolute inset-0 cursor-crosshair bg-transparent" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full cursor-pointer" onClick={setDefaultImage}>
            <ImageIcon className="w-8 h-8 text-[#6d7a77] mb-2" />
            <p className="text-sm text-[#6d7a77]">Click to set base image</p>
          </div>
        )}
        
        {spots.map((spot: any, i: number) => (
          <div 
            key={spot.id} 
            onClick={() => { if(isPreview) setSelectedSpot(spot); }}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-lg transition-transform ${
              isPreview 
                ? selectedSpot?.id === spot.id 
                    ? (spot.isCorrect ? 'bg-green-500 scale-125' : 'bg-red-500 scale-125') 
                    : 'bg-[#131b2e]/80 hover:bg-[#131b2e] shadow-[0_0_0_4px_rgba(255,255,255,0.4)] hover:scale-110'
                : spot.isCorrect ? 'bg-[#00685f]' : 'bg-[#131b2e]'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      
      {isPreview && selectedSpot && (
        <div className="mt-4 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
           <p className={`font-bold text-lg ${selectedSpot.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
             {selectedSpot.isCorrect ? '✓ Spot Located Correctly!' : '✗ Incorrect Area'}
           </p>
           {selectedSpot.label && <p className="text-slate-500 mt-1">{selectedSpot.label}</p>}
        </div>
      )}

      {/* Buttons row */}
      {!isPreview && (
        <div className="flex gap-3">
          <label className="flex-1 py-2 border border-[#bcc9c6] rounded-lg text-sm text-center cursor-pointer hover:border-[#00685f] transition-colors">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            Upload Image
          </label>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAdding 
                ? 'bg-[#00685f] text-white' 
                : 'border border-[#00685f] text-[#00685f]'
            }`}
          >
            {isAdding ? 'Click on image...' : '+ Add Hotspot'}
          </button>
        </div>
      )}

      {/* Hotspot list - fully visible */}
      {!isPreview && (
        <div className="flex flex-col gap-2">
          {spots.map((spot: any, i: number) => (
            <div key={spot.id} className="flex items-center gap-3 p-3 border border-[#bcc9c6] rounded-lg bg-white">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                spot.isCorrect ? 'bg-[#00685f]' : 'bg-[#131b2e]'
              }`}>
                {i + 1}
              </span>
              <input
                value={spot.label}
                onChange={(e) => {
                  const n = [...spots];
                  n[i].label = e.target.value;
                  onUpdate({ hotspots: n });
                }}
                placeholder="Hotspot label..."
                className="flex-1 outline-none text-sm text-[#191c1e]"
              />
              <label className="flex items-center gap-1.5 text-xs text-[#6d7a77] cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={spot.isCorrect}
                  onChange={(e) => {
                    const n = [...spots];
                    n[i].isCorrect = e.target.checked;
                    onUpdate({ hotspots: n });
                  }}
                  className="accent-[#00685f]"
                />
                Correct
              </label>
              <button onClick={() => onUpdate({ hotspots: spots.filter((s:any) => s.id !== spot.id) })}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabsBlock({ layout, content, onUpdate, isPreview }: any) {
  const it = (content.items && content.items.length > 0) ? content.items : [{ id: '1', title: 'Tab 1', content: '' }];
  const [at, setAt] = useState(it[0]?.id || '1');
  
  return (
    <div className={`max-w-4xl mx-auto flex ${layout === 'v-tabs' ? 'gap-10' : 'flex-col gap-6'}`}>
      <div className={`flex shrink-0 ${layout === 'v-tabs' ? 'flex-col min-w-[180px]' : 'flex-wrap border-b border-slate-100 pb-2'}`}>
        {it.map((tab:any, idx:any) => (
          <div key={tab.id} className="relative group/tab">
            <button onClick={() => setAt(tab.id)} className={`px-6 py-3 text-[10px] font-black uppercase rounded-xl ${at === tab.id ? 'bg-[#00685f] text-white' : 'text-slate-400'}`}>
              <input value={tab.title} onClick={(e) => e.stopPropagation()} onChange={(e) => { const n = [...it]; n[idx].title = e.target.value; onUpdate({ items: n }); }} className="bg-transparent border-none p-0 outline-none w-20 uppercase font-black" />
            </button>
            <X size={12} className="absolute -top-1 -right-1 opacity-0 group-hover/tab:opacity-100 text-red-500 cursor-pointer" onClick={() => onUpdate({ items: it.filter((t:any) => t.id !== tab.id) })} />
          </div>
        ))}
        <button onClick={() => onUpdate({ items: [...it, { id: Date.now().toString(), title: `New Tab`, content: '' }] })} className="px-4 py-2 text-[#00685f] font-black text-[9px] uppercase">+ Tab</button>
      </div>
      <div className="flex-1 min-h-[300px] bg-slate-50/50 rounded-[2.5rem] p-10">
        {it.map((t:any, idx: number) => t.id === at && (
          <RichTextBlock 
            key={t.id} 
            content={t.content} 
            onChange={(html) => { 
              const n = [...it]; 
              n[idx].content = html; 
              onUpdate({ items: n }); 
            }} 
            isPreview={isPreview}
          />
        ))}
      </div>
    </div>
  );
}

function TrueFalseBlock({ content, onUpdate, isPreview }: any) {
  const qu = content.quiz || { question: '', correct: null, explanation: '' }; 
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  if (isPreview) {
    return (
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="w-full text-3xl font-black text-[#131b2e] border-b-4 border-slate-100 pb-6">{qu.question}</div>
        <div className="flex gap-6 mt-4">
          <button onClick={() => !submitted && setSelected('true')} className={`flex-1 py-10 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all ${submitted && selected === 'true' ? qu.correct === 'true' ? 'bg-green-500 text-white shadow-2xl' : 'bg-red-500 text-white shadow-2xl' : selected === 'true' ? 'bg-[#00685f] text-white shadow-2xl' : 'border-2 border-[#bcc9c6] bg-slate-50 text-slate-400 hover:border-[#00685f]'}`}><Check size={28}/> TRUE</button>
          <button onClick={() => !submitted && setSelected('false')} className={`flex-1 py-10 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all ${submitted && selected === 'false' ? qu.correct === 'false' ? 'bg-green-500 text-white shadow-2xl' : 'bg-red-500 text-white shadow-2xl' : selected === 'false' ? 'bg-[#00685f] text-white shadow-2xl' : 'border-2 border-[#bcc9c6] bg-slate-50 text-slate-400 hover:border-[#00685f]'}`}><X size={28}/> FALSE</button>
        </div>
        {!submitted && selected && <button onClick={() => setSubmitted(true)} className="w-full mt-3 py-4 bg-[#131b2e] text-teal-400 font-black tracking-widest uppercase text-xs rounded-[2rem]">Submit Answer</button>}
        {submitted && (
          <div className="flex flex-col gap-4 mt-8">
            <p className={`text-center font-bold text-xl ${selected === qu.correct ? 'text-green-500' : 'text-red-500'}`}>{selected === qu.correct ? '✓ Correct!' : '✗ Incorrect. Try again!'}</p>
            {qu.explanation && <div className="bg-slate-50 rounded-[2rem] p-8 text-[#131b2e] font-medium"><p className="text-[10px] uppercase font-black tracking-widest text-[#00685f] mb-2">Explanation</p>{qu.explanation}</div>}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <input value={qu.question} onChange={(e) => onUpdate({ quiz: { ...qu, question: e.target.value } })} placeholder="Enter question..." className="w-full text-3xl font-black text-[#131b2e] border-b-4 border-slate-100 pb-6 outline-none focus:border-[#00685f]/20" />
      <div className="flex gap-6">
        <button onClick={() => onUpdate({ quiz: { ...qu, correct: 'true' } })} className={`flex-1 py-10 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 ${qu.correct === 'true' ? 'bg-[#00685f] text-white shadow-2xl' : 'bg-slate-50 text-slate-400'}`}><Check size={28}/> TRUE</button>
        <button onClick={() => onUpdate({ quiz: { ...qu, correct: 'false' } })} className={`flex-1 py-10 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 ${qu.correct === 'false' ? 'bg-red-500 text-white shadow-2xl' : 'bg-slate-50 text-slate-400'}`}><X size={28}/> FALSE</button>
      </div>
      <div className="bg-slate-50 rounded-[2rem] p-8">
        <label className="text-[9px] font-black uppercase text-slate-400 block mb-3">Explanation</label>
        <textarea value={qu.explanation} onChange={(e) => onUpdate({ quiz: { ...qu, explanation: e.target.value } })} className="w-full bg-transparent border-none outline-none resize-none font-medium" rows={3} />
      </div>
    </div>
  ); 
}

function MCQuizBlock({ content, onUpdate, isPreview }: any) {
  const qu = content.quiz || { question: '', options: ['', '', '', ''], correct: null, explanation: '' }; 
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  if (isPreview) {
    return (
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="w-full text-3xl font-black text-[#131b2e] border-b-4 border-slate-100 pb-6">{qu.question}</div>
        <div className="space-y-4">
          {qu.options.map((opt:any, i:any) => (
            <div key={i} onClick={() => !submitted && setSelected(i)} className={`flex items-center gap-5 p-5 rounded-[2rem] border-2 cursor-pointer transition-all ${submitted && selected === i ? qu.correct === i ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10' : selected === i ? 'border-[#00685f] bg-[#00685f]/5 shadow-xl' : 'border-slate-50 bg-white hover:border-[#00685f]/30'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${submitted && selected === i ? qu.correct === i ? 'bg-green-500 text-white' : 'bg-red-500 text-white' : selected === i ? 'bg-[#00685f] text-white' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65+i)}</div>
              <div className="flex-1 font-bold text-[#131b2e]">{opt}</div>
            </div>
          ))}
        </div>
        {!submitted && selected !== null && <button onClick={() => setSubmitted(true)} className="w-full mt-3 py-4 bg-[#131b2e] text-teal-400 font-black tracking-widest uppercase text-xs rounded-[2rem]">Submit Answer</button>}
        {submitted && (
          <div className="flex flex-col gap-4 mt-8">
            <p className={`text-center font-bold text-xl ${selected === qu.correct ? 'text-green-500' : 'text-red-500'}`}>{selected === qu.correct ? '✓ Correct!' : '✗ Incorrect. Try again!'}</p>
            {qu.explanation && <div className="bg-slate-50 rounded-[2rem] p-8 text-[#131b2e] font-medium"><p className="text-[10px] uppercase font-black tracking-widest text-[#00685f] mb-2">Explanation</p>{qu.explanation}</div>}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <input value={qu.question} onChange={(e) => onUpdate({ quiz: { ...qu, question: e.target.value } })} className="w-full text-3xl font-black text-[#131b2e] border-b-4 border-slate-100 pb-6 outline-none" />
      <div className="space-y-4">
        {qu.options.map((opt:any, i:any) => (
          <div key={i} onClick={() => onUpdate({ quiz: { ...qu, correct: i } })} className={`flex items-center gap-5 p-5 rounded-[2rem] border-2 cursor-pointer ${qu.correct === i ? 'border-[#00685f] bg-[#00685f]/5 shadow-xl' : 'border-slate-50'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${qu.correct === i ? 'bg-[#00685f] text-white' : 'bg-white text-slate-400'}`}>{String.fromCharCode(65+i)}</div>
            <input value={opt} onChange={(e) => { const n = [...qu.options]; n[i] = e.target.value; onUpdate({ quiz: { ...qu, options: n } }); }} onClick={(e) => e.stopPropagation()} className="flex-1 bg-transparent border-none outline-none font-bold" />
          </div>
        ))}
      </div>
      <div className="bg-slate-50 rounded-[2rem] p-8">
        <label className="text-[9px] font-black uppercase text-slate-400 block mb-3">Explanation</label>
        <textarea value={qu.explanation || ''} onChange={(e) => onUpdate({ quiz: { ...qu, explanation: e.target.value } })} className="w-full bg-transparent border-none outline-none resize-none font-medium" rows={3} />
      </div>
    </div>
  ); 
}

function FlashcardBlock({ content, onUpdate }: any) {
  const fc = content.flashcard || { front: '', back: '' }; 
  const [fl, setFl] = useState(false); 
  
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        <div>
          <label className="text-[9px] font-black text-slate-400 uppercase">Front</label>
          <textarea value={fc.front} onChange={(e) => onUpdate({ flashcard: { ...fc, front: e.target.value } })} className="w-full h-32 bg-[#fafcfc] border rounded-[2rem] p-6 text-sm font-black outline-none shadow-inner" />
        </div>
        <div>
          <label className="text-[9px] font-black text-slate-400 uppercase">Back</label>
          <textarea value={fc.back} onChange={(e) => onUpdate({ flashcard: { ...fc, back: e.target.value } })} className="w-full h-32 bg-[#fafcfc] border rounded-[2rem] p-6 text-sm outline-none shadow-inner" />
        </div>
      </div>
      <div className="w-full max-w-md">
        <motion.div className="w-full h-64 cursor-pointer" onClick={() => setFl(!fl)} style={{ perspective: 1200 }}>
          <motion.div className="w-full h-full relative" animate={{ rotateY: fl ? 180 : 0 }} transition={{ duration: 0.6 }} style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-[#00685f] rounded-[3rem] flex items-center justify-center p-12 shadow-2xl" style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-white font-black text-2xl text-center leading-tight">{fc.front || 'Prompt'}</p>
            </div>
            <div className="absolute inset-0 bg-[#131b2e] rounded-[3rem] flex items-center justify-center p-12 shadow-2xl" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
              <p className="text-teal-400 font-bold text-center text-lg">{fc.back || 'Answer'}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
