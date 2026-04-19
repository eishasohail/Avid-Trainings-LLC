"use client";

import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  ChevronRight, 
  FileText, 
  ShieldCheck,
} from "lucide-react";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";

// --- Dummy Data ---
const PREVIEW_DATA = {
  title: "ISO 27001 Information Security",
  description: "Comprehensive training for mastering Information Security Management Systems (ISMS) based on international ISO/IEC 27001 standards. This module covers risk management, structural controls, and operational compliance.",
  isoStandard: "ISO 27001",
  sections: [
    {
      id: "s1",
      title: "Introduction to ISO 27001",
      lectures: [
        { id: "l1", title: "What is ISO 27001?", pages: 3 },
        { id: "l2", title: "Key Concepts", pages: 5 },
        { id: "l3", title: "Scope and Objectives", pages: 4 }
      ]
    },
    {
      id: "s2", 
      title: "Risk Assessment",
      lectures: [
        { id: "l4", title: "Understanding Risk", pages: 6 },
        { id: "l5", title: "Risk Treatment", pages: 4 }
      ]
    },
    {
      id: "s3",
      title: "Implementation",
      lectures: [
        { id: "l6", title: "Controls and Measures", pages: 7 },
        { id: "l7", title: "Documentation", pages: 3 }
      ]
    }
  ]
};

export default function CoursePreviewPage() {
  const router = useRouter();
  const { courseId } = useParams();

  return (
    <DashboardWrapper loadingMessage="Rendering Preview View...">
      {(user) => (
        <div className="space-y-12 animate-fade-in-up">
           {/* Top Preview Banner */}
           <div className="fixed top-0 inset-x-0 md:left-64 z-[100] px-10 py-5 bg-[#00685f] text-white flex items-center justify-center gap-4 shadow-2xl transition-all">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em]">You are previewing this course as a Learner</p>
           </div>

           {/* Navigation & Header */}
           <header className="pt-24 space-y-10">
              <button 
                onClick={() => router.push(`/dashboard/editor/${courseId}`)}
                className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#6d7a77] hover:text-[#00685f] transition-all"
              >
                 <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                 Back to Editor Structure
              </button>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                 <div className="space-y-6 max-w-4xl">
                    <div className="flex items-center gap-3">
                       <span className="px-4 py-1.5 bg-[#ebfaf8] border border-[#00685f]/20 rounded-full text-[10px] font-black text-[#00685f] uppercase tracking-widest">
                          {PREVIEW_DATA.isoStandard} Standard
                       </span>
                       <span className="text-[10px] font-black text-[#bcc9c6] uppercase tracking-widest">• Global Accreditation</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-[#191c1e] tracking-tighter leading-none uppercase">
                       {PREVIEW_DATA.title}
                    </h1>
                    <p className="text-lg font-medium text-[#6d7a77] leading-relaxed">
                       {PREVIEW_DATA.description}
                    </p>
                 </div>
                 
                 <div className="shrink-0 p-8 bg-white border border-[#bcc9c6]/30 rounded-[32px] shadow-sm space-y-6 min-w-[280px]">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-[#6d7a77] uppercase tracking-widest">Course Depth</p>
                       <p className="text-2xl font-black text-[#191c1e]">{PREVIEW_DATA.sections.length} Sections</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-[#6d7a77] uppercase tracking-widest">Total Curriculum</p>
                       <p className="text-2xl font-black text-[#191c1e]">{PREVIEW_DATA.sections.reduce((acc, s) => acc + s.lectures.length, 0)} Lectures</p>
                    </div>
                 </div>
              </div>
           </header>

           {/* Curriculum View */}
           <div className="grid grid-cols-1 gap-12 pb-24">
              <div className="space-y-6">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00685f]">Curriculum Journey</h2>
                 <div className="space-y-6">
                    {PREVIEW_DATA.sections.map((section, idx) => (
                       <div key={section.id} className="bg-white border border-[#bcc9c6]/30 rounded-[40px] overflow-hidden shadow-sm">
                          <div className="p-8 bg-[#fdfefe] border-b border-[#f0f4f4] flex items-center justify-between">
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#131b2e] text-white flex items-center justify-center text-[11px] font-black">
                                   0{idx + 1}
                                </div>
                                <h3 className="text-2xl font-black text-[#191c1e] uppercase">{section.title}</h3>
                             </div>
                             <span className="px-4 py-1.5 bg-[#f7f9fb] border border-[#bcc9c6]/10 rounded-full text-[10px] font-black text-[#6d7a77] uppercase tracking-widest">
                                {section.lectures.length} Modules
                             </span>
                          </div>
                          
                          <div className="p-8 space-y-4">
                             {section.lectures.map((lecture, lIdx) => (
                                <div key={lecture.id} className="group flex items-center justify-between p-6 bg-[#fafcfc] border border-[#bcc9c6]/20 rounded-2xl transition-all hover:border-[#00685f]/30 hover:bg-white hover:shadow-xl">
                                   <div className="flex items-center gap-6">
                                      <div className="w-8 h-8 rounded-xl bg-white border border-[#bcc9c6]/20 flex items-center justify-center text-[10px] font-black text-[#6d7a77]">
                                         {lIdx + 1}
                                      </div>
                                      <p className="text-base font-black text-[#191c1e] group-hover:text-[#00685f] transition-all uppercase">{lecture.title}</p>
                                   </div>
                                   <div className="flex items-center gap-6">
                                      <div className="flex items-center gap-2 px-3 py-1 bg-white border border-[#bcc9c6]/20 rounded-full">
                                         <FileText className="w-3.5 h-3.5 text-[#00685f]" />
                                         <span className="text-[10px] font-black text-[#6d7a77] uppercase tracking-widest">{lecture.pages} Pages</span>
                                      </div>
                                      <div className="w-10 h-10 rounded-full border border-[#bcc9c6]/30 flex items-center justify-center text-[#bcc9c6] group-hover:bg-[#00685f] group-hover:text-white transition-all transform group-hover:scale-105">
                                         <ChevronRight className="w-5 h-5" />
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </DashboardWrapper>
  );
}
