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
  MoreVertical,
  Trophy,
  Star
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Link as TiptapLink } from '@tiptap/extension-link'
import { Highlight } from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import Head from 'next/head'

import { getAllCourses } from '@/lib/utils/courseUtils'
import PageBlockDispatcher from '@/components/editor/PageBuilder/PageBlockDispatcher'
import { useImageSrc } from "@/hooks/useImageSrc"

export default function LectureViewerPage() {
  const router = useRouter()
  const params = useParams() as { courseId: string; lectureId: string; pageId: string }
  const { courseId, lectureId, pageId } = params

  const [user, loadingAuth] = useAuthState(auth)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [course, setCourse] = useState<any>(null)
  const [pages, setPages] = useState<any[]>([])
  const [activePage, setActivePage] = useState<any>(null)
  const [completedLectures, setCompletedLectures] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [showCompletionPopup, setShowCompletionPopup] = useState<{type: 'lecture' | 'section', title: string, nextAction: () => void} | null>(null)

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
      Table.configure({
        HTMLAttributes: {
          class: 'avid-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: '',
    editable: false,
    immediatelyRender: false,
  })

  const [realPageCounts, setRealPageCounts] = useState<Record<string, number>>({})

  const resolvedPopupImage = useImageSrc(
    activePage?.content?.popupImage
  )

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

    // Build real page count map from localStorage
    const counts: Record<string, number> = {}
    foundCourse.sections.forEach((section: any) => {
      section.lectures.forEach((lec: any) => {
        const stored = localStorage.getItem(`avid-pages-${lec.id}`)
        if (stored) {
          try {
            const pagesArray = JSON.parse(stored)
            counts[lec.id] = Array.isArray(pagesArray) ? pagesArray.length : (lec.pages || 0)
          } catch {
            counts[lec.id] = lec.pages || 0
          }
        } else {
          counts[lec.id] = lec.pages || 0
        }
      })
    })
    setRealPageCounts(counts)

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
      if (currentLectureIdx > 0) {
        const prevLec = flatLectures[currentLectureIdx - 1]
        const prevLecPagesStr = localStorage.getItem(`avid-pages-${prevLec.id}`)
        const prevPages = prevLecPagesStr ? JSON.parse(prevLecPagesStr) : []
        if (prevPages.length > 0) {
          router.push(`/dashboard/learn/${courseId}/${prevLec.id}/${prevPages[prevPages.length - 1].id}`)
        } else {
          router.push(`/dashboard/learn/${courseId}/${prevLec.id}/${prevLec.id}-p1`)
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
    const progressStr = localStorage.getItem(`avid-progress-${courseId}`)
    const progressData = progressStr ? JSON.parse(progressStr) : { completedLectures: [] }
    const newCompleted = [...progressData.completedLectures]
    const wasAlreadyCompleted = newCompleted.includes(lectureId)
    
    if (!wasAlreadyCompleted) {
      newCompleted.push(lectureId)
      localStorage.setItem(`avid-progress-${courseId}`, JSON.stringify({ completedLectures: newCompleted }))
      setCompletedLectures(newCompleted)
    }

    const performNextNavigation = () => {
      setShowCompletionPopup(null);
      if (currentLectureIdx < flatLectures.length - 1) {
        const nextLec = flatLectures[currentLectureIdx + 1]
        const nextLecPagesStr = localStorage.getItem(`avid-pages-${nextLec.id}`)
        const nextPages = nextLecPagesStr ? JSON.parse(nextLecPagesStr) : []
        if (nextPages.length > 0) {
          router.push(`/dashboard/learn/${courseId}/${nextLec.id}/${nextPages[0].id}`)
        } else {
          router.push(`/dashboard/learn/${courseId}/${nextLec.id}/${nextLec.id}-p1`)
        }
      } else {
        router.push(`/dashboard/learn/${courseId}/certificate`)
      }
    };

    const sectionLectures = currentSection?.lectures.map((l: any) => l.id) || [];
    const isLastLectureInSection = sectionLectures[sectionLectures.length - 1] === lectureId;
    
    if (isLastLectureInSection) {
      setShowCompletionPopup({
        type: 'section',
        title: currentSection.title,
        nextAction: performNextNavigation
      });
    } else {
      setShowCompletionPopup({
        type: 'lecture',
        title: activeLectureInfo.title,
        nextAction: performNextNavigation
      });
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

      {/* Global Table Styles for Learner View — fixed: removed .prose prefix */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .avid-table {
          border-collapse: separate !important;
          border-spacing: 0 !important;
          width: 100% !important;
          margin: 2rem 0 !important;
          border-radius: 1.5rem !important;
          border: 2px solid #00685f20 !important;
          overflow: hidden !important;
          box-shadow: 0 10px 30px -12px rgba(0, 104, 95, 0.12) !important;
        }
        .avid-table td,
        .avid-table th {
          border: 1px solid #00685f15 !important;
          padding: 16px 20px !important;
          vertical-align: top !important;
          background-color: white !important;
          text-decoration: none !important;
        }
        .avid-table tr:first-child th,
        .avid-table tr:first-child td {
          background-color: #00685f !important;
          color: white !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          font-size: 0.8rem !important;
          border-color: #ffffff20 !important;
          text-decoration: none !important;
        }
        .avid-table tr:first-child p {
          color: white !important;
          font-weight: 800 !important;
          text-decoration: none !important;
        }
        .avid-table tr:nth-child(even) td {
          background-color: #f7f9fb !important;
        }
        .avid-table tr:hover td {
          background-color: #f0fdfa !important;
        }
        .avid-table * {
          text-decoration: none !important;
        }
        .avid-table tr:first-child > *:first-child { border-top-left-radius: 1.3rem !important; }
        .avid-table tr:first-child > *:last-child { border-top-right-radius: 1.3rem !important; }
        .avid-table tr:last-child > *:first-child { border-bottom-left-radius: 1.3rem !important; }
        .avid-table tr:last-child > *:last-child { border-bottom-right-radius: 1.3rem !important; }
      `}} />

      <header className="h-16 bg-white border-b border-slate-200 shrink-0 z-[60] flex items-center justify-between px-4 sm:px-6 gap-4">
        <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden w-9 h-9 shrink-0 rounded-xl hover:bg-slate-50 flex items-center justify-center transition-colors border border-slate-100"
          >
            <Menu size={18} className="text-slate-600" />
          </button>
          <button
            onClick={() => router.push(`/dashboard/learn/${courseId}`)}
            className="hidden sm:flex shrink-0 w-9 h-9 rounded-xl hover:bg-slate-50 items-center justify-center transition-colors border border-slate-100"
          >
            <X size={18} className="text-slate-400" />
          </button>
          <div className="flex flex-col flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="truncate min-w-0">{course.title}</span>
              <ChevronRight size={10} className="shrink-0" />
              <span className="truncate min-w-0">{currentSection?.title}</span>
            </div>
            <h2 className="text-[10px] sm:text-xs font-black text-[#131b2e] uppercase tracking-tight truncate mt-0.5 w-full">
              {activeLectureInfo?.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:block">
            <p className="text-[11px] font-black text-[#131b2e] uppercase tracking-tighter truncate max-w-[150px]">
              {activePage.title}
            </p>
          </div>

          <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl bg-[#131b2e] flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-sm">
            {user?.displayName?.[0].toUpperCase() || user?.email?.[0].toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">

        {/* Mobile Sidebar Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-md z-[70] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Navigation Sidebar */}
        <aside className={`
          fixed left-0 top-0 lg:top-16 h-full lg:h-[calc(100vh-64px)] w-72 bg-white border-r border-slate-200 
          z-[80] lg:z-40 transition-transform duration-500 overflow-y-auto custom-scrollbar flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between lg:block">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00685f]">
              Course Syllabus
            </h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
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
                                setIsSidebarOpen(false)
                                const ls = localStorage.getItem(`avid-pages-${lec.id}`)
                                const lp = ls ? JSON.parse(ls) : []
                                if (lp.length > 0) router.push(`/dashboard/learn/${courseId}/${lec.id}/${lp[0].id}`)
                                else router.push(`/dashboard/learn/${courseId}/${lec.id}/${lec.id}-p1`)
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
                                  <span className="flex items-center gap-0.5"><Clock size={10} /> {(realPageCounts[lec.id] ?? lec.pages ?? 0) * 2} min</span>
                                  <span className="flex items-center gap-0.5"><BookOpen size={10} /> {realPageCounts[lec.id] ?? lec.pages ?? 0} pages</span>
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
        <main className="flex-1 lg:ml-72 h-full overflow-hidden p-6 sm:p-10 md:p-14 pb-32 w-full bg-[#f7f9fb]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={activePage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden flex flex-col"
              style={{ height: 'calc(100vh - 220px)' }}
            >
              {activePage.heading && (
                <div className="w-full bg-[#00685f] px-12 py-5 shrink-0 z-10" style={{ width: '100%' }}>
                  <h1 className="text-white font-black text-xl uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: activePage.heading }} />
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-12 py-10 custom-scrollbar">
                <PageBlockDispatcher
                  layout={activePage.layout}
                  content={activePage.content}
                  onUpdate={() => { }}
                  editor={editor}
                  isPreview={true}
                />
              </div>

              {(activePage.content?.popupTitle || activePage.content?.popupImage) && (
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
      <footer className="h-20 sm:h-20 bg-white border-t border-slate-200 fixed bottom-0 w-full z-50 px-4 sm:px-8 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">

        <div className="hidden sm:flex flex-col gap-2 min-w-[140px] md:min-w-[200px]">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#00685f]">
            <span>Progress</span>
            <span>{sectionProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#00685f] transition-all duration-700" style={{ width: `${sectionProgress}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 flex-1 sm:flex-none justify-center">
          <button
            disabled={isFirstPage && currentLectureIdx === 0}
            onClick={goPrevPage}
            className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2 border border-[#bcc9c6] rounded-xl text-xs font-black uppercase tracking-widest text-[#131b2e] hover:border-[#00685f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
          >
            <ChevronLeft size={16} /> <span className="hidden sm:inline ml-2">Previous</span>
          </button>

          <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest whitespace-nowrap">
            {currentPageIdx + 1} / {pages.length}
          </span>

          <button
            disabled={isLastPage}
            onClick={goNextPage}
            className={`flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2 border border-[#bcc9c6] rounded-xl text-xs font-black uppercase tracking-widest text-[#131b2e] hover:border-[#00685f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white ${isLastPage ? 'hidden' : 'flex'}`}
          >
            <span className="hidden sm:inline mr-2">Next</span> <ChevronRight size={16} />
          </button>
        </div>

        <div className="min-w-0 sm:min-w-[140px] md:min-w-[200px] flex justify-end">
          {isLastPage && (
            <button
              onClick={markComplete}
              className="bg-[#00685f] hover:bg-[#131b2e] text-white px-4 sm:px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] flex items-center gap-2 sm:gap-3 transition-all transform hover:scale-[1.02] shadow-teal whitespace-nowrap"
            >
              <CheckCircle2 size={16} />
              <span className="hidden xs:inline">{currentLectureIdx === flatLectures.length - 1 ? "Finish" : "Complete"}</span>
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
              className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              {/* Teal Header with title and X */}
              <div className="bg-[#00685f] px-8 py-5 flex items-center justify-between">
                <h3 className="text-white font-black text-lg uppercase tracking-widest">
                  {activePage.content?.popupTitle || 'Information'}
                </h3>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body — image + content based on position */}
              <div className="p-8">
                {resolvedPopupImage ? (() => {
                  const pos = activePage.content?.popupImagePosition || 'left'
                  
                  if (pos === 'center') {
                    return (
                      <div className="flex flex-col gap-6">
                        <img src={resolvedPopupImage} className="w-full max-h-64 object-contain rounded-xl" />
                        {activePage.content?.popupContent && (
                          <p className="text-slate-600 font-medium leading-relaxed">
                            {activePage.content.popupContent}
                          </p>
                        )}
                      </div>
                    )
                  }
                  
                  if (pos === 'top') {
                    return (
                      <div className="flex flex-col gap-6">
                        <img src={resolvedPopupImage} className="w-full max-h-48 object-contain rounded-xl" />
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {activePage.content?.popupContent}
                        </p>
                      </div>
                    )
                  }
                  
                  if (pos === 'bottom') {
                    return (
                      <div className="flex flex-col gap-6">
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {activePage.content?.popupContent}
                        </p>
                        <img src={resolvedPopupImage} className="w-full max-h-48 object-contain rounded-xl" />
                      </div>
                    )
                  }
                  
                  // left or right
                  return (
                    <div className={`flex gap-6 items-start ${pos === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <img src={resolvedPopupImage} className="w-1/3 max-h-48 object-contain rounded-xl flex-shrink-0" />
                      <p className="flex-1 text-slate-600 font-medium leading-relaxed">
                        {activePage.content?.popupContent}
                      </p>
                    </div>
                  )
                })() : (
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {activePage.content?.popupContent}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => showCompletionPopup.nextAction()}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className={`relative rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-8 text-center border-2 
                ${showCompletionPopup.type === 'section' 
                  ? 'bg-gradient-to-b from-[#131b2e] to-[#0f1524] border-[#00685f]/30 text-white' 
                  : 'bg-gradient-to-b from-teal-50 to-white border-teal-100 text-[#131b2e]'
                }`}
            >
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-inner
                  ${showCompletionPopup.type === 'section'
                    ? 'bg-[#00685f]/20 text-emerald-400 border border-emerald-500/20'
                    : 'bg-[#00685f] text-white shadow-teal'
                  }`}
                >
                  {showCompletionPopup.type === 'section' ? <Trophy size={40} /> : <Star size={40} fill="currentColor" />}
                </div>
              </div>
              
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 
                ${showCompletionPopup.type === 'section' ? 'text-emerald-400' : 'text-[#00685f]'}`}>
                {showCompletionPopup.type === 'section' ? 'Section Completed' : 'Lecture Completed'}
              </h4>
              
              <h2 className="text-xl font-black uppercase tracking-tight mb-8">
                {showCompletionPopup.title}
              </h2>
              
              <button
                onClick={() => showCompletionPopup.nextAction()}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all transform hover:scale-105 active:scale-95
                  ${showCompletionPopup.type === 'section'
                    ? 'bg-[#00685f] hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(0,104,95,0.4)]'
                    : 'bg-[#131b2e] hover:bg-black text-white shadow-lg'
                  }`}
              >
                Continue
              </button>
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