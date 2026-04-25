"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu, Search, X, Check, ArrowRight, Settings, User, Sparkles } from "lucide-react";
import type { AuthUser } from "@/lib/types/auth";
import { fetchUserNotifications, markAsRead, type Notification } from "@/lib/services/notificationService";

export default function Navbar({
  user,
  setIsSidebarOpen,
}: {
  user: AuthUser;
  setIsSidebarOpen: (o: boolean) => void;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "U");
  const roleDisplay = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    const load = async () => {
      if (user?.uid) {
        const data = await fetchUserNotifications(user.uid);
        setNotifications(data);
      }
    };
    load();

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/dashboard/library?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    const success = await markAsRead(id);
    if (success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  return (
    <header className={`fixed top-0 right-0 left-0 md:left-64 z-30 flex justify-between items-center transition-all duration-500 border-b ${
      scrolled 
        ? "py-5 px-8 md:px-12 bg-white/80 backdrop-blur-2xl border-[#00685f]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" 
        : "py-8 px-6 md:px-10 bg-transparent border-transparent"
    }`}>
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-[#191c1e] p-2.5 -ml-2 rounded-xl hover:bg-black/5 transition-all active:scale-95"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative max-w-lg w-full hidden md:block group">
          <div className="absolute inset-0 bg-[#00685f]/5 rounded-[20px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-white/50 backdrop-blur-md border border-[#bcc9c6]/40 rounded-[20px] group-focus-within:border-[#00685f] group-focus-within:bg-white transition-all duration-300 shadow-sm group-focus-within:shadow-xl">
             <Search className="ml-5 w-5 h-5 text-[#6d7a77] group-focus-within:text-[#00685f] group-focus-within:scale-110 transition-all duration-300" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               onKeyDown={handleSearch}
               placeholder="Search courses, modules, or standards..."
               className="w-full pl-4 pr-16 py-4 text-sm bg-transparent outline-none placeholder:text-[#6d7a77]/60 font-semibold text-[#191c1e]"
             />
             <div className="absolute right-4 flex items-center gap-1.5 opacity-40 group-focus-within:opacity-100 transition-opacity">
                <span className="px-2 py-1 bg-[#f0f4f4] border border-[#bcc9c6]/30 text-[9px] font-black text-[#6d7a77] rounded-lg">⌘</span>
                <span className="px-2 py-1 bg-[#f0f4f4] border border-[#bcc9c6]/30 text-[9px] font-black text-[#6d7a77] rounded-lg">K</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-3 rounded-2xl transition-all duration-500 group ${
              isNotifOpen 
                ? 'bg-[#00685f] text-white shadow-lg shadow-[#00685f]/20' 
                : 'text-[#6d7a77] hover:text-[#00685f] bg-[#f7f9fb] border border-[#bcc9c6]/20'
            }`}
          >
            <Bell className={`w-5.5 h-5.5 transition-transform duration-500 ${isNotifOpen ? '' : 'group-hover:rotate-12'}`} />
            {unreadCount > 0 && (
              <span className={`absolute top-2.5 right-2.5 w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                isNotifOpen ? 'bg-white border-[#00685f] scale-125' : 'bg-red-500 border-[#f7f9fb] animate-pulse'
              }`} />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-5 w-[380px] bg-white rounded-[32px] border border-[#bcc9c6]/30 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] overflow-hidden animate-scale-up-left z-50">
              <div className="p-6 border-b border-[#bcc9c6]/10 bg-[#fcfdfe] flex justify-between items-center">
                <div>
                   <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#131b2e]">Notification Center</h4>
                   <p className="text-[10px] font-bold text-[#6d7a77] mt-0.5">Real-time system updates</p>
                </div>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 rounded-full bg-[#00685f] text-white text-[9px] font-black uppercase tracking-widest">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-16 px-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-[#f7f9fb] rounded-[24px] flex items-center justify-center mx-auto text-[#bcc9c6]">
                       <Bell className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-[10px] font-black text-[#6d7a77] uppercase tracking-[0.2em] opacity-40">System Quiet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-6 border-b border-[#bcc9c6]/10 last:border-0 transition-all hover:bg-[#fcfdfe] relative group ${!n.isRead ? 'bg-[#00685f]/5' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className={`text-sm font-black tracking-tight ${!n.isRead ? 'text-[#00685f]' : 'text-[#191c1e]'}`}>{n.title}</h5>
                        {!n.isRead && (
                          <button 
                            onClick={() => handleMarkRead(n.id)}
                            className="p-1.5 rounded-lg text-white bg-[#00685f] opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[12px] font-medium text-[#6d7a77] leading-relaxed mb-3">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black uppercase tracking-widest text-[#bcc9c6]">
                           {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Global Hub
                         </span>
                         <ArrowRight className="w-3.5 h-3.5 text-[#00685f] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 group/user cursor-pointer">
           <div className="text-right hidden sm:block transition-all duration-300 group-hover/user:-translate-x-1">
             <p className="text-sm font-black text-[#191c1e] leading-tight mb-0.5">{user.displayName || "User"}</p>
             <p className="text-[10px] text-[#00685f] font-black uppercase tracking-[0.2em] opacity-60 group-hover/user:opacity-100 transition-opacity">{roleDisplay}</p>
           </div>
           <div className="relative">
              <div className="absolute inset-0 bg-[#00685f] blur-lg opacity-0 group-hover/user:opacity-20 transition-opacity duration-500 rounded-full" />
              <div className="relative w-12 h-12 rounded-[18px] bg-white border-2 border-[#f0f4f4] flex items-center justify-center shrink-0 shadow-sm group-hover/user:border-[#00685f]/30 group-hover/user:shadow-xl transition-all duration-500 overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#00685f] to-[#01a69a] opacity-0 group-hover/user:opacity-100 transition-opacity duration-500" />
                 <span className="relative z-10 text-[#00685f] group-hover/user:text-white font-black text-base transition-colors">{initial}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00bfa5] border-3 border-white rounded-full shadow-lg flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
           </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleUpLeft {
          from { opacity: 0; transform: scale(0.9) translateY(-20px) translateX(20px); }
          to { opacity: 1; transform: scale(1) translateY(0) translateX(0); }
        }
        .animate-scale-up-left {
          animation: scaleUpLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </header>
  );
}
