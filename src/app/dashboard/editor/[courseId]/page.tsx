"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Globe, 
  ChevronRight, 
  Layers,
  Settings, 
  ChevronDown, 
  Image as ImageIcon, 
  Trash2, 
  Clock, 
  FileText, 
  BookOpen,
  X
} from "lucide-react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import SectionRow from "@/components/editor/CourseStructure/SectionRow";
import DeleteConfirmModal from "@/components/editor/CourseStructure/DeleteConfirmModal";
import { getAllCourses } from '@/lib/utils/courseUtils';
import { Course, DUMMY_COURSES } from '@/lib/data/dummyData';

export default function CourseStructurePage() {
  const router = useRouter();
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    type: "section" | "lecture" | "page" | "course"; 
    targetId: string; 
    parentId?: string;
    grandParentId?: string;
  } | null>(null);

  const [settingsModal, setSettingsModal] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const allCourses = getAllCourses();
    const found = allCourses.find(c => c.id === courseId);
    if (!found) {
      router.push('/dashboard/editor');
      return;
    }
    setCourse(found);
    setSections(found.sections || []);
    
    // Load local thumbnail
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`avid-thumbnail-${courseId}`);
      if (saved) setThumbnail(saved);
    }
  }, [courseId, router]);

  // Initializing ALL pages for a lecture upfront
  useEffect(() => {
    if (!course || !course.sections) return;
    
    course.sections.forEach(section => {
      section.lectures.forEach((lecture: any) => {
        const storageKey = `avid-pages-${lecture.id}`;
        const existing = localStorage.getItem(storageKey);
        
        if (!existing) {
          // Create all pages for this lecture based on count from dummy data
          const pagesCount = typeof lecture.pages === 'number' ? lecture.pages : 1;
          const initialPages = Array.from({ length: pagesCount }, (_, i) => ({
            id: `${lecture.id}-p${i + 1}`,
            lectureId: lecture.id,
            title: `Page ${i + 1}`,
            heading: '',
            layout: null,
            content: {},
            status: 'draft',
            infoPopup: null
          }));
          localStorage.setItem(storageKey, JSON.stringify(initialPages));
        }
      });
    });
  }, [course]);

  const saveToStorage = (updatedFields: Partial<Course>) => {
    if (!course) return;
    setIsSaving(true);
    
    const today = new Date().toISOString().split('T')[0];
    const isDummy = DUMMY_COURSES.some(dc => dc.id === course.id);
    
    if (isDummy) {
      const overrides = JSON.parse(localStorage.getItem('avid-course-overrides') || '{}');
      overrides[course.id] = { 
        ...overrides[course.id], 
        ...updatedFields,
        updatedAt: today 
      };
      localStorage.setItem('avid-course-overrides', JSON.stringify(overrides));
    } else {
      const stored = localStorage.getItem('avid-courses');
      const localCourses: Course[] = stored ? JSON.parse(stored) : [];
      const updatedLocal = localCourses.map(lc => 
        lc.id === course.id ? { ...lc, ...updatedFields, updatedAt: today } : lc
      );
      localStorage.setItem('avid-courses', JSON.stringify(updatedLocal));
    }
    
    setCourse({ ...course, ...updatedFields });
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    let newSections = Array.from(sections);
    if (type === "section") {
      const [removed] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, removed);
      toast.success("Section reordered.");
    } else {
      const sourceSectionIndex = sections.findIndex(s => s.id === source.droppableId);
      const destSectionIndex = sections.findIndex(s => s.id === destination.droppableId);
      
      const sourceLectures = Array.from(newSections[sourceSectionIndex].lectures);
      const [removed] = sourceLectures.splice(source.index, 1);

      if (sourceSectionIndex === destSectionIndex) {
        sourceLectures.splice(destination.index, 0, removed);
        newSections[sourceSectionIndex].lectures = sourceLectures;
      } else {
        const destLectures = Array.from(newSections[destSectionIndex].lectures);
        destLectures.splice(destination.index, 0, removed);
        newSections[sourceSectionIndex].lectures = sourceLectures;
        newSections[destSectionIndex].lectures = destLectures;
      }
      toast.success("Lecture reordered.");
    }
    setSections(newSections);
    saveToStorage({ sections: newSections });
  };

  const addSection = () => {
    const newSection = {
      id: `s${Date.now()}`,
      title: "New Section",
      lectures: []
    };
    const updated = [...sections, newSection];
    setSections(updated);
    saveToStorage({ sections: updated });
    toast.success("Section added.");
  };

  const deleteSection = (id: string) => {
    const updated = sections.filter(s => s.id !== id);
    setSections(updated);
    saveToStorage({ sections: updated });
    toast.error("Section deleted.");
  };

  const addLecture = (sectionId: string) => {
    const lectureId = `lec-${Date.now()}`;
    const storageKey = `avid-pages-${lectureId}`;
    const firstPage = {
      id: `${lectureId}-p1`,
      lectureId,
      title: 'Page 1',
      heading: '',
      layout: null,
      content: {},
      status: 'draft',
      infoPopup: null
    };
    localStorage.setItem(storageKey, JSON.stringify([firstPage]));

    const updated = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lectures: [...s.lectures, { id: lectureId, title: "New Lecture", pages: 1 }]
        };
      }
      return s;
    });
    setSections(updated);
    saveToStorage({ sections: updated });
    toast.success("Lecture added.");
  };

  const deleteLecture = (sectionId: string, lectureId: string) => {
    const updated = sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, lectures: s.lectures.filter((l: any) => l.id !== lectureId) };
      }
      return s;
    });
    setSections(updated);
    saveToStorage({ sections: updated });
    toast.error("Lecture deleted.");
  };

  const addPage = (sectionId: string, lectureId: string) => {
    const storageKey = `avid-pages-${lectureId}`;
    const existing = localStorage.getItem(storageKey);
    const storedPages = existing ? JSON.parse(existing) : [];
    
    const newPageId = `${lectureId}-p${Date.now()}`;
    const newPage = {
      id: newPageId,
      lectureId,
      title: `Page ${storedPages.length + 1}`,
      heading: '',
      layout: null,
      content: {},
      status: 'draft',
      infoPopup: null
    };
    
    const updatedLocalStorage = [...storedPages, newPage];
    localStorage.setItem(storageKey, JSON.stringify(updatedLocalStorage));

    const updated = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lectures: s.lectures.map((l: any) => {
            if (l.id === lectureId) {
              return { ...l, pages: (l.pages || 0) + 1 };
            }
            return l;
          })
        };
      }
      return s;
    });
    setSections(updated);
    saveToStorage({ sections: updated });
    toast.success("Page added.");
  };

  const handleEditLecture = (lectureId: string) => {
    const storageKey = `avid-pages-${lectureId}`;
    const existing = localStorage.getItem(storageKey);
    
    if (existing) {
      const pages = JSON.parse(existing);
      if (pages.length > 0) {
        router.push(`/dashboard/editor/${courseId}/${lectureId}/${pages[0].id}`);
        return;
      }
    }
    
    // Create first page if missing
    const firstPage = {
      id: `${lectureId}-p1`,
      lectureId,
      title: 'Page 1',
      heading: '',
      layout: null,
      content: {},
      status: 'draft',
      infoPopup: null
    };
    localStorage.setItem(storageKey, JSON.stringify([firstPage]));
    router.push(`/dashboard/editor/${courseId}/${lectureId}/${firstPage.id}`);
  };

  const deletePage = (sectionId: string, lectureId: string) => {
    const updated = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lectures: s.lectures.map((l: any) => {
            if (l.id === lectureId) {
              return { ...l, pages: Math.max(0, (l.pages || 0) - 1) };
            }
            return l;
          })
        };
      }
      return s;
    });
    setSections(updated);
    saveToStorage({ sections: updated });
    toast.error("Page removed.");
  };

  const renameSection = (sectionId: string, newTitle: string) => {
    const updated = sections.map(s => s.id === sectionId ? { ...s, title: newTitle } : s);
    setSections(updated);
    saveToStorage({ sections: updated });
  };

  const renameLecture = (sectionId: string, lectureId: string, newTitle: string) => {
    const updated = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lectures: s.lectures.map((l: any) => l.id === lectureId ? { ...l, title: newTitle } : l)
        };
      }
      return s;
    });
    setSections(updated);
    saveToStorage({ sections: updated });
  };

  const totalLecturesCount = useMemo(() => sections.reduce((acc, s) => acc + s.lectures.length, 0), [sections]);
  const totalPagesCount = useMemo(() => sections.reduce((acc, s) => acc + s.lectures.reduce((lAcc: number, l: any) => lAcc + (l.pages || 0), 0), 0), [sections]);

  const handleDeleteCourse = () => {
    if (!course) return;
    const isDummy = DUMMY_COURSES.some(dc => dc.id === course.id);
    if (isDummy) {
      const deleted = JSON.parse(localStorage.getItem('avid-deleted-courses') || '[]');
      if (!deleted.includes(course.id)) {
        deleted.push(course.id);
        localStorage.setItem('avid-deleted-courses', JSON.stringify(deleted));
      }
    } else {
      const stored = localStorage.getItem('avid-courses');
      const localCourses: Course[] = stored ? JSON.parse(stored) : [];
      const updatedLocal = localCourses.filter(lc => lc.id !== course.id);
      localStorage.setItem('avid-courses', JSON.stringify(updatedLocal));
    }
    router.push('/dashboard/editor');
  };

  const togglePublish = () => {
    if (!course) return;
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    saveToStorage({ status: newStatus });
    toast.success(newStatus === 'published' ? "Course published!" : "Course set to draft.");
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && course) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setThumbnail(base64String);
        localStorage.setItem(`avid-thumbnail-${course.id}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const totalRuntimeMinutes = totalPagesCount * 3;
  const runtimeHours = Math.floor(totalRuntimeMinutes / 60);
  const runtimeMins = totalRuntimeMinutes % 60;

  if (!course) return null;

  return (
    <DashboardWrapper loadingMessage="Opening Course Structure...">
      {(user) => (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up pb-20 pt-10">
           <Toaster />
           
           {/* REDESIGNED HEADER AS A UNIFIED CARD */}
           <header className="bg-white border border-slate-200 shadow-sm rounded-[40px] overflow-hidden">
              {/* Top Navigation & Action Row */}
              <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                 <div className="flex items-center gap-6">
                    <button 
                      onClick={() => router.push("/dashboard/editor")}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#00685f] hover:border-[#00685f]/30 transition-all active:scale-95 shadow-sm"
                    >
                       <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                       <span>AVID EDITOR</span>
                       <ChevronRight className="w-3 h-3 opacity-30" />
                       <span className="text-[#00685f]">Course Structure</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                       <div className={`w-2 h-2 ${isSaving ? 'bg-orange-500' : 'bg-emerald-500'} rounded-full ${isSaving ? 'animate-bounce' : ''}`} />
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {isSaving ? 'Saving' : 'Synced'}
                       </span>
                    </div>
                    <button 
                      onClick={() => setSettingsModal(true)}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#131b2e] hover:border-[#131b2e]/30 transition-all active:scale-95 shadow-sm"
                    >
                       <Settings className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={togglePublish}
                      className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 border shadow-sm ${
                        course.status === 'published' 
                          ? 'bg-[#ebfaf8] text-[#00685f] border-[#00685f]/20' 
                          : 'bg-[#131b2e] text-white border-transparent hover:bg-[#00685f]'
                      }`}
                    >
                       <Globe className="w-3.5 h-3.5" /> {course.status === 'published' ? 'Live' : 'Draft'}
                    </button>
                 </div>
              </div>

              {/* Main Info Block */}
              <div className="px-10 py-8 space-y-6">
                 <div>
                    <h1 className="text-3xl font-black text-[#131b2e] tracking-tighter uppercase leading-[1.1] max-w-3xl">
                       {course.title}
                    </h1>
                 </div>

                 <div className="flex flex-wrap items-center gap-6">
                    {/* Meta Dropdowns */}
                    <div className="flex items-center gap-3 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                       <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Standard</span>
                          <select 
                            value={course.isoStandard}
                            onChange={(e) => saveToStorage({ isoStandard: e.target.value })}
                            className="bg-transparent font-black text-[#131b2e] text-[11px] outline-none cursor-pointer pr-1"
                          >
                            {['ISO 27001', 'ISO 9001', 'ISO 45001', 'ISO 14001', 'ISO 31000'].map(std => (
                              <option key={std} value={std}>{std}</option>
                            ))}
                          </select>
                       </div>
                       <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Level</span>
                          <select 
                            value={course.category}
                            onChange={(e) => saveToStorage({ category: e.target.value })}
                            className="bg-transparent font-black text-[#131b2e] text-[11px] outline-none cursor-pointer pr-1"
                          >
                            {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                       </div>
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 hidden md:block mx-4" />

                    {/* Stats List */}
                    <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-[#6d7a77]">
                       <div className="flex items-center gap-3 group">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#00685f] group-hover:bg-[#00685f] group-hover:text-white transition-all shadow-sm">
                             <Layers className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[#131b2e]">{sections.length}</span>
                             <span className="text-[8px] text-slate-400 mt-0.5">Sections</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 group">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#00685f] group-hover:bg-[#00685f] group-hover:text-white transition-all shadow-sm">
                             <BookOpen className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[#131b2e]">{totalLecturesCount}</span>
                             <span className="text-[8px] text-slate-400 mt-0.5">Lectures</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 group">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#00685f] group-hover:bg-[#00685f] group-hover:text-white transition-all shadow-sm">
                             <Clock className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[#131b2e] text-xs lowercase">
                               {runtimeHours > 0 ? `${runtimeHours}h ` : ''}{runtimeMins}m
                             </span>
                             <span className="text-[8px] text-slate-400 mt-0.5">Estimated</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </header>

           <div className="max-w-4xl mx-auto space-y-12">
              <div className="flex items-end justify-between border-b-2 border-slate-100 pb-6">
                 <div className="space-y-1">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00685f]">Building Blocks</h2>
                    <p className="text-sm font-medium text-slate-400">Manage your learning journey flow below.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Drag to reorder</span>
                 </div>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections" type="section">
                   {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-4 mb-12 min-h-[50px] transition-all ${snapshot.isDraggingOver ? 'scale-[0.99] opacity-90' : ''}`}
                      >
                         {sections.length > 0 ? (
                           sections.map((section, index) => (
                             <SectionRow 
                               key={section.id} 
                               id={section.id} 
                               courseId={courseId} 
                               index={index} 
                               title={section.title} 
                               lectures={section.lectures}
                               onRenameSection={(val) => renameSection(section.id, val)}
                               onDeleteSection={() => setDeleteModal({ isOpen: true, type: "section", targetId: section.id })}
                               onAddLecture={() => addLecture(section.id)}
                               onRenameLecture={(lId, val) => renameLecture(section.id, lId, val)}
                               onDeleteLecture={(lId) => setDeleteModal({ isOpen: true, type: "lecture", targetId: lId, parentId: section.id })}
                               onAddPage={(lId) => addPage(section.id, lId)}
                               onEditLecture={handleEditLecture}
                               onDeletePage={(lId, pId) => setDeleteModal({ isOpen: true, type: "page", targetId: pId, parentId: lId, grandParentId: section.id })}
                             />
                           ))
                         ) : (
                           <div className="py-72 flex flex-col items-center justify-center space-y-10 border-4 border-dashed border-[#bcc9c6]/20 rounded-[64px] bg-white opacity-40 hover:opacity-100 transition-opacity group">
                              <div className="w-32 h-32 bg-[#00685f]/5 rounded-[44px] flex items-center justify-center text-[#00685f] group-hover:scale-110 transition-all duration-700">
                                 <Layers className="w-16 h-16" />
                              </div>
                              <div className="text-center space-y-4">
                                 <h3 className="text-3xl font-black text-[#131b2e] tracking-tighter uppercase">Structure Empty</h3>
                                 <p className="text-sm font-medium text-[#6d7a77] max-w-xs leading-relaxed">Add your first section to begin building your course.</p>
                                 <button 
                                  onClick={addSection}
                                  className="px-10 py-5 bg-[#131b2e] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#00685f] transition-all"
                                 >
                                     Add Section
                                 </button>
                              </div>
                           </div>
                         )}
                         {provided.placeholder}
                      </div>
                   )}
                </Droppable>
              </DragDropContext>

              {sections.length > 0 && (
                <button 
                  onClick={addSection}
                  className="w-full py-10 border-3 border-dashed border-[#bcc9c6]/40 rounded-[40px] flex items-center justify-center gap-4 text-[#6d7a77] hover:border-[#00685f]/40 hover:bg-white hover:text-[#00685f] hover:shadow-2xl hover:-translate-y-1 transition-all group"
                >
                   <div className="w-12 h-12 bg-[#bcc9c6]/10 group-hover:bg-[#ebfaf8] rounded-2xl flex items-center justify-center transition-all">
                      <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                   </div>
                   <span className="text-[13px] font-black uppercase tracking-[0.3em]">Add New Section</span>
                </button>
              )}
           </div>

           {/* Settings Modal */}
           <AnimatePresence>
              {settingsModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSettingsModal(false)}
                    className="absolute inset-0 bg-[#131b2e]/60 backdrop-blur-md"
                   />
                   <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-xl bg-white rounded-[48px] shadow-3xl overflow-hidden p-12 space-y-10"
                   >
                     <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-[#131b2e] uppercase tracking-tighter">Advanced Settings</h2>
                        <button onClick={() => setSettingsModal(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-all">
                           <X className="w-6 h-6" />
                        </button>
                     </div>

                     <div className="space-y-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77]">Course Identity</label>
                           <div className="relative aspect-video bg-slate-50 border-2 border-dashed border-[#bcc9c6]/30 rounded-[32px] overflow-hidden group">
                              {thumbnail ? (
                                <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                   <ImageIcon className="w-8 h-8 text-slate-200" />
                                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No Thumbnail</p>
                                </div>
                              )}
                              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                                 <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                                 <Plus className="w-8 h-8 text-white mb-2" />
                                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Update Image</span>
                              </label>
                           </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 space-y-6">
                           <h3 className="text-lg font-black text-[#131b2e] uppercase tracking-tight">Danger Zone</h3>
                           <button 
                             onClick={() => {
                               setSettingsModal(false);
                               setDeleteModal({ isOpen: true, type: "course", targetId: courseId });
                             }}
                             className="w-full py-5 border-2 border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
                           >
                             Delete This Course
                           </button>
                        </div>
                     </div>
                   </motion.div>
                </div>
              )}
           </AnimatePresence>

           <DeleteConfirmModal 
              isOpen={!!deleteModal?.isOpen}
              onClose={() => setDeleteModal(null)}
              title={
                deleteModal?.type === 'course' ? "Delete Course?" :
                deleteModal?.type === 'section' ? "Delete Section?" :
                deleteModal?.type === 'lecture' ? "Delete Lecture?" : "Delete Page?"
              }
              message={
                deleteModal?.type === 'course' ? "Are you sure you want to delete this course? This action cannot be undone." :
                deleteModal?.type === 'section' ? "This will permanently remove all associated lectures and pages inside this section." :
                deleteModal?.type === 'lecture' ? "This will permanently remove all associated pages inside this lecture." :
                "Are you sure you want to remove this page? This action cannot be undone."
              }
              onConfirm={() => {
                const m = deleteModal;
                if (!m) return;
                if (m.type === 'section') deleteSection(m.targetId);
                else if (m.type === 'lecture' && m.parentId) deleteLecture(m.parentId, m.targetId);
                else if (m.type === 'page' && m.parentId && m.grandParentId) deletePage(m.grandParentId, m.parentId);
                else if (m.type === 'course') {
                   handleDeleteCourse();
                }
                setDeleteModal(null);
              }}
            />
        </div>
      )}
    </DashboardWrapper>
  );
}
