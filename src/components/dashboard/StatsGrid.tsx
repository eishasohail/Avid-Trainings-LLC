import type { DashboardStats } from "@/lib/services/dashboardService";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Layers,
  Users,
  Activity,
  Library,
  ShieldCheck,
  GraduationCap,
  Database
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  book: BookOpen,
  check: CheckCircle,
  clock: Clock,
  award: Award,
  layers: Layers,
  users: Users,
  activity: Activity,
  library: Library,
  shield: ShieldCheck,
  graduation: GraduationCap,
  database: Database,
};

export default function StatsGrid({ stats }: { stats: DashboardStats[] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, i) => {
        const Icon = ICON_MAP[stat.icon] || BookOpen;
        
        return (
          <div
            key={stat.label}
            className={`glass-panel card-hover rounded-2xl p-6 relative overflow-hidden animate-fade-in-up stagger-${i + 1} flex flex-col justify-between group bg-white/70 hover:bg-white/95 border-t-4 border-t-transparent hover:border-t-[#00685f] transition-all duration-500`}
          >
            {/* Ambient Ambient Glow behind Icon */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00685f]/10 to-transparent rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-125 group-hover:from-[#00685f]/20" />
            
            <div className="relative z-10 flex items-start justify-between mb-8">
               <div>
                 <span className="text-[10px] uppercase tracking-[0.15em] text-[#6d7a77] font-black block mb-2 group-hover:text-[#00685f] transition-colors">
                   {stat.label}
                 </span>
                 <h3 className="text-4xl lg:text-5xl font-extrabold text-[#191c1e] tracking-tighter drop-shadow-sm">{stat.value}</h3>
               </div>
               
               {/* Icon Container with Glass Glow */}
               <div className="w-12 h-12 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,104,95,0.08)] flex items-center justify-center relative shrink-0 border border-[#bcc9c6]/30 group-hover:shadow-[0_8px_25px_rgba(0,104,95,0.2)] group-hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute inset-0 bg-[#00685f]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Icon className="w-6 h-6 text-[#00685f] relative z-10" strokeWidth={2} />
               </div>
            </div>
            
            <div className="relative z-10 pt-4 border-t border-[#bcc9c6]/30">
               <p className="text-xs font-bold text-[#6d7a77] flex items-center gap-2 group-hover:text-[#191c1e] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00685f]/40 block group-hover:bg-[#008378] group-hover:shadow-[0_0_8px_rgba(0,104,95,0.6)] transition-all duration-300" />
                  {stat.sub}
               </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
