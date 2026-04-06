"use client";

import { BarChart2, Users, Download, Activity, Clock, Plus, Target, GraduationCap } from "lucide-react";
import type { AuthUser } from "@/lib/types/auth";

export default function CreatorDashboard({ user }: { user: AuthUser }) {
  const stats = [
    { label: "Total Learners", value: "12,840", icon: Users, color: "bg-blue-500", trend: "+12%" },
    { label: "Course Revenue", value: "$4.8k", icon: BarChart2, color: "bg-emerald-500", trend: "+4.5%" },
    { label: "Avg. Completion", value: "72%", icon: GraduationCap, color: "bg-purple-500", trend: "+2.1%" },
    { label: "Active Sessions", value: "142", icon: Activity, color: "bg-amber-500", trend: "+8%" },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
        <div className="space-y-2">
           <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter">Publisher's Studio</h1>
           <p className="text-sm sm:text-base font-medium text-[#6d7a77]">Optimize curriculum reach and track enrollment real-time performance.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <button className="flex-1 sm:flex-none px-8 py-5 bg-white border border-[#bcc9c6]/40 text-xs font-black uppercase tracking-widest text-[#191c1e] rounded-[24px] hover:border-[#00685f] transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3">
              <Download className="w-5 h-5 text-[#00685f]" /> Export Data
           </button>
           <button className="flex-1 sm:flex-none px-8 py-5 bg-[#00685f] text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-[#004d46] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group">
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> New Template
           </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up stagger-1">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white rounded-[40px] border border-[#bcc9c6]/40 p-1 relative overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
            <div className="p-8 flex flex-col justify-between h-full space-y-8">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f7f9fb] rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-[#bcc9c6]/20">
                   <Target className="w-3.5 h-3.5" /> {stat.trend}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up stagger-2 pb-10">
        {/* Course Portfolio */}
        <section className="lg:col-span-2 bg-white rounded-[48px] border border-[#bcc9c6]/40 p-8 sm:p-10 shadow-sm space-y-10 group hover:border-[#00685f]/30 transition-all duration-500">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#bcc9c6]/10 pb-8 gap-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight flex items-center gap-3">
                 <Activity className="w-7 h-7 text-[#00685f]" /> Recent Activity
              </h3>
              <div className="flex gap-2">
                 <span className="px-5 py-2 bg-[#00685f]/5 text-[#00685f] text-[10px] font-black uppercase tracking-widest rounded-2xl border border-[#00685f]/10">This Week</span>
                 <span className="px-5 py-2 bg-[#f7f9fb] text-[#bcc9c6] text-[10px] font-black uppercase tracking-widest rounded-2xl border border-transparent">v.4.1.2</span>
              </div>
           </div>

           <div className="space-y-6">
              {[
                { name: "ISO 9001 Mastery", status: "Published", users: 1240, progress: 85, color: "bg-[#00685f]" },
                { name: "Risk Framework Foundation", status: "Review", users: 42, progress: 100, color: "bg-blue-500" },
                { name: "Advanced Compliance", status: "Draft", users: 0, progress: 40, color: "bg-amber-500" }
              ].map((c, i) => (
                <div key={i} className="group/item flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[#f7f9fb] rounded-[32px] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-[#bcc9c6]/20 cursor-default gap-6">
                   <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl ${c.color} flex items-center justify-center text-white shadow-xl flex-shrink-0`}>
                         <GraduationCap className="w-7 h-7 opacity-40" />
                      </div>
                      <div className="min-w-0">
                         <h4 className="text-lg font-black text-[#191c1e] group-hover/item:text-[#00685f] transition-colors truncate">{c.name}</h4>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d7a77] mt-1">{c.users} Current Active <span className="text-[#bcc9c6]">/ week</span></p>
                      </div>
                   </div>
                   <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${c.status === 'Published' ? 'bg-[#00685f]/5 text-[#00685f] border-[#00685f]/20' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>{c.status}</div>
                      <div className="flex items-center justify-end gap-4 w-full sm:w-40">
                         <div className="h-1.5 flex-1 bg-[#bcc9c6]/20 rounded-full overflow-hidden">
                            <div className={`h-full ${c.color} transition-all duration-1000`} style={{ width: `${c.progress}%` }} />
                         </div>
                         <span className="text-[11px] font-black text-[#191c1e]">{c.progress}%</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Global Overview Section (As requested in screen 2 specs) */}
        <section className="bg-white rounded-[48px] border border-[#bcc9c6]/40 p-10 shadow-sm space-y-10 group hover:border-[#00685f]/30 transition-all duration-500 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#00685f]/5 blur-2xl rounded-full" />
           <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight">Timeline Hub</h3>
           <div className="space-y-8 relative">
              <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-[#bcc9c6]/10 via-[#00685f]/20 to-[#bcc9c6]/10" />
              {[
                { time: "2m ago", title: "Course Version Released", desc: "ISO 9001 Masterclass v1.2", icon: Download, color: "bg-[#00685f]" },
                { time: "1h ago", title: "Batch Enrollment Complete", desc: "42 learners from ComplyEncrypt", icon: Users, color: "bg-blue-500" },
                { time: "3h ago", title: "Certification Threshold Met", desc: "68% completion reached on 'Risk'", icon: Target, color: "bg-purple-500" },
                { time: "4h ago", title: "Session Cap Reached", desc: "Highest concurrent user spike", icon: Activity, color: "bg-amber-500" }
              ].map((t, i) => (
                <div key={i} className="relative pl-14 group/timeline">
                   <div className={`absolute left-3 top-0 w-7 h-7 rounded-full ${t.color} flex items-center justify-center z-10 shadow-lg group-hover/timeline:scale-125 transition-transform border border-white`}>
                      <t.icon className="w-3.5 h-3.5 text-white" />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center justify-between">
                         <h4 className="text-[13px] font-black text-[#191c1e] tracking-tight">{t.title}</h4>
                         <span className="text-[9px] font-black uppercase text-[#bcc9c6] tracking-[0.2em]">{t.time}</span>
                      </div>
                      <p className="text-[11px] font-medium text-[#6d7a77] leading-relaxed">{t.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
