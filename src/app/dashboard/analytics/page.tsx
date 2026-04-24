"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Eye, 
  Award, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { getAllCourses } from "@/lib/utils/courseUtils";
import { getTotalLearners, getAvgCompletionRate, getLearnerCountForCourse } from "@/lib/data/dummyData";

export default function AnalyticsPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setCourses(getAllCourses());
  }, []);

  const stats = [
    { label: "Total Learners", value: getTotalLearners().toLocaleString(), icon: Users, color: "bg-blue-500", trend: "+12.4%", up: true },
    { label: "Avg. Completion", value: getAvgCompletionRate() + "%", icon: CheckCircle, color: "bg-[#00685f]", trend: "+5.1%", up: true },
  ];

  const topCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => getLearnerCountForCourse(b.id) - getLearnerCountForCourse(a.id))
      .slice(0, 4);
  }, [courses]);

  // Data: Jan:0, Feb:0, Mar:0, Apr:3, rest:0
  const barChartData = [0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0]; // 100% height for 3 if we want it to show up, or just scale carefully

  const circumference = 251.2;

  return (
    <DashboardWrapper loadingMessage="Generating Insights...">
      {(user) => (
        <div className="space-y-8 sm:space-y-10">
          
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
            <div className="space-y-3">
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter uppercase">Analytics</h1>
               <p className="text-sm sm:text-base font-medium text-[#6d7a77] max-w-2xl">Track platform performance and course analytics</p>
            </div>
          </header>

          <div className="space-y-12 animate-fade-in-up">
            {/* Stat Cards with Trends */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 stagger-1">
               {stats.map((stat, i) => (
                  <div key={i} className="group bg-white rounded-[32px] border border-[#bcc9c6]/40 p-1 relative overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all duration-700">
                     <div className="p-7 space-y-8">
                        <div className="flex items-center justify-between">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                              <stat.icon className="w-6 h-6" />
                           </div>
                           <div className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                              {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {stat.trend}
                           </div>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] group-hover:text-[#00685f] transition-colors">{stat.label}</p>
                           <h3 className="text-4xl font-black text-[#191c1e] tracking-tight">{stat.value}</h3>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 stagger-2">
               <section className="lg:col-span-2 bg-white rounded-[40px] border border-[#bcc9c6]/40 p-6 sm:p-8 shadow-sm space-y-8 group hover:border-[#00685f]/30 transition-all duration-500">
                  <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#bcc9c6]/10 pb-8 gap-6">
                     <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight flex items-center gap-4 uppercase">
                        <Activity className="w-7 h-7 text-[#00685f]" /> Enrollment Trend
                     </h3>
                     <div className="flex gap-2">
                        <span className="px-4 py-2 bg-[#00685f]/5 text-[#00685f] text-[10px] font-black uppercase tracking-widest rounded-2xl border border-[#00685f]/10 shadow-sm">Learners</span>
                     </div>
                  </div>
                  
                  <div className="h-80 w-full flex items-end justify-between gap-1 sm:gap-2 lg:gap-3 xl:gap-4 relative pt-12 pb-4 pr-8 pl-2 overflow-hidden group/bars">
                     <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pt-16 pb-0 pointer-events-none opacity-[0.1]">
                        <div className="w-full border-t border-[#bcc9c6] h-px" />
                        <div className="w-full border-t border-[#bcc9c6] h-px" />
                        <div className="w-full border-t border-[#bcc9c6] h-px" />
                        <div className="w-full border-t border-[#bcc9c6] h-px" />
                     </div>
                     
                     {barChartData.map((h, i) => (
                        <div key={i} className="flex-1 min-w-[32px] sm:min-w-[40px] group/bar relative h-full flex items-end justify-center">
                           <div className="w-full sm:w-10 bg-[#00685f] rounded-t-2xl hover:bg-[#008378] hover:shadow-2xl hover:shadow-[#00685f]/20 transition-all duration-700 flex items-end justify-center relative cursor-help" style={{ height: `${h}%` }}>
                              <div className="absolute -top-12 px-3 py-2 bg-[#131b2e] text-white text-[10px] font-black rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all mb-2 whitespace-nowrap shadow-2xl scale-75 group-hover/bar:scale-100 pointer-events-none z-20">
                                 {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}: {i === 3 ? 3 : 0}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-between px-2 pr-8 pl-2 text-[10px] font-black uppercase tracking-widest text-[#bcc9c6] pt-2">
                     {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                        <span key={m}>{m}</span>
                     ))}
                  </div>
               </section>

               <section className="bg-white rounded-[40px] border border-[#bcc9c6]/40 p-6 sm:p-8 shadow-sm space-y-8 group hover:border-[#00685f]/30 transition-all duration-500">
                  <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight text-center sm:text-left uppercase">Status Distribution</h3>
                  <div className="flex flex-col items-center py-6 gap-10">
                     <div className="relative w-48 h-48 sm:w-56 sm:h-56 group-hover:scale-105 transition-transform duration-1000">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                           <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f4f4" strokeWidth="12" />
                           {/* Not Started - Base layer above static gray */}
                           <motion.circle 
                              cx="50" cy="50" r="40" fill="none" stroke="#bcc9c6" strokeWidth="12" 
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset: circumference * (1 - 1) }} 
                              transition={{ duration: 1.2, delay: 2.4, ease: "easeOut" }}
                           />
                           {/* In Progress */}
                           <motion.circle 
                              cx="50" cy="50" r="40" fill="none" stroke="#131b2e" strokeWidth="12" 
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset: circumference * (1 - 0.9) }} 
                              transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
                           />
                           {/* Completed */}
                           <motion.circle 
                              cx="50" cy="50" r="40" fill="none" stroke="#00685f" strokeWidth="12" 
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset: circumference * (1 - 0.65) }} 
                              transition={{ duration: 1.2, delay: 0, ease: "easeOut" }}
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-4xl font-black text-[#191c1e] tracking-tighter">{getTotalLearners().toLocaleString()}</span>
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d7a77]">Learners</span>
                        </div>
                     </div>

                     <div className="w-full space-y-5">
                        {[
                          { label: "Completed", value: 65, color: "bg-[#00685f]" },
                          { label: "In Progress", value: 25, color: "bg-[#131b2e]" },
                          { label: "Not Started", value: 10, color: "bg-[#bcc9c6]" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest group/item px-4 py-3 bg-[#f7f9fb] rounded-[20px] transition-colors hover:bg-white hover:shadow-lg border border-transparent hover:border-[#bcc9c6]/20">
                             <div className="flex items-center gap-4">
                                <div className={`w-3.5 h-3.5 rounded-full ${item.color} group-hover/item:scale-150 transition-transform ring-4 ring-white shadow-sm`} />
                                <span className="text-[#6d7a77] group-hover/item:text-[#191c1e] transition-colors">{item.label}</span>
                             </div>
                             <span className="text-[#191c1e] font-black">{item.value}%</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 stagger-3 pb-10">
               <section className="bg-white rounded-[40px] border border-[#bcc9c6]/40 p-6 sm:p-8 shadow-sm space-y-8 group hover:border-[#00685f]/30 transition-all duration-500">
                  <div className="flex justify-between items-center border-b border-[#bcc9c6]/10 pb-8">
                     <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight uppercase">Top Courses</h3>
                  </div>
                  <div className="space-y-4">
                     {topCourses.map((course, i) => (
                        <div key={course.id} onClick={() => router.push(`/dashboard/my-courses/${course.id}`)} className="group/row flex items-center justify-between p-5 rounded-[28px] hover:bg-[#f7f9fb] transition-all duration-500 cursor-pointer border border-transparent hover:border-[#bcc9c6]/30">
                           <div className="flex items-center gap-8">
                              <span className="text-3xl font-black text-[#bcc9c6] min-w-[40px] group-hover/row:text-[#00685f] transition-all group-hover/row:translate-x-1">{i + 1}</span>
                              <div>
                                 <h4 className="text-base font-black text-[#191c1e] group-hover/row:text-[#00685f] transition-colors uppercase">{course.title}</h4>
                                 <p className="text-[10px] font-bold text-[#6d7a77] uppercase tracking-widest mt-1 opacity-80">{getLearnerCountForCourse(course.id).toLocaleString()} <span className="opacity-50">Active Learners</span></p>
                              </div>
                           </div>
                           <div className="w-12 h-12 rounded-2xl border border-[#bcc9c6]/20 flex items-center justify-center text-[#bcc9c6] group-hover/row:bg-white group-hover/row:shadow-xl group-hover/row:text-[#00685f] group-hover/row:border-[#00685f]/30 transition-all">
                              <ChevronRight className="w-6 h-6 flex-shrink-0" />
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               <section className="bg-white rounded-[40px] border border-[#bcc9c6]/40 p-6 sm:p-8 shadow-sm space-y-8 group hover:border-[#00685f]/30 transition-all duration-500">
                  <div className="flex justify-between items-center border-b border-[#bcc9c6]/10 pb-8">
                     <h3 className="text-xl sm:text-2xl font-black text-[#191c1e] tracking-tight uppercase">Recent Activity</h3>
                  </div>
                  <div className="space-y-8 relative px-2">
                     <div className="absolute left-10 top-4 bottom-4 w-px bg-gradient-to-b from-[#f0f4f4] via-[#00685f]/10 to-[#f0f4f4]" />
                     {[
                       { id: "u1", user: "Menahil", action: "completed ISO 27001", time: "1H AGO", icon: CheckCircle, color: "bg-[#00685f]" },
                       { id: "u2", user: "Ifra", action: "enrolled in ISO 9001", time: "3H AGO", icon: GraduationCap, color: "bg-blue-500" },
                       { id: "u3", user: "Maryam", action: "enrolled in ISO 45001", time: "5H AGO", icon: GraduationCap, color: "bg-purple-500" }
                     ].map((act, i) => (
                        <div key={i} className="relative pl-16 group/act cursor-default">
                           <div className={`absolute left-4 top-0 w-12 h-12 rounded-3xl ${act.color} flex items-center justify-center z-10 shadow-lg shadow-black/5 group-hover/act:scale-110 transition-transform ring-4 ring-white`}>
                              <act.icon className="w-6 h-6 text-white" />
                           </div>
                           <div className="bg-[#f7f9fb] group-hover/act:bg-white group-hover/act:shadow-xl group-hover/act:border-[#bcc9c6]/30 border border-transparent p-5 rounded-[28px] transition-all duration-500 flex flex-col gap-1">
                              <div className="flex items-center justify-between gap-4">
                                 <p className="text-sm sm:text-base font-black text-[#191c1e] group-hover/act:text-[#101b2e] transition-colors uppercase">{act.user}</p>
                                 <span className="text-[10px] font-black uppercase text-[#bcc9c6] tracking-[0.2em] shrink-0 font-mono">{act.time}</span>
                              </div>
                              <p className="text-xs font-medium text-[#6d7a77] opacity-80 leading-relaxed uppercase">{act.action}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  );
}
