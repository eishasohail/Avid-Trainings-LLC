"use client";

import { useState } from "react";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import Logo from "@/components/shared/Logo";
import { 
  Award, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight,
  Sparkles,
  Trophy,
  BadgeCheck,
  Globe,
  Share2,
  MoreVertical,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Eye,
  X,
  Printer,
  Shield,
  QrCode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const certificates = [
  {
    id: "CERT-2024-001",
    courseName: "ISO/IEC 27001:2022 Lead Implementer",
    issueDate: "March 15, 2024",
    expiryDate: "March 15, 2027",
    status: "Verified",
    grade: "Distinction",
    provider: "Avid Trainings Academy",
    verificationUrl: "https://avid-trainings.com/verify/27001-001",
    color: "from-[#00685f] to-[#00bfa5]",
    secondaryColor: "text-[#00685f]"
  },
  {
    id: "CERT-2024-042",
    courseName: "Risk Management Professional (ISO 31000)",
    issueDate: "February 10, 2024",
    expiryDate: "Lifetime",
    status: "Verified",
    grade: "A+",
    provider: "Avid Trainings Academy",
    verificationUrl: "https://avid-trainings.com/verify/31000-042",
    color: "from-[#131b2e] to-[#0b514c]",
    secondaryColor: "text-[#131b2e]"
  },
  {
    id: "CERT-2023-112",
    courseName: "Internal Auditor ISO 9001:2015",
    issueDate: "November 28, 2023",
    expiryDate: "November 28, 2026",
    status: "Verified",
    grade: "Merit",
    provider: "Avid Trainings Academy",
    verificationUrl: "https://avid-trainings.com/verify/9001-112",
    color: "from-[#00bfa5] to-emerald-400",
    secondaryColor: "text-[#00bfa5]"
  }
];

// --- Certificate Preview Component ---
const CertificateModal = ({ isOpen, onClose, cert }: { isOpen: boolean, onClose: () => void, cert: any }) => {
  if (!cert) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8">
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="absolute inset-0 bg-[#131b2e]/90 backdrop-blur-md"
           />
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row"
             onClick={e => e.stopPropagation()}
           >
              {/* Sidebar Actions */}
              <div className="w-full md:w-80 bg-[#f7f9fb] p-10 border-b md:border-b-0 md:border-r border-[#bcc9c6]/40 flex flex-col justify-between">
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-[#131b2e] rounded-2xl flex items-center justify-center text-white">
                          <Award className="w-7 h-7" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-[#6d7a77] tracking-[0.2em]">Verified Hub</p>
                          <p className="text-sm font-black text-[#131b2e]">Document Preview</p>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <button className="w-full px-6 py-4 bg-[#131b2e] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-[#00685f] transition-all active:scale-95">
                          <Download className="w-4 h-4" /> Download PDF
                       </button>
                       <button className="w-full px-6 py-4 bg-white border border-[#bcc9c6]/40 text-[#131b2e] rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm hover:shadow-xl transition-all active:scale-95">
                          <Printer className="w-4 h-4" /> Print Document
                       </button>
                       <button className="w-full px-6 py-4 bg-white border border-[#bcc9c6]/40 text-[#131b2e] rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm hover:shadow-xl transition-all active:scale-95">
                          <Share2 className="w-4 h-4" /> Share Credentials
                       </button>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-[#bcc9c6]/20 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-[#00685f]/10 rounded-xl flex items-center justify-center text-[#00685f]">
                          <QrCode className="w-6 h-6" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[9px] font-black uppercase text-[#6d7a77] tracking-widest mb-1">Audit Link</p>
                          <p className="text-[10px] font-bold text-[#131b2e] truncate">{cert.id}</p>
                       </div>
                    </div>
                    <button onClick={onClose} className="w-full text-center py-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#6d7a77] hover:text-red-500 transition-colors">Close Portal</button>
                 </div>
              </div>

              {/* The Certificate Render */}
              <div className="flex-1 p-8 md:p-16 flex items-center justify-center bg-[#f0f4f4] overflow-y-auto max-h-[80vh] md:max-h-none">
                 <div className="w-full aspect-[1.414/1] bg-white shadow-[0_30px_60px_-10px_rgba(0,0,0,0.2)] border-[12px] border-white p-1 md:p-2 relative group">
                    {/* Inner Border Frame */}
                    <div className="w-full h-full border-[2px] border-[#131b2e]/10 p-6 md:p-12 flex flex-col items-center justify-between relative">
                       {/* Background Texture */}
                       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: `radial-gradient(#131b2e 1.5px, transparent 1.5px)`, backgroundSize: '24px 24px' }} 
                       />
                       
                       {/* Header Logos */}
                       <div className="w-full flex justify-between items-start z-10">
                          <Logo size="md" />
                          <div className="text-right">
                             <p className="text-[8px] font-black text-[#6d7a77] uppercase tracking-[0.2em] mb-1">Official Document</p>
                             <p className="text-[10px] font-black text-[#131b2e]">{cert.id}</p>
                          </div>
                       </div>

                       {/* Main Body */}
                       <div className="flex flex-col items-center text-center space-y-4 md:space-y-8 z-10">
                          <div className="space-y-2">
                             <p className="text-[10px] md:text-[14px] font-black text-[#00685f] uppercase tracking-[0.6em]">Certificate of Achievement</p>
                             <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#00685f] to-transparent mx-auto" />
                          </div>

                          <div className="space-y-4">
                             <p className="text-[10px] md:text-[12px] font-bold text-[#6d7a77] uppercase tracking-[0.2em]">This is to certify that the institutional entity</p>
                             <h3 className="text-2xl md:text-5xl font-black text-[#131b2e] tracking-tight decoration-[#00685f]/30 underline decoration-4 underline-offset-8">Alex Rivers</h3>
                             <p className="text-[10px] md:text-[12px] font-bold text-[#6d7a77] uppercase tracking-[0.2em]">Haas successfully mastered the professional curriculum of</p>
                          </div>

                          <div className="p-6 md:p-10 bg-[#f7f9fb] border border-[#bcc9c6]/20 rounded-3xl space-y-2 max-w-xl mx-auto shadow-sm">
                             <h4 className="text-lg md:text-3xl font-black text-[#131b2e] leading-tight">{cert.courseName}</h4>
                             <p className="text-[9px] md:text-[11px] font-black text-[#00685f] uppercase tracking-[0.4em]">International Governance Standard</p>
                          </div>

                          <div className="flex items-center gap-6 md:gap-16 pt-4 md:pt-8">
                             <div className="text-center">
                                <p className="text-[8px] font-black text-[#bcc9c6] uppercase tracking-widest mb-1">Date Published</p>
                                <p className="text-[10px] font-black text-[#131b2e] uppercase">{cert.issueDate}</p>
                             </div>
                             <div className="text-center">
                                <p className="text-[8px] font-black text-[#bcc9c6] uppercase tracking-widest mb-1">Grade / Level</p>
                                <p className="text-[10px] font-black text-[#131b2e] uppercase">{cert.grade} Status</p>
                             </div>
                          </div>
                       </div>

                       {/* Footer / Seals */}
                       <div className="w-full flex justify-between items-end z-10 border-t border-[#f0f4f4] pt-8 md:pt-12 mt-4 md:mt-8">
                          <div className="space-y-4 text-left">
                             <div className="w-24 h-[1px] bg-[#131b2e]/40" />
                             <div>
                                <p className="text-[10px] font-black text-[#131b2e]">Dr. Sarah Kensington</p>
                                <p className="text-[8px] font-black text-[#6d7a77] uppercase tracking-widest">Director of Academics</p>
                             </div>
                          </div>

                          <div className="w-16 h-16 md:w-24 md:h-24 relative flex items-center justify-center">
                             <div className="absolute inset-0 border-2 border-[#131b2e]/20 rounded-full animate-[spin_10s_linear_infinite]" />
                             <div className="absolute inset-2 border border-[#131b2e]/10 rounded-full" />
                             <Shield className="w-8 h-8 md:w-12 md:h-12 text-[#00685f] opacity-80" />
                          </div>

                          <div className="space-y-4 text-right">
                             <div className="w-24 h-[1px] bg-[#131b2e]/40 ml-auto" />
                             <div>
                                <p className="text-[10px] font-black text-[#131b2e]">Institutional Registry</p>
                                <p className="text-[8px] font-black text-[#6d7a77] uppercase tracking-widest">Digital Authentication Hub</p>
                             </div>
                          </div>
                       </div>

                       {/* Corner Decorative Elements */}
                       <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#00685f]/20 rounded-tl-xl" />
                       <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#00685f]/20 rounded-tr-xl" />
                       <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#00685f]/20 rounded-bl-xl" />
                       <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#00685f]/20 rounded-br-xl" />
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const filteredCertificates = certificates.filter(cert => 
    cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cert.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePreview = (cert: any) => {
    setSelectedCert(cert);
    setIsPreviewOpen(true);
  };

  return (
    <DashboardWrapper loadingMessage="Verifying Credentials...">
      {(user) => (
        <>
          <div className="space-y-16 pb-32">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <div className="space-y-5">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-[#00685f]/10 to-transparent border-l-4 border-[#00685f] rounded-r-xl w-fit shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#00685f] animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#00685f]">Institutional Credentials Port</span>
                </motion.div>
                <h1 className="text-5xl lg:text-[5.5rem] font-black text-[#131b2e] tracking-tighter leading-none">Your <span className="text-[#00685f]">Identity.</span></h1>
                <p className="text-[#6d7a77] font-semibold text-xl max-w-2xl leading-relaxed italic opacity-80">Access your high-fidelity ISO/IEC professional credentials verified against EMEA infrastructure protocols.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-6">
                <button className="px-8 py-5 bg-white border-2 border-[#bcc9c6]/40 rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] text-[#131b2e] flex items-center gap-4 shadow-sm hover:shadow-2xl hover:border-[#131b2e] hover:-translate-y-1 transition-all active:scale-95 group">
                  <Globe className="w-5 h-5 text-[#00685f] group-hover:rotate-12 transition-transform" /> Sync Profile
                </button>
                <button className="px-10 py-5 bg-[#131b2e] text-white rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] flex items-center gap-4 shadow-3xl hover:bg-[#00685f] hover:-translate-y-1 transition-all active:scale-95 group">
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> Share All
                </button>
              </div>
            </div>

            {/* Identity Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               <motion.div 
                 whileHover={{ y: -10 }}
                 className="md:col-span-1 bg-gradient-to-br from-[#131b2e] via-[#0b514c] to-[#00685f] rounded-[48px] p-10 text-white relative overflow-hidden group shadow-3xl transition-all duration-700"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-[-20%] -translate-y-[-20%] group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 space-y-8">
                     <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-xl group-hover:rotate-[15deg] transition-transform">
                        <Trophy className="w-7 h-7 text-[#00bfa5]" />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[11px] font-black uppercase text-white/40 tracking-[0.4em]">Total Accreditations</p>
                        <p className="text-6xl font-black tracking-tighter">{certificates.length}</p>
                     </div>
                  </div>
               </motion.div>

               <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-3 bg-white border-2 border-[#bcc9c6]/40 rounded-[48px] p-10 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 shadow-sm transition-all duration-700 hover:shadow-2xl hover:border-[#00685f]/20"
               >
                  <div className="w-32 h-32 bg-gradient-to-br from-[#00685f]/5 to-transparent rounded-full flex items-center justify-center border border-[#00685f]/10 shrink-0 relative group">
                     <div className="absolute inset-0 bg-[#00685f]/10 rounded-full animate-ping opacity-20" />
                     <BadgeCheck className="w-16 h-16 text-[#00685f] group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="space-y-6 flex-1 text-center lg:text-left">
                     <h3 className="text-3xl font-black text-[#131b2e] tracking-tighter leading-none italic">Institutional Identity Verified.</h3>
                     <p className="text-lg font-medium text-[#6d7a77] leading-relaxed max-w-2xl">Your identity has been cryptographically secured. Every certificate issued is a high-fidelity digital asset recognized by top-tier global infrastructure corporations.</p>
                  </div>
                  <div className="flex flex-col items-center lg:items-end gap-4 shrink-0">
                     <span className="px-6 py-2.5 bg-[#00685f]/10 text-[#00685f] rounded-full text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 border border-[#00685f]/15 shadow-sm">
                       <div className="w-2 h-2 rounded-full bg-[#00685f] animate-pulse" /> Elite Accreditations
                     </span>
                     <p className="text-[11px] font-black text-[#6d7a77] uppercase tracking-[0.25em] opacity-60">Last Global Sync: 14:42 GMT</p>
                  </div>
               </motion.div>
            </div>

            {/* Search & Tooling */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
               <div className="flex-1 relative w-full group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-[#bcc9c6] group-focus-within:text-[#00685f] group-focus-within:scale-110 transition-all">
                    <Search className="w-full h-full" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Filter by Course Title, ISO Standard or Credential ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-2 border-[#bcc9c6]/30 rounded-[32px] pl-20 pr-10 py-7 text-base font-bold text-[#131b2e] focus:outline-none focus:ring-8 focus:ring-[#00685f]/5 focus:border-[#00685f]/30 shadow-sm transition-all placeholder:text-[#bcc9c6] placeholder:font-medium"
                  />
               </div>
               <button className="w-full lg:w-auto px-12 py-7 bg-white border-2 border-[#bcc9c6]/40 rounded-[32px] flex items-center justify-center gap-4 text-[12px] font-black text-[#6d7a77] hover:text-[#131b2e] hover:border-[#131b2e] shadow-sm transition-all group">
                  <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Advanced Filtering
               </button>
            </div>

            {/* High-Fidelity Certificates Grid */}
            <div className="flex flex-col gap-10 w-full max-w-[1000px] mx-auto">
              {filteredCertificates.map((cert, index) => (
                <motion.div 
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-white border-2 border-[#bcc9c6]/30 rounded-[64px] overflow-hidden hover:shadow-3xl hover:border-[#00685f]/40 transition-all duration-700 flex flex-col md:flex-row h-auto min-h-[350px] w-full"
                >
                  {/* Visual Preview Side */}
                  <div className={`w-full md:w-[40%] bg-gradient-to-br ${cert.color} p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/20 overflow-hidden relative shadow-inner shrink-0`}>
                     {/* High-Fidelity Grain & Glows */}
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.2] mix-blend-overlay pointer-events-none" />
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full translate-x-10 -translate-y-20 pointer-events-none" />
                     
                     <div className="relative z-10 flex justify-between items-start">
                       <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-2xl shadow-2xl rounded-[20px] flex items-center justify-center border border-white/30 group-hover:rotate-[20deg] transition-transform duration-1000 ease-spring shrink-0">
                          <Award className="w-7 h-7 md:w-9 md:h-9 text-white drop-shadow-lg" />
                       </div>
                       <div className="px-4 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-[10px] font-black uppercase text-white tracking-[0.25em] shadow-sm ml-4 text-center mt-2">{cert.grade}</div>
                     </div>

                     {/* Refined Institutional Badge Stack (No Clipping) */}
                     <div className="relative z-10 space-y-8 md:space-y-10 mt-10 md:mt-auto py-8">
                        <div className="flex -space-x-4">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-10 h-12 md:w-12 md:h-14 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] transform-gpu hover:-translate-y-2 transition-transform duration-500" />
                          ))}
                        </div>
                        <div className="space-y-3">
                          <p className="text-[10px] md:text-[11px] font-black uppercase text-white/50 tracking-[0.5em] leading-none">Security Protocol</p>
                          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 overflow-hidden">
                             <p className="text-[12px] md:text-[13px] font-black uppercase text-white tracking-[0.15em] leading-none drop-shadow-md truncate">{cert.id}</p>
                          </div>
                        </div>
                     </div>

                     {/* Status Indicator */}
                     <div className="relative z-10 pt-4 md:pt-8 mt-auto">
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10 shadow-inner">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: "100%" }}
                             transition={{ duration: 1.5, delay: 0.8 }}
                             className="h-full bg-white shadow-[0_0_20px_white]"
                           />
                        </div>
                     </div>

                     <button 
                       onClick={() => handlePreview(cert)}
                       className="absolute inset-0 bg-[#131b2e]/70 opacity-0 group-hover:opacity-100 backdrop-blur-md flex flex-col items-center justify-center gap-4 transition-all duration-700 text-white z-20 cursor-pointer"
                     >
                       <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center border border-white/20 scale-50 group-hover:scale-100 transition-transform duration-700">
                          <Eye className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
                       </div>
                       <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.6em] translate-y-4 group-hover:translate-y-0 transition-transform duration-700 font-sans text-center px-4 w-full">Audit Identity</span>
                     </button>
                  </div>

                  {/* Information Strategy Side (Balanced) */}
                  <div className="w-full md:w-[60%] p-8 md:p-14 flex flex-col justify-between relative bg-white overflow-hidden gap-8">
                     <div className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                           <span className={`px-5 py-2 bg-[#f0f9f8] ${cert.secondaryColor} rounded-full text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3 border border-[#00685f]/15 shadow-sm whitespace-nowrap`}>
                             <div className="w-2 h-2 rounded-full bg-current animate-pulse outline outline-4 outline-current/10 shrink-0" /> {cert.status} Compliance
                           </span>
                           <button className="p-3 text-[#bcc9c6] hover:text-[#131b2e] hover:bg-[#f7f9fb] rounded-2xl transition-all shrink-0"><MoreVertical className="w-7 h-7" /></button>
                        </div>
                        <h3 className="text-[24px] md:text-[32px] font-black text-[#131b2e] leading-[1.2] tracking-tighter group-hover:text-[#00685f] transition-all duration-700 break-words">{cert.courseName}</h3>
                     </div>

                     <div className="space-y-8 md:space-y-12">
                        <div className="grid grid-cols-2 gap-4 md:gap-12 border-t-2 border-[#f0f4f4] pt-8 md:pt-12">
                           <div className="space-y-2.5">
                              <p className="text-[9px] md:text-[11px] font-black text-[#6d7a77] uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-60">Issue Date</p>
                              <div className="flex items-center gap-2 md:gap-3.5 text-[14px] md:text-[16px] font-black text-[#131b2e]">
                                 <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#00685f] shrink-0" /> <span className="break-words">{cert.issueDate}</span>
                              </div>
                           </div>
                           <div className="space-y-2.5">
                              <p className="text-[9px] md:text-[11px] font-black text-[#6d7a77] uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-60">Audit Verification</p>
                              <div className="flex items-center gap-2 md:gap-3.5 text-[14px] md:text-[16px] font-black text-[#131b2e]">
                                 <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#00685f] shrink-0" /> <span className="break-words">{cert.expiryDate}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                           <button className="w-full sm:flex-1 px-4 md:px-8 py-5 md:py-[22px] bg-[#fcfdfe] border-2 border-[#f0f4f4] rounded-[32px] text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.35em] text-[#131b2e] flex items-center justify-center gap-3 md:gap-4 hover:border-[#131b2e] hover:shadow-2xl transition-all group/btn active:scale-95 text-center">
                              <Download className="w-4 h-4 md:w-5 md:h-5 text-[#00685f] group-hover/btn:scale-125 transition-transform shrink-0" /> PDF Transcript
                           </button>
                           <button 
                             onClick={() => handlePreview(cert)}
                             className="w-full sm:flex-1 px-4 md:px-8 py-5 md:py-[22px] bg-white border-2 border-[#f0f4f4] rounded-[32px] text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.35em] text-[#131b2e] flex items-center justify-center gap-3 md:gap-4 hover:border-[#131b2e] hover:shadow-2xl transition-all group/btn active:scale-95 text-center"
                           >
                              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-[#00685f] group-hover/btn:rotate-45 transition-transform shrink-0" /> Identity Portal
                           </button>
                        </div>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Help Center CTA */}
            <div className="bg-[#fcfdfe] border-2 border-[#bcc9c6]/30 rounded-[64px] p-24 text-center space-y-12 relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-700">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#00685f]/5 via-transparent to-blue-400/5 opacity-50" />
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[#00685f]/5 rounded-full blur-[200px] -z-10" />
               
               <div className="max-w-3xl mx-auto space-y-12 relative z-10">
                  <div className="w-24 h-24 bg-[#131b2e] rounded-[40px] flex items-center justify-center text-white mx-auto shadow-3xl group-hover:rotate-[25deg] transition-all duration-1000">
                     <Shield className="w-12 h-12 text-[#00bfa5] animate-pulse" />
                  </div>
                  <div className="space-y-6">
                     <h3 className="text-5xl font-black text-[#131b2e] tracking-tighter italic">Institutional Presence.</h3>
                     <p className="text-2xl font-medium text-[#6d7a77] leading-relaxed max-w-2xl mx-auto">Request official embossed parchment certifications and physical institutional ID cards for worldwide deployment.</p>
                  </div>
                  <div className="pt-8 flex items-center justify-center">
                     <button className="text-[14px] font-black uppercase tracking-[0.5em] text-[#00685f] hover:gap-10 flex items-center gap-8 transition-all group/cta underline decoration-[#00685f]/30 underline-offset-[16px] decoration-4">
                       Initialize Logistics Dispatch <ArrowRight className="w-7 h-7 group-hover/cta:translate-x-4 transition-transform" />
                     </button>
                  </div>
               </div>
            </div>
          </div>

          <CertificateModal 
            isOpen={isPreviewOpen} 
            onClose={() => setIsPreviewOpen(false)} 
            cert={selectedCert} 
          />

          <style jsx global>{`
            @font-face {
              font-family: 'CertificateFont';
              src: local('Times New Roman'), serif;
            }
            .ease-spring {
              transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
            }
          `}</style>
        </>
      )}
    </DashboardWrapper>
  );
}
