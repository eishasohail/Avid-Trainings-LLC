"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  Award, 
  QrCode, 
  Download, 
  Share2, 
  CheckCircle2, 
  Lock,
  Play,
  ShieldCheck,
  Trophy
} from "lucide-react"
import { auth } from "@/lib/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { getCourseById } from "@/lib/data/dummyData"
import Logo from "@/components/shared/Logo"

export default function CertificatePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.courseId as string
  const [user, loadingAuth] = useAuthState(auth)

  const [course, setCourse] = useState<any>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loadingAuth) return
    if (!user) {
      router.push("/login")
      return
    }

    if (typeof window === "undefined") return

    // Enrollment check
    const enrolledStr = localStorage.getItem("avid-enrolled-courses")
    const enrolledIds = enrolledStr ? JSON.parse(enrolledStr) : []
    if (!enrolledIds.includes(courseId)) {
      router.push(`/dashboard/library/${courseId}`)
      return
    }
    setIsEnrolled(true)

    // Course data
    const foundCourse = getCourseById(courseId)
    if (!foundCourse) {
      setLoading(false)
      return
    }
    setCourse(foundCourse)

    // Progress data
    const progressStr = localStorage.getItem(`avid-progress-${courseId}`)
    const progressData = progressStr ? JSON.parse(progressStr) : { completedLectures: [] }
    setProgress(progressData)
    
    setLoading(false)
  }, [courseId, user, loadingAuth, router])

  const { isComplete, completionDate, certId } = useMemo(() => {
    if (!course || !progress || !user) return { isComplete: false, completionDate: "", certId: "" }

    const totalLectures = course.sections.reduce((acc: number, s: any) => acc + s.lectures.length, 0)
    const completed = progress.completedLectures || []
    const complete = completed.length >= totalLectures && totalLectures > 0

    // Get completion date from progress or use today
    const dateStr = progress.completedAt || new Date().toISOString()
    const dateObj = new Date(dateStr)
    
    // Format: "20th April, 2026"
    const day = dateObj.getDate()
    const month = dateObj.toLocaleString('en-US', { month: 'long' })
    const year = dateObj.getFullYear()
    
    const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"]
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    }
    const formattedDate = `${getOrdinal(day)} ${month}, ${year}`

    // Certificate ID: AVD-[courseId.toUpperCase()]-[first 6 chars of uid]
    const shortUid = user.uid.substring(0, 6).toUpperCase()
    const generatedId = `AVD-${courseId.toUpperCase().replace('-', '')}-${shortUid}`

    return { isComplete: complete, completionDate: formattedDate, certId: generatedId }
  }, [course, progress, user, courseId])

  if (loadingAuth || loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00685f]"></div>
      </div>
    )
  }

  if (!course) return null

  const handleDownload = () => {
    window.print()
  }

  const handleShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://avid-trainings.vercel.app')}`,
      '_blank'
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] selection:bg-[#00685f]/15">
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-card, 
          #certificate-card * { visibility: visible; }
          #certificate-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Top Bar */}
      <nav className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between no-print sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => router.push('/dashboard/my-courses')}
          className="flex items-center gap-2 text-[#6d7a77] hover:text-[#131b2e] transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">My Courses</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-sm font-black text-[#131b2e] uppercase tracking-[0.2em]">Certificate of Completion</h1>
          <div className="h-1 w-12 bg-[#00685f] rounded-full mt-1" />
        </div>

        <div className="w-10 h-10 rounded-2xl bg-[#131b2e] flex items-center justify-center text-white font-black text-sm border-2 border-[#00685f]/10 shadow-lg">
          {user?.displayName ? user.displayName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U')}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-16 flex flex-col items-center">
        
        {/* Certificate Container */}
        <div className="relative w-full mb-16">
          {!isComplete && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none p-10 mt-10">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white/50 text-center space-y-6 pointer-events-auto max-w-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-[#131b2e]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#131b2e] uppercase tracking-tight">Certificate Locked</h2>
                  <p className="text-sm font-medium text-[#6d7a77] mt-2">Complete the course to unlock your official certification.</p>
                </div>
                <button 
                  onClick={() => router.push(`/dashboard/learn/${courseId}`)}
                  className="w-full py-4 bg-[#131b2e] hover:bg-[#00685f] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                >
                  <Play fill="white" size={14} /> Continue Learning
                </button>
              </div>
            </div>
          )}

          <motion.div 
            id="certificate-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full aspect-[1.4/1] bg-white rounded-[2rem] shadow-[0_40px_120px_-30px_rgba(19,27,46,0.2)] border-4 border-[#00685f] overflow-hidden flex transition-all duration-1000 ${!isComplete ? 'blur-lg grayscale opacity-40' : ''}`}
          >
            {/* Left Panel */}
            <div className="w-1/4 bg-[#00685f] relative flex flex-col items-center justify-between py-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center relative z-10 shadow-2xl">
                  <div className="w-20 h-20 rounded-full border-4 border-[#00685f]/20 flex items-center justify-center">
                    <Award size={40} className="text-[#00685f]" strokeWidth={1.5} />
                  </div>
                </div>
                {/* Decorative Medal Shape */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                
                {/* Ribbons */}
                <div className="absolute top-full left-1/2 -translate-x-[60%] w-6 h-20 bg-[#00524b] rounded-b-lg -mt-4 shadow-lg origin-top rotate-[15deg]"></div>
                <div className="absolute top-full left-1/2 -translate-x-[40%] w-6 h-24 bg-[#004a43] rounded-b-lg -mt-4 shadow-lg origin-top -rotate-[5deg]"></div>
              </div>

              <div className="bg-white px-6 py-2 rounded-xl shadow-2xl relative z-10 transform -rotate-1">
                 <span className="text-xs font-black text-[#00685f] uppercase tracking-widest">{course.isoStandard}</span>
              </div>

              {/* Texture/Background Details */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />
              </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 bg-white p-16 flex flex-col relative">
              {/* Logo section */}
              <div className="absolute top-12 right-16 text-right">
                <Logo size="md" clickable={false} />
              </div>

              <div className="mt-8">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Certificate of Completion</span>
                <h2 className="text-5xl font-black text-[#131b2e] uppercase tracking-tighter mt-4 leading-none">
                  {user?.displayName || user?.email?.split('@')[0]}
                </h2>
                <div className="w-full h-px bg-slate-100 my-8" />
                
                <p className="text-sm font-medium text-slate-400">has successfully completed the course:</p>
                <h3 className="text-3xl font-black text-[#00685f] uppercase tracking-tight mt-2 leading-tight">
                  {course.title}
                </h3>
                
                <div className="flex gap-4 mt-6">
                  <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
                    {course.isoStandard} Standard
                  </div>
                  <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
                    {course.category}
                  </div>
                </div>
              </div>

              {/* Bottom Details Section */}
              <div className="mt-auto pt-10 border-t border-slate-100 grid grid-cols-3 items-end gap-10">
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block">Date of Award</span>
                  <p className="text-sm font-black text-[#131b2e] uppercase tracking-tight">{completionDate}</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 bg-[#f7f9fb] border border-slate-100 rounded-xl flex items-center justify-center text-[#00685f] shadow-inner relative group">
                    <QrCode size={40} strokeWidth={1} />
                    <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <div className="w-full h-full border border-dashed border-[#00685f]/30" />
                    </div>
                  </div>
                  <div className="text-center group">
                    <span className="text-[8px] font-black text-[#131b2e] tracking-widest uppercase block mb-0.5">{certId}</span>
                    <span className="text-[7px] text-slate-400 uppercase tracking-widest">avid-trainings.vercel.app/verify</span>
                  </div>
                </div>

                <div className="text-right space-y-4">
                  <div className="relative group inline-block">
                    {/* Fake signature */}
                    <p className="font-['Courier_New',_monospace] text-2xl text-[#131b2e]/80 italic transform -rotate-1 mb-[-4px]">Syra</p>
                    <div className="w-40 h-[2px] bg-slate-200 group-hover:bg-[#00685f] transition-colors" />
                    <p className="text-sm font-black text-[#131b2e] uppercase tracking-tight mt-2">Syra</p>
                    <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-1">Director of Certification</p>
                  </div>
                </div>
              </div>

              {/* Decorative Background Icon */}
              <div className="absolute bottom-[-40px] right-[-40px] opacity-[0.03] pointer-events-none transform -rotate-12">
                 <Trophy size={400} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefits Row */}
        {isComplete && (
          <div className="w-full max-w-3xl space-y-12 no-print">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                "Highlight your skills to potential employers",
                "Share your achievement on LinkedIn",
                "Download your certificate as PDF"
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-[#00685f]/5 text-[#00685f]">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-[11px] font-black text-[#6d7a77] uppercase tracking-tight leading-tight pt-1">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={handleDownload}
                className="flex-1 py-6 bg-[#131b2e] hover:bg-[#00685f] text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#131b2e]/20 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0"
              >
                <Download size={18} /> Download PDF
              </button>
              
              <button 
                onClick={handleShare}
                className="flex-1 py-6 border-4 border-[#0077b5] text-[#0077b5] bg-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-[#0077b5] hover:text-white transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0 shadow-xl"
              >
                <Share2 size={18} /> Share on LinkedIn
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="py-20 text-center no-print">
         <p className="text-[9px] font-black text-[#bcc9c6] uppercase tracking-[0.5em]">Avid Trainings LLC • Official Certification Authority</p>
      </footer>
    </div>
  )
}
