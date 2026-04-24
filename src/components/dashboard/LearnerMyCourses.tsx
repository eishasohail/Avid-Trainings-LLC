"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, BookOpen, Clock, ChevronRight, GraduationCap, Award, Library } from "lucide-react";
import type { AuthUser } from "@/lib/types/auth";
import { getAllCourses } from "@/lib/utils/courseUtils";

export default function LearnerMyCourses({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("In Progress");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // STEP 1 - Read enrolled courses
    const enrolledStr = localStorage.getItem('avid-enrolled-courses');
    const enrolledIds: string[] = enrolledStr ? JSON.parse(enrolledStr) : [];

    // STEP 2 - Get course objects from dummyData
    const allCourses = getAllCourses();
    const enriched = allCourses
      .filter(c => enrolledIds.includes(c.id))
      .map(course => {
        // STEP 3 - Get progress for each course
        const progressStr = localStorage.getItem(`avid-progress-${course.id}`);
        const progressData = progressStr ? JSON.parse(progressStr) : { completedLectures: [] };
        const completed = progressData.completedLectures || [];
        
        const total = course.sections.reduce(
          (acc: number, s: any) => acc + s.lectures.length, 0
        );
        
        const progressPercent = total === 0 ? 0 : Math.round((completed.length / total) * 100);
        const timeRemaining = progressPercent === 100 
          ? "Completed" 
          : `${(total - completed.length) * 10} min remaining`;

        return {
          ...course,
          progress: progressPercent,
          completedCount: completed.length,
          totalCount: total,
          timeRemaining,
          status: progressPercent === 100 ? "Completed" : "In Progress"
        };
      });

    setEnrolledCourses(enriched);
    setLoading(false);
  }, []);

  const filtered = enrolledCourses.filter(c => {
    const matchesTab = c.status === activeTab;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00685f]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter">My Courses</h1>
          <p className="text-sm sm:text-base font-medium text-[#6d7a77] mt-2">Manage your ISO certification journey and ongoing learning.</p>
        </div>
      </header>

      {/* Tabs and Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in-up stagger-1">
        <div className="flex p-1 bg-white border border-[#bcc9c6]/40 rounded-2xl shadow-sm w-full sm:w-fit overflow-x-auto custom-scrollbar no-scrollbar scrollbar-hide">
          {["In Progress", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 sm:px-10 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                activeTab === tab 
                  ? "bg-[#00685f] text-white shadow-lg shadow-[#00685f]/20" 
                  : "text-[#6d7a77] hover:text-[#191c1e] hover:bg-[#f0f4f4]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
           <div className="relative group w-full sm:w-auto flex-1 lg:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:min-w-[280px] lg:min-w-[320px] pl-12 pr-6 py-3.5 bg-white border border-[#bcc9c6]/40 rounded-2xl text-sm outline-none focus:border-[#00685f] transition-all font-medium shadow-sm"
              />
           </div>
           <button className="hidden sm:flex p-3.5 bg-white border border-[#bcc9c6]/40 rounded-2xl text-[#6d7a77] hover:text-[#00685f] hover:border-[#00685f] transition-all shadow-sm active:scale-95">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length === 0 ? (
          <div className="lg:col-span-3 py-24 flex flex-col items-center text-center space-y-6">
             <div className="w-24 h-24 bg-[#f0f4f4] rounded-full flex items-center justify-center text-[#bcc9c6]">
                <GraduationCap className="w-12 h-12" />
             </div>
             <div>
                <h3 className="text-xl font-black text-[#191c1e]">
                  {activeTab === "In Progress" ? "No courses in progress" : "No completed courses yet"}
                </h3>
                <p className="text-sm font-medium text-[#6d7a77] mt-2">
                  {activeTab === "In Progress" 
                    ? "Start your learning journey by enrolling in a course." 
                    : "Finish your active courses to see them here."}
                </p>
             </div>
             <button 
                onClick={() => router.push(activeTab === "In Progress" ? '/dashboard/library' : '/dashboard/my-courses')}
                className="px-10 py-4 bg-[#00685f] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#004d46] transition-all shadow-xl shadow-[#00685f]/20 active:scale-95"
             >
                {activeTab === "In Progress" ? "Browse Global Library" : "Continue Learning"}
             </button>
          </div>
        ) : (
          filtered.map((course, i) => (
            <div key={course.id} className="group flex flex-col bg-white rounded-[40px] border border-[#bcc9c6]/40 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all duration-700 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00685f] to-[#131b2e] group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-black text-white uppercase tracking-widest">
                   ISO COMPLIANT
                </div>
                {course.status === 'Completed' && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <Award className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-[#191c1e] leading-tight group-hover:text-[#00685f] transition-colors line-clamp-2 min-h-[48px] uppercase">{course.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#f7f9fb] flex items-center justify-center overflow-hidden border border-[#bcc9c6]/20">
                       <span className="text-[9px] font-black text-[#00685f]">{course.creatorName?.charAt(0)}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#6d7a77]">{course.creatorName}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-[#bcc9c6]">Progress</span>
                    <span className="text-[#00685f]">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#f0f4f4] rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00685f] to-[#008378] transition-all duration-1000 ease-out" 
                      style={{ width: `${course.progress}%` }} 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1 text-[9px] font-black uppercase tracking-widest text-[#bcc9c6]">
                  <div className="flex items-center gap-1.5 group-hover:text-[#6d7a77] transition-colors">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{course.totalCount} Lectures</span>
                  </div>
                  <div className="flex items-center gap-1.5 group-hover:text-[#6d7a77] transition-colors">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.timeRemaining}</span>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  {course.status === "Completed" ? (
                    <button 
                      onClick={() => router.push(`/dashboard/learn/${course.id}/certificate`)}
                      className="w-full py-4 bg-[#f7f9fb] hover:bg-[#00685f] hover:text-white text-[#00685f] border border-[#bcc9c6]/30 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm focus:outline-none"
                    >
                      View Certificate
                    </button>
                  ) : (
                    <button 
                      onClick={() => router.push(`/dashboard/learn/${course.id}`)}
                      className="w-full py-4 bg-[#00685f] hover:bg-[#004d46] text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#00685f]/20 active:scale-95 transition-all focus:outline-none"
                    >
                      Continue Learning
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
