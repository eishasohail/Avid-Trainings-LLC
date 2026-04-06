"use client";

import { Award, BookOpen, Clock, TrendingUp, ChevronRight, GraduationCap, Trophy, PlayCircle, Shield } from "lucide-react";
import type { AuthUser } from "@/lib/types/auth";

export default function LearnerDashboard({ user }: { user: AuthUser }) {
  const stats = [
    { label: "Enrolled Courses", value: "8", icon: BookOpen, color: "bg-blue-500", accent: "text-blue-600" },
    { label: "Completed", value: "3", icon: Award, color: "bg-emerald-500", accent: "text-emerald-600" },
    { label: "Hours Learned", value: "24", icon: Clock, color: "bg-purple-500", accent: "text-purple-600" },
    { label: "Certificates", value: "2", icon: Trophy, color: "bg-amber-500", accent: "text-amber-600" },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      
      <header className="animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter">
          Welcome back, <span className="text-[#00685f]">{user.displayName?.split(' ')[0]}</span>
        </h1>
        <p className="text-sm sm:text-base font-medium text-[#6d7a77] mt-3 max-w-xl">
           Continue your ISO certification journey. You're 3 modules away from your next badge!
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up stagger-1">
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
                   <span className={`text-[10px] font-bold mb-1 opacity-60 ${stat.accent}`}>+12%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up stagger-2">
        {/* Continue Learning */}
        <section className="lg:col-span-2 bg-white rounded-[44px] border border-[#bcc9c6]/40 p-8 sm:p-10 shadow-sm space-y-10 group hover:border-[#00685f]/30 transition-all duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#bcc9c6]/10 pb-8 gap-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight flex items-center gap-3">
              <PlayCircle className="w-7 h-7 text-[#00685f]" /> Current Momentum
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#00685f] hover:tracking-[0.2em] transition-all">My Library →</button>
          </div>

          <div className="bg-[#f7f9fb] rounded-[32px] p-6 sm:p-8 border border-transparent hover:border-[#bcc9c6]/20 transition-all group/card">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-full sm:w-48 aspect-video bg-gradient-to-br from-[#00685f] to-[#131b2e] rounded-24 relative overflow-hidden shrink-0 shadow-lg">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                 <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover/card:scale-110 transition-transform">
                    <GraduationCap className="w-12 h-12 text-white" />
                 </div>
              </div>
              <div className="flex-1 space-y-6 w-full">
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#00685f]">Next Action Required</p>
                   <h4 className="text-xl sm:text-2xl font-black text-[#191c1e]">ISO 27001 Module 4: Asset Mgmt</h4>
                   <p className="text-sm font-medium text-[#6d7a77] opacity-80 leading-relaxed">Systematic information security standards as applied to physical infrastructure.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-[#6d7a77]">45% Complete</span>
                    <span className="text-[#00685f]">ETA: 1h 24m</span>
                  </div>
                  <div className="h-2 w-full bg-[#bcc9c6]/20 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-[#00685f] to-[#008378] transition-all duration-1000" style={{ width: '45%' }} />
                  </div>
                </div>
                <button className="w-full py-4 bg-[#00685f] hover:bg-[#004d46] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#00685f]/20 active:scale-95 transition-all">Resume Session</button>
              </div>
            </div>
          </div>
        </section>

        {/* Milestone Tracker */}
        <section className="bg-white rounded-[44px] border border-[#bcc9c6]/40 p-8 sm:p-10 shadow-sm space-y-10 group hover:border-[#00685f]/30 transition-all duration-500">
           <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight">Achievements</h3>
           <div className="space-y-6">
              {[
                { title: "Weekly Runner", desc: "Learned 5+ hours this week", icon: Trophy, active: true },
                { title: "Quiz Master", desc: "Scored 90%+ in 4 exams", icon: Award, active: true },
                { title: "Certified Specialist", desc: "Unlock with next certificate", icon: Shield, active: false }
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

      {/* Suggested Courses */}
      <section className="animate-fade-in-up stagger-3 space-y-8">
         <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-[#191c1e] tracking-tight">Curated for your Pathway</h3>
            <button className="text-[11px] font-black uppercase tracking-widest text-[#6d7a77] hover:text-[#00685f] transition-colors">See all matches →</button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
               <div key={n} className="group bg-white rounded-[32px] border border-[#bcc9c6]/40 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all duration-700 hover:-translate-y-2 p-1">
                  <div className="aspect-video bg-[#f7f9fb] rounded-[28px] relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#00685f] to-[#131b2e] opacity-10 group-hover:opacity-100 transition-opacity duration-700" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap className="w-10 h-10 text-[#00685f]/40 group-hover:text-white transition-colors" />
                     </div>
                  </div>
                  <div className="p-6 space-y-4">
                     <h4 className="text-sm font-black text-[#191c1e] group-hover:text-[#00685f] transition-colors leading-tight">ISO {9000 + n} Internal Auditor Fast-track</h4>
                     <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#6d7a77]">
                        <span>4.8 ★</span>
                        <span>$149.00</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
