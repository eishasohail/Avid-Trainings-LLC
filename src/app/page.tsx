"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView, 
  AnimatePresence
} from "framer-motion";
import { 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  Zap, 
  Library, 
  CheckCircle, 
  Star, 
  Check,
  Menu,
  X,
  Play,
  GraduationCap,
  Users,
  Award,
  Layers,
  BarChart3,
  Search,
  BookOpen,
  MousePointer2,
  Activity,
  User,
  Lock,
  ChevronRight,
  Plus,
  Sparkles,
  Command,
  TrendingUp,
  ExternalLink,
  Flame
} from "lucide-react";

// --- Components ---

const FlowyGradients = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
    <motion.div 
      animate={{ 
        x: [0, 100, 0], 
        y: [0, 50, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-gradient-to-br from-[#00685f]/10 to-transparent blur-[120px] rounded-full" 
    />
    <motion.div 
      animate={{ 
        x: [0, -80, 0], 
        y: [0, 100, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-gradient-to-br from-[#00bfa5]/5 to-transparent blur-[100px] rounded-full" 
    />
    <motion.div 
      animate={{ 
        x: [0, 50, 0], 
        y: [0, -50, 0],
        scale: [1, 1.3, 1]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-gradient-to-tr from-blue-400/5 to-transparent blur-[110px] rounded-full" 
    />
  </div>
);

const GridOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.3]">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply" />
    <div className="absolute inset-0" 
      style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #bcc9c6 1.2px, transparent 0)`, backgroundSize: '40px 40px' }} />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f7f9fb]/80 to-[#f7f9fb]" />
  </div>
);

const SectionNotice = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white border border-[#00685f]/15 rounded-full mb-8 shadow-sm group hover:border-[#00685f]/30 transition-colors"
  >
    <div className="w-1.5 h-1.5 rounded-full bg-[#00685f]/40 group-hover:bg-[#00685f] transition-colors animate-pulse" />
    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00685f]">{text}</span>
  </motion.div>
);

// --- Main Page ---

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const sections = ["home", "features", "curriculum", "methodology", "enterprise"];
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
          setActiveHash(`#${section}`);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans selection:bg-[#00685f]/30 overflow-x-hidden antialiased">
      {/* Refined Navigation */}
      <nav className={`fixed top-0 inset-x-0 z-[1000] px-6 transition-all duration-700 ${scrolled ? 'py-4' : 'py-10'}`}>
        <div className={`max-w-6xl mx-auto flex items-center justify-between px-8 py-3.5 transition-all duration-700 border-2 rounded-[32px] ${
          scrolled 
            ? "bg-white/95 backdrop-blur-3xl border-[#00685f]/5 shadow-[0_30px_60px_-15px_rgba(0,104,95,0.12)]" 
            : "bg-white/60 backdrop-blur-xl border-white/80 shadow-2xl"
        }`}>
          <div className="flex items-center gap-12">
            <button onClick={() => scrollToSection('home')} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#131b2e] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-navy/20 transition-transform group-hover:rotate-[15deg]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-[#131b2e] tracking-tighter">Avid <span className="text-[#00685f]">Trainings</span></span>
            </button>
            <div className="hidden lg:flex items-center gap-8">
              {[
                { name: "Features", id: "features" },
                { name: "Curriculum", id: "curriculum" },
                { name: "Methodology", id: "methodology" },
                { name: "Enterprise", id: "enterprise" }
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => scrollToSection(item.id)}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${
                    activeHash === `#${item.id}` ? 'text-[#00685f]' : 'text-[#6d7a77] hover:text-[#131b2e]'
                  }`}
                >
                  {item.name}
                  {activeHash === `#${item.id}` && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00685f] to-[#00bfa5] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-[#6d7a77] hover:text-[#00685f] transition-colors">Login</Link>
            <Link href="/register" className="px-8 py-3.5 bg-[#00685f] text-white rounded-[18px] text-[11px] font-black uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(0,104,95,0.4)] hover:bg-[#004d46] hover:scale-[1.03] active:scale-95 transition-all">
              Get Started Free
            </Link>
            <button className="lg:hidden text-[#131b2e]" onClick={() => setMobileMenuOpen(true)}>
               <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO: Enterprise Elite with Color Flow */}
        <section id="home" className="relative pt-64 pb-32 px-6 min-h-screen flex flex-col items-center justify-center">
          <FlowyGradients />
          <GridOverlay />
          
          <div className="max-w-6xl mx-auto relative z-10 text-center space-y-12">
            <SectionNotice text="ISO Certified Excellence 2026" />

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-[6.5rem] lg:text-[8rem] font-black text-[#131b2e] tracking-tighter leading-[0.9] mb-8"
            >
               Elevate Your <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00685f] to-[#00bfa5] relative inline-block">
                 Professional
                 <div className="absolute bottom-2 left-0 right-0 h-3 bg-[#00685f]/10 -rotate-1 -z-10 rounded-full" />
               </span> Standards.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="max-w-3xl mx-auto text-lg sm:text-xl font-semibold text-[#6d7a77] leading-relaxed"
            >
               The primary infrastructure for mastering ISO/IEC frameworks through rigorous, logic-driven course sequences and institutional behavioral analytics.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10"
            >
               <Link href="/register" className="w-full sm:w-auto px-12 py-5.5 bg-[#131b2e] text-white rounded-[20px] text-[12px] font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-[#00685f] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                  Start Learning <ArrowRight className="w-5 h-5" />
               </Link>
               <button className="w-full sm:w-auto px-10 py-5.5 bg-white border-2 border-[#bcc9c6]/50 text-[#131b2e] rounded-[20px] text-[11px] font-black uppercase tracking-[0.3em] shadow-sm hover:border-[#131b2e] hover:shadow-2xl transition-all flex items-center justify-center gap-5 group">
                  <div className="w-8 h-8 rounded-xl bg-[#f0f4f4] flex items-center justify-center group-hover:bg-[#131b2e] group-hover:text-white transition-all">
                     <Play className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                  Platform Documentation
               </button>
            </motion.div>

            {/* Floating High-Fidelity UI Presentation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pt-24 relative hidden md:block"
            >
               <div className="relative max-w-5xl mx-auto">
                 <div className="absolute -inset-4 bg-gradient-to-r from-[#00685f]/20 via-[#00bfa5]/20 to-blue-400/20 rounded-[64px] blur-[100px] opacity-40 animate-pulse" />
                 <div className="relative bg-white border-2 border-[#bcc9c6]/30 rounded-[44px] p-3 shadow-3xl overflow-hidden aspect-[16/9] group hover:border-[#00685f]/30 transition-colors duration-1000">
                    <div className="w-full h-full bg-[#fcfdfe] rounded-[32px] border border-[#bcc9c6]/10 flex flex-col">
                       {/* Mock Dashboard Top */}
                       <div className="h-16 border-b border-[#bcc9c6]/10 px-8 flex items-center justify-between bg-white">
                          <div className="flex gap-2">
                             {[1,2,3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#bcc9c6]/30" />)}
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="w-40 h-2 bg-[#f0f4f4] rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-gradient-to-r from-[#00685f] to-[#00bfa5]" />
                             </div>
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#131b2e] to-[#00685f]" />
                          </div>
                       </div>
                       {/* Mock Dashboard Content */}
                       <div className="flex-1 p-10 flex items-center justify-center relative">
                          {/* Card 1: Course Progress */}
                          <div className="w-full max-w-sm bg-white border border-[#bcc9c6]/30 rounded-[36px] p-8 shadow-xl hover:scale-105 transition-transform duration-500 relative z-10">
                             <div className="flex flex-col items-center gap-6">
                                <div className="relative w-32 h-32 flex items-center justify-center mt-2 group">
                                   <svg className="w-full h-full transform -rotate-90">
                                       <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-[#f0f4f4]" />
                                       <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.8" strokeDashoffset="77.4" className="text-[#00bfa5] transition-all duration-1000 ease-out group-hover:stroke-[#00685f]" strokeLinecap="round" />
                                   </svg>
                                   <div className="absolute flex flex-col items-center justify-center">
                                      <span className="text-3xl font-black text-[#131b2e] leading-none">78%</span>
                                   </div>
                                </div>
                                <div className="text-center space-y-2">
                                   <p className="text-[11px] font-black text-[#00685f] uppercase tracking-[0.3em]">Course In Progress</p>
                                   <p className="text-2xl font-black text-[#131b2e] leading-tight">ISO Audit Training</p>
                                </div>
                             </div>
                             <div className="pt-8">
                                <button className="w-full py-4 bg-[#131b2e] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#00685f] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg">
                                   Continue Learning <ArrowRight className="w-5 h-5" />
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 {/* Floating Badges */}
                 <motion.div 
                   animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                   transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -top-4 -left-12 p-6 bg-white border-2 border-[#bcc9c6]/20 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,104,95,0.15)] flex items-center gap-5 z-20"
                 >
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl flex items-center justify-center text-[#00685f] shadow-inner">
                       <CheckCircle className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black text-[#6d7a77] uppercase tracking-[0.2em]">Certificate Earned</p>
                       <p className="text-lg font-black text-[#131b2e]">ISO 27001 Badge</p>
                    </div>
                 </motion.div>
                 <motion.div 
                   animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                   transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -bottom-4 -right-12 p-6 bg-[#131b2e] border-2 border-white/10 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] flex items-center gap-5 group z-20"
                 >
                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-amber-400 shadow-inner group-hover:scale-110 transition-transform">
                       <Flame className="w-7 h-7" />
                    </div>
                    <div className="text-left text-white">
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Learning Streak</p>
                       <p className="text-lg font-black tracking-tight flex items-center gap-1.5">12 Days <span className="text-amber-400 text-xl leading-none">🔥</span></p>
                    </div>
                 </motion.div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES: Multi-Hue Bento Grid */}
        <section id="features" className="py-48 px-6 bg-white relative">
           <div className="max-w-6xl mx-auto space-y-24">
              <div className="max-w-3xl">
                <SectionNotice text="The Infrastructure" />
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#131b2e] tracking-tighter leading-[0.9]">
                   Structure Your <br/> Professional <span className="text-[#00685f]">Growth.</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-8 auto-rows-[250px]">
                 <motion.div 
                   whileHover={{ y: -8, backgroundColor: "#fcfdfe", borderColor: "#00685f33" }}
                   className="lg:col-span-8 md:row-span-2 bg-[#fcfdfe] border-2 border-[#bcc9c6]/20 rounded-[48px] p-12 flex flex-col justify-between group transition-all duration-700 shadow-sm"
                 >
                    <div className="w-16 h-16 bg-[#131b2e] rounded-3xl flex items-center justify-center text-white shadow-3xl group-hover:rotate-12 transition-transform">
                       <Layers className="w-8 h-8" />
                    </div>
                    <div className="space-y-6 max-w-lg">
                       <h3 className="text-4xl font-black text-[#131b2e] tracking-tight">Course Builder</h3>
                       <p className="text-lg font-medium text-[#6d7a77] leading-relaxed">Translate institutional complexity into high-fidelity educational flows powered by deep behavioral engineering.</p>
                       <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#00685f] group-hover:gap-6 transition-all group-hover:text-[#00bfa5]">
                         Explore Engineering Protocols <ArrowRight className="w-4.5 h-4.5" />
                       </div>
                    </div>
                 </motion.div>

                 <motion.div 
                   whileHover={{ y: -8, scale: 1.02 }}
                   className="lg:col-span-4 md:row-span-2 bg-gradient-to-br from-[#131b2e] via-[#0b514c] to-[#00685f] rounded-[48px] p-12 flex flex-col justify-between group transition-all duration-700 shadow-3xl text-white relative overflow-hidden"
                 >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00bfa5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-[#00bfa5] shadow-2xl group-hover:scale-110 transition-transform relative z-10">
                       <Activity className="w-8 h-8" />
                    </div>
                    <div className="space-y-6 relative z-10">
                       <h3 className="text-3xl font-black tracking-tight leading-tight">Progress Tracking</h3>
                       <p className="text-base font-medium text-white/40 leading-relaxed italic">"Simultaneous skill mapping across 12,000+ active enterprise professional nodes."</p>
                    </div>
                 </motion.div>

                 <motion.div 
                   whileHover={{ y: -5, borderColor: "#00685f44", boxShadow: "0 30px 60px -15px rgba(0,0,0,0.06)" }}
                   className="lg:col-span-6 bg-white border border-[#bcc9c6]/40 rounded-[44px] p-10 flex flex-col justify-between group transition-all duration-500 shadow-sm"
                 >
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#00685f] group-hover:bg-[#00685f] group-hover:text-white transition-all">
                          <ShieldCheck className="w-7 h-7" />
                       </div>
                       <h3 className="text-2xl font-black text-[#131b2e] tracking-tight">Institutional Privacy</h3>
                    </div>
                    <p className="text-sm font-medium text-[#6d7a77] leading-relaxed">Multi-layered data isolation protocols designed for high-sensitivity governance frameworks.</p>
                 </motion.div>

                 <motion.div 
                   whileHover={{ y: -5, backgroundColor: "#004d46", boxShadow: "0 30px 60px -15px rgba(0,104,95,0.3)" }}
                   className="lg:col-span-6 bg-[#00685f] rounded-[44px] p-10 flex flex-col justify-between group transition-all duration-500 shadow-3xl text-white overflow-hidden relative"
                 >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-[-20%] -translate-y-[-20%] group-hover:scale-150 transition-transform duration-1000" />
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#00bfa5] border border-white/10">
                          <Globe className="w-7 h-7" />
                       </div>
                       <h3 className="text-2xl font-black tracking-tight">Global Connectivity</h3>
                    </div>
                    <p className="text-sm font-medium text-white/70 leading-relaxed max-w-xs relative z-10">Low-latency distribution infrastructure ensuring seamless curriculum delivery worldwide.</p>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* CURRICULUM: Deep Gradient Cards */}
        <section id="curriculum" className="py-48 px-6 bg-[#f7f9fb] relative overflow-hidden">
           <FlowyGradients />
           <div className="max-w-6xl mx-auto space-y-24 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                 <div className="max-w-3xl">
                   <SectionNotice text="The Academy Library" />
                   <h2 className="text-4xl md:text-7xl font-black text-[#131b2e] tracking-tighter leading-[0.85]">
                      Featured <br/> ISO <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00685f] to-[#00bfa5]">Courses.</span>
                   </h2>
                 </div>
                 <p className="max-w-[280px] text-lg font-bold text-[#6d7a77]/80 leading-relaxed italic opacity-80">Our library provides the structural blueprints for global governance mastery.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 {[
                   { id: "ISO/IEC 27001", title: "Information Security Management", level: "Admin Access", grad: "from-[#131b2e] to-[#0b514c]" },
                   { id: "ISO 9001", title: "Quality Operations Architecture", level: "Creator Access", grad: "from-[#00685f] to-[#00bfa5]" },
                   { id: "ISO 45001", title: "Occupational Health Protocol", level: "Open Access", grad: "from-[#00bfa5] to-emerald-400" },
                 ].map((course, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.8, delay: i * 0.1 }}
                     viewport={{ once: true }}
                     className="group bg-white border border-[#bcc9c6]/40 rounded-[48px] overflow-hidden shadow-sm hover:shadow-[0_50px_100px_-20px_rgba(0,104,95,0.2)] transition-all duration-700 h-[580px] flex flex-col"
                   >
                      <div className={`h-[260px] bg-gradient-to-br ${course.grad} p-12 flex flex-col justify-between relative group-hover:scale-105 transition-transform duration-1000`}>
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                         <div className="flex justify-between items-start relative z-10">
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.4em]">ISO Standard</span>
                            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#00685f] transition-all">
                               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                         </div>
                         <h4 className="text-3xl sm:text-4xl font-black text-white tracking-[0.15em] leading-none uppercase relative z-10">{course.id}</h4>
                      </div>
                      <div className="p-12 flex flex-col justify-between flex-1 relative bg-white">
                         <div className="space-y-5">
                            <h3 className="text-2xl font-black text-[#131b2e] group-hover:text-[#00685f] transition-all duration-500">{course.title}</h3>
                            <p className="text-sm font-medium text-[#6d7a77] leading-relaxed">Master the structural methodology for institutional resiliency and verified encryption standards.</p>
                         </div>
                         <div className="flex items-center justify-between pt-8 border-t border-[#f0f4f4]">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black uppercase text-[#6d7a77]/50 tracking-widest mb-1">Authorization</span>
                               <span className="text-[10px] font-black uppercase text-[#00685f] tracking-widest">{course.level}</span>
                            </div>
                            <div className="flex -space-x-3">
                               {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-2xl bg-[#f0f4f4] border-2 border-white shadow-inner" />)}
                            </div>
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* METHODOLOGY: Enhanced Timeline with Colors */}
        <section id="methodology" className="py-64 px-10 bg-white relative">
           <div className="max-w-6xl mx-auto space-y-32">
              <div className="text-center space-y-10 max-w-4xl mx-auto">
                 <SectionNotice text="How It Works" />
                  <h2 className="text-4xl md:text-[5.5rem] font-black text-[#131b2e] tracking-tighter leading-[0.85] mb-12">
                    Your Learning <br/> <span className="text-[#00685f]">Journey.</span>
                  </h2>
              </div>

              <div className="relative pt-20">
                 <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-1 bg-[#f0f4f4] -translate-x-1/2 overflow-hidden">
                    <motion.div 
                       style={{ scaleY: scrollYProgress }}
                       className="h-full bg-gradient-to-b from-[#00685f] to-[#00bfa5] origin-top rounded-full shadow-[0_0_20px_#00bfa5]"
                    />
                 </div>
                 
                 <div className="space-y-56">
                    {[
                      { title: "Create Account", desc: "Define your institutional role and authenticate professional credentials within our global encrypted ecosystem.", icon: User, color: "bg-blue-500" },
                      { title: "Enroll in Course", desc: "Select and mobilize targeted ISO academy streams as architectural blueprints for your team.", icon: Layers, color: "bg-[#00685f]" },
                      { title: "Learn at Your Pace", desc: "Progress through logic-driven behavioral loops monitored by institutional analytics in real-time.", icon: Activity, color: "bg-[#00bfa5]" },
                      { title: "Earn Certificate", desc: "Earn validated global accreditation and quality seals recognized by infrastructure industry leaders.", icon: Award, color: "bg-amber-400" },
                    ].map((step, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`flex items-start md:items-center flex-col md:flex-row ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''} gap-16 md:gap-32 relative`}
                      >
                         <div className={`absolute left-[39px] md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 ${step.color} shadow-2xl rounded-3xl flex items-center justify-center text-white z-10 transition-transform hover:rotate-12 hover:scale-110 border-4 border-white`}>
                            <step.icon className="w-9 h-9" />
                         </div>
                         <div className={`flex-1 space-y-6 text-left pl-28 md:pl-0 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 bg-[#bcc9c6]/10 rounded-full mb-2 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                               <span className="text-[10px] font-black uppercase text-[#6d7a77] tracking-[0.3em]">Step 0{i + 1}</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-[#131b2e] tracking-tighter leading-none">{step.title}</h3>
                            <p className="text-lg font-medium text-[#6d7a77] leading-relaxed max-w-lg odd:ml-auto even:mr-auto">{step.desc}</p>
                         </div>
                         <div className="flex-1 hidden md:block" />
                      </motion.div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* ENTERPRISE: Enhanced Trust with Glows */}
        <section id="enterprise" className="py-48 px-10 bg-[#131b2e] relative overflow-hidden flex flex-col items-center">
           <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00bfa5]/10 rounded-full blur-[200px]" />
           
           <div className="max-w-6xl mx-auto text-center space-y-24 relative z-10">
              <SectionNotice text="What Our Learners Say" />
              <div className="space-y-16">
                 <div className="flex justify-center gap-4 text-[#00bfa5]">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-10 h-10 fill-current opacity-30 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight max-w-4xl mx-auto">
                    "Avid Trainings translated institutional rigor into a fluid, technological experience. Our workforce mobilization time decreased by 60% within forty-eight hours."
                 </h2>
                 <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-full border-2 border-[#00bfa5]/40 p-1">
                       <div className="w-full h-full bg-[#f0f4f4] rounded-full overflow-hidden grayscale contrast-125" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-2xl font-black text-[#00bfa5] tracking-widest uppercase leading-none">Global Infrastructure</p>
                       <p className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] pt-1">Director of Governance • 2026 Batch</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* FINAL CTA: Elite Flowy Closing */}
        <section className="py-64 px-10 bg-white relative overflow-hidden text-center">
           <FlowyGradients />
           <GridOverlay />
           <div className="max-w-5xl mx-auto relative z-10 space-y-20">
              <SectionNotice text="Initialize Your Access" />
              <h2 className="text-6xl md:text-[7.5rem] font-black text-[#131b2e] tracking-tighter leading-[0.8] mb-8">
                 Revolutionize <br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00685f] to-[#00bfa5]">Excellence.</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6">
                 <Link href="/register" className="w-full sm:w-auto px-16 py-7 bg-[#131b2e] text-white rounded-[24px] text-[15px] font-black uppercase tracking-[0.4em] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] hover:bg-[#00685f] hover:scale-105 active:scale-95 transition-all">
                    Initialize Access
                 </Link>
                 <button className="w-full sm:w-auto px-14 py-7 bg-white border-2 border-[#131b2e] text-[#131b2e] rounded-[24px] text-[13px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-[#131b2e] hover:text-white transition-all">
                    Institutional Support
                 </button>
              </div>
              <p className="text-[10px] font-black text-[#bcc9c6] uppercase tracking-[0.5em] pt-12 animate-pulse">Primary Nodes Active • Provisioning 2.4-A</p>
           </div>
        </section>
      </main>

      <footer className="bg-[#fcfdfe] py-40 px-10 border-t border-[#bcc9c6]/30 relative z-10">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-24">
            <div className="space-y-10 group">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#131b2e] rounded-2xl flex items-center justify-center text-white shadow-2xl transition-transform group-hover:rotate-[15deg]">
                   <ShieldCheck className="w-7 h-7" />
                 </div>
                 <span className="text-3xl font-black text-[#131b2e] tracking-tighter leading-none">Avid <span className="text-[#00685f]">Trainings</span></span>
               </div>
               <p className="text-lg font-semibold text-[#6d7a77] leading-relaxed max-w-sm">Architecting the future of corporate educational standards through rigor and algorithmic precision.</p>
               <div className="flex gap-4">
                  {[Globe, Users, ExternalLink].map((Icon, i) => (
                    <div key={i} className="w-12 h-12 bg-white border-2 border-[#f0f4f4] rounded-2xl flex items-center justify-center text-[#131b2e] hover:bg-[#00685f] hover:text-white transition-all cursor-pointer">
                       <Icon className="w-5 h-5" />
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
               {[
                 { title: "Platform", links: ["Engine", "Infrastructure", "ISO Sync", "Security"] },
                 { title: "Company", links: ["Our Hub", "Institutional News", "Press", "Careers"] },
                 { title: "Standard", links: ["Privacy", "Ethics", "Governance", "Legal"] },
                 { title: "Global", links: ["London", "Abu Dhabi", "New York", "Singapore"] },
               ].map((group, i) => (
                  <div key={i} className="space-y-10">
                     <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#00685f]">{group.title}</p>
                     <ul className="space-y-6">
                        {group.links.map(l => <li key={l}><a href="#" className="text-[13px] font-bold text-[#6d7a77] hover:text-[#00685f] transition-colors">{l}</a></li>)}
                     </ul>
                  </div>
               ))}
            </div>
         </div>
         <div className="max-w-6xl mx-auto pt-32 mt-32 border-t border-[#bcc9c6]/20 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#bcc9c6]">© 2026 Avid Trainings LLC. All platform protocols synchronized globally.</p>
            <div className="flex gap-12 text-[11px] font-black uppercase tracking-[0.25em] text-[#bcc9c6]">
               <a href="#" className="hover:text-[#00685f] transition-colors">Twitter // X</a>
               <a href="#" className="hover:text-[#00685f] transition-colors">LinkedIn Enterprise</a>
            </div>
         </div>
      </footer>

      {/* Mobile Context-Aware Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[2000] bg-white p-12 flex flex-col justify-between"
          >
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#131b2e] rounded-2xl flex items-center justify-center text-white shadow-2xl">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <span className="text-2xl font-black text-[#131b2e] tracking-tighter">Avid Trainings</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-4 bg-[#f7f9fb] rounded-3xl text-[#131b2e] active:scale-90 transition-all"><X className="w-8 h-8" /></button>
             </div>
             <div className="flex flex-col gap-10 overflow-y-auto pt-10">
                {[
                  { name: "Features", id: "features" },
                  { name: "Curriculum", id: "curriculum" },
                  { name: "Methodology", id: "methodology" },
                  { name: "Enterprise", id: "enterprise" }
                ].map((item, i) => (
                  <motion.button 
                    key={item.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-5xl font-black text-[#131b2e] tracking-tighter hover:text-[#00685f] transition-colors"
                  >
                    {item.name}
                  </motion.button>
                ))}
             </div>
             <div className="space-y-6 mt-10">
                <Link href="/login" className="block text-center py-7 text-[13px] font-black uppercase tracking-widest text-[#6d7a77] border-2 border-[#bcc9c6]/40 rounded-3xl">Login</Link>
                <Link href="/register" className="block text-center py-7 bg-[#00685f] text-white text-[13px] font-black uppercase tracking-widest rounded-3xl shadow-3xl">Get Started Free</Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
