"use client";

import { Users, UserCheck, Shield, Activity, TrendingUp, TrendingDown, ChevronRight, UserPlus, CheckCircle, Award } from "lucide-react";
import type { AuthUser } from "@/lib/types/auth";

export default function AdminDashboard({ user }: { user: AuthUser }) {
  const stats = [
    { label: "Total Registrations", value: "24,842", icon: Users, color: "bg-blue-500", trend: "+12%" },
    { label: "Platform Health", value: "99.8%", icon: Activity, color: "bg-[#00685f]", trend: "+0.1%" },
    { label: "Total Revenue", value: "$4.12k", icon: CheckCircle, color: "bg-emerald-500", trend: "+5.1%" },
    { label: "Active Nodes", value: "12", icon: Shield, color: "bg-[#00685f]", trend: "Healthy" },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      
      <header className="animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter">System Overview</h1>
        <p className="text-sm sm:text-base font-medium text-[#6d7a77] mt-3 max-w-xl">
           Global governance metrics and real-time oversight for the Avid Trainings ISO ecosystem.
        </p>
      </header>

      {/* Corporate Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up stagger-1">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white rounded-[40px] border border-[#bcc9c6]/40 p-1 relative overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
            <div className="p-8 flex flex-col justify-between h-full space-y-8">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f7f9fb] rounded-full text-[10px] font-black uppercase tracking-widest text-[#00685f] border border-[#bcc9c6]/20">
                   {stat.trend}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6d7a77] group-hover:text-[#00685f] transition-colors">{stat.label}</p>
                <h3 className="text-3xl font-black text-[#191c1e] tracking-tight">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up stagger-2 pb-10">
        {/* Registration Analytics */}
        <section className="lg:col-span-2 bg-white rounded-[48px] border border-[#bcc9c6]/40 p-10 shadow-sm space-y-10 group hover:border-[#00685f]/30 transition-all duration-500">
           <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#bcc9c6]/10 pb-8 gap-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tighter flex items-center gap-4">
                 <TrendingUp className="w-8 h-8 text-[#00685f]" /> Enrollment Dynamics
              </h3>
              <div className="flex gap-2">
                 <span className="px-5 py-2 bg-[#00685f]/5 text-[#00685f] text-[10px] font-black uppercase tracking-widest rounded-2xl border border-[#00685f]/10">Rolling 24h</span>
                 <span className="px-5 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-blue-100 opacity-60">Revenue</span>
              </div>
           </div>

           <div className="space-y-8">
              <div className="h-64 flex items-end justify-between gap-2 overflow-x-auto custom-scrollbar no-scrollbar scrollbar-hide group/chart relative pt-12 pb-4">
                 {/* Chart Guide Stripes */}
                 <div className="absolute inset-x-0 top-0 bottom-4 flex flex-col justify-between pt-16 pointer-events-none opacity-[0.08]">
                    <div className="w-full border-t border-[#bcc9c6] h-px" />
                    <div className="w-full border-t border-[#bcc9c6] h-px" />
                    <div className="w-full border-t border-[#bcc9c6] h-px" />
                 </div>
                 
                 {[40, 55, 48, 70, 62, 85, 96, 78, 110, 105, 130, 125].map((h, i) => (
                    <div key={i} className="flex-1 min-w-[32px] group/bar relative h-full flex items-end justify-center">
                       <div className="w-full sm:w-12 bg-gradient-to-t from-[#00685f]/10 via-[#00685f]/30 to-[#00685f] rounded-t-2xl group-hover/bar:from-[#00685f] group-hover/bar:to-[#008378] group-hover/bar:shadow-2xl group-hover/bar:shadow-[#00685f]/20 transition-all duration-700 flex items-end justify-center relative cursor-cell" style={{ height: `${h}%` }}>
                          <span className="absolute -top-10 px-3 py-2 bg-[#131b2e] text-white text-[10px] font-black rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all mb-2 whitespace-nowrap shadow-2xl scale-75 group-hover/bar:scale-100 z-20">
                             Batch {i+1}: +{h*3}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between px-2 text-[10px] font-black uppercase tracking-widest text-[#bcc9c6] pt-2">
                 {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"].map(m => (
                    <span key={m}>{m}</span>
                 ))}
              </div>
           </div>
        </section>

        {/* Global Overview Section (As requested in screen specs) */}
        <section className="bg-white rounded-[48px] border border-[#bcc9c6]/40 p-10 shadow-sm space-y-12 group hover:border-[#00685f]/30 transition-all duration-500 flex flex-col items-center text-center">
           <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight">System Distribution</h3>
           
           <div className="relative w-56 h-56 sm:w-64 sm:h-64 group-hover:scale-105 transition-transform duration-1000">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="40" fill="none" stroke="#f7f9fb" strokeWidth="12" />
                 <circle cx="50" cy="50" r="40" fill="none" stroke="#00685f" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="62.8" className="animate-[dash_2s_ease-out_forwards]" />
                 <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="180" className="animate-[dash_2.5s_ease-out_forwards]" />
                 <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="220" className="animate-[dash_3s_ease-out_forwards]" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-black text-[#191c1e] tracking-tight">72%</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6d7a77]">Compliance</span>
              </div>
           </div>

           <div className="w-full space-y-6 pt-4">
              {[
                { label: "Organization Pass", val: 75, color: "bg-[#00685f]" },
                { label: "Ongoing Training", val: 18, color: "bg-blue-500" },
                { label: "Pending Audit", val: 7, color: "bg-purple-500" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest group/li">
                   <div className="flex items-center gap-4">
                      <div className={`w-3.5 h-3.5 rounded-lg ${item.color} group-hover/li:rotate-45 transition-transform ring-4 ring-[#f7f9fb] shadow-sm`} />
                      <span className="text-[#6d7a77] group-hover/li:text-[#191c1e] transition-colors">{item.label}</span>
                   </div>
                   <span className="text-[#191c1e]">{item.val}%</span>
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* Directory Snapshot */}
      <section className="bg-white rounded-[40px] border border-[#bcc9c6]/40 p-8 sm:p-12 shadow-sm space-y-12 group hover:border-[#00685f]/30 transition-all duration-500">
         <div className="flex justify-between items-center border-b border-[#bcc9c6]/10 pb-8">
            <h3 className="text-2xl font-black text-[#191c1e] tracking-tighter">Directory Insight</h3>
            <button className="text-[11px] font-black uppercase tracking-widest text-[#00685f] hover:tracking-[0.2em] transition-all flex items-center gap-2 group/btn">
               Access Control <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Fatima Sohail", role: "Creator", users: 124, status: "Active" },
              { name: "John Archer", role: "Learner", users: 42, status: "Pending" },
              { name: "Global Admin", role: "Owner", users: 856, status: "Primary" },
              { name: "Sarah Malik", role: "Creator", users: 24, status: "Active" }
            ].map((u, i) => (
               <div key={i} className="flex items-center gap-5 p-4 rounded-[32px] bg-[#f7f9fb] hover:bg-white hover:shadow-2xl hover:border-[#bcc9c6]/30 transition-all duration-500 border border-transparent">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#bcc9c6]/20 flex items-center justify-center font-black text-[#00685f] shadow-sm">
                     {u.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                     <p className="text-sm font-black text-[#191c1e] truncate">{u.name}</p>
                     <p className="text-[9px] font-black uppercase tracking-widest text-[#6d7a77] opacity-60 leading-tight mt-1">{u.role}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
