"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  Filter, 
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Activity,
  Lock,
  TrendingUp,
  Fingerprint,
  Mail,
  Calendar,
  ShieldCheck,
  MoreVertical
} from "lucide-react";
import { fetchAllUsers, updateUserRole, type AdminUser } from "@/lib/services/adminService";
import type { UserRole } from "@/lib/types/auth";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";

// --- High Fidelity Components From Original Specs ---

const RoleBadge = ({ role }: { role: UserRole }) => {
  const styles = {
    admin: "bg-[#00685f] text-white shadow-lg shadow-[#00685f]/20 border-white/10",
    creator: "bg-[#00bfa5] text-white shadow-lg shadow-[#00bfa5]/20 border-white/10",
    learner: "bg-[#f0f4f4] text-[#6d7a77] border border-[#bcc9c6]/30",
  }[role] || "bg-gray-100 text-gray-800";

  return (
    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] flex items-center justify-center w-fit border ${styles}`}>
      <span className="mr-1.5 opacity-60">●</span> {role}
    </div>
  );
};

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, show: boolean}>({message: "", show: false});
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    description: string;
    actionLabel: string;
    actionType: "primary" | "danger";
    onConfirm: () => void;
  }>({
    show: false,
    title: "",
    description: "",
    actionLabel: "",
    actionType: "primary",
    onConfirm: () => {},
  });

  useEffect(() => {
    const load = async () => {
      setIsLoadingUsers(true);
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
      setIsLoadingUsers(false);
    };
    load();
  }, []);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 4000);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All" || u.role.toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const currentUsers = useMemo(() => {
    const lastIndex = currentPage * usersPerPage;
    const firstIndex = lastIndex - usersPerPage;
    return filteredUsers.slice(firstIndex, lastIndex);
  }, [filteredUsers, currentPage]);

  const stats = useMemo(() => ({
    total: users.length,
    creators: users.filter(u => u.role === "creator").length,
    learners: users.filter(u => u.role === "learner").length,
    nodes: users.filter(u => u.role === "admin").length,
  }), [users]);

  const handleUpdate = (userId: string, targetName: string, newRole: UserRole) => {
    const isUpgrade = newRole === 'creator';
    setConfirmModal({
      show: true,
      title: isUpgrade ? `Elevate Authority?` : "Restrict Permission?",
      description: isUpgrade 
        ? `Upgrading ${targetName} to Creator status will enable curriculum architecture and content publication capabilities.` 
        : `Reverting ${targetName} access will immediately revoke all platform authoring rights.`,
      actionLabel: isUpgrade ? "Confirm Elevation" : "Revoke Access",
      actionType: isUpgrade ? "primary" : "danger",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, show: false }));
        setUpdatingId(userId);
        const success = await updateUserRole(userId, newRole);
        if (success) {
          setUsers(prev => prev.map(u => u.uid === userId ? { ...u, role: newRole } : u));
          showToast(`System permissions updated for ${targetName}`);
        } else {
          showToast("Global update failed. System synchronized.");
        }
        setUpdatingId(null);
      }
    });
  };

  return (
    <DashboardWrapper loadingMessage="Synchronizing Directory...">
      {(user) => (
        <div className="space-y-8 pb-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-8 h-8 text-[#00685f]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00685f]">User Management</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter uppercase">Admin Panel</h1>
              <p className="text-sm sm:text-base font-medium text-[#6d7a77] max-w-xl">
                 Platform-wide user oversight and Access Management for the Avid Trainings ecosystem.
              </p>
            </div>
            <div className="flex gap-4">
               <button className="flex-1 sm:flex-none px-8 py-5 bg-[#00685f] text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#00685f]/20 hover:scale-105 active:scale-95 transition-all">
                  Export Report
               </button>
            </div>
          </header>

          {/* Expanded Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up stagger-1">
             {[
               { label: "Total Users", value: stats.total, icon: Users, accent: "bg-blue-500", trend: "+12%" },
               { label: "Creators", value: stats.creators, icon: UserPlus, accent: "bg-[#00bfa5]", trend: "+4%" },
               { label: "Learners", value: stats.learners, icon: Activity, accent: "bg-purple-500", trend: "+18%" },
               { label: "Admins", value: stats.nodes, icon: Shield, accent: "bg-[#00685f]", trend: "Stable" },
             ].map((stat, i) => (
                <div key={i} className="bg-white rounded-[40px] border border-[#bcc9c6]/40 p-1 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2 group">
                   <div className="p-6 flex flex-col justify-between h-full space-y-6">
                      <div className="flex items-center justify-between">
                         <div className={`w-12 h-12 rounded-2xl ${stat.accent} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                         </div>
                         <div className="text-[10px] font-black text-[#00685f] bg-[#00685f]/5 px-3 py-1.5 rounded-full border border-[#00685f]/10">
                            {stat.trend}
                         </div>
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d7a77] group-hover:text-[#00685f] transition-colors">{stat.label}</p>
                         <h3 className="text-3xl font-black text-[#191c1e] mt-1">{stat.value.toLocaleString()}</h3>
                      </div>
                   </div>
                </div>
             ))}
          </div>

          {/* Management Interface */}
          <div className="bg-white rounded-[48px] border border-[#bcc9c6]/40 shadow-sm overflow-hidden animate-fade-in-up stagger-2">
             <div className="p-6 sm:p-8 border-b border-[#bcc9c6]/20 flex flex-col xl:flex-row justify-between items-center gap-6 bg-[#fcfdfe]">
                <div className="relative w-full xl:max-w-xl group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#6d7a77]/40 group-focus-within:text-[#00685f] transition-colors" />
                   <input 
                     type="text" 
                     placeholder="Filter users..." 
                     className="w-full pl-16 pr-8 py-4 bg-white border border-[#bcc9c6]/40 rounded-[28px] text-sm font-semibold outline-none focus:border-[#00685f] focus:ring-4 focus:ring-[#00685f]/5 transition-all shadow-inner"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
                   <div className="flex p-1 bg-[#f0f4f4] rounded-[24px] w-full sm:w-fit overflow-x-auto no-scrollbar">
                      {["All", "Admin", "Creator", "Learner"].map(role => (
                         <button 
                           key={role} 
                           onClick={() => setRoleFilter(role)}
                           className={`px-8 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${roleFilter === role ? 'bg-white text-[#00685f] shadow-xl' : 'text-[#6d7a77] hover:bg-white/40'}`}
                         >
                            {role}
                         </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="w-full overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                   <thead className="bg-[#fcfdfe] text-[9px] font-black uppercase tracking-[0.25em] text-[#6d7a77] border-b border-[#bcc9c6]/20 whitespace-nowrap">
                      <tr>
                         <th className="px-8 py-6 font-black w-[25%] min-w-[200px]">User Details</th>
                         <th className="px-8 py-6 font-black w-[15%] min-w-[120px]">Platform Role</th>
                         <th className="px-8 py-6 font-black w-[15%] min-w-[120px]">Joined Date</th>
                         <th className="px-8 py-6 font-black w-[15%] min-w-[100px]">Status</th>
                         <th className="px-8 py-6 font-black w-[40%] min-w-[280px] text-right pr-8">ACTIONS</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#bcc9c6]/10">
                      {isLoadingUsers ? (
                         [...Array(6)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                               <td className="px-8 py-6"><div className="w-64 h-10 bg-[#f7f9fb] rounded-3xl" /></td>
                               <td className="px-8 py-6"><div className="w-28 h-8 bg-[#f7f9fb] rounded-full" /></td>
                               <td className="px-8 py-6"><div className="w-32 h-6 bg-[#f7f9fb] rounded-lg" /></td>
                               <td className="px-8 py-6"><div className="w-20 h-6 bg-[#f7f9fb] rounded-lg" /></td>
                               <td className="px-8 py-6 text-right pr-8"><div className="w-40 h-10 bg-[#f7f9fb] rounded-2xl ml-auto" /></td>
                            </tr>
                         ))
                      ) : currentUsers.map((u, i) => (
                         <tr key={u.uid} className="hover:bg-[#fcfdfe] transition-all group/row">
                            <td className="px-8 py-5 whitespace-nowrap">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-[#00685f] flex items-center justify-center text-white text-lg font-black shadow-lg shrink-0">
                                     {u.displayName.charAt(0)}
                                  </div>
                                  <div className="space-y-0.5">
                                     <p className="text-base font-black text-[#191c1e] group-hover/row:text-[#00685f] transition-colors truncate max-w-[180px] uppercase tracking-tight">{u.displayName}</p>
                                     <div className="flex items-center gap-2 text-[#6d7a77]">
                                        <Mail className="w-3.5 h-3.5 opacity-40" />
                                        <p className="text-[11px] font-bold truncate max-w-[150px]">{u.email}</p>
                                     </div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                               <RoleBadge role={u.role} />
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                               <div className="flex items-center gap-2 text-[11px] font-bold text-[#6d7a77]">
                                  <Calendar className="w-3.5 h-3.5 opacity-40" />
                                  {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                               </div>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-[9px] font-black uppercase text-[#00685f]">
                               <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#00685f] animate-pulse" /> Active
                               </div>
                            </td>
                            <td className="px-8 py-5 text-right pr-8 whitespace-nowrap">
                                <div className="flex items-center justify-end gap-3 h-11">
                                   {updatingId === u.uid ? (
                                      <div className="flex items-center justify-center gap-3 px-6 h-full bg-[#f7f9fb] rounded-xl border border-[#bcc9c6]/20 shadow-inner">
                                         <Loader2 className="w-4 h-4 animate-spin text-[#00685f]" />
                                         <span className="text-[9px] font-black text-[#6d7a77] uppercase tracking-widest">Updating</span>
                                      </div>
                                   ) : u.role === 'admin' ? (
                                      <div className="relative h-full px-6 flex items-center justify-center gap-2.5 text-[9px] font-black uppercase tracking-widest text-white bg-[#131b2e] rounded-xl border border-white/10 shadow-lg cursor-default">
                                         <ShieldCheck className="w-3.5 h-3.5 opacity-80" /> Protected Access
                                      </div>
                                   ) : (
                                      <div className="flex items-center justify-end gap-3 h-full">
                                         <button 
                                           onClick={() => handleUpdate(u.uid, u.displayName, u.role === 'creator' ? 'learner' : 'creator')}
                                           className={`h-full px-5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border flex items-center justify-center gap-2 ${
                                             u.role === 'creator' 
                                               ? 'text-red-500 border-red-200 hover:bg-red-50' 
                                               : 'text-[#6d7a77] border-[#bcc9c6]/40 hover:border-[#00685f] hover:text-[#00685f] hover:bg-[#00685f]/5'
                                           }`}
                                         >
                                            {u.role === 'creator' ? 'Revoke' : 'Promote'}
                                         </button>
                                         <button className="relative w-12 h-full flex items-center justify-center bg-white border border-[#bcc9c6]/40 rounded-xl text-[#6d7a77] hover:text-[#191c1e] hover:border-[#00685f] transition-all shrink-0 active:scale-95">
                                            <MoreVertical className="w-5 h-5" />
                                         </button>
                                      </div>
                                   )}
                                </div>
                             </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             {/* Pagination High-Fidelity */}
             {!isLoadingUsers && filteredUsers.length > usersPerPage && (
                <div className="p-8 sm:p-12 border-t border-[#bcc9c6]/20 bg-[#fcfdfe] flex flex-col sm:flex-row items-center justify-between gap-8">
                   <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                         {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#bcc9c6] flex items-center justify-center text-[10px] font-black text-white">{i}</div>)}
                      </div>
                      <p className="text-[11px] font-black uppercase text-[#6d7a77] tracking-[0.1em]">
                         Displaying <span className="text-[#131b2e]">{currentUsers.length}</span> of <span className="text-[#131b2e]">{filteredUsers.length}</span> Identities
                      </p>
                   </div>
                   <div className="flex items-center gap-4">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-4 bg-white border border-[#bcc9c6]/40 rounded-2xl hover:border-[#00685f] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm active:scale-90"
                      >
                         <ChevronLeft className="w-6 h-6" />
                      </button>
                      <div className="flex gap-2">
                         {[...Array(Math.min(5, Math.ceil(filteredUsers.length / usersPerPage)))].map((_, i) => (
                           <button 
                             key={i} 
                             onClick={() => setCurrentPage(i + 1)}
                             className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#00685f] text-white' : 'hover:bg-[#f0f4f4] text-[#6d7a77]'}`}
                           >
                             {i + 1}
                           </button>
                         ))}
                      </div>
                      <button 
                        disabled={currentPage === Math.ceil(filteredUsers.length/usersPerPage)}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-4 bg-white border border-[#bcc9c6]/40 rounded-2xl hover:border-[#00685f] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm active:scale-90"
                      >
                         <ChevronRight className="w-6 h-6" />
                      </button>
                   </div>
                </div>
             )}
          </div>

          {/* Modal & Hub Toast */}
          {confirmModal.show && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 sm:p-10 w-screen h-screen m-0 overflow-hidden">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmModal(prev => ({...prev, show: false}))} />
               <div className="relative bg-white rounded-[56px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] p-12 sm:p-16 w-full max-w-[540px] animate-scale-up text-center space-y-10">
                  <div className={`w-28 h-28 rounded-[40px] mx-auto flex items-center justify-center ${confirmModal.actionType === 'danger' ? 'bg-red-50 text-red-500' : 'bg-[#00bfa5]/5 text-[#00bfa5]'} shadow-inner ring-4 ring-white`}>
                     {confirmModal.actionType === 'danger' ? <ShieldAlert className="w-14 h-14" /> : <Fingerprint className="w-14 h-14" />}
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-4xl font-black text-[#191c1e] tracking-tighter leading-tight uppercase">{confirmModal.title}</h3>
                     <p className="text-base sm:text-lg font-medium text-[#6d7a77] leading-relaxed max-w-[320px] mx-auto">{confirmModal.description}</p>
                  </div>
                  <div className="flex flex-col gap-4">
                     <button onClick={confirmModal.onConfirm} className={`w-full py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all active:scale-95 ${confirmModal.actionType === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/40' : 'bg-[#00685f] hover:bg-[#004d46] shadow-[#00685f]/40'}`}>
                        {confirmModal.actionLabel}
                     </button>
                     <button onClick={() => setConfirmModal(prev => ({...prev, show: false}))} className="w-full py-5 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] text-[#6d7a77] hover:bg-[#f7f9fb] transition-all">
                        Abandon Changes
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* Hub Toast UI */}
          <div className={`fixed bottom-12 right-12 z-[3000] transform transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${toast.show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-32 opacity-0 scale-90'}`}>
             <div className="bg-[#0b514c] text-white px-10 py-6 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center gap-6 border border-white/10">
                <div className="w-12 h-12 bg-[#00685f] rounded-2xl flex items-center justify-center shadow-lg">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00685f] mb-1">Global Notification</p>
                   <p className="text-base font-bold tracking-tight">{toast.message}</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  );
}
