"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Library, 
  CheckCircle, 
  BarChart2, 
  Search, 
  LayoutGrid, 
  List, 
  Edit3, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { 
  getTotalLearners, 
  getAvgCompletionRate, 
  getLearnerCountForCourse,
  Course 
} from '@/lib/data/dummyData';
import { getAllCourses } from '@/lib/utils/courseUtils';

export default function PublicationsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const all = getAllCourses();
    setCourses(all.filter(c => c.status === 'published'));
  }, []);

  const filtered = useMemo(() => {
    return courses.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [courses, searchQuery]);

  const stats = [
    { label: "Total Published", value: courses.length, icon: CheckCircle, color: "bg-[#00685f]" },
    { label: "Total Learners", value: getTotalLearners(), icon: Library, color: "bg-purple-500" },
    { label: "Avg Completion", value: getAvgCompletionRate() + "%", icon: BarChart2, color: "bg-blue-500" },
  ];

  return (
    <DashboardWrapper loadingMessage="Opening Archives...">
      {(user) => (
        <div className="space-y-8">
          
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className={`fixed bottom-8 right-8 z-[10000] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
                  toast.type === 'success' ? 'bg-[#131b2e] text-white' : 'bg-red-500 text-white'
                }`}
              >
                {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#00d1b2]" /> : <AlertCircle className="w-5 h-5" />}
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>

          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
            <div className="space-y-2">
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter uppercase">Publications</h1>
               <p className="text-sm sm:text-base font-medium text-[#6d7a77]">Your published courses</p>
            </div>
          </header>

          {/* Inline Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up stagger-1">
             {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-5 bg-white shadow-lg rounded-[24px] border border-[#bcc9c6]/30 transition-all group hover:bg-white active:scale-95">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#6d7a77]">{stat.label}</p>
                      <p className="text-base font-black text-[#191c1e]">{stat.value}</p>
                   </div>
                </div>
             ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in-up stagger-2">
             <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <div className="relative group w-full lg:w-96">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a77] group-focus-within:text-[#00685f] transition-colors" />
                   <input 
                     type="text" 
                     placeholder="Search publications..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-14 pr-8 py-4 bg-white border border-[#bcc9c6]/40 rounded-[20px] text-sm outline-none focus:border-[#00685f] transition-all font-bold shadow-sm" 
                   />
                </div>
                <div className="flex p-1 bg-white border border-[#bcc9c6]/40 rounded-2xl shadow-sm w-full sm:w-auto justify-center ml-auto">
                   <button onClick={() => setViewMode("card")} className={`p-2 flex-1 sm:flex-none rounded-xl transition-all ${viewMode === 'card' ? 'bg-[#00685f] text-white' : 'text-[#6d7a77] hover:bg-[#f7f9fb]'}`}><LayoutGrid className="w-4 h-4" /></button>
                   <button onClick={() => setViewMode("table")} className={`p-2 flex-1 sm:flex-none rounded-xl transition-all ${viewMode === 'table' ? 'bg-[#00685f] text-white' : 'text-[#6d7a77] hover:bg-[#f7f9fb]'}`}><List className="w-4 h-4" /></button>
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
                   <h3 className="text-xl font-black text-[#191c1e] uppercase">No Publications Found</h3>
                   <p className="text-sm font-medium text-[#6d7a77]">No courses found matching your criteria.</p>
                </div>
              ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {filtered.map((p) => (
                      <div 
                        key={p.id} 
                        onClick={() => router.push(`/dashboard/my-courses/${p.id}`)}
                        className="group flex flex-col bg-white rounded-[40px] border border-[#bcc9c6]/40 p-1 relative overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all duration-700 cursor-pointer"
                      >
                         <div className="aspect-video bg-gradient-to-br from-[#00685f] to-[#131b2e] rounded-[38px] relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                            <div className={`absolute top-4 left-4 px-3 py-1 backdrop-blur-md rounded-full border text-[8px] font-black uppercase tracking-widest ${
                              p.status === 'published' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                            }`}>
                               {p.status}
                            </div>
                         </div>
                         <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-3">
                               <h3 className="text-base font-black text-[#191c1e] line-clamp-2 min-h-[44px] group-hover:text-[#00685f] transition-colors uppercase leading-tight tracking-tight">{p.title}</h3>
                               <div className="flex items-center justify-between text-[9px] font-black uppercase text-[#bcc9c6] tracking-widest">
                                  <span>Modified</span><span>{p.updatedAt}</span>
                               </div>
                               <div className="flex items-center justify-between pt-1">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-[#6d7a77]">{getLearnerCountForCourse(p.id)} Learners</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              ) : (
                <div className="bg-white rounded-[40px] border border-[#bcc9c6]/40 shadow-sm relative overflow-x-auto custom-scrollbar">
                   <table className="w-full min-w-[900px]">
                      <thead className="bg-[#fcfdfe] border-b border-[#bcc9c6]/20 whitespace-nowrap">
                         <tr className="text-left font-black text-[9px] uppercase tracking-widest text-[#6d7a77]">
                            <th className="px-8 py-5">Course</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5">Learners</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#bcc9c6]/10 font-bold text-[13px]">
                         {filtered.map((p) => (
                            <tr key={p.id} className="hover:bg-[#f7f9fb] transition-all group/row whitespace-nowrap">
                               <td className="px-8 py-5 text-[#191c1e] text-sm font-black truncate max-w-[280px] uppercase tracking-tight">{p.title}</td>
                               <td className="px-8 py-5">
                                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${p.status === 'published' ? 'bg-[#00685f]/5 text-[#00685f] border-[#00685f]/10' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{p.status}</span>
                               </td>
                               <td className="px-8 py-5 text-[#6d7a77] uppercase tracking-widest text-[10px]">{getLearnerCountForCourse(p.id).toLocaleString()} <span className="text-[9px] text-[#bcc9c6]">Learners</span></td>
                               <td className="px-8 py-5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                     <button 
                                       onClick={() => router.push(`/dashboard/my-courses/${p.id}`)}
                                       className="w-10 h-10 flex items-center justify-center text-[#6d7a77] hover:text-[#00685f] hover:bg-white hover:shadow-lg rounded-xl transition-all"
                                     >
                                        <Edit3 className="w-4 h-4" />
                                     </button>
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
