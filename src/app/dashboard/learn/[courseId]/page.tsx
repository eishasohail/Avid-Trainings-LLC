"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { auth } from "@/lib/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { 
  ChevronLeft, 
  ChevronDown, 
  ChevronRight,
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Bell,
  Search,
  Layout as LayoutIcon,
  Play,
  LogOut,
  Award,
  X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getAllCourses } from "@/lib/utils/courseUtils"
import Logo from '@/components/shared/Logo'

export default function CourseViewerPage() {
  const router = useRouter()
  const { courseId } = useParams() as { courseId: string }
  const [user, loadingAuth] = useAuthState(auth)
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const [course, setCourse] = useState<any>(null)
  const [completedLectures, setCompletedLectures] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [showUnenrollModal, setShowUnenrollModal] = useState(false)

  const handleUnenroll = () => {
    // Remove from enrolled courses
    const existing = localStorage.getItem('avid-enrolled-courses')
    const enrolled: string[] = existing ? JSON.parse(existing) : []
    const updated = enrolled.filter(id => id !== courseId)
    localStorage.setItem('avid-enrolled-courses', 
      JSON.stringify(updated))
    
    // Progress data
    localStorage.removeItem(`avid-progress-${courseId}`)
    
    // Last position
    localStorage.removeItem(`avid-last-position-${courseId}`)
    
    // Navigate back to course landing page
    router.push(`/dashboard/library/${courseId}`)
  }

  // Load Data
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (loadingAuth) return
    if (!user) {
      router.push('/login')
      return
    }

    // Enrollment check
    const enrolledStr = localStorage.getItem('avid-enrolled-courses')
    const enrolledIds = enrolledStr ? JSON.parse(enrolledStr) : []
    if (!enrolledIds.includes(courseId)) {
      router.push(`/dashboard/library/${courseId}`)
      return
    }

    // Course data
    const allCourses = getAllCourses()
    const foundCourse = allCourses.find(c => c.id === courseId)
    if (!foundCourse) {
      setLoading(false)
      return
    }
    setCourse(foundCourse)

    // Progress
    const progressStr = localStorage.getItem(`avid-progress-${courseId}`)
    const progress = progressStr ? JSON.parse(progressStr) : { completedLectures: [] }
    setCompletedLectures(progress.completedLectures || [])

    // Default expand all sections
    setExpandedSections(foundCourse.sections.map((s: any) => s.id))
    setLoading(false)
  }, [courseId, user, loadingAuth, router])

  if (loadingAuth || loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00685f]"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black text-[#131b2e]">Course not found</h1>
        <button 
          onClick={() => router.push('/dashboard/library')}
          className="flex items-center gap-2 text-[#00685f] font-bold"
        >
          <ChevronLeft size={20} /> Back to Library
        </button>
      </div>
    )
  }

  // Calculations
  const allLectures = course.sections.flatMap((s: any) => s.lectures)
  const totalLectures = allLectures.length
  const completedCount = completedLectures.length
  const overallProgress = totalLectures === 0 ? 0 : Math.round((completedCount / totalLectures) * 100)
  
  const totalPages = allLectures.reduce((acc: number, l: any) => acc + (l.pages || 0), 0)

  const firstIncompleteLecture = allLectures.find((l: any) => !completedLectures.includes(l.id)) || allLectures[0]

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const navigateToLecture = (lectureId: string) => {
    if (typeof window === 'undefined') return
    setIsSidebarOpen(false)
    const pagesStr = localStorage.getItem(`avid-pages-${lectureId}`)
    if (pagesStr) {
      try {
        const pages = JSON.parse(pagesStr)
        if (pages && pages.length > 0) {
          router.push(`/dashboard/learn/${courseId}/${lectureId}/${pages[0].id}`)
          return
        }
      } catch (e) {
        console.error("Error parsing pages", e)
      }
    }
    router.push(`/dashboard/learn/${courseId}/${lectureId}/page-1`)
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Topbar */}
      <header className="h-20 border-b border-slate-200 bg-white fixed top-0 w-full z-[70] px-6 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
          >
            <Play className="w-5 h-5 rotate-180" fill="currentColor" />
          </button>
          <Logo size="sm" destination="/" />
        </div>

        <div className="hidden lg:block max-w-md w-full mx-10">
          <div className="text-center">
            <h1 className="text-sm font-black text-[#131b2e] uppercase truncate tracking-tight px-4">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
             <span className="text-[10px] font-black uppercase tracking-widest text-[#00685f]">Learning Mode</span>
             <span className="text-[9px] font-bold text-slate-400">Avid Trainings Hub</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#131b2e] flex items-center justify-center text-white font-black text-sm border-2 border-[#00685f]/20">
            {user?.displayName ? user.displayName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U')}
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-20">
        {/* Mobile Sidebar Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-md z-[80] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          fixed left-0 top-0 lg:top-20 h-full lg:h-[calc(100vh-80px)] w-80 bg-white border-r border-slate-200 
          z-[90] lg:z-40 transition-transform duration-500 flex flex-col overflow-hidden
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between lg:block">
            <div className="space-y-4 flex-1">
              <button 
                onClick={() => router.push('/dashboard/library')}
                className="flex items-center gap-2 text-slate-400 hover:text-[#00685f] transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#00685f]/10 transition-colors">
                  <ChevronLeft size={16} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Exit Course</span>
              </button>
              <h2 className="text-lg font-black text-[#131b2e] leading-tight line-clamp-2">
                {course.title}
              </h2>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-[#131b2e]"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                <span className="text-slate-400">Total Progress</span>
                <span className="text-[#00685f]">{overallProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-[#00685f]" 
                />
              </div>
            </div>
            <button
               onClick={() => setShowUnenrollModal(true)}
               className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors mt-4 group"
            >
               <LogOut size={14} className="text-red-400" />
               <span className="text-[10px] font-black uppercase tracking-widest">Unenroll From Course</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-6">
              {course.sections.map((section: any, sIdx: number) => {
                const isExpanded = expandedSections.includes(section.id)
                const completedInSection = section.lectures.filter((l: any) => completedLectures.includes(l.id)).length
                
                return (
                  <div key={section.id} className="space-y-3">
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between group"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00685f]">
                          Section {sIdx + 1}
                        </span>
                        <span className="text-xs font-black text-[#131b2e] uppercase text-left group-hover:text-[#00685f] transition-colors">
                          {section.title}
                        </span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`text-slate-400 transform transition-transform duration-300 ${isExpanded ? '' : '-rotate-90'}`} 
                      />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-1"
                        >
                          {section.lectures.map((lecture: any, lIdx: number) => {
                            const isComplete = completedLectures.includes(lecture.id)
                            const isNext = firstIncompleteLecture?.id === lecture.id
                            
                            return (
                              <motion.div
                                key={lecture.id}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: lIdx * 0.05 }}
                                onClick={() => navigateToLecture(lecture.id)}
                                className={`group p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 relative overflow-hidden
                                  ${isNext ? 'bg-[#00685f]/5 border-l-4 border-[#00685f]' : 'hover:bg-slate-50'}
                                `}
                              >
                                <div className="mt-1 shrink-0">
                                  {isComplete ? (
                                    <CheckCircle2 size={16} className="text-[#00685f] fill-[#00685f]/10" />
                                  ) : isNext ? (
                                    <motion.div 
                                      animate={{ scale: [1, 1.2, 1] }} 
                                      transition={{ duration: 2, repeat: Infinity }}
                                      className="w-4 h-4 rounded-full border-2 border-[#00685f] flex items-center justify-center"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#00685f]" />
                                    </motion.div>
                                  ) : (
                                    <Circle size={16} className="text-slate-300" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className={`text-xs font-black leading-tight mb-2 uppercase tracking-tight
                                    ${isComplete ? 'text-slate-400' : 'text-[#131b2e]'}
                                  `}>
                                    {lecture.title}
                                  </p>
                                  <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1">
                                      <Clock size={10} /> {lecture.pages * 2} min
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <BookOpen size={10} /> {lecture.pages} pages
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80 p-4 sm:p-8 md:p-10 max-w-6xl mx-auto w-full">
          {/* Course Intro Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
            <div className="h-64 bg-gradient-to-br from-[#131b2e] to-[#00685f] relative flex items-center justify-center overflow-hidden">
               {/* Decorative Circles */}
               <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
               <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl"></div>
               
               <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl relative z-10"
               >
                 <GraduationCap size={48} strokeWidth={1.5} />
               </motion.div>
            </div>
            
            <div className="p-10 pt-0 -mt-10 relative z-20">
              <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-10 shadow-xl border border-slate-50">
                <div className="flex flex-col gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-4 flex-1">
                      <span className="px-5 py-2 bg-[#00685f]/10 text-[#00685f] text-[10px] font-black uppercase tracking-[0.2em] rounded-full inline-block">
                        {course.isoStandard}
                      </span>
                      <h1 className="text-4xl font-black text-[#131b2e] leading-[1.1] uppercase tracking-tighter">
                        {course.title}
                      </h1>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#131b2e] flex items-center justify-center text-white font-black text-xs">
                          {course.creatorName ? course.creatorName[0].toUpperCase() : 'A'}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77]">
                          Created by <span className="text-[#131b2e]">{course.creatorName}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 text-right space-y-2">
                       <span className="text-4xl font-black text-[#131b2e] tracking-tighter">
                         {overallProgress}%
                       </span>
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Completion Status</p>
                    </div>
                  </div>

                  <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#00685f] to-teal-400" 
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-8 py-8 border-y border-slate-100">
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#131b2e]">{course.sections.length}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Sections</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#131b2e]">{totalLectures}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Lessons & Quizzes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#131b2e]">{totalPages}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Content Pages</p>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => navigateToLecture(firstIncompleteLecture.id)}
                      className="flex-1 bg-[#131b2e] hover:bg-[#00685f] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] hover:shadow-2xl active:scale-[0.98]"
                    >
                      <Play fill="white" size={18} />
                      {completedCount === totalLectures ? "Review Course" : completedCount > 0 ? "Resume Learning" : "Start Learning"}
                    </button>
                    {completedCount === totalLectures && (
                      <button 
                        onClick={() => router.push(`/dashboard/learn/${courseId}/certificate`)}
                        className="flex-1 bg-[#00685f] hover:bg-[#004d46] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] hover:shadow-2xl active:scale-[0.98]"
                      >
                        <Award size={20} /> View Certificate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Breakdown */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-[#131b2e] uppercase tracking-tight">Curriculum Overview</h3>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                 {completedCount} of {totalLectures} Lessons Finished
               </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.sections.map((section: any, idx: number) => {
                const totalInSec = section.lectures.length
                const completedInSec = section.lectures.filter((l: any) => completedLectures.includes(l.id)).length
                const secPercent = totalInSec === 0 ? 0 : Math.round((completedInSec / totalInSec) * 100)
                
                return (
                  <motion.div 
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-[#00685f] uppercase tracking-widest">Section {idx + 1}</span>
                        <h4 className="font-black text-[#131b2e] leading-tight text-base uppercase">{section.title}</h4>
                      </div>
                      <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-[#00685f]/10 transition-colors">
                        <span className="text-xs font-black text-[#00685f]">{secPercent}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter text-slate-400">
                        <span>Progress</span>
                        <span>{completedInSec}/{totalInSec} Lessons</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                         <div 
                          className="h-full bg-[#00685f] transition-all duration-1000" 
                          style={{ width: `${secPercent}%` }}
                         />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showUnenrollModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={() => setShowUnenrollModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-6"
            >
              <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                  <LogOut size={24} className="text-red-500" />
                </div>
                <h3 className="text-xl font-black text-[#131b2e] uppercase tracking-tight mb-2">
                  Unenroll from course?
                </h3>
                <p className="text-sm font-medium text-[#6d7a77] leading-relaxed mb-8">
                  This will remove the course from your library and delete all your progress. This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowUnenrollModal(false)}
                    className="flex-1 py-4 border-2 border-[#bcc9c6] rounded-2xl text-xs font-black uppercase tracking-widest text-[#6d7a77] hover:border-[#131b2e] hover:text-[#131b2e] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUnenroll}
                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
                  >
                    Yes, Unenroll
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  )
}
