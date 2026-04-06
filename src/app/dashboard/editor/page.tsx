"use client";

import { Plus, Video, Target, Users, Layout, FileText, ChevronRight, Edit3, Eye, Trash2, Library, GraduationCap } from "lucide-react";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";

interface EditorStatProps {
  label: string;
  value: string | number;
  icon: any;
  accent: string;
  index: number;
}

const EditorStat = ({ label, value, icon: Icon, accent, index }: EditorStatProps) => (
  <div className="flex-1 min-w-[180px] flex items-center gap-4 px-6 py-4 bg-white/70 backdrop-blur-md rounded-[24px] border border-[#bcc9c6]/30 shadow-sm animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
     <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${accent} shadow-inner shrink-0`}>
        <Icon className="w-5 h-5" />
     </div>
     <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6d7a77]">{label}</p>
        <p className="text-base font-black text-[#191c1e]">{value}</p>
     </div>
  </div>
);

export default function EditorPage() {
  const coursesData = [
    { title: "ISO 9001 Masterclass", desc: "A comprehensive guide to Quality Management Systems.", learners: 1240, status: "Published", progress: 100 },
    { title: "ISO 27001 Auditor", desc: "Technical training for InfoSec auditing professionals.", learners: 856, status: "Review", progress: 85 },
    { title: "Risk Mgmt Essentials", desc: "Foundation course on risk frameworks in enterprise.", learners: 18, status: "Draft", progress: 40 }
  ];

  return (
    <DashboardWrapper loadingMessage="Opening Atelier...">
      {(user) => (
        <div className="space-y-10 sm:space-y-12">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
            <div className="space-y-3">
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter">Course Editor</h1>
               <p className="text-sm sm:text-base font-medium text-[#6d7a77] max-w-2xl">The specialized workbench for ISO educational standards. Manage curriculum structures and deploy content to the global library.</p>
            </div>
            <button className="w-full sm:w-auto px-10 py-5 bg-[#131b2e] hover:bg-[#00685f] text-white rounded-[24px] text-sm font-black uppercase tracking-widest shadow-xl shadow-black/20 active:scale-95 transition-all flex items-center justify-center gap-3 group">
               <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
               New Curriculum
            </button>
          </header>

          {/* Editor Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6 animate-fade-in-up stagger-1">
             <EditorStat label="Total Content" value={"14 Courses"} icon={Video} accent="bg-[#00685f]" index={0} />
             <EditorStat label="Review Pending" value={"2 Drafts"} icon={Target} accent="bg-amber-500" index={1} />
             <EditorStat label="Author Score" value={"Elite Tier"} icon={GraduationCap} accent="bg-purple-500" index={2} />
             <EditorStat label="Total Reach" value={"8.4k Users"} icon={Users} accent="bg-blue-500" index={3} />
          </div>

          {/* Editor List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
             {coursesData.map((course, i) => (
                <div key={i} className="group flex flex-col bg-white rounded-[48px] border border-[#bcc9c6]/40 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all duration-700 animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                   <div className="relative h-64 bg-gradient-to-br from-[#00685f] to-[#131b2e] overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                      
                      {/* Course Thumbnail Inner UI */}
                      <div className="absolute inset-0 flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                         <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center p-6 text-white group-hover:scale-110 transition-all duration-700">
                            <Layout className="w-full h-full opacity-40" />
                         </div>
                      </div>
                      
                      <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-sm">
                         ISO COMPLIANT
                      </div>
                      <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg border ${course.status === 'Published' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-amber-500 text-white border-amber-400'}`}>
                         {course.status}
                      </div>

                      {/* Hover Actions Overlay */}
                      <div className="absolute inset-x-6 bottom-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex gap-3">
                         <button className="flex-1 py-4 bg-white text-[#191c1e] text-[10px] font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-[#00685f] hover:text-white transition-all shadow-xl active:scale-95">Structure</button>
                         <button className="flex-1 py-4 bg-white text-[#191c1e] text-[10px] font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-[#00685f] hover:text-white transition-all shadow-xl active:scale-95">Content</button>
                      </div>
                   </div>

                   <div className="p-8 sm:p-10 space-y-6 flex flex-col flex-1 relative">
                      <div className="space-y-3">
                         <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] group-hover:text-[#00685f] transition-colors leading-tight">{course.title}</h3>
                         <p className="text-xs sm:text-sm font-medium text-[#6d7a77] line-clamp-2 leading-relaxed opacity-80">{course.desc}</p>
                      </div>

                      <div className="flex items-center justify-between py-4 border-y border-[#bcc9c6]/10">
                         <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(n => (
                               <div key={n} className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-[#00685f] to-[#131b2e] flex items-center justify-center text-[10px] font-black text-white shadow-sm hover:z-10 transition-transform hover:scale-110 cursor-pointer">
                                  {n}
                               </div>
                            ))}
                            <div className="w-9 h-9 rounded-full border-2 border-white bg-[#f0f4f4] flex items-center justify-center text-[10px] font-black text-[#6d7a77] shadow-sm">
                               +12
                            </div>
                         </div>
                         <div className="relative w-16 h-16 group/chart">
                            <svg className="w-full h-full transform -rotate-90">
                               <circle cx="32" cy="32" r="28" fill="none" stroke="#f0f4f4" strokeWidth="6" />
                               <circle cx="32" cy="32" r="28" fill="none" stroke="#00685f" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * course.progress) / 100} className="transition-all duration-1000" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-[#00685f] transition-transform group-hover/chart:scale-125">{course.progress}%</span>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 mt-auto">
                         <button className="py-4 bg-[#00685f] hover:bg-[#004d46] text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#00685f]/20 transition-all flex items-center justify-center gap-2 group/btn active:scale-95">
                            <Edit3 className="w-4 h-4 transition-transform group-hover/btn:scale-110" /> Edit
                         </button>
                         <button className="py-4 bg-white border border-[#bcc9c6]/60 hover:bg-[#131b2e] hover:text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn active:scale-95">
                            <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" /> Preview
                         </button>
                      </div>
                   </div>
                </div>
             ))}
             
             {/* New Content Placeholder */}
             <div className="group bg-[#f7f9fb] border-2 border-dashed border-[#bcc9c6]/40 rounded-[48px] flex flex-col items-center justify-center p-12 min-h-[480px] animate-fade-in-up hover:border-[#00685f]/40 hover:bg-white hover:shadow-2xl transition-all duration-700 cursor-pointer text-center">
                <div className="w-16 h-16 bg-[#00685f]/5 rounded-full flex items-center justify-center text-[#00685f] mb-6 group-hover:bg-[#00685f] group-hover:text-white transition-all duration-500 scale-100 group-hover:scale-110 shadow-inner">
                   <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#6d7a77] group-hover:text-[#191c1e] transition-colors">Create Next Standard</h3>
                <p className="text-xs font-medium text-[#6d7a77] mt-3 opacity-60 max-w-[200px]">Launch a new ISO training module for the global corporate library.</p>
             </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  );
}
