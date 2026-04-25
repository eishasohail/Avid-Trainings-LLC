"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Video, 
  Users, 
  Layout, 
  Edit3, 
  X, 
  Search as SearchIcon, 
  MoreVertical, 
  Trash2, 
  Edit2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { 
  DUMMY_COURSES, 
  getTotalLearners, 
  getCourseById,
  Course,
  CourseStatus
} from '@/lib/data/dummyData';
import { getAllCourses } from "@/lib/utils/courseUtils";

interface EditorStatProps {
  label: string;
  value: string | number;
  icon: any;
  accent: string;
  index: number;
}

const EditorStat = ({ label, value, icon: Icon, accent, index }: EditorStatProps) => (
  <div className="flex-1 min-w-[200px] flex items-center gap-5 px-8 py-6 bg-white border border-[#bcc9c6]/30 rounded-[32px] shadow-sm transition-all hover:shadow-xl hover:border-[#00685f]/20 group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${accent} shadow-lg shadow-black/5 shrink-0 transition-transform group-hover:scale-110`}>
        <Icon className="w-6 h-6" />
     </div>
     <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6d7a77] group-hover:text-[#00685f] transition-colors">{label}</p>
        <p className="text-xl font-black text-[#191c1e]">{value}</p>
     </div>
  </div>
);

export default function EditorPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | CourseStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isoStandard: '',
    category: 'Intermediate',
    status: 'draft' as CourseStatus
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Unified Data Loading
  useEffect(() => {
    setCourses(getAllCourses());
  }, []);

  const filteredCourses = useMemo(() => {
     return courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" || course.status === activeTab;
        return matchesSearch && matchesTab;
     });
  }, [courses, searchQuery, activeTab]);

  const handleSaveCourse = () => {
    if (!formData.title || !formData.description) {
      showToast("Title and description are required", "error");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    let updatedCourses = [...courses];

    if (editingCourse) {
      // Update existing course
      const isDummy = DUMMY_COURSES.some(dc => dc.id === editingCourse.id);
      
      if (isDummy) {
        // Save to overrides
        const overrides = JSON.parse(localStorage.getItem('avid-course-overrides') || '{}');
        overrides[editingCourse.id] = { 
          ...overrides[editingCourse.id],
          title: formData.title,
          description: formData.description,
          isoStandard: formData.isoStandard,
          category: formData.category,
          status: formData.status,
          updatedAt: today
        };
        localStorage.setItem('avid-course-overrides', JSON.stringify(overrides));
      } else {
        // Save to local courses
        const stored = localStorage.getItem('avid-courses');
        const localCourses: Course[] = stored ? JSON.parse(stored) : [];
        const updatedLocal = localCourses.map(lc => 
          lc.id === editingCourse.id ? { 
            ...lc, 
            title: formData.title, 
            description: formData.description,
            isoStandard: formData.isoStandard,
            category: formData.category,
            status: formData.status,
            updatedAt: today 
          } : lc
        );
        localStorage.setItem('avid-courses', JSON.stringify(updatedLocal));
      }
      
      updatedCourses = updatedCourses.map(c => 
        c.id === editingCourse.id ? { 
          ...c, 
          title: formData.title, 
          description: formData.description,
          isoStandard: formData.isoStandard,
          category: formData.category,
          status: formData.status,
          updatedAt: today 
        } : c
      );
      showToast("Course details updated successfully!");

    } else {
      // Create new course
      const newCourseObj: Course = {
        id: `course-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        isoStandard: formData.isoStandard,
        category: formData.category,
        status: formData.status,
        creatorName: 'Syra',
        creatorId: 'creator-001',
        createdAt: today,
        updatedAt: today,
        sections: []
      };

      const stored = localStorage.getItem('avid-courses');
      const localCourses: Course[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('avid-courses', JSON.stringify([...localCourses, newCourseObj]));
      
      updatedCourses = [...updatedCourses, newCourseObj];
      showToast("New course created successfully!");
    }

    setCourses(updatedCourses);
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData({ title: '', description: '', isoStandard: '', category: 'Intermediate', status: 'draft' });
  };

  const handleDeleteCourse = (courseId: string) => {
    const isDummy = DUMMY_COURSES.some(dc => dc.id === courseId);
    
    if (isDummy) {
      const deletedIds: string[] = JSON.parse(localStorage.getItem('avid-deleted-courses') || '[]');
      if (!deletedIds.includes(courseId)) {
        deletedIds.push(courseId);
        localStorage.setItem('avid-deleted-courses', JSON.stringify(deletedIds));
      }
    } else {
      const stored = localStorage.getItem('avid-courses');
      const localCourses: Course[] = stored ? JSON.parse(stored) : [];
      const updatedLocal = localCourses.filter(lc => lc.id !== courseId);
      localStorage.setItem('avid-courses', JSON.stringify(updatedLocal));
    }

    setCourses(courses.filter(c => c.id !== courseId));
    setOpenDropdownId(null);
    showToast("Course deleted permanently");
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      isoStandard: course.isoStandard,
      category: course.category,
      status: course.status
    });
    setOpenDropdownId(null);
    setIsModalOpen(true);
  };

  const stats = [
     { label: "Total Courses", value: courses.length, icon: Video, accent: "bg-[#00685f]" },
     { label: "Drafts", value: courses.filter(c => c.status === 'draft').length, icon: Edit3, accent: "bg-amber-500" },
     { label: "Total Learners", value: getTotalLearners(), icon: Users, accent: "bg-blue-500" }
  ];

  return (
    <DashboardWrapper loadingMessage="Opening Atelier...">
      {(user) => (
        <div className="space-y-12 sm:space-y-16">
          
          {/* Toast Notification */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className={`fixed bottom-8 right-8 z-[10000] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
                  toast.type === 'success' ? 'bg-[#131b2e] text-white' : 'bg-red-500 text-white'
                }`}
              >
                {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#00d1b2]" /> : <AlertCircle className="w-5 h-5" />}
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>

          <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 animate-fade-in-up">
            <div className="space-y-4">
               <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[#191c1e] tracking-tighter leading-none uppercase">Editor</h1>
               <p className="text-base sm:text-lg font-medium text-[#6d7a77] max-w-2xl leading-relaxed">Build and manage your ISO courses</p>
            </div>
            <button 
               onClick={() => {
                 setEditingCourse(null);
                 setFormData({ title: '', description: '', isoStandard: 'ISO 27001', category: 'Intermediate', status: 'draft' });
                 setIsModalOpen(true);
               }}
               className="w-full sm:w-auto px-12 py-6 bg-[#131b2e] hover:bg-[#00685f] text-white rounded-[28px] text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#131b2e]/30 active:scale-95 transition-all flex items-center justify-center gap-4 group"
            >
               <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
               Create New Course
            </button>
          </header>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 animate-fade-in-up stagger-1">
             <div className="flex bg-white/70 backdrop-blur-md border border-[#bcc9c6]/30 p-1.5 rounded-[24px] w-full lg:w-auto overflow-x-auto custom-scrollbar">
                {(["all", "published", "draft"] as const).map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        activeTab === tab 
                           ? "bg-[#131b2e] text-white shadow-lg" 
                           : "text-[#6d7a77] hover:bg-[#131b2e]/5 hover:text-[#131b2e]"
                     }`}
                   >
                      {tab}
                   </button>
                ))}
             </div>
             
             <div className="relative w-full lg:w-96 group">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
                <input 
                   type="text" 
                   placeholder="Search courses..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-14 pr-8 py-5 bg-white border border-[#bcc9c6]/40 rounded-[24px] outline-none text-[#191c1e] text-sm font-bold placeholder:text-[#6d7a77]/40 focus:border-[#00685f] focus:bg-white shadow-sm transition-all"
                />
             </div>
          </div>

          <div className="flex flex-wrap gap-6 animate-fade-in-up stagger-2">
             {stats.map((stat, i) => (
                <EditorStat key={i} {...stat} index={i} />
             ))}
          </div>

          {/* Regular Grid 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {filteredCourses.map((course, i) => (
                <div key={course.id} className="group flex flex-col bg-white rounded-[56px] border border-[#bcc9c6]/30 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all duration-700 animate-fade-in-up min-h-[640px]" style={{ animationDelay: `${i * 150}ms` }}>
                   <div className="relative h-72 bg-gradient-to-br from-[#131b2e] to-[#00685f] overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                      <div className="absolute inset-0 flex items-center justify-center translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                         <div className="w-36 h-36 rounded-[40px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center p-8 text-white group-hover:scale-110 transition-all duration-700">
                            <Layout className="w-full h-full opacity-40" />
                         </div>
                      </div>
                      <div className="absolute top-8 left-8 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-black text-white uppercase tracking-[0.3em] shadow-sm">
                         {course.isoStandard}
                      </div>
                      <div className={`absolute top-8 right-8 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-lg border ${
                         course.status === 'published' 
                            ? 'bg-emerald-500 text-white border-emerald-400' 
                            : 'bg-amber-500 text-white border-amber-400'
                      }`}>
                         {course.status}
                      </div>
                   </div>

                   <div className="p-10 space-y-8 flex flex-col flex-1 relative bg-white">
                      <div className="space-y-4">
                         <h3 className="text-2xl sm:text-3xl font-black text-[#191c1e] group-hover:text-[#00685f] transition-colors leading-tight uppercase">{course.title}</h3>
                         <p className="text-sm font-medium text-[#6d7a77] line-clamp-2 leading-relaxed opacity-70">{course.description}</p>
                      </div>

                      <div className="flex items-center justify-between py-6 border-y border-[#bcc9c6]/10 h-24">
                          <div className="flex items-center gap-2">
                             <Users className="w-6 h-6 text-[#00685f]" />
                             <span className="text-xs font-black text-[#131b2e] uppercase tracking-widest">{course.category}</span>
                          </div>
                      </div>

                      <div className="flex items-center gap-5 pt-4 mt-auto">
                         <button 
                           onClick={() => router.push(`/dashboard/editor/${course.id}`)}
                           className="flex-1 py-5 bg-[#00685f] hover:bg-[#131b2e] text-white rounded-[26px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#00685f]/15 transition-all flex items-center justify-center gap-3 active:scale-95"
                         >
                            <Edit3 className="w-5 h-5" /> Edit
                         </button>
                         <div className="relative">
                            <button 
                              onClick={() => setOpenDropdownId(openDropdownId === course.id ? null : course.id)}
                              className={`w-[60px] h-[60px] border-2 rounded-[26px] transition-all flex items-center justify-center ${openDropdownId === course.id ? 'bg-[#131b2e] text-white border-[#131b2e]' : 'bg-white border-[#131b2e]/10 text-[#131b2e] hover:border-[#131b2e] hover:bg-[#131b2e] hover:text-white'}`}
                            >
                               <MoreVertical className="w-6 h-6" />
                            </button>
                            {openDropdownId === course.id && (
                               <div className="absolute bottom-full right-0 mb-4 w-48 bg-white border border-[#bcc9c6]/30 rounded-2xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2">
                                  <button onClick={() => openEditModal(course)} className="w-full px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-[#131b2e] hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                     <Edit2 className="w-4 h-4" /> Edit Details
                                  </button>
                                  <button onClick={() => handleDeleteCourse(course.id)} className="w-full px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                     <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
             ))}
             
             <div 
               onClick={() => {
                 setEditingCourse(null);
                 setFormData({ title: '', description: '', isoStandard: '', category: 'Intermediate', status: 'draft' });
                 setIsModalOpen(true);
               }}
               className="group bg-[#f7f9fb] border-3 border-dashed border-[#bcc9c6]/40 rounded-[56px] flex flex-col items-center justify-center p-16 min-h-[640px] animate-fade-in-up hover:border-[#00685f]/40 hover:bg-white hover:shadow-2xl transition-all duration-700 cursor-pointer text-center"
             >
                <div className="w-20 h-20 bg-[#00685f]/5 rounded-[32px] flex items-center justify-center text-[#00685f] mb-8 group-hover:bg-[#00685f] group-hover:text-white transition-all duration-500 scale-100 group-hover:scale-110 shadow-inner">
                   <Plus className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#6d7a77] group-hover:text-[#191c1e] transition-colors uppercase">Create New Course</h3>
                <p className="text-sm font-medium text-[#6d7a77] mt-4 opacity-60 max-w-[220px] leading-relaxed">Start building a new ISO course</p>
             </div>
          </div>

          {/* Create/Edit Modal */}
          <AnimatePresence>
             {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                   <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsModalOpen(false)}
                      className="absolute inset-0 bg-[#131b2e]/80 backdrop-blur-md"
                   />
                   <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-xl bg-white rounded-[40px] shadow-3xl p-10 overflow-hidden"
                   >
                      <div className="flex justify-between items-start mb-10">
                         <h2 className="text-3xl font-black text-[#191c1e] tracking-tighter uppercase">{editingCourse ? 'Edit Course Details' : 'Create New Course'}</h2>
                         <button onClick={() => setIsModalOpen(false)} className="p-3 bg-[#f7f9fb] rounded-xl hover:bg-red-50 text-[#6d7a77] hover:text-red-500 transition-all">
                            <X className="w-6 h-6" />
                         </button>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] ml-4">Course Title</label>
                           <input 
                              type="text" 
                              placeholder="e.g. ISO 27001 Lead Auditor" 
                              className="w-full px-8 py-5 bg-[#f7f9fb] border border-[#bcc9c6]/30 rounded-2xl outline-none focus:border-[#00685f] transition-all font-bold text-[#191c1e]" 
                              value={formData.title}
                              onChange={(e) => setFormData({...formData, title: e.target.value})}
                           />
                         </div>

                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] ml-4">Description</label>
                           <textarea 
                              placeholder="Enter brief course summary..." 
                              rows={3} 
                              className="w-full px-8 py-5 bg-[#f7f9fb] border border-[#bcc9c6]/30 rounded-2xl outline-none focus:border-[#00685f] transition-all font-bold text-[#191c1e] resize-none" 
                              value={formData.description}
                              onChange={(e) => setFormData({...formData, description: e.target.value})}
                           />
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] ml-4">ISO Standard</label>
                              <select 
                                 className="w-full px-8 py-5 bg-[#f7f9fb] border border-[#bcc9c6]/30 rounded-2xl outline-none focus:border-[#00685f] transition-all font-bold text-[#191c1e] appearance-none"
                                 value={formData.isoStandard}
                                 onChange={(e) => setFormData({...formData, isoStandard: e.target.value})}
                              >
                                 <option value="">-- Select Standard (Optional) --</option>
                                 {['ISO 27001', 'ISO 9001', 'ISO 45001', 'ISO 14001', 'ISO 50001'].map(std => (
                                    <option key={std} value={std}>{std}</option>
                                 ))}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] ml-4">Category</label>
                              <select 
                                 className="w-full px-8 py-5 bg-[#f7f9fb] border border-[#bcc9c6]/30 rounded-2xl outline-none focus:border-[#00685f] transition-all font-bold text-[#191c1e] appearance-none"
                                 value={formData.category}
                                 onChange={(e) => setFormData({...formData, category: e.target.value})}
                              >
                                 {['Beginner', 'Intermediate', 'Advanced'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                 ))}
                              </select>
                           </div>
                         </div>

                         <div className="pt-2 flex items-center justify-between px-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77]">Status</span>
                            <div className="flex bg-[#f7f9fb] border border-[#bcc9c6]/30 p-1 rounded-xl w-48">
                               <button 
                                 onClick={() => setFormData({...formData, status: 'draft'})}
                                 className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${formData.status === 'draft' ? 'bg-[#131b2e] text-white shadow-md' : 'text-[#6d7a77]'}`}
                               >
                                 Draft
                               </button>
                               <button 
                                 onClick={() => setFormData({...formData, status: 'published'})}
                                 className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${formData.status === 'published' ? 'bg-[#131b2e] text-white shadow-md' : 'text-[#6d7a77]'}`}
                               >
                                 Published
                               </button>
                            </div>
                         </div>
                      </div>

                      <button 
                        onClick={handleSaveCourse}
                        className="w-full py-6 mt-10 bg-[#131b2e] hover:bg-[#00685f] text-white rounded-[24px] text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all"
                      >
                         {editingCourse ? 'Save Changes' : 'Create Course'}
                      </button>
                   </motion.div>
                </div>
             )}
          </AnimatePresence>
        </div>
      )}
    </DashboardWrapper>
  );
}
