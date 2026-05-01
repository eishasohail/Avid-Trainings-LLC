"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Award, BookOpen, Clock, TrendingUp, ChevronRight, GraduationCap, Trophy, PlayCircle, Shield } from "lucide-react";
import type { AuthUser } from "@/lib/types/auth";
import { getCourseById, getPublishedCourses } from "@/lib/data/dummyData";
import { getAllCourses } from "@/lib/utils/courseUtils";

export default function LearnerDashboard({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [certificatesCount, setCertificatesCount] = useState(0);
  const [learningTime, setLearningTime] = useState('0h 0m');
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [recentCourse, setRecentCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Enrolled courses
    const enrolledStr = localStorage.getItem('avid-enrolled-courses')
    const enrolledIdsList: string[] = enrolledStr ? JSON.parse(enrolledStr) : []
    setEnrolledIds(enrolledIdsList)
    setEnrolledCount(enrolledIdsList.length)

    // Calculations
    const allCourses = getAllCourses()
    let completedCountVal = 0
    let totalMinutes = 0
    let mostRecent: any = null

    enrolledIdsList.forEach((courseId: string) => {
      const progressStr = localStorage.getItem(`avid-progress-${courseId}`)
      const progress = progressStr ? JSON.parse(progressStr) : { completedLectures: [] }
      const completed = progress.completedLectures || []
      
      const course = allCourses.find(c => c.id === courseId)
      if (!course) return

      const total = course.sections.reduce((acc: number, s: any) => acc + s.lectures.length, 0)
      
      if (completed.length === total && total > 0) {
        completedCountVal++
      }
      
      totalMinutes += completed.length * 10

      // Most recent check
      const lastPosStr = localStorage.getItem(`avid-last-position-${courseId}`);
      if (lastPosStr) {
         mostRecent = { 
           ...course, 
           progress: total === 0 ? 0 : Math.round((completed.length/total)*100) 
         };
      }
    })

    setCompletedCount(completedCountVal)
    setCertificatesCount(completedCountVal)
    
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    setLearningTime(`${hours}h ${mins}m`)

    // Fallback most recent
    if (!mostRecent && enrolledIdsList.length > 0) {
      const first = allCourses.find(c => c.id === enrolledIdsList[0])
      if (first) {
        const progressStr = localStorage.getItem(`avid-progress-${first.id}`)
        const progress = progressStr ? JSON.parse(progressStr) : { completedLectures: [] }
        const total = first.sections.reduce((acc: number, s: any) => acc + s.lectures.length, 0)
        mostRecent = { 
          ...first, 
          progress: total === 0 ? 0 : Math.round((progress.completedLectures.length/total)*100) 
        }
      }
    }
    setRecentCourse(mostRecent)
    setLoading(false)

    if (mostRecent && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`avid-thumbnail-${mostRecent.id}`)
      if (saved) setThumbnail(saved)
    }
  }, [])

  const curatedCourses = useMemo(() => {
    const published = getPublishedCourses();
    return published.filter(c => !enrolledIds.includes(c.id)).slice(0, 4);
  }, [enrolledIds]);

  const stats = [
    { label: "Enrolled Courses", value: enrolledCount.toString(), icon: BookOpen, color: "bg-blue-500", accent: "text-blue-600" },
    { label: "Completed", value: completedCount.toString(), icon: Award, color: "bg-emerald-500", accent: "text-emerald-600" },
    { label: "Learning Time", value: learningTime, icon: Clock, color: "bg-purple-500", accent: "text-purple-600" },
    { label: "Certificates", value: certificatesCount.toString(), icon: Trophy, color: "bg-amber-500", accent: "text-amber-600" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00685f]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      
      <header className="animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter">
          Welcome back, <span className="text-[#00685f]">{user.displayName?.split(' ')[0]}</span>
        </h1>
        <p className="text-sm sm:text-base font-medium text-[#6d7a77] mt-3 max-w-xl">
           Continue your ISO certification journey. You have completed <span className="text-[#00685f] font-black">{completedCount}</span> certification{completedCount !== 1 ? 's' : ''} so far!
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up stagger-1">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white rounded-[32px] border border-[#bcc9c6]/40 p-1 relative overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
            <div className="p-7 flex flex-col justify-between h-full space-y-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] group-hover:text-[#00685f] transition-colors">{stat.label}</p>
                <div className="flex items-end gap-2">
                   <h3 className="text-3xl font-black text-[#191c1e] tracking-tight">{stat.value}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in-up stagger-2">
        {/* Continue Learning */}
        <section className="lg:col-span-2 bg-white rounded-[44px] border border-[#bcc9c6]/40 p-8 sm:p-10 shadow-sm space-y-10 group hover:border-[#00685f]/30 transition-all duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#bcc9c6]/10 pb-8 gap-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight flex items-center gap-3">
              <PlayCircle className="w-7 h-7 text-[#00685f]" /> Current Momentum
            </h3>
            <button 
              onClick={() => router.push('/dashboard/library')}
              className="text-[10px] font-black uppercase tracking-widest text-[#00685f] hover:tracking-[0.2em] transition-all"
            >
              My Library &rarr;
            </button>
          </div>

          {recentCourse ? (
            <div className="bg-[#f7f9fb] rounded-[32px] p-6 sm:p-8 border border-transparent hover:border-[#bcc9c6]/20 transition-all group/card">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="w-full sm:w-48 aspect-video bg-gradient-to-br from-[#00685f] to-[#131b2e] rounded-[24px] relative overflow-hidden shrink-0 shadow-lg">
                   {thumbnail ? (
                     <img src={thumbnail} alt={recentCourse.title} className="w-full h-full object-cover" />
                   ) : (
                     <>
                       <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover/card:scale-110 transition-transform">
                          <GraduationCap className="w-12 h-12 text-white" />
                       </div>
                     </>
                   )}
                </div>
                <div className="flex-1 space-y-6 w-full">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#00685f]">Next Action Required</p>
                     <h4 className="text-xl sm:text-2xl font-black text-[#191c1e] whitespace-normal break-words">{recentCourse.title}</h4>
                     <p className="text-sm font-medium text-[#6d7a77] opacity-80 leading-relaxed whitespace-normal break-words">{recentCourse.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                      <span className="text-[#6d7a77]">{recentCourse.progress}% Complete</span>
                    </div>
                    <div className="h-2 w-full bg-[#bcc9c6]/20 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-[#00685f] to-[#008378] transition-all duration-1000" style={{ width: `${recentCourse.progress}%` }} />
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/dashboard/learn/${recentCourse.id}`)}
                    className="w-full py-4 bg-[#00685f] hover:bg-[#004d46] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#00685f]/20 active:scale-95 transition-all focus:outline-none"
                  >
                    Resume Session
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#f7f9fb] rounded-[32px] p-12 text-center border border-dashed border-[#bcc9c6]/40">
               <h4 className="text-lg font-black text-[#191c1e] uppercase tracking-tight mb-2">No Active Courses</h4>
               <p className="text-sm font-medium text-[#6d7a77] mb-8">Start your first ISO training to see your progress here.</p>
               <button 
                onClick={() => router.push('/dashboard/library')}
                className="px-8 py-3 bg-[#00685f] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#00685f]/20 transition-all hover:bg-[#131b2e]"
               >
                 Explore Library
               </button>
            </div>
          )}
        </section>

        {/* Milestone Tracker */}
        <section className="bg-white rounded-[44px] border border-[#bcc9c6]/40 p-8 sm:p-10 shadow-sm space-y-10 group hover:border-[#00685f]/30 transition-all duration-500">
           <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight">Achievements</h3>
           <div className="space-y-6">
              {[
                { title: "Quick Starter", desc: "Enrolled in your first course", icon: Trophy, active: enrolledIds.length > 0 },
                { title: "First Step", desc: "Completed 1 certification", icon: Award, active: completedCount >= 1 },
                { title: "ISO Specialist", desc: "Completed 3 certifications", icon: Shield, active: completedCount >= 3 }
              ].map((m, i) => (
                <div key={i} className={`flex items-center gap-5 p-5 rounded-[28px] border transition-all ${m.active ? 'bg-[#f7f9fb] border-[#bcc9c6]/10 hover:bg-white hover:shadow-xl' : 'opacity-40 grayscale border-dashed border-[#bcc9c6]'}`}>
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.active ? 'bg-amber-500 shadow-lg shadow-amber-500/20' : 'bg-[#bcc9c6]'} text-white`}>
                      <m.icon className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-[#191c1e]">{m.title}</h4>
                      <p className="text-[10px] font-bold text-[#6d7a77] uppercase tracking-widest">{m.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
