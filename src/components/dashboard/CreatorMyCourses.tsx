"use client";

import { Search, Filter, Plus, Users, Edit3, Trash2, MoreVertical, Layers } from "lucide-react";
import type { AuthUser } from "@/lib/types/auth";
import { useState } from "react";

export default function CreatorMyCourses({ user }: { user: AuthUser }) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const courses = [
    { title: "ISO 9001 Implementation", enrolls: 342, status: "Published", completion: 82, modified: "2 days ago" },
    { title: "ISO 27001 ISMS Lead Auditor", enrolls: 156, status: "Published", completion: 64, modified: "Yesterday" },
    { title: "Risk Management ISO 31000", enrolls: 18, status: "Draft", completion: 45, modified: "4h ago" },
    { title: "ISO 45001 Advanced", enrolls: 0, status: "Unpublished", completion: 0, modified: "1 week ago" }
  ];

  const filtered = courses.filter(c => {
    const matchesTab = activeTab === "All" || c.status === activeTab;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
        <div className="space-y-2">
           <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter">My Courses</h1>
           <p className="text-sm sm:text-base font-medium text-[#6d7a77]">Manage your course library and track enrollment performance.</p>
        </div>
        <button className="w-full sm:w-auto px-10 py-5 bg-[#00685f] hover:bg-[#004d46] text-white rounded-[24px] text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl shadow-[#00685f]/20 active:scale-95 transition-all flex items-center justify-center gap-3 group">
           <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 group-active:rotate-0" />
           Create New Course
        </button>
      </header>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in-up stagger-1">
        <div className="flex p-1.5 bg-[#f0f4f4] rounded-2xl w-full sm:w-fit overflow-x-auto custom-scrollbar no-scrollbar scrollbar-hide">
          {["All", "Published", "Draft", "Unpublished"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                activeTab === tab 
                  ? "bg-white text-[#00685f] shadow-md" 
                  : "text-[#6d7a77] hover:text-[#191c1e] hover:bg-white/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
           <div className="relative group w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
              <input 
                type="text" 
                placeholder="Search your library..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-white border border-[#bcc9c6]/40 rounded-2xl text-sm outline-none focus:border-[#00685f] shadow-sm transition-all font-medium"
              />
           </div>
           <button className="hidden sm:flex p-3.5 bg-white border border-[#bcc9c6]/40 rounded-2xl text-[#6d7a77] hover:text-[#00685f] transition-all shadow-sm active:scale-95">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((course, i) => (
          <div key={i} className="group relative bg-white rounded-[40px] border border-[#bcc9c6]/40 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all duration-700 animate-fade-in-up flex flex-col h-full" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="relative aspect-video overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#131b2e] to-[#00685f] group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-black text-white uppercase tracking-widest">
                 {course.status}
              </div>
              <button className="absolute top-4 right-4 w-9 h-9 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 active:scale-90">
                 <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 flex flex-col flex-1 space-y-6">
              <div className="space-y-4 pb-4 border-b border-[#bcc9c6]/10 h-28">
                <h3 className="text-xl font-black text-[#191c1e] leading-tight group-hover:text-[#00685f] transition-colors line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2 text-[#6d7a77] group-hover:text-[#191c1e] transition-colors text-[10px] font-black uppercase tracking-widest">
                      <Users className="w-4 h-4" />
                      <span>{course.enrolls} <span className="opacity-60">Learners</span></span>
                   </div>
                   <div className="flex items-center gap-2 text-[#6d7a77] group-hover:text-[#191c1e] transition-colors text-[10px] font-black uppercase tracking-widest">
                      <Layers className="w-4 h-4" />
                      <span>v1.2.4</span>
                   </div>
                </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-[#bcc9c6]">Completion Analytics</span>
                    <span className="text-[#00685f]">{course.completion}%</span>
                 </div>
                 <div className="h-2 w-full bg-[#f0f4f4] rounded-full overflow-hidden shadow-inner relative">
                    <div className="h-full bg-gradient-to-r from-[#00685f] to-[#008378] relative transition-all duration-1000" style={{ width: `${course.completion}%` }} />
                 </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#bcc9c6]">Modified {course.modified}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 mt-auto">
                 <button className="py-4 bg-white border border-[#bcc9c6]/60 hover:border-[#00685f] hover:bg-[#f0f4f4] text-[#191c1e] hover:text-[#00685f] rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2">
                    <Edit3 className="w-4 h-4" /> Edit
                 </button>
                 <button className="py-4 bg-white border border-[#bcc9c6]/60 hover:border-red-200 hover:text-red-500 hover:bg-red-50 text-[#191c1e] rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 group/btn">
                    <Trash2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" /> Delete
                 </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Create UI Card */}
        <div className="group bg-[#f7f9fb] border-2 border-dashed border-[#bcc9c6]/40 rounded-[40px] flex flex-col items-center justify-center p-12 min-h-[460px] animate-fade-in-up hover:border-[#00685f]/40 hover:bg-white hover:shadow-2xl transition-all duration-700 cursor-pointer text-center" style={{ animationDelay: `${filtered.length * 100}ms` }}>
           <div className="w-16 h-16 bg-[#00685f]/5 rounded-[20px] flex items-center justify-center text-[#00685f] mb-6 group-hover:bg-[#00685f] group-hover:text-white transition-all duration-500 scale-100 group-hover:scale-110 shadow-inner ring-4 ring-white">
              <Plus className="w-8 h-8" />
           </div>
           <h3 className="text-xl font-black text-[#6d7a77] group-hover:text-[#191c1e] transition-colors">Add New Standard</h3>
           <p className="text-xs font-medium text-[#6d7a77] mt-3 opacity-60 leading-relaxed max-w-[220px]">Deploy a new ISO authorized training module to the global academy ecosystem.</p>
        </div>
      </div>
    </div>
  );
}
