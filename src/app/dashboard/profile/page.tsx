"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Clock, 
  Settings, 
  Camera, 
  CheckCircle2, 
  Lock, 
  ChevronRight,
  Bell,
  Globe,
  Database,
  History,
  Activity,
  Fingerprint,
  PenSquare
} from "lucide-react";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";

export default function ProfilePage() {
  const [activeSegment, setActiveSegment] = useState("Information");
  const [isEditing, setIsEditing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = () => {
     setIsEditing(false);
     setIsSuccess(true);
     setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <DashboardWrapper loadingMessage="Decrypting Profile Identity...">
      {(user) => (
        <div className="space-y-12 animate-fade-in-up">
          {/* Hero Profile Header */}
          <header className="relative w-full h-[320px] md:h-[400px] bg-[#00685f]/5 rounded-[64px] border border-[#bcc9c6]/20 overflow-hidden group shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-[#00685f]/10 to-[#00bfa5]/5 group-hover:scale-105 transition-transform duration-1000" />
             <div className="absolute inset-0 opacity-20" 
                  style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #00685f 1px, transparent 0)', backgroundSize: '40px 40px'}} />
             
             <div className="absolute bottom-0 left-0 right-0 p-10 sm:p-16 flex flex-col md:flex-row items-center md:items-end gap-10">
                <div className="relative group/avatar">
                   <div className="absolute -inset-4 bg-white/40 backdrop-blur-2xl rounded-[48px] blur-2xl opacity-60 group-hover/avatar:opacity-100 transition-opacity" />
                   <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-[40px] bg-white shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden group-hover/avatar:scale-105 transition-all duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00685f] to-[#01a69a] flex items-center justify-center text-white text-5xl md:text-7xl font-black tracking-tighter">
                         {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </div>
                      <button className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white transition-all duration-500 backdrop-blur-sm">
                         <Camera className="w-8 h-8" />
                      </button>
                   </div>
                   <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white border-4 border-[#fcfdfe] rounded-2xl shadow-xl flex items-center justify-center text-[#00685f]">
                      <Fingerprint className="w-6 h-6" />
                   </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                   <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <h1 className="text-4xl md:text-6xl font-black text-[#131b2e] tracking-tighter">{user.displayName || "ISO Member"}</h1>
                      <div className="px-5 py-2 bg-white border border-[#00685f]/10 rounded-full shadow-sm flex items-center gap-2.5 mx-auto md:mx-0 w-fit">
                         <div className="w-2 h-2 rounded-full bg-[#00bfa5] animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00685f]">Verified {user.role} Identity</span>
                      </div>
                   </div>
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-2 bg-white/40 px-4 py-2.5 rounded-2xl border border-white/50 backdrop-blur-md">
                         <Mail className="w-4 h-4 text-[#6d7a77]" />
                         <span className="text-xs font-bold text-[#131b2e]">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/40 px-4 py-2.5 rounded-2xl border border-white/50 backdrop-blur-md">
                         <Shield className="w-4 h-4 text-[#00685f]" />
                         <span className="text-xs font-black uppercase tracking-widest text-[#00685f]">Tier 1 Admin</span>
                      </div>
                   </div>
                </div>

                <div className="hidden lg:flex flex-col items-end gap-3 translate-y-4">
                   <div className="p-1 px-4 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm text-right">
                      <p className="text-[9px] font-black uppercase text-[#6d7a77] tracking-[0.2em]">Auth Timestamp</p>
                      <p className="text-xs font-black text-[#131b2e]">OCT 24, 2024</p>
                   </div>
                   <button 
                     onClick={() => setIsEditing(!isEditing)}
                     className="flex items-center gap-3 px-8 py-4 bg-[#00685f] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#00685f]/20 hover:scale-105 active:scale-95 transition-all"
                   >
                     <Settings className="w-4 h-4" /> Edit Authority
                   </button>
                </div>
             </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             {/* Left Column: Navigation & Core */}
             <div className="lg:col-span-8 space-y-12">
                <div className="flex p-2 bg-[#f0f4f4] rounded-[32px] w-full overflow-x-auto custom-scrollbar no-scrollbar scrollbar-hide">
                   {["Information", "Security", "Activity Log", "Connectivity"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveSegment(tab)}
                        className={`flex-1 px-8 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 whitespace-nowrap ${
                          activeSegment === tab 
                            ? "bg-white text-[#00685f] shadow-xl" 
                            : "text-[#6d7a77] hover:text-[#131b2e] hover:bg-white/40"
                        }`}
                      >
                         {tab}
                      </button>
                   ))}
                </div>

                {activeSegment === "Information" && (
                   <div className="bg-white rounded-[48px] border border-[#bcc9c6]/40 p-10 sm:p-14 shadow-sm space-y-12 animate-fade-in-up">
                      <div className="flex items-center justify-between border-b border-[#bcc9c6]/10 pb-10">
                         <div>
                            <h3 className="text-2xl font-black text-[#131b2e] tracking-tight">Identity Details</h3>
                            <p className="text-sm font-medium text-[#6d7a77] mt-1">Manage public profile attributes and global visibility.</p>
                         </div>
                         <div className="p-4 bg-[#fcfdfe] border border-[#bcc9c6]/30 rounded-2xl text-[#00685f]">
                            <User className="w-7 h-7" />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                         {[
                            { label: "Authorized Name", value: user.displayName || "ISO Hub User", icon: User },
                            { label: "System Email", value: user.email, icon: Mail },
                            { label: "Global Role", value: user.role, icon: Shield },
                            { label: "Connectivity State", value: "Primary Node", icon: Globe },
                            { label: "Academy Node", value: "HQ-01 (Global)", icon: Database },
                            { label: "Member Since", value: "Oct 2024", icon: Clock },
                         ].map((item, i) => (
                            <div key={i} className="group/item space-y-3 p-6 rounded-3xl border border-transparent hover:border-[#00685f]/10 hover:bg-[#fcfdfe] transition-all duration-500">
                               <div className="flex items-center gap-3">
                                  <item.icon className="w-4 h-4 text-[#00685f] opacity-40 group-hover/item:opacity-100 transition-opacity" />
                                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d7a77]">{item.label}</label>
                               </div>
                               {isEditing ? (
                                  <input 
                                    defaultValue={item.value}
                                    className="w-full bg-white border border-[#bcc9c6]/40 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#00685f] shadow-inner"
                                  />
                               ) : (
                                  <p className="text-[15px] font-black text-[#131b2e] ml-7">{item.value}</p>
                               )}
                            </div>
                         ))}
                      </div>

                      {isEditing && (
                         <div className="pt-6 flex justify-end gap-5">
                            <button onClick={() => setIsEditing(false)} className="px-10 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-[#6d7a77] hover:bg-[#f7f9fb] transition-all">Cancel Synchronization</button>
                            <button onClick={handleSave} className="px-12 py-5 bg-[#00685f] text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-[#00685f]/20 hover:scale-105 active:scale-95 transition-all">Propagate Changes</button>
                         </div>
                      )}
                   </div>
                )}

                {activeSegment === "Security" && (
                   <div className="bg-white rounded-[48px] border border-[#bcc9c6]/40 p-10 sm:p-14 shadow-sm space-y-12 animate-fade-in-up">
                      <div className="flex items-center justify-between border-b border-[#bcc9c6]/10 pb-10 text-red-600">
                         <div>
                            <h3 className="text-2xl font-black text-[#131b2e] tracking-tight">Security Protocol</h3>
                            <p className="text-sm font-medium text-red-500/60 mt-1 uppercase tracking-widest text-[10px] font-black">Authentication & Encryption Controls</p>
                         </div>
                         <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600">
                            <Lock className="w-7 h-7" />
                         </div>
                      </div>

                      <div className="space-y-6">
                         {[
                            { label: "System Firewall", desc: "Global administrative firewall for unauthorized credential isolation.", active: true },
                            { label: "Biometric Auth Check", desc: "Secondary fingerprint verification for all publication activities.", active: false },
                            { label: "Two-Factor Auth", desc: "Multi-layered protocol verification for environment switches.", active: true },
                         ].map((proto, i) => (
                            <div key={i} className="flex items-center justify-between p-8 bg-[#fcfdfe] border border-[#bcc9c6]/30 rounded-[32px] hover:border-[#00685f]/20 hover:shadow-xl transition-all duration-500 cursor-pointer group">
                               <div className="space-y-2">
                                  <h4 className="text-base font-black text-[#131b2e] group-hover:text-[#00685f] transition-colors">{proto.label}</h4>
                                  <p className="text-xs font-medium text-[#6d7a77] max-w-sm">{proto.desc}</p>
                               </div>
                               <div className={`w-14 h-7 rounded-full p-1 transition-colors duration-500 ${proto.active ? 'bg-[#00685f]' : 'bg-[#bcc9c6]'}`}>
                                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-500 transform ${proto.active ? 'translate-x-7' : 'translate-x-0'}`} />
                               </div>
                            </div>
                         ))}
                      </div>

                      <div className="p-8 bg-red-50 border-2 border-dashed border-red-200 rounded-[32px] flex items-center justify-between group cursor-pointer hover:bg-red-100/40 transition-colors">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-red-100 group-hover:rotate-12 transition-transform">
                               <History className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-red-700">Purge Active Sessions</p>
                               <p className="text-[10px] font-bold text-red-600/60 uppercase tracking-widest mt-1">Disconnect 4 Authorized Hubs</p>
                            </div>
                         </div>
                         <ChevronRight className="w-6 h-6 text-red-300 group-hover:translate-x-2 transition-transform" />
                      </div>
                   </div>
                )}
             </div>

             {/* Right Column: Platform Analytics */}
             <div className="lg:col-span-4 space-y-12">
                <div className="bg-[#131b2e] rounded-[48px] p-10 flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#00685f] to-[#01a69a] opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
                   <div className="w-20 h-20 rounded-3xl bg-[#00685f] flex items-center justify-center text-white shadow-3xl transform -rotate-6 group-hover:rotate-6 transition-transform duration-700">
                      <Activity className="w-10 h-10" />
                   </div>
                   <div className="space-y-4 relative z-10">
                      <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-[0.2em] text-[10px] opacity-40">Governance Metric</h3>
                      <p className="text-5xl font-black text-white tracking-tighter">98.4<span className="text-[#00bfa5]">%</span></p>
                      <p className="text-xs font-semibold text-white/40 leading-relaxed">Platform-wide administrative responsiveness and identity integrity score.</p>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                      <div className="w-[98.4%] h-full bg-[#00bfa5] animate-pulse" />
                   </div>
                </div>

                <div className="bg-white rounded-[40px] border border-[#bcc9c6]/40 p-10 space-y-8 shadow-sm">
                   <div className="flex items-center justify-between border-b border-[#bcc9c6]/10 pb-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d7a77]">Identity Evolution</h4>
                      <CheckCircle2 className="w-5 h-5 text-[#00685f]" />
                   </div>
                   <div className="space-y-8">
                      {[
                         { label: "Learning Path", progress: 84, color: "bg-[#00685f]" },
                         { label: "Publication Score", progress: 62, color: "bg-[#00bfa5]" },
                         { label: "Hub Connectivity", progress: 100, color: "bg-purple-500" },
                      ].map((bar, i) => (
                         <div key={i} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.1em]">
                               <span className="text-[#131b2e]">{bar.label}</span>
                               <span className="text-[#6d7a77]">{bar.progress}%</span>
                            </div>
                            <div className="h-2 bg-[#f0f4f4] rounded-full overflow-hidden shadow-inner">
                               <div className={`h-full ${bar.color} rounded-full transition-all duration-1000`} style={{ width: `${bar.progress}%` }} />
                            </div>
                         </div>
                      ))}
                   </div>
                   <div className="pt-6 border-t border-[#bcc9c6]/10 mt-6">
                      <p className="text-[10px] font-semibold text-[#6d7a77] leading-relaxed italic opacity-60">"Global ISO certification progress is evaluated across curriculum architecture and publishing standards."</p>
                   </div>
                </div>

                <div className="p-8 bg-[#fcfdfe] rounded-[40px] border border-[#00685f]/10 flex items-center justify-between group cursor-pointer hover:bg-[#00685f] transition-all duration-500">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-[18px] flex items-center justify-center text-[#00685f] shadow-sm group-hover:scale-90 transition-transform">
                         <PenSquare className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-[#131b2e] group-hover:text-white transition-colors">Platform Logs</p>
                         <p className="text-[9px] font-bold text-[#6d7a77] uppercase tracking-widest group-hover:text-white/60 transition-colors">Download Global Audit</p>
                      </div>
                   </div>
                   <ChevronRight className="w-5 h-5 text-[#bcc9c6] group-hover:text-white group-hover:translate-x-2 transition-all" />
                </div>
             </div>
          </div>

          {/* Success Hub Toast */}
          <div className={`fixed bottom-12 right-12 z-[2000] transform transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${isSuccess ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-32 opacity-0 scale-90'}`}>
             <div className="bg-[#0b514c] text-white px-10 py-6 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center gap-6 border border-white/10">
                <div className="w-12 h-12 bg-[#00685f] rounded-2xl flex items-center justify-center shadow-lg">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00bfa5] mb-1">Identity Update</p>
                   <p className="text-sm font-bold tracking-tight">Changes propagated to the global hub successfully.</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  );
}
