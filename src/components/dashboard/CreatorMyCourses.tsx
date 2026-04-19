"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Layers, 
  X, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AuthUser } from "@/lib/types/auth";
import { 
  getLearnerCountForCourse, 
  getEnrollmentsForCourse,
  Course, 
  CourseStatus 
} from '@/lib/data/dummyData';
import { getAllCourses } from "@/lib/utils/courseUtils";

export default function CreatorMyCourses({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    isoStandard: 'ISO 27001',
    category: 'Intermediate',
    status: 'draft' as CourseStatus
  });

  // Load and merge courses on mount
  useEffect(() => {
    setCourses(getAllCourses());
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesTab = activeTab === 'all' || course.status === activeTab;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [courses, activeTab, searchQuery]);

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      showToast("Title and description are required", "error");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const createdCourse: Course = {
      id: `course-${Date.now()}`,
      title: newCourse.title,
      description: newCourse.description,
      isoStandard: newCourse.isoStandard,
      category: newCourse.category,
      status: 'draft',
      creatorName: 'Syra',
      creatorId: 'creator-001',
      createdAt: today,
      updatedAt: today,
      sections: []
    };

    // Save to localStorage
    const stored = localStorage.getItem('avid-courses');
    const localCourses: Course[] = stored ? JSON.parse(stored) : [];
    const updatedLocal = [...localCourses, createdCourse];
    localStorage.setItem('avid-courses', JSON.stringify(updatedLocal));

    // Update local state and close modal
    setCourses([...courses, createdCourse]);
    setShowCreateModal(false);
    setNewCourse({ title: '', description: '', isoStandard: 'ISO 27001', category: 'Intermediate', status: 'draft' });
    showToast("Course created successfully!");
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-[#131b2e] text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#00d1b2]" /> : <AlertCircle className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
           <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter uppercase">My Courses</h1>
           <p className="text-sm sm:text-base font-medium text-[#6d7a77]">Build and manage your ISO courses</p>
        </div>
        <button 
          onClick={() => {
            setNewCourse({ title: '', description: '', isoStandard: 'ISO 27001', category: 'Intermediate', status: 'draft' });
            setShowCreateModal(true);
          }}
          className="w-full sm:w-auto px-10 py-5 bg-[#00685f] hover:bg-[#004d46] text-white rounded-[24px] text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl shadow-[#00685f]/20 active:scale-95 transition-all flex items-center justify-center gap-3 group"
        >
           <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 group-active:rotate-0" />
           Create New Course
        </button>
      </header>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 stagger-1">
        <div className="flex p-1.5 bg-[#f0f4f4] rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
          {["all", "published", "draft", "unpublished"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                activeTab === tab 
                  ? "bg-white text-[#00685f] shadow-md" 
                  : "text-[#6d7a77] hover:text-[#191c1e] hover:bg-white/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
           <div className="relative group w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
              <input 
                type="text" 
                placeholder="Search your courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-white border border-[#bcc9c6]/40 rounded-2xl text-sm outline-none focus:border-[#00685f] shadow-sm transition-all font-medium"
              />
           </div>
           <button className="hidden sm:flex p-3.5 bg-white border border-[#bcc9c6]/40 rounded-2xl text-[#6d7a77] hover:text-[#00685f] transition-all shadow-sm active:scale-95">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course, i) => {
          const learnerCount = getLearnerCountForCourse(course.id);
          const enrollments = getEnrollmentsForCourse(course.id);
          const avgProgress = enrollments.length > 0 
            ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
            : 0;
            
          const [year, month, day] = course.updatedAt.split('-');
          const formattedDate = `${day}/${month}/${year}`;

          return (
            <div 
              key={course.id} 
              onClick={() => router.push(`/dashboard/courses/${course.id}`)}
              className="group relative bg-white rounded-[40px] border border-[#bcc9c6]/40 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all duration-700 flex flex-col h-full cursor-pointer" 
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-video overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#131b2e] to-[#00685f] group-hover:scale-105 transition-transform duration-1000" />
                <div className={`absolute top-4 left-4 px-3 py-1 backdrop-blur-md rounded-full border text-[9px] font-black uppercase tracking-widest ${
                  course.status === 'published' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                   {course.status}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1 space-y-6 text-left">
                <div className="space-y-4 pb-4 border-b border-[#bcc9c6]/10 h-28">
                  <h3 className="text-xl font-black text-[#191c1e] leading-tight group-hover:text-[#00685f] transition-colors line-clamp-2 uppercase">{course.title}</h3>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2 text-[#6d7a77] group-hover:text-[#191c1e] transition-colors text-[10px] font-black uppercase tracking-widest">
                        <Users className="w-4 h-4" />
                        <span>{learnerCount} <span className="opacity-60">LEARNERS</span></span>
                     </div>
                     <div className="flex items-center gap-2 text-[#6d7a77] group-hover:text-[#191c1e] transition-colors text-[10px] font-black uppercase tracking-widest">
                        <Layers className="w-4 h-4" />
                        <span>{course.isoStandard}</span>
                     </div>
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                      <span className="text-[#bcc9c6]">COMPLETION RATE</span>
                      <span className="text-[#00685f]">{avgProgress}%</span>
                   </div>
                   <div className="h-2 w-full bg-[#f0f4f4] rounded-full overflow-hidden shadow-inner relative">
                      <div className="h-full bg-gradient-to-r from-[#00685f] to-[#008378] relative transition-all duration-1000" style={{ width: `${avgProgress}%` }} />
                   </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                   <span className="text-[9px] font-black uppercase tracking-widest text-[#bcc9c6]">Modified {formattedDate}</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Create UI Card */}
        <div 
          onClick={() => {
            setNewCourse({ title: '', description: '', isoStandard: 'ISO 27001', category: 'Intermediate', status: 'draft' });
            setShowCreateModal(true);
          }}
          className="group bg-[#f7f9fb] border-2 border-dashed border-[#bcc9c6]/40 rounded-[40px] flex flex-col items-center justify-center p-12 min-h-[460px] hover:border-[#00685f]/40 hover:bg-white hover:shadow-2xl transition-all duration-700 cursor-pointer text-center" 
          style={{ animationDelay: `${filteredCourses.length * 100}ms` }}
        >
           <div className="w-16 h-16 bg-[#00685f]/5 rounded-[20px] flex items-center justify-center text-[#00685f] mb-6 group-hover:bg-[#00685f] group-hover:text-white transition-all duration-500 scale-100 group-hover:scale-110 shadow-inner ring-4 ring-white">
              <Plus className="w-8 h-8" />
           </div>
           <h3 className="text-xl font-black text-[#6d7a77] group-hover:text-[#191c1e] transition-colors uppercase">Create New Course</h3>
           <p className="text-xs font-medium text-[#6d7a77] mt-3 opacity-60 leading-relaxed max-w-[220px]">Start building a new ISO course</p>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 h-screen w-screen overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#131b2e]/60 backdrop-blur-md"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#00685f]/10 rounded-2xl flex items-center justify-center text-[#00685f]">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-[#191c1e] uppercase">Create New Course</h2>
                      <p className="text-sm font-medium text-[#6d7a77]">Start building a new ISO course</p>
                    </div>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="p-3 hover:bg-[#f7f9fb] rounded-full text-[#6d7a77] transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#191c1e] ml-1">Course Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., ISO 27001 ISMS Lead Implementation" 
                      className="w-full px-6 py-4 bg-[#f7f9fb] border border-[#bcc9c6]/40 rounded-2xl text-sm font-medium focus:border-[#00685f] outline-none transition-all"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#191c1e] ml-1">Description</label>
                    <textarea 
                      placeholder="High-level overview of the course content..." 
                      rows={4}
                      className="w-full px-6 py-4 bg-[#f7f9fb] border border-[#bcc9c6]/40 rounded-2xl text-sm font-medium focus:border-[#00685f] outline-none transition-all resize-none"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[#191c1e] ml-1">ISO Standard</label>
                      <select 
                        className="w-full px-6 py-4 bg-[#f7f9fb] border border-[#bcc9c6]/40 rounded-2xl text-sm font-bold focus:border-[#00685f] outline-none appearance-none cursor-pointer"
                        value={newCourse.isoStandard}
                        onChange={(e) => setNewCourse({...newCourse, isoStandard: e.target.value})}
                      >
                        {['ISO 27001', 'ISO 9001', 'ISO 45001', 'ISO 14001', 'ISO 50001', 'ISO 31000'].map(std => (
                          <option key={std} value={std}>{std}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[#191c1e] ml-1">Category / Level</label>
                      <select 
                        className="w-full px-6 py-4 bg-[#f7f9fb] border border-[#bcc9c6]/40 rounded-2xl text-sm font-bold focus:border-[#00685f] outline-none appearance-none cursor-pointer"
                        value={newCourse.category}
                        onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                      >
                        {['Beginner', 'Intermediate', 'Advanced'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-[#f7f9fb] rounded-[32px] border border-[#bcc9c6]/40">
                    <div>
                      <h4 className="text-sm font-black text-[#191c1e] uppercase">Published Status</h4>
                      <p className="text-xs font-medium text-[#6d7a77]">Making this public will allow learners to enroll.</p>
                    </div>
                    <button 
                      onClick={() => setNewCourse({...newCourse, status: newCourse.status === 'published' ? 'draft' : 'published'})}
                      className={`relative w-14 h-8 rounded-full transition-all duration-500 ${newCourse.status === 'published' ? 'bg-[#00685f]' : 'bg-[#bcc9c6]'}`}
                    >
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-500 ${newCourse.status === 'published' ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-10">
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-5 bg-white border border-[#bcc9c6]/60 text-[#6d7a77] rounded-[24px] text-xs font-black uppercase tracking-widest transition-all hover:bg-gray-50 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateCourse}
                    className="flex-1 py-5 bg-[#00685f] text-white rounded-[24px] text-xs font-black uppercase tracking-widest transition-all hover:bg-[#004d46] active:scale-95 shadow-xl shadow-[#00685f]/20"
                  >
                    Create Course
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
