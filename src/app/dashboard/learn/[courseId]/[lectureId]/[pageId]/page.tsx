"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { auth } from "@/lib/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  X, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Info,
  Bell,
  Menu,
  MoreVertical
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Link as TiptapLink } from '@tiptap/extension-link'
import { Highlight } from '@tiptap/extension-highlight'

import { getAllCourses } from '@/lib/utils/courseUtils'
import PageBlockDispatcher from '@/components/editor/PageBuilder/PageBlockDispatcher'

export default function LectureViewerPage() {
  const router = useRouter()
  const params = useParams() as { courseId: string; lectureId: string; pageId: string }
  const { courseId, lectureId, pageId } = params

  const [user, loadingAuth] = useAuthState(auth)
  
  const [course, setCourse] = useState<any>(null)
  const [pages, setPages] = useState<any[]>([])
  const [activePage, setActivePage] = useState<any>(null)
  const [completedLectures, setCompletedLectures] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  // TipTap Editor Initialization
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Color,
      TextStyle,
      TiptapLink.configure({ openOnClick: false }),
      Highlight.configure({ multicolor: true }),
    ],
    content: '',
    editable: false,
    immediatelyRender: false,
  })

  // Load Data
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (loadingAuth) return
    if (!user) {
      router.push('/login')
      return
    }

    // 1. Get Course
    const allCourses = getAllCourses()
    const foundCourse = allCourses.find(c => c.id === courseId)
    if (!foundCourse) {
      setLoading(false)
      return
    }
    setCourse(foundCourse)

    // 2. Get Pages for this lecture
    const savedPages = localStorage.getItem(`avid-pages-${lectureId}`)
    const lecturePages = savedPages ? JSON.parse(savedPages) : []
    setPages(lecturePages)

    const currentPage = lecturePages.find((p: any) => p.id === pageId)
    setActivePage(currentPage)

    // 3. Get Progress
    const progressStr = localStorage.getItem(`avid-progress-${courseId}`)
    const progressData = progressStr ? JSON.parse(progressStr) : { completedLectures: [] }
    setCompletedLectures(progressData.completedLectures || [])

    // 4. Update Last Position
    localStorage.setItem(`avid-last-position-${courseId}`, JSON.stringify({ lectureId, pageId }))

    // 5. Expand current section
    const currentSection = foundCourse.sections.find((s: any) => 
      s.lectures.some((l: any) => l.id === lectureId)
    )
    if (currentSection) {
      setExpandedSections(prev => prev.includes(currentSection.id) ? prev : [...prev, currentSection.id])
    }

    setLoading(false)
  }, [courseId, lectureId, pageId, user, loadingAuth, router])

  // Sync Editor Content
  useEffect(() => {
    if (editor && activePage?.content?.text !== undefined) {
      editor.commands.setContent(activePage?.content?.text || '')
    }
  }, [activePage?.id, editor])

  // Flat list of all lectures for nav
  const flatLectures = useMemo(() => {
    if (!course) return []
    return course.sections.flatMap((s: any) => s.lectures)
  }, [course])

  const currentLectureIdx = flatLectures.findIndex((l: any) => l.id === lectureId)
  const activeLectureInfo = flatLectures[currentLectureIdx]
  
  const currentSection = course?.sections.find((s: any) => 
    s.lectures.some((l: any) => l.id === lectureId)
  )

  const currentPageIdx = pages.findIndex(p => p.id === pageId)
  const isFirstPage = currentPageIdx === 0
  const isLastPage = currentPageIdx === pages.length - 1

  // Navigation Handlers
  const goPrevPage = () => {
    if (currentPageIdx > 0) {
      router.push(`/dashboard/learn/${courseId}/${lectureId}/${pages[currentPageIdx - 1].id}`)
    } else {
      // Go to previous lecture's last page
      if (currentLectureIdx > 0) {
        const prevLec = flatLectures[currentLectureIdx - 1]
        const prevLecPagesStr = localStorage.getItem(`avid-pages-${prevLec.id}`)
        const prevPages = prevLecPagesStr ? JSON.parse(prevLecPagesStr) : []
        if (prevPages.length > 0) {
          router.push(`/dashboard/learn/${courseId}/${prevLec.id}/${prevPages[prevPages.length - 1].id}`)
        } else {
          router.push(`/dashboard/learn/${courseId}/${prevLec.id}/page-1`)
        }
      }
    }
  }

  const goNextPage = () => {
    if (currentPageIdx < pages.length - 1) {
      router.push(`/dashboard/learn/${courseId}/${lectureId}/${pages[currentPageIdx + 1].id}`)
    }
  }

  const markComplete = () => {
    if (typeof window === 'undefined') return
    // Update progress
    const progressStr = localStorage.getItem(`avid-progress-${courseId}`)
    const progressData = progressStr ? JSON.parse(progressStr) : { completedLectures: [] }
    const newCompleted = [...progressData.completedLectures]
    if (!newCompleted.includes(lectureId)) {
      newCompleted.push(lectureId)
    }
    localStorage.setItem(`avid-progress-${courseId}`, JSON.stringify({ completedLectures: newCompleted }))
    setCompletedLectures(newCompleted)

    // Navigate to next lecture
    if (currentLectureIdx < flatLectures.length - 1) {
      const nextLec = flatLectures[currentLectureIdx + 1]
      const nextLecPagesStr = localStorage.getItem(`avid-pages-${nextLec.id}`)
      const nextPages = nextLecPagesStr ? JSON.parse(nextLecPagesStr) : []
      if (nextPages.length > 0) {
        router.push(`/dashboard/learn/${courseId}/${nextLec.id}/${nextPages[0].id}`)
      } else {
        router.push(`/dashboard/learn/${courseId}/${nextLec.id}/page-1`)
      }
    } else {
      // Course finished
      router.push(`/dashboard/learn/${courseId}`)
    }
  }

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  if (loadingAuth || loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00685f]"></div>
      </div>
    )
  }

  if (!course || !activePage) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold text-[#131b2e]">
          {pages.length === 0 ? "No content available for this lecture" : "Page not found"}
        </h1>
        <button onClick={() => router.push(`/dashboard/learn/${courseId}`)} className="flex items-center gap-2 text-[#00685f] font-black uppercase text-[10px] tracking-widest">
          <ChevronLeft size={16} /> Back to Course Hub
        </button>
      </div>
    )
  }

  const sectionCompletedCount = currentSection?.lectures.filter((l: any) => completedLectures.includes(l.id)).length || 0
  const sectionTotalCount = currentSection?.lectures.length || 1
  const sectionProgress = Math.round((sectionCompletedCount / sectionTotalCount) * 100)

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col h-screen overflow-hidden">
      
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 shrink-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push(`/dashboard/learn/${courseId}`)}
            className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center transition-colors border border-slate-100"
          >
            <X size={20} className="text-slate-400" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="truncate max-w-[120px]">{course.title}</span>
              <ChevronRight size={10} />
              <span className="truncate max-w-[120px]">{currentSection?.title}</span>
            </div>
            <h2 className="text-xs font-black text-[#131b2e] uppercase tracking-tight">
               {activeLectureInfo?.title}
            </h2>
          </div>
        </div>

        <div className="hidden md:block">
          <p className="text-sm font-black text-[#131b2e] uppercase tracking-tighter line-clamp-1 max-w-md">
            {activePage.title}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Bell size={20} className="text-slate-300" />
          <div className="w-9 h-9 rounded-xl bg-[#131b2e] flex items-center justify-center text-white font-black text-sm">
            {user?.displayName?.[0].toUpperCase() || user?.email?.[0].toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Navigation Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-200 fixed left-0 h-full overflow-y-auto z-40 custom-scrollbar">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00685f]">
              Course Modules
            </h3>
          </div>

          <div className="p-4 space-y-4 pb-32">
            {course.sections.map((section: any, sIdx: number) => {
              const isExpanded = expandedSections.includes(section.id)
              
              return (
                <div key={section.id} className="space-y-2">
                  <button 
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-[#131b2e]">
                        {sIdx + 1}
                      </div>
                      <span className="text-[11px] font-black text-[#131b2e] uppercase tracking-tight group-hover:text-[#00685f] transition-colors">
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1 ml-2 pl-2 border-l border-slate-100"
                      >
                        {section.lectures.map((lec: any, lIdx: number) => {
                          const isActive = lec.id === lectureId
                          const isComplete = completedLectures.includes(lec.id)
                          
                          return (
                            <div 
                              key={lec.id}
                              onClick={() => {
                                // Navigate to lecture's first page
                                const ls = localStorage.getItem(`avid-pages-${lec.id}`)
                                const lp = ls ? JSON.parse(ls) : []
                                if (lp.length > 0) router.push(`/dashboard/learn/${courseId}/${lec.id}/${lp[0].id}`)
                                else router.push(`/dashboard/learn/${courseId}/${lec.id}/page-1`)
                              }}
                              className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3
                                ${isActive ? 'bg-[#00685f]/5 border-l-4 border-[#00685f]' : 'hover:bg-slate-50'}
                              `}
                            >
                              <div className="mt-1">
                                {isComplete ? (
                                  <CheckCircle2 size={14} className="text-[#00685f]" />
                                ) : isActive ? (
                                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00685f] flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00685f]" />
                                  </div>
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-300">
                                    {lIdx + 1}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`text-[11px] font-bold uppercase tracking-tight leading-none mb-1
                                  ${isComplete ? 'text-slate-400' : 'text-[#131b2e]'}
                                  ${isActive ? 'text-[#00685f]' : ''}
                                `}>
                                  {lec.title}
                                </p>
                                <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                  <span className="flex items-center gap-0.5"><Clock size={10} /> {lec.pages * 2} min</span>
                                  <span className="flex items-center gap-0.5"><BookOpen size={10} /> {lec.pages} pages</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="ml-72 flex-1 h-full overflow-y-auto p-12 custom-scrollbar pb-32">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              key={activePage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 relative"
            >
              {/* Optional Heading */}
              {activePage.heading && (
                <div 
                  className="text-2xl font-black text-[#131b2e] mb-10 uppercase tracking-tighter"
                  dangerouslySetInnerHTML={{ __html: activePage.heading }}
                />
              )}

              {/* Core Content */}
              <PageBlockDispatcher
                layout={activePage.layout}
                content={activePage.content}
                onUpdate={() => {}} 
                editor={editor}
                isPreview={true}
              />

              {/* Info Popup Button */}
              {activePage.content?.popupTitle && (
                <button 
                  onClick={() => setShowInfoModal(true)}
                  className="absolute bottom-8 right-8 w-12 h-12 bg-teal-50 hover:bg-[#00685f]/10 text-[#00685f] rounded-2xl flex items-center justify-center transition-all shadow-sm border border-[#00685f]/20 group"
                >
                  <Info size={24} className="group-hover:scale-110 transition-transform" />
                </button>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Bottom Bar */}
      <footer className="h-20 bg-white border-t border-slate-200 fixed bottom-0 w-full z-50 px-8 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        
        {/* Left: Module Progress */}
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#00685f]">
            <span>Module Progress</span>
            <span>{sectionProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-[#00685f] transition-all duration-700" style={{ width: `${sectionProgress}%` }} />
          </div>
        </div>

        {/* Center: Navigation Controls */}
        <div className="flex items-center gap-6">
          <button 
            disabled={isFirstPage && currentLectureIdx === 0}
            onClick={goPrevPage}
            className="flex items-center gap-2 px-4 py-2 border border-[#bcc9c6] rounded-xl text-xs font-black uppercase tracking-widest text-[#131b2e] hover:border-[#00685f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Page {currentPageIdx + 1} of {pages.length}
          </span>

          <button 
            disabled={isLastPage}
            onClick={goNextPage}
            className={`flex items-center gap-2 px-4 py-2 border border-[#bcc9c6] rounded-xl text-xs font-black uppercase tracking-widest text-[#131b2e] hover:border-[#00685f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white ${isLastPage ? 'hidden' : 'flex'}`}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Mark Complete */}
        <div className="min-w-[200px] flex justify-end">
          {isLastPage && (
            <button 
              onClick={markComplete}
              className="bg-[#00685f] hover:bg-[#131b2e] text-white px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 transition-all transform hover:scale-[1.02] shadow-teal"
            >
              <CheckCircle2 size={16} />
              {currentLectureIdx === flatLectures.length - 1 ? "Finish Course" : "Mark Complete"}
            </button>
          )}
        </div>
      </footer>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoModal(false)}
              className="absolute inset-0 bg-[#131b2e]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#00685f]">
                    <Info size={24} />
                  </div>
                  <h3 className="text-xl font-black text-[#131b2e] uppercase tracking-tighter">
                    {activePage.content?.popupTitle}
                  </h3>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-6 text-slate-600 font-medium leading-relaxed">
                  {activePage.content?.popupContent}
                </div>

                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="w-full mt-8 bg-[#131b2e] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#00685f] transition-all"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
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
