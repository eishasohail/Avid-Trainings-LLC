"use client";

import { useState } from "react";
import { GripVertical, Trash2, Edit3, Plus, ChevronDown } from "lucide-react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import LectureRow from "./LectureRow";
import { motion, AnimatePresence } from "framer-motion";
import Folder from "@/components/reactbits/Folder/Folder";

interface Page {
  id: string;
  title: string;
}

interface Lecture {
  id: string;
  title: string;
  pages: Page[];
}

interface SectionRowProps {
  id: string;
  courseId: string;
  index: number;
  title: string;
  lectures: Lecture[];
  onRenameSection: (newTitle: string) => void;
  onDeleteSection: () => void;
  onAddLecture: () => void;
  onRenameLecture: (lectureId: string, newTitle: string) => void;
  onDeleteLecture: (lectureId: string) => void;
  onAddPage: (lectureId: string) => void;
  onEditLecture: (lectureId: string) => void;
  onDeletePage: (lectureId: string, pageId: string) => void;
}

export default function SectionRow({ 
  id, 
  courseId, 
  index, 
  title, 
  lectures, 
  onRenameSection, 
  onDeleteSection, 
  onAddLecture,
  onRenameLecture,
  onDeleteLecture,
  onAddPage,
  onEditLecture,
  onDeletePage
}: SectionRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    if (editValue.trim()) {
      onRenameSection(editValue);
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
          className={`bg-white border border-[#bcc9c6]/30 rounded-[32px] overflow-hidden transition-all duration-500 mb-8 shadow-sm ${
            snapshot.isDragging ? "shadow-3xl border-[#00685f]/40 z-[1000] scale-[1.02]" : "hover:shadow-xl group/card"
          }`}
        >
          {/* Section Header */}
          <div className="p-8">
             <div className="flex items-center justify-between mb-4">
                <div className="px-4 py-2 bg-[#ebfaf8] border border-[#00685f]/20 rounded-full flex items-center justify-center text-[10px] font-black text-[#00685f] uppercase tracking-widest leading-none shrink-0">
                   Section {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex items-center gap-2">
                   {isExpanded && (
                     <button 
                       onClick={onAddLecture}
                       className="px-4 py-2 bg-[#ebfaf8] border border-[#00685f]/10 text-[#00685f] hover:bg-[#00685f] hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 animate-in fade-in zoom-in duration-300"
                     >
                        <Plus className="w-4 h-4" /> Add Lecture
                     </button>
                   )}
                   <button 
                     onClick={() => setIsEditing(true)}
                     className="p-3 text-[#6d7a77] hover:text-[#00685f] hover:bg-[#ebfaf8] rounded-xl transition-all"
                   >
                      <Edit3 className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={onDeleteSection}
                     className="p-3 text-[#6d7a77] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                   
                   <div className="w-[1px] h-6 bg-[#bcc9c6]/20 mx-2" />
                   
                   <button
                     onClick={() => setIsExpanded(!isExpanded)}
                     className={`p-3 rounded-xl transition-all ${isExpanded ? 'bg-[#131b2e] text-white shadow-lg' : 'text-[#6d7a77] hover:bg-[#f0f4f4]'}`}
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

             <div 
               onClick={() => !isEditing && setIsExpanded(!isExpanded)}
               className="flex items-center gap-6 cursor-pointer group/folder"
             >
                <div 
                  {...provided.dragHandleProps}
                  className="text-[#bcc9c6] group-hover/folder:text-[#00685f] transition-all cursor-grab active:cursor-grabbing"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-4 flex-1">
                   <Folder 
                     size={1.5} 
                     color="#00685f"
                     isOpen={isExpanded}
                     className="custom-folder"
                   />
                   <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSave}
                          onKeyDown={(e) => e.key === "Enter" && handleSave()}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-transparent text-xl font-black text-[#191c1e] outline-none border-b-2 border-[#00685f] transition-all"
                        />
                      ) : (
                        <h3 className="text-xl font-black text-[#191c1e] transition-colors group-hover/folder:text-[#00685f] tracking-tighter">
                          {title}
                        </h3>
                      )}
                   </div>
                </div>
             </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-[#f0f4f4] bg-[#fafcfc]"
              >
                <Droppable droppableId={id} type="lecture">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-8 pl-16 space-y-4 transition-all ${
                        snapshot.isDraggingOver ? "bg-[#ebfaf8]/30" : ""
                      }`}
                    >
                      {lectures.map((lecture, i) => (
                        <LectureRow 
                          key={lecture.id}
                          id={lecture.id}
                          courseId={courseId}
                          index={i}
                          title={lecture.title}
                          pages={lecture.pages}
                          onRename={(newTitle) => onRenameLecture(lecture.id, newTitle)}
                          onDelete={() => onDeleteLecture(lecture.id)}
                          onAddPage={() => onAddPage(lecture.id)}
                          onEdit={() => onEditLecture(lecture.id)}
                          onDeletePage={(pId) => onDeletePage(lecture.id, pId)}
                        />
                      ))}
                      
                      <button 
                        onClick={onAddLecture}
                        className="w-full py-5 border-2 border-dashed border-[#bcc9c6]/40 hover:border-[#00685f]/40 hover:bg-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase text-[#6d7a77] hover:text-[#00685f] transition-all group/dash"
                      >
                         <Plus className="w-4 h-4 transition-transform group-hover/dash:rotate-90" />
                         Add New Lecture
                      </button>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Draggable>
  );
}
