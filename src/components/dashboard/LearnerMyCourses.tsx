"use client";

import { Search, Filter, BookOpen, Clock, ChevronRight, GraduationCap, Award, Library } from "lucide-react";
import type { AuthUser } from "@/lib/types/auth";
import { useState } from "react";

export default function LearnerMyCourses({ user }: { user: AuthUser }) {
  const [activeTab, setActiveTab] = useState("In Progress");
  const [searchQuery, setSearchQuery] = useState("");

  const courses = [
    { title: "ISO 9001:2015 Foundation", progress: 75, lectures: 24, sections: 6, status: "In Progress", creator: "Alex Rivera", time: "4h remaining" },
    { title: "ISO 27001 ISMS Lead Auditor", progress: 40, lectures: 42, sections: 12, status: "In Progress", creator: "Sarah Chen", time: "18h remaining" },
    { title: "ISO 14001 Environmental Mgmt", progress: 100, lectures: 18, sections: 5, status: "Completed", creator: "James Wilson", time: "Completed" },
  ];

  const filtered = courses.filter(c => {
    const matchesTab = c.status === activeTab;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter">My Courses</h1>
          <p className="text-sm sm:text-base font-medium text-[#6d7a77] mt-2">Manage your ISO certification journey and ongoing learning.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard/library'} 
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-[#bcc9c6]/40 hover:border-[#00685f] hover:text-[#00685f] text-[#3d4947] rounded-xl font-bold text-sm transition-all shadow-sm group active:scale-95 whitespace-nowrap"
        >
          Discover More Courses
          <Library className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </header>

      {/* Tabs and Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in-up stagger-1">
        <div className="flex p-1 bg-white border border-[#bcc9c6]/40 rounded-2xl shadow-sm w-full sm:w-fit overflow-x-auto custom-scrollbar no-scrollbar scrollbar-hide">
          {["In Progress", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 sm:px-10 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                activeTab === tab 
                  ? "bg-[#00685f] text-white shadow-lg shadow-[#00685f]/20" 
                  : "text-[#6d7a77] hover:text-[#191c1e] hover:bg-[#f0f4f4]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
           <div className="relative group w-full sm:w-auto flex-1 lg:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:min-w-[280px] lg:min-w-[320px] pl-12 pr-6 py-3.5 bg-white border border-[#bcc9c6]/40 rounded-2xl text-sm outline-none focus:border-[#00685f] transition-all font-medium shadow-sm"
              />
           </div>
           <button className="hidden sm:flex p-3.5 bg-white border border-[#bcc9c6]/40 rounded-2xl text-[#6d7a77] hover:text-[#00685f] hover:border-[#00685f] transition-all shadow-sm active:scale-95">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length === 0 ? (
          <div className="lg:col-span-3 py-24 flex flex-col items-center text-center space-y-6">
             <div className="w-24 h-24 bg-[#f0f4f4] rounded-full flex items-center justify-center text-[#bcc9c6]">
                <GraduationCap className="w-12 h-12" />
             </div>
             <div>
                <h3 className="text-xl font-black text-[#191c1e]">No courses found</h3>
                <p className="text-sm font-medium text-[#6d7a77] mt-2">No results matching your query in {activeTab.toLowerCase()}.</p>
             </div>
             <button className="px-10 py-4 bg-[#00685f] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#004d46] transition-all shadow-xl shadow-[#00685f]/20 active:scale-95">
                Browse Global Library
             </button>
          </div>
        ) : (
          filtered.map((course, i) => (
            <div key={i} className="group flex flex-col bg-white rounded-[40px] border border-[#bcc9c6]/40 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all duration-700 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00685f] to-[#131b2e] group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-black text-white uppercase tracking-widest">
                   ISO COMPLIANT
                </div>
                {course.status === 'Completed' && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <Award className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col flex-1 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[#191c1e] leading-tight group-hover:text-[#00685f] transition-colors line-clamp-2 min-h-[56px]">{course.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#f7f9fb] flex items-center justify-center overflow-hidden border border-[#bcc9c6]/20">
                       <span className="text-[10px] font-black text-[#00685f]">{course.creator.charAt(0)}</span>
                    </div>
                    <span className="text-xs font-bold text-[#6d7a77]">{course.creator}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-[#bcc9c6]">Progress</span>
                    <span className="text-[#00685f]">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#f0f4f4] rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00685f] to-[#008378] transition-all duration-1000 ease-out" 
                      style={{ width: `${course.progress}%` }} 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2 text-[10px] font-black uppercase tracking-widest text-[#bcc9c6]">
                  <div className="flex items-center gap-1.5 group-hover:text-[#6d7a77] transition-colors">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lectures} Lectures</span>
                  </div>
                  <div className="flex items-center gap-1.5 group-hover:text-[#6d7a77] transition-colors">
                    <Clock className="w-4 h-4" />
                    <span>{course.time}</span>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  {course.status === "Completed" ? (
                    <button className="w-full py-4 bg-[#f7f9fb] hover:bg-[#00685f] hover:text-white text-[#00685f] border border-[#bcc9c6]/30 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm">
                      View Certificate
                    </button>
                  ) : (
                    <button className="w-full py-4 bg-[#00685f] hover:bg-[#004d46] text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#00685f]/20 active:scale-95 transition-all">
                      Continue Learning
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
