import { BookOpen, Search, ShieldAlert, Clock, Flame, ChevronRight, FileDigit } from "lucide-react";
import type { UserRole } from "@/lib/types/auth";

export default function RecentCourses({
  items,
  title,
  emptyMessage,
  role
}: {
  items: any[];
  title: string;
  emptyMessage: string;
  role: UserRole;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="space-y-4 h-full flex flex-col">
         <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-bold text-[#191c1e] tracking-tight">{title}</h3>
         </div>
         <div className="glass-panel flex-1 rounded-2xl p-10 flex flex-col items-center justify-center text-center animate-fade-in-up stagger-4 shadow-sm border border-[#bcc9c6]/40 min-h-[300px]">
           <div className="w-16 h-16 bg-[#00685f]/10 flex items-center justify-center rounded-2xl mb-6 text-[#00685f]">
             {role === "admin" ? <FileDigit className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
           </div>
           <h4 className="text-xl font-bold text-[#191c1e] mb-2">
             {role === "admin" ? "No Recent Activity" : "The Atelier is Empty"}
           </h4>
           <p className="text-[#3d4947] text-sm max-w-sm mb-8 leading-relaxed font-medium">
             {emptyMessage}
           </p>
           {role === "learner" && (
             <button className="px-6 py-3 bg-[#00685f] hover:bg-[#008378] text-white font-bold rounded-lg shadow-md transition-colors flex items-center gap-2">
               <Search className="w-4 h-4" />
               Browse Course Catalog
             </button>
           )}
         </div>
      </div>
    );
  }

  // Populate loaded items if they exist
  return (
    <div className="space-y-4 h-full flex flex-col">
       <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold text-[#191c1e] tracking-tight">{title}</h3>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 flex-1">
         {items.map((course, i) => (
           <div key={i} className="glass-panel group card-hover rounded-2xl p-5 border border-[#bcc9c6]/40 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${(i % 3 + 1) * 100 + 300}ms` }}>
             {/* Tags */}
             <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-1 bg-[#131b2e] text-white text-[9px] font-black uppercase tracking-widest rounded flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3 text-[#00685f]" /> ISO 27001
                </span>
                {role === "learner" && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#00685f] uppercase tracking-wider bg-[#00685f]/10 px-2 py-1 rounded">
                    <Flame className="w-3 h-3" /> Active
                  </span>
                )}
             </div>
             
             {/* Content */}
             <h4 className="font-bold text-[#191c1e] text-lg leading-tight mb-2 group-hover:text-[#00685f] transition-colors">{course.title || "Foundation Module"}</h4>
             
             {/* Meta */}
             {role === "learner" && (
               <div className="flex items-center gap-4 text-xs font-semibold text-[#6d7a77] mb-6">
                 <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> 14 Lectures</span>
                 <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 2h 45m left</span>
               </div>
             )}

             {/* Progress */}
             {role === "learner" && (
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#3d4947]">
                    <span>Progress</span>
                    <span className="text-[#00685f]">68%</span>
                  </div>
                  <div className="w-full bg-[#e6e8ea] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00685f] h-full rounded-full w-[68%] transition-all duration-1000 ease-out flex items-center justify-end pr-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
               </div>
             )}

             {/* Action Arrow */}
             <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-[#f7f9fb] text-[#191c1e] flex items-center justify-center opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 border border-[#bcc9c6]/40 group-hover:bg-[#00685f] group-hover:border-[#00685f] group-hover:text-white">
                <ChevronRight className="w-4 h-4" />
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}
