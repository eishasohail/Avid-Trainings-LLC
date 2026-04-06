import { Search, Award, User, PlusCircle, BarChart2, Library, Users, ShieldCheck, FileText, ChevronRight } from "lucide-react";
import type { UserRole } from "@/lib/types/auth";

export default function QuickActions({ role }: { role: UserRole }) {
  let actions: any[] = [];

  if (role === "learner") {
    actions = [
      { label: "Browse Courses",     desc: "Explore new modules", icon: Search, primary: true },
      { label: "View Certificates",  desc: "Your achievements",   icon: Award,  primary: false },
      { label: "Update Profile",     desc: "Manage your details", icon: User,   primary: false },
    ];
  } else if (role === "creator") {
    actions = [
      { label: "Create New Course",  desc: "Start drafting",      icon: PlusCircle, primary: true },
      { label: "View Analytics",     desc: "Learner metrics",     icon: BarChart2,  primary: false },
      { label: "Manage Publications",desc: "Review your content", icon: Library,    primary: false },
    ];
  } else if (role === "admin") {
    actions = [
      { label: "Manage Users",        desc: "Access control",     icon: Users,        primary: true },
      { label: "Grant Creator Access",desc: "Elevate privileges", icon: ShieldCheck,  primary: false },
      { label: "View Reports",        desc: "System audits",      icon: FileText,     primary: false },
    ];
  }

  return (
    <div className="grid grid-cols-1 gap-4 animate-fade-in-up stagger-5 h-full">
      {actions.map((action, i) => (
        <button
          key={action.label}
          className={`group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 card-hover text-left flex-1 border ${
            action.primary
              ? "bg-[#00685f] text-white border-transparent"
              : "glass-panel text-[#191c1e]"
          }`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-transform group-hover:scale-110 ${
            action.primary ? "bg-white/10 text-white" : "bg-[#f7f9fb] text-[#00685f] border border-[#bcc9c6]/40"
          }`}>
            <action.icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className={`block font-bold text-sm tracking-tight ${action.primary ? "text-white" : "text-[#191c1e]"}`}>
              {action.label}
            </span>
            <span className={`block text-xs font-semibold mt-0.5 ${action.primary ? "text-[#e0f2f1] opacity-90" : "text-[#6d7a77]"}`}>
              {action.desc}
            </span>
          </div>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${action.primary ? "bg-white/20 text-white" : "bg-[#f7f9fb] text-[#191c1e] border border-[#bcc9c6]/40"}`}>
             <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      ))}
    </div>
  );
}
