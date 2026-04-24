import { BookOpen } from "lucide-react";

export default function PageTransitionLoader() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-[#f7f9fb] gap-5">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 border-[3px] border-[#00685f]/10 rounded-xl rotate-45 transform"></div>
        {/* Inner spinning line */}
        <div className="absolute inset-0 border-[3px] border-[#00685f] rounded-xl border-t-transparent animate-spin rotate-45 transform"></div>
        <img 
          src="/logo.png" 
          alt="Avid Trainings Logo" 
          className="w-12 h-12 object-contain animate-logo-pulse"
        />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-[11px] font-bold text-[#00685f] uppercase tracking-[0.4em] animate-pulse">Initializing Ecosystem</p>
        <p className="text-[9px] text-[#6d7a77] uppercase tracking-[0.2em]">Secure Data Access</p>
      </div>
    </div>
  );
}
