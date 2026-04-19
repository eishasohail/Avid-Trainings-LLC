"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Globe, 
  ChevronRight, 
  Layers,
} from "lucide-react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import toast, { Toaster } from "react-hot-toast";

import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import SectionRow from "@/components/editor/CourseStructure/SectionRow";
import CourseSettings from "@/components/editor/CourseStructure/CourseSettings";
import DeleteConfirmModal from "@/components/editor/CourseStructure/DeleteConfirmModal";
import { getAllCourses } from '@/lib/utils/courseUtils';
import { Course, DUMMY_COURSES } from '@/lib/data/dummyData';

export default function CourseStructurePage() {
  const router = useRouter();
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal States
  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    type: "section" | "lecture" | "page" | "course"; 
    targetId: string; 
    parentId?: string;
    grandParentId?: string;
  } | null>(null);

  // Data Loading
  useEffect(() => {
    const allCourses = getAllCourses();
    const found = allCourses.find(c => c.id === courseId);
    if (!found) {
      router.push('/dashboard/editor');
      return;
    }
    setCourse(found);
    setSections(found.sections || []);
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

  if (!course) return null;

  return (
    <DashboardWrapper loadingMessage="Opening Course Structure...">
      {(user) => (
        <div className="space-y-16 animate-fade-in-up">
           <Toaster />
           
           <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#bcc9c6]/20 pb-12">
              <div className="flex items-center gap-8">
                 <button 
                  onClick={() => router.push("/dashboard/editor")}
                  className="w-12 h-12 bg-white border border-[#bcc9c6]/30 rounded-2xl flex items-center justify-center text-[#6d7a77] hover:text-[#0b514c] hover:bg-[#ebfaf8] transition-all active:scale-90"
                 >
                    <ArrowLeft className="w-5 h-5" />
                 </button>
                 <div className="space-y-1">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#6d7a77]">
                       <span>Dashboard</span>
                       <ChevronRight className="w-3 h-3 opacity-30" />
                       <span>Editor</span>
                       <ChevronRight className="w-3 h-3 opacity-30" />
                       <span className="text-[#00685f]">Structure</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter leading-none uppercase">
                       {course.title}
                    </h1>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 pr-6 border-r border-[#bcc9c6]/20 mr-4">
                    <div className={`w-2.5 h-2.5 ${isSaving ? 'bg-orange-500' : 'bg-emerald-500'} rounded-full ${isSaving ? 'animate-bounce' : 'animate-pulse'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77]">
                       {isSaving ? 'Saving...' : 'Autosaved'}
                    </span>
                 </div>
                 <button 
                   onClick={togglePublish}
                   className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 shadow-2xl ${
                     course.status === 'published' 
                       ? 'bg-[#f0f4f4] text-[#6d7a77] border border-[#bcc9c6]/20' 
                       : 'bg-[#00685f] text-white shadow-[#00685f]/20 hover:bg-[#131b2e]'
                   }`}
                 >
                    <Globe className="w-4 h-4" /> {course.status === 'published' ? 'Unpublish' : 'Publish'}
                 </button>
              </div>
           </header>

           <div className="flex flex-col xl:flex-row gap-16 items-start">
              <div className="flex-1 w-full order-2 xl:order-1">
                 <div className="space-y-6 mb-16">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00685f]">Course Structure</h2>
                    <p className="text-xl font-medium text-[#6d7a77] leading-relaxed max-w-xl">
                       Define the structure of your course — add sections and lectures for effective structural learning.
                    </p>
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
                      className="w-full py-10 border-3 border-dashed border-[#bcc9c6]/40 rounded-[32px] flex items-center justify-center gap-4 text-[#6d7a77] hover:border-[#00685f]/40 hover:bg-white hover:text-[#00685f] hover:shadow-2xl hover:-translate-y-1 transition-all group"
                    >
                       <div className="w-12 h-12 bg-[#bcc9c6]/10 group-hover:bg-[#ebfaf8] rounded-2xl flex items-center justify-center transition-all">
                          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                       </div>
                       <span className="text-[13px] font-black uppercase tracking-[0.3em]">Add New Section</span>
                    </button>
                 )}
              </div>

              <CourseSettings 
                course={course}
                sectionsCount={sections.length}
                lecturesCount={totalLecturesCount}
                pagesCount={totalPagesCount}
                onDeleteCourse={() => setDeleteModal({ isOpen: true, type: "course", targetId: courseId })}
                onUpdateMetadata={saveToStorage}
              />
           </div>

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
