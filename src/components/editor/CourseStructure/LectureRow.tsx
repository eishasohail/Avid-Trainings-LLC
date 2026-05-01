"use client";

import { GripVertical, Trash2, ChevronDown, Plus, FileText, Edit3 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageRow from "./PageRow";

interface Page {
  id: string;
  title: string;
}

interface LectureRowProps {
  id: string;
  courseId: string;
  index: number;
  title: string;
  pages: Page[] | number; // Support both models
  onRename: (newTitle: string) => void;
  onDelete: () => void;
  onAddPage: () => void;
  onEdit: () => void;
  onDeletePage: (pageId: string) => void;
}

export default function LectureRow({ 
  id, 
  courseId, 
  index, 
  title, 
  pages, 
  onRename, 
  onDelete, 
  onAddPage,
  onEdit,
  onDeletePage
}: LectureRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isExpanded, setIsExpanded] = useState(false);

  // Normalize pages to an array for mapping
  const pageList = useMemo(() => {
    if (Array.isArray(pages)) return pages;
    return Array.from({ length: pages || 0 }, (_, i) => ({
      id: `p-${id}-${i}`,
      title: `Page ${i + 1}`
    }));
  }, [pages, id]);

  const handleSave = () => {
    if (editValue.trim()) {
      onRename(editValue);
    } else {
      setEditValue(title);
    }
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex flex-col bg-white border border-[#bcc9c6]/20 rounded-2xl transition-all shadow-sm ${
            snapshot.isDragging 
              ? "shadow-2xl border-[#00685f]/30 z-50 ring-2 ring-[#00685f]/10" 
              : "hover:border-[#00685f]/20 hover:shadow-md"
          }`}
        >
          {/* Lecture Header */}
          <div className="flex items-center gap-5 py-4 px-6 group">
            <div 
              {...provided.dragHandleProps}
              className="text-[#bcc9c6] group-hover:text-[#00685f] transition-all cursor-grab active:cursor-grabbing shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-5 h-5" />
            </div>

            <div 
              onClick={() => !isEditing && setIsExpanded(!isExpanded)}
              className="flex items-center gap-4 flex-1 cursor-pointer min-w-0"
            >
              <span className="text-[10px] font-black text-[#6d7a77] uppercase tracking-widest shrink-0">
                 Lecture {index + 1}:
              </span>
              <div className="flex-1 min-w-0">
                 {isEditing ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSave}
                      onKeyDown={(e) => e.key === "Enter" && handleSave()}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-transparent text-sm font-black text-[#191c1e] outline-none border-b-2 border-[#00685f] py-1"
                    />
                 ) : (
                    <p 
                      onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
                      className="text-sm font-black text-[#191c1e] cursor-text whitespace-normal break-words group-hover:text-[#00685f] transition-colors"
                    >
                       {title}
                    </p>
                 )}
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#f7f9fb] border border-[#bcc9c6]/10 rounded-full text-[9px] font-black text-[#6d7a77] uppercase tracking-widest shrink-0">
                  {pageList.length} Pages
               </div>

               <button 
                 onClick={(e) => { e.stopPropagation(); onEdit(); }}
                 className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#f0f4f4] border border-[#bcc9c6]/10 text-[#6d7a77] hover:bg-[#131b2e] hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shrink-0"
               >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
               </button>
               
               <button 
                 onClick={onAddPage}
                 className="px-3 py-1.5 bg-[#ebfaf8] border border-[#00685f]/10 text-[#00685f] hover:bg-[#00685f] hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn shrink-0"
               >
                  <Plus className="w-3.5 h-3.5" /> Page
               </button>
               
               <button 
                 onClick={onDelete}
                 className="p-2 text-[#bcc9c6] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
               >
                  <Trash2 className="w-4 h-4" />
               </button>

               <div className="w-[1px] h-6 bg-[#bcc9c6]/20 mx-1 shrink-0" />

               <button
                 onClick={() => setIsExpanded(!isExpanded)}
                 className={`p-2 rounded-lg transition-all ${isExpanded ? 'bg-[#131b2e] text-white shadow-md' : 'text-[#6d7a77] hover:bg-[#f0f4f4]'}`}
               >
                 <motion.div
                   animate={{ rotate: isExpanded ? 0 : -90 }}
                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
                 >
                    <ChevronDown className="w-5 h-5" />
                 </motion.div>
               </button>
            </div>
          </div>

          {/* Pages List */}
          <AnimatePresence>
             {isExpanded && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 transition={{ duration: 0.35, ease: "easeInOut" }}
                 className="overflow-hidden bg-[#fafcfc] border-t border-[#f0f4f4]"
               >
                 <div className="p-6 pl-16 space-y-3">
                    {pageList.map((page, pIdx) => (
                      <PageRow 
                        key={page.id}
                        id={page.id}
                        courseId={courseId}
                        lectureId={id}
                        index={pIdx}
                        title={page.title}
                        onDelete={() => onDeletePage(page.id)}
                      />
                    ))}
                    
                    <button 
                      onClick={onAddPage}
                      className="w-full py-4 border-2 border-dashed border-[#bcc9c6]/30 hover:border-[#00685f]/40 hover:bg-white rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase text-[#6d7a77] hover:text-[#00685f] transition-all group/dash"
                    >
                       <Plus className="w-4 h-4 transition-transform group-hover/dash:rotate-90" />
                       Add New Page
                    </button>
                 </div>
               </motion.div>
             )}
          </AnimatePresence>
        </div>
      )}
    </Draggable>
  );
}
