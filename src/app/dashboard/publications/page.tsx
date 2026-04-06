"use client";

import { useState } from "react";
import { Library, CheckCircle, Clock, BarChart2, Search, Filter, LayoutGrid, List, Download, Eye, Edit3, Archive, MoreVertical } from "lucide-react";
import type { AuthUser } from "@/lib/types/auth";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";

export default function PublicationsPage() {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const pubs = [
    { title: "ISO 9001 Mastery", status: "Published", date: "Jan 12, 2026", enrolls: 1240, completion: 82 },
    { title: "ISO 27001 Auditor", status: "Published", date: "Feb 04, 2026", enrolls: 856, completion: 64 },
    { title: "Risk Frameworks", status: "Draft", date: "Mar 18, 2026", enrolls: 0, completion: 0 },
    { title: "ISO 14001 Guide", status: "Unpublished", date: "Apr 02, 2026", enrolls: 42, completion: 15 },
  ];

  const filtered = pubs.filter(p => {
    const matchesTab = activeTab === "All" || p.status === activeTab;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardWrapper loadingMessage="Opening Archives...">
      {(user) => (
        <div className="space-y-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
            <div className="space-y-2">
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter">Publications</h1>
               <p className="text-sm sm:text-base font-medium text-[#6d7a77]">Manage your ISO education library and release cycles.</p>
            </div>
            <button className="w-full sm:w-auto px-10 py-5 bg-white border border-[#bcc9c6]/40 hover:border-[#00685f] text-[#191c1e] hover:text-[#00685f] rounded-[24px] text-sm font-black uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-3 active:scale-95">
               <Download className="w-5 h-5" /> Export Data
            </button>
          </header>

          {/* Inline Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
             {[
               { label: "Total Published", value: 12, icon: CheckCircle, color: "bg-[#00685f]" },
               { label: "Total Drafts", value: 4, icon: Clock, color: "bg-amber-500" },
               { label: "Total Learners", value: "2.8k", icon: Library, color: "bg-purple-500" },
               { label: "Avg Completion", value: "72%", icon: BarChart2, color: "bg-blue-500" },
             ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 bg-white/70 backdrop-blur-md rounded-[24px] border border-[#bcc9c6]/30 shadow-sm transition-all group hover:bg-white active:scale-95">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#6d7a77]">{stat.label}</p>
                      <p className="text-sm font-black text-[#191c1e]">{stat.value}</p>
                   </div>
                </div>
             ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in-up stagger-2">
             <div className="flex flex-wrap p-1 bg-[#f0f4f4] rounded-2xl w-fit">
                {["All", "Published", "Draft", "Unpublished"].map((tab) => (
                   <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab)}
                     className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-[#00685f] shadow-md' : 'text-[#6d7a77] hover:bg-white/40'}`}
                   >
                     {tab}
                   </button>
                ))}
             </div>
             <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="relative group w-full sm:w-auto">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
                   <input 
                     type="text" 
                     placeholder="Search archive..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full sm:min-w-[240px] md:min-w-[320px] pl-12 pr-6 py-3.5 bg-white border border-[#bcc9c6]/40 rounded-2xl text-sm outline-none focus:border-[#00685f] transition-all font-medium" 
                   />
                </div>
                <div className="flex p-1 bg-white border border-[#bcc9c6]/40 rounded-2xl shadow-sm w-full sm:w-auto justify-center">
                   <button onClick={() => setViewMode("card")} className={`p-2.5 flex-1 sm:flex-none rounded-xl transition-all ${viewMode === 'card' ? 'bg-[#00685f] text-white' : 'text-[#6d7a77] hover:bg-[#f7f9fb]'}`}><LayoutGrid className="w-5 h-5" /></button>
                   <button onClick={() => setViewMode("table")} className={`p-2.5 flex-1 sm:flex-none rounded-xl transition-all ${viewMode === 'table' ? 'bg-[#00685f] text-white' : 'text-[#6d7a77] hover:bg-[#f7f9fb]'}`}><List className="w-5 h-5" /></button>
                </div>
             </div>
          </div>

          {/* List Content */}
          <div className="animate-fade-in-up stagger-3 min-h-[400px]">
             {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                   <div className="w-20 h-20 bg-[#f0f4f4] rounded-full flex items-center justify-center text-[#bcc9c6]">
                      <Library className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-black text-[#191c1e]">No Publications Found</h3>
                   <p className="text-sm font-medium text-[#6d7a77]">No courses found matching your criteria.</p>
                </div>
             ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                   {filtered.map((p, i) => (
                      <div key={i} className="group flex flex-col bg-white rounded-[40px] border border-[#bcc9c6]/40 p-1 relative overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all duration-700">
                         <div className="aspect-video bg-gradient-to-br from-[#00685f] to-[#131b2e] rounded-[38px] relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">{p.status}</div>
                         </div>
                         <div className="p-7 space-y-6 flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                               <h3 className="text-lg font-black text-[#191c1e] line-clamp-2 min-h-[56px] group-hover:text-[#00685f] transition-colors">{p.title}</h3>
                               <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#bcc9c6] tracking-widest">
                                  <span>Released</span><span>{p.date}</span>
                               </div>
                               <div className="h-1.5 w-full bg-[#f0f4f4] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#00685f] transition-all duration-1000" style={{ width: `${p.completion}%` }} />
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button className="flex-1 py-4 bg-[#00685f] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#004d46] transition-all active:scale-95 shadow-lg shadow-[#00685f]/10">View Report</button>
                               <button className="py-4 px-5 bg-white border border-[#bcc9c6]/40 text-[#6d7a77] rounded-2xl hover:border-[#00685f] hover:text-[#00685f] transition-all active:scale-95 hover:bg-[#f0f4f4]"><Edit3 className="w-5 h-5" /></button>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="bg-white rounded-[40px] border border-[#bcc9c6]/40 shadow-sm relative overflow-x-auto custom-scrollbar">
                   <table className="w-full min-w-[1050px]">
                      <thead className="bg-[#fcfdfe] border-b border-[#bcc9c6]/20 whitespace-nowrap">
                         <tr className="text-left font-black text-[10px] uppercase tracking-widest text-[#6d7a77]">
                            <th className="px-10 py-6">Publication Name</th>
                            <th className="px-10 py-6">Release Status</th>
                            <th className="px-10 py-6">Enrollment</th>
                            <th className="px-10 py-6">Performance</th>
                            <th className="px-10 py-6 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#bcc9c6]/10 font-bold text-sm">
                         {filtered.map((p, i) => (
                            <tr key={i} className="hover:bg-[#f7f9fb] transition-all group/row whitespace-nowrap">
                               <td className="px-10 py-7 text-[#191c1e] text-base font-black truncate max-w-[300px]">{p.title}</td>
                               <td className="px-10 py-7">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${p.status === 'Published' ? 'bg-[#00685f]/5 text-[#00685f] border-[#00685f]/10' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{p.status}</span>
                               </td>
                               <td className="px-10 py-7 text-[#6d7a77] uppercase tracking-widest text-xs">{p.enrolls.toLocaleString()} <span className="text-[10px] text-[#bcc9c6]">Learners</span></td>
                               <td className="px-10 py-7">
                                  <div className="flex items-center gap-4 w-40">
                                     <div className="h-2 flex-1 bg-[#f0f4f4] rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-[#00685f] transition-all duration-1000" style={{ width: `${p.completion}%` }} />
                                     </div>
                                     <span className="text-[11px] font-black text-[#00685f]">{p.completion}%</span>
                                  </div>
                               </td>
                               <td className="px-10 py-7 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                     <button className="p-3 text-[#6d7a77] hover:text-[#00685f] hover:bg-white hover:shadow-lg rounded-2xl transition-all"><Eye className="w-5 h-5" /></button>
                                     <button className="p-3 text-[#6d7a77] hover:text-[#00685f] hover:bg-white hover:shadow-lg rounded-2xl transition-all"><Edit3 className="w-5 h-5" /></button>
                                     <button className="p-3 text-[#6d7a77] hover:text-red-500 hover:bg-red-50 hover:shadow-lg rounded-2xl transition-all"><Archive className="w-5 h-5" /></button>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             )}
          </div>
        </div>
      )}
    </DashboardWrapper>
  );
}
