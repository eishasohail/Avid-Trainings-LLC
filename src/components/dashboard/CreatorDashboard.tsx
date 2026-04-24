"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Activity, 
  GraduationCap, 
  BookOpen, 
  Target, 
  CheckCircle, 
  UserPlus, 
  Search
} from "lucide-react";
import type { AuthUser } from "@/lib/types/auth";
import { 
  getTotalLearners, 
  getAvgCompletionRate,
  DUMMY_COURSES,
  DUMMY_ENROLLMENTS,
  getLearnerCountForCourse
} from "@/lib/data/dummyData";

export default function CreatorDashboard({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState<any[]>([]);
  
  const firstName = user.displayName?.split(' ')[0] ?? 'Creator';

  useEffect(() => {
    const stored = localStorage.getItem('avid-courses');
    const localCourses = stored ? JSON.parse(stored) : [];
    const deletedIds: string[] = JSON.parse(localStorage.getItem('avid-deleted-courses') || '[]');
    const overrides = JSON.parse(localStorage.getItem('avid-course-overrides') || '{}');
    
    const merged = [...DUMMY_COURSES, ...localCourses.filter(
      (lc: any) => !DUMMY_COURSES.find(dc => dc.id === lc.id)
    )]
    .filter(c => !deletedIds.includes(c.id))
    .map(c => ({ 
      ...c, 
      ...(overrides[c.id] || {})
    }));

    setAllCourses(merged);
  }, []);

  const stats = [
    { label: "Total Learners", value: getTotalLearners(), icon: Users, color: "bg-blue-500" },
    { label: "Total Courses", value: allCourses.length, icon: BookOpen, color: "bg-emerald-500" },
    { label: "Avg Completion Rate", value: getAvgCompletionRate() + "%", icon: GraduationCap, color: "bg-[#00685f]" },
    { label: "Published Courses", value: allCourses.filter(c => c.status === 'published').length, icon: Activity, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 flex-1 min-w-0 overflow-hidden">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div className="space-y-0.5">
           <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter">Welcome back, {firstName}</h1>
           <p className="text-sm sm:text-base font-medium text-[#6d7a77]">Here's your platform overview.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#bcc9c6] group-focus-within:text-[#00685f] transition-colors" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full pl-14 pr-6 py-4 bg-white border border-[#bcc9c6]/40 rounded-2xl text-sm font-semibold outline-none focus:border-[#00685f] transition-all shadow-sm"
          />
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-fade-in-up stagger-1">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white rounded-[40px] border border-[#bcc9c6]/40 p-1 relative min-w-0 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
            <div className="p-6 flex flex-col justify-between h-full space-y-6">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d7a77] group-hover:text-[#00685f] transition-colors">{stat.label}</p>
                <h3 className="text-3xl font-black text-[#191c1e] tracking-tight">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full animate-fade-in-up stagger-2 pb-10">
        {/* Recent Activity */}
        <section className="xl:col-span-2 min-w-0 overflow-hidden bg-white rounded-[48px] border border-[#bcc9c6]/40 p-6 sm:p-8 shadow-sm space-y-8 group hover:border-[#00685f]/30 transition-all duration-500">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#bcc9c6]/10 pb-8 gap-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight flex items-center gap-3">
                 <Activity className="w-7 h-7 text-[#00685f]" /> Recent Activity
              </h3>
              <div className="flex gap-2">
                 <span className="px-5 py-2 bg-[#00685f]/5 text-[#00685f] text-[10px] font-black uppercase tracking-widest rounded-2xl border border-[#00685f]/10">This Week</span>
              </div>
           </div>

           <div className="space-y-6">
              {allCourses.slice(0, 4).map((course) => {
                const learnerCount = getLearnerCountForCourse(course.id);
                const publishedEnrollments = DUMMY_ENROLLMENTS.filter(e => e.courseId === course.id);
                const avgProgress = course.status === 'published' && publishedEnrollments.length > 0
                  ? Math.round(publishedEnrollments.reduce((sum, e) => sum + e.progress, 0) / publishedEnrollments.length)
                  : 0;
                
                return (
                  <div 
                    key={course.id} 
                    onClick={() => router.push(`/dashboard/my-courses/${course.id}`)}
                    className="group/item flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#f7f9fb] rounded-[32px] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-[#bcc9c6]/20 cursor-pointer gap-4"
                  >
                    <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-xl bg-[#00685f] flex items-center justify-center text-white shadow-xl flex-shrink-0">
                          <BookOpen className="w-5 h-5 opacity-40" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[13px] font-black text-[#191c1e] group-hover/item:text-[#00685f] transition-colors truncate uppercase">{course.title}</h4>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6d7a77] mt-0.5">{learnerCount} ENROLLED LEARNERS</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                        <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          course.status === 'published' 
                            ? 'bg-[#00685f]/5 text-[#00685f] border-[#00685f]/20' 
                            : course.status === 'draft'
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {course.status}
                        </div>
                        <div className="flex items-center justify-end gap-3 w-full sm:w-32">
                          <div className="h-1 bg-[#bcc9c6]/20 rounded-full overflow-hidden">
                              <div className="h-full bg-[#00685f] transition-all duration-1000" style={{ width: `${avgProgress}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-[#191c1e]">{avgProgress}%</span>
                        </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </section>

        {/* Activity Timeline */}
        <section className="xl:col-span-1 min-w-0 bg-white rounded-[48px] border border-[#bcc9c6]/40 p-8 shadow-sm space-y-8 group hover:border-[#00685f]/30 transition-all duration-500 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#00685f]/5 blur-2xl rounded-full" />
           <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight">Activity Timeline</h3>
           <div className="space-y-8 relative">
              <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-[#bcc9c6]/10 via-[#00685f]/20 to-[#bcc9c6]/10" />
              {[
                { time: "1H AGO", title: "Ahmed Khan completed ISO 27001", desc: "Course completion threshold reached", icon: CheckCircle, color: "bg-[#00685f]" },
                { time: "3H AGO", title: "Ahmed Khan enrolled in ISO 9001", desc: "New learner onboarded to platform", icon: UserPlus, color: "bg-[#00685f]" },
                { time: "5H AGO", title: "Ayesha Ahmed enrolled in ISO 45001", desc: "Initial sequence accessed by learner", icon: UserPlus, color: "bg-[#00685f]" }
              ].map((t, i) => (
                <div key={i} className="relative pl-14 group/timeline">
                   <div className={`absolute left-3 top-0 w-8 h-8 rounded-full ${t.color} flex items-center justify-center z-10 shadow-lg group-hover/timeline:scale-125 transition-transform border border-white`}>
                      <t.icon className="w-4 h-4 text-white" />
                   </div>
                   <div className="space-y-0.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                         <h4 className="text-[11px] font-black text-[#191c1e] tracking-tight truncate mr-2">{t.title}</h4>
                         <span className="text-[8px] font-black uppercase text-[#bcc9c6] tracking-[0.15em] shrink-0">{t.time}</span>
                      </div>
                      <p className="text-[10px] font-medium text-[#6d7a77] leading-tight line-clamp-1">{t.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
