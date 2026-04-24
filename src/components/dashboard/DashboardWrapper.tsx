"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/services/authService";
import type { AuthUser } from "@/lib/types/auth";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BackgroundMesh from "./BackgroundMesh";

interface DashboardWrapperProps {
  children: (user: AuthUser) => React.ReactNode;
  loadingMessage?: string;
}

export default function DashboardWrapper({ children, loadingMessage = "Securing Session..." }: DashboardWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const u = await getCurrentUser();
        if (u && active) {
          setUser(u);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  if (isLoading || !user) {
    return (
      <div className="bg-[#f4f8f7] min-h-screen flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#00685f]/10 border-t-[#00685f] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#00685f]/5 rounded-full" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00685f]">{loadingMessage}</h3>
            <p className="text-[10px] font-bold text-[#6d7a77] opacity-60">Preparing your ISO Workspace</p>
          </div>
        </div>
      </div>
    );
  }

  const normalizedRole = user.role.trim().toLowerCase() as any;

  return (
    <div className="min-h-screen font-sans bg-[#f4f8f7] selection:bg-[#00685f]/10 selection:text-[#00685f] overflow-x-hidden">
      <BackgroundMesh />
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={{...user, role: normalizedRole}} />
      <Navbar user={{...user, role: normalizedRole}} setIsSidebarOpen={setIsSidebarOpen} />

      <main className="pt-20 pb-20 min-h-screen md:ml-64 flex flex-col min-w-0">
        <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 min-w-0">
          {children(user)}
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .stagger-1 { animation-delay: 100ms; }
        .stagger-2 { animation-delay: 200ms; }
        .stagger-3 { animation-delay: 300ms; }
        .stagger-4 { animation-delay: 400ms; }
        .stagger-5 { animation-delay: 500ms; }
        
        @keyframes dash { to { stroke-dashoffset: 0; } }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bcc9c6; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00685f; }
        
        .glass-panel {
          @apply bg-white/70 backdrop-blur-md border border-[#bcc9c6]/40 shadow-sm;
        }
        
        .card-hover {
          @apply transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#00685f]/30;
        }
      `}</style>
    </div>
  );
}
