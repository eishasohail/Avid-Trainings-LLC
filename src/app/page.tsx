"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from '@/lib/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import Logo from "@/components/shared/Logo";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView, 
  AnimatePresence,
  useSpring
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
  Flame,
  LayoutGrid,
  Bookmark,
  User as UserIcon,
  MessageCircle,
  Building2,
  Globe2,
  GraduationCap as GraduationIcon,
  ShieldCheck as ShieldIcon,
  BookOpen as BookIcon,
  Trophy,
  Briefcase,
  ChevronLeft
} from "lucide-react";

import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars';
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon';
import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble';
import { RadialIntro } from '@/components/animate-ui/components/community/radial-intro';
import type { Course } from '@/lib/data/dummyData';
import { getAllCourses } from '@/lib/utils/courseUtils'
import { RadialNav } from '@/components/animate-ui/components/community/radial-nav';
import { DUMMY_COURSES } from '@/lib/data/dummyData';

const COMMUNITY_ITEMS = [
  { id: 1, name: 'Framer University', src: 'https://pbs.twimg.com/profile_images/1602734731728142336/9Bppcs67_400x400.jpg' },
  { id: 2, name: 'arhamkhnz', src: 'https://pbs.twimg.com/profile_images/1897311929028255744/otxpL-ke_400x400.jpg' },
  { id: 3, name: 'Skyleen', src: 'https://pbs.twimg.com/profile_images/1948770261848756224/oPwqXMD6_400x400.jpg' },
  { id: 4, name: 'Shadcn', src: 'https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg' },
  { id: 5, name: 'Adam Wathan', src: 'https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg' },
  { id: 6, name: 'Guillermo Rauch', src: 'https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg' },
  { id: 7, name: 'Jhey', src: 'https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg' },
  { id: 8, name: 'David Haz', src: 'https://pbs.twimg.com/profile_images/1927474594102784000/Al0g-I6o_400x400.jpg' },
  { id: 9, name: 'Matt Perry', src: 'https://pbs.twimg.com/profile_images/1690345911149375488/wfD0Ai9j_400x400.jpg' },
];

const NAV_ITEMS = [
  { id: 1, icon: LayoutGrid, label: 'Projects', angle: 0 },
  { id: 2, icon: Bookmark, label: 'Bookmarks', angle: -115 },
  { id: 3, icon: User, label: 'About', angle: 115 },
];

const StatCounterInner = ({ value, suffix }: { value: number, suffix: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })
  
  useEffect(() => {
    if (isInView) {
      let start = 0
      const increment = value / (2000 / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, value])
  
  return <span ref={ref}>{count}{suffix}</span>
}

const StatCounter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-[#131b2e] mb-2">
        {count}{suffix}
      </div>
      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00685f]/60">{label}</div>
    </div>
  );
};

const SectionNotice = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: false }}
    className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white border border-[#00685f]/15 rounded-full mb-8 shadow-sm group hover:border-[#00685f]/30 transition-colors"
  >
    <div className="w-1.5 h-1.5 rounded-full bg-[#00685f]/40 group-hover:bg-[#00685f] transition-colors animate-pulse" />
    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00685f]">{text}</span>
  </motion.div>
);

export default function LandingPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [activeHash, setActiveHash] = useState<string>('#home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [courses, setCourses] = useState<any[]>([])
  const journeyRef = useRef(null);
  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRef,
    offset: ["start 85%", "end 15%"]
  });

  const smoothJourneyProgress = useSpring(journeyProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const lineHeight = useTransform(smoothJourneyProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (typeof window === 'undefined') return
    const all = getAllCourses()
    const published = all.filter(
      c => c.status === 'published'
    )
    setCourses(published)
  }, [])

  const sections = ["home", "features", "curriculum", "methodology", "enterprise"];
  const { scrollYProgress } = useScroll();

  const featuredCourses = useMemo(() => courses.slice(0, 3), [courses]);

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
    <div className="min-h-screen bg-[#fafcfc] font-sans selection:bg-[#00685f]/15 overflow-x-hidden antialiased text-[#11221f]">
      {/* Refined Navigation */}
      <nav className={`fixed top-0 inset-x-0 z-[1000] transition-all duration-500 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-[#00685f]/5 py-4 shadow-sm" 
          : "bg-transparent py-7"
      }`}>
        <div className="max-w-[1600px] w-full mx-auto px-8 xl:px-12 flex items-center justify-between">
          <div className="flex items-center gap-14">
            <Logo 
              size="sm" 
              destination={user ? '/dashboard' : '/'}
            />
            <div className="hidden lg:flex items-center gap-10">
              {[
                { name: "Courses", id: "curriculum" },
                { name: "Features", id: "features" },
                { name: "About", id: "methodology" },
                { name: "Community", id: "enterprise" }
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => scrollToSection(item.id)}
                  className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative py-2 ${
                    activeHash === `#${item.id}` ? 'text-[#00685f]' : 'text-[#6d7a77] hover:text-[#131b2e]'
                  }`}
                >
                  {item.name}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#00685f] rounded-full transition-transform duration-300 origin-left ${
                    activeHash === `#${item.id}` ? 'scale-x-100' : 'scale-x-0'
                  }`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-8">
            {user ? (
               <div className="flex items-center gap-3">
                 <div 
                   className="w-9 h-9 rounded-xl bg-[#131b2e] flex items-center justify-center text-white font-black text-sm cursor-pointer hover:bg-[#00685f] transition-colors"
                   onClick={() => router.push('/dashboard')}
                 >
                   {user.displayName 
                     ? user.displayName[0].toUpperCase() 
                     : user.email?.[0].toUpperCase() || 'U'}
                 </div>
                 <button
                   onClick={() => router.push('/dashboard')}
                   className="px-5 py-2.5 bg-[#00685f] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#131b2e] transition-all"
                 >
                   Dashboard
                 </button>
               </div>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-[#6d7a77] hover:text-[#00685f] transition-all"
                >
                  Login
                </button>
                <Link href="/register" className="px-8 py-3 bg-[#131b2e] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-[#00685f] hover:translate-y-[-2px] active:translate-y-0 transition-all">
                  Get Started
                </Link>
              </>
            )}
            <button className="lg:hidden text-[#11221f]" onClick={() => setMobileMenuOpen(true)}>
               <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="relative pt-64 pb-32 px-6 min-h-screen flex flex-col items-center justify-center bg-[#fafcfc] overflow-hidden">
          <GravityStarsBackground className="opacity-20" />
          
          <div className="absolute inset-0 z-0">
             <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-gradient-to-br from-[#7C3AED]/10 to-[#00685f]/10 blur-[120px] rounded-full animate-pulse" />
             <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-br from-[#F59E0B]/10 to-[#0EA5E9]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 text-center space-y-16">
            <SectionNotice text="ISO Certified Academy 2026" />

            <div className="space-y-8">
                <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl sm:text-8xl md:text-[8rem] lg:text-[9rem] font-black text-[#131b2e] tracking-tighter leading-[0.85] break-words"
                >
                Better Skills. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00685f] via-[#00bfa5] to-teal-400">
                    Better Standards.
                </span>
                </motion.h1>
                
                <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                className="max-w-2xl mx-auto text-xl font-medium text-[#6d7a77] leading-relaxed"
                >
                Access premium ISO certification courses designed for <span className="text-[#131b2e] font-black">compliance professionals</span> and industry leaders.
                </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
               <Link href="/register" className="w-full sm:w-auto px-14 py-6 bg-[#131b2e] text-white rounded-[24px] text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#00685f] hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center justify-center gap-4">
                  Enroll Now <ArrowRight className="w-5 h-5" />
               </Link>
               <button className="w-full sm:w-auto px-12 py-6 bg-white border border-[#bcc9c6]/30 text-[#131b2e] rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] shadow-sm hover:border-[#131b2e] hover:shadow-xl transition-all flex items-center justify-center gap-5 group">
                  <div className="w-8 h-8 rounded-xl bg-[#ebfaf8] flex items-center justify-center group-hover:bg-[#131b2e] group-hover:text-white transition-all">
                     <Play className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                  Watch Demo
               </button>
            </motion.div>

            {/* ENHANCEMENT 1 — Hero Floating UI Mockup */}
            <div className="relative w-full max-w-4xl mx-auto mt-16 group">
              <div className="absolute inset-0 bg-[#00685f]/20 blur-3xl rounded-[3rem] -z-10 scale-95" />
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -10, 0] 
                }}
                transition={{ 
                  delay: 0.5, 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200/60"
                style={{
                  perspective: '1000px',
                  transform: 'rotateX(5deg)',
                  boxShadow: '0 32px 80px -12px rgba(0,104,95,0.15), 0 0 0 1px rgba(0,104,95,0.05)'
                }}
              >
                {/* Browser chrome bar */}
                <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-5 bg-slate-200 rounded-full w-64 mx-auto" />
                  </div>
                </div>

                {/* Dashboard preview content */}
                <div className="p-6 bg-[#f7f9fb] text-left">
                  {/* Top stat cards row */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'PREMIUM COURSES', value: '15+', color: 'bg-[#00685f]' },
                      { label: 'PROFESSIONALS', value: '1200+', color: 'bg-purple-500' },
                      { label: 'SUCCESS RATE', value: '98%', color: 'bg-amber-500' },
                      { label: 'SUPPORT', value: '24/7', color: 'bg-[#131b2e]' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                        <div className={`w-6 h-6 ${stat.color} rounded-lg mb-2`} />
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                          {stat.label}
                        </p>
                        <p className="text-lg font-black text-[#131b2e]">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Course cards row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { title: 'ISO 27001', progress: 65, color: 'from-[#131b2e] to-[#00685f]' },
                      { title: 'ISO 9001', progress: 100, color: 'from-[#00685f] to-teal-400' },
                      { title: 'ISO 14001', progress: 30, color: 'from-slate-700 to-slate-900' },
                    ].map((course) => (
                      <div key={course.title} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                        <div className={`h-16 bg-gradient-to-br ${course.color}`} />
                        <div className="p-3">
                          <p className="text-xs font-black text-[#131b2e] mb-2">{course.title}</p>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#00685f] rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1 font-black">{course.progress}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ENHANCEMENT 2 — Marquee ticker bar */}
        <div className="w-full bg-[#131b2e] py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="mx-4 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 flex items-center gap-4">
                ISO 27001 
                <span className="text-[#00685f]">•</span> 
                ISO 9001 
                <span className="text-[#00685f]">•</span> 
                ISO 14001 
                <span className="text-[#00685f]">•</span> 
                ISO 45001 
                <span className="text-[#00685f]">•</span> 
                Information Security 
                <span className="text-[#00685f]">•</span> 
                Quality Management 
                <span className="text-[#00685f]">•</span> 
                Environmental Standards 
                <span className="text-[#00685f]">•</span> 
                CPD Certified 
                <span className="text-[#00685f]">•</span> 
                Expert-Led Courses 
                <span className="text-[#00685f]">•</span>
              </span>
            ))}
          </div>
        </div>
        {/* FEATURES */}
        <section id="features" className="py-64 px-8 bg-white relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-7xl mx-auto space-y-32"
          >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
                  <div className="space-y-10">
                    <SectionNotice text="The Academy Experience" />
                    <h2 className="text-5xl md:text-8xl font-black text-[#131b2e] tracking-tighter leading-[0.85]">
                       Master Your <br/> <span className="text-[#00685f]">Domain.</span>
                    </h2>
                  </div>
                  <p className="text-xl font-medium text-[#6d7a77] leading-relaxed max-w-md pb-4">
                    Our platform provides the structure and clarity needed to navigate complex ISO frameworks with confidence.
                  </p>
              </div>

              <div className="relative">
                 {/* Ambient Background Glow */}
                 <div className="absolute -inset-10 bg-gradient-to-tr from-[#00685f]/5 via-transparent to-teal-400/5 blur-3xl -z-10 rounded-full animate-pulse-slow" />
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[
                      { title: "Course Builder", desc: "Engaging ISO standards translated into interactive, retention-optimized paths.", icon: Layers, color: "bg-[#00685f]", iconColor: "text-white", hoverBorder: "hover:border-t-[#00685f]" },
                      { title: "Progress Analytics", desc: "Live tracking and performance metrics to keep your learning goals on schedule.", icon: Activity, color: "bg-[#7C3AED]", iconColor: "text-white", hoverBorder: "hover:border-t-[#7C3AED]" },
                      { title: "Data Security", desc: "Enterprise-grade protection for your professional and corporate training data.", icon: ShieldCheck, color: "bg-[#0EA5E9]", iconColor: "text-white", hoverBorder: "hover:border-t-[#0EA5E9]" },
                      { title: "Global Accessibility", desc: "Seamless course delivery across any device, anywhere in the world.", icon: Globe2, color: "bg-[#F59E0B]", iconColor: "text-white", hoverBorder: "hover:border-t-[#F59E0B]" },
                      { title: "Expert Support", desc: "Access to compliance specialists to guide you through complex certification steps.", icon: MessageCircle, color: "bg-[#F43F5E]", iconColor: "text-white", hoverBorder: "hover:border-t-[#F43F5E]" },
                      { title: "Recognition", desc: "Industry-recognized seals and certificates to validate your professional expertise.", icon: Trophy, color: "bg-[#131b2e]", iconColor: "text-white", hoverBorder: "hover:border-t-[#131b2e]" },
                    ].map((feat, i) => (
                       <motion.div 
                         key={i}
                         initial={{ 
                           opacity: 0, 
                           x: i % 2 === 0 ? -100 : 100,
                           y: 20
                         }}
                         whileInView={{ 
                           opacity: 1, 
                           x: 0,
                           y: 0 
                         }}
                         viewport={{ once: false, margin: "-50px" }}
                         transition={{ 
                           duration: 0.8, 
                           delay: i * 0.1,
                           ease: [0.16, 1, 0.3, 1] 
                         }}
                         whileHover={{ 
                           y: -15,
                           scale: 1.02,
                           boxShadow: '0 40px 100px -20px rgba(0,104,95,0.15)' 
                         }}
                         className={`p-12 bg-white/60 backdrop-blur-sm border border-[#00685f]/10 border-t-4 border-t-transparent ${feat.hoverBorder} rounded-[44px] space-y-8 transition-all hover:bg-white group relative overflow-hidden`}
                       >
                          {/* Inner card glow */}
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#00685f]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <motion.div 
                            className={`w-16 h-16 ${feat.color} ${feat.iconColor} rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-12`}
                          >
                             <feat.icon className="w-8 h-8" />
                          </motion.div>
                          <div className="space-y-4 relative z-10">
                             <h3 className="text-2xl font-black text-[#131b2e] tracking-tight group-hover:text-[#00685f] transition-colors">{feat.title}</h3>
                             <p className="text-base font-medium text-[#6d7a77] leading-relaxed line-clamp-3">{feat.desc}</p>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              </div>
           </motion.div>
        </section>

        {/* ENHANCEMENT 3 — Course Showcase Section */}
        <section id="curriculum" className="py-48 px-6 bg-[#f7f9fb] relative overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#00685f]/8 rounded-full blur-[100px] -z-10 -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-teal-400/6 rounded-full blur-[80px] -z-10 -translate-y-1/2" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-[1600px] w-full mx-auto min-w-0"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 px-2 xl:px-6 mb-16">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#bcc9c6]/10 rounded-full">
                  <span className="text-[10px] font-black uppercase text-[#6d7a77] tracking-[0.3em]">OUR COURSES</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[#131b2e] leading-[0.9]">
                  ISO Certifications <br/>
                  <span className="text-[#00685f]">That Matter.</span>
                </h2>
              </div>
              <div className="max-w-md space-y-6">
                <p className="text-lg font-medium text-[#6d7a77]">
                  Industry-recognized courses built for compliance professionals.
                </p>
                <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#00685f] hover:text-[#131b2e] transition-colors">
                  View All Courses <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {courses.map((course) => (
                <motion.div 
                  key={course.id}
                  whileHover={{ 
                    y: -12,
                    boxShadow: '0 24px 60px -10px rgba(0,104,95,0.25)'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="shrink-0 min-w-[320px] bg-white rounded-[2rem] overflow-hidden border border-slate-100 flex flex-col group transition-all"
                >
                  <div className="h-56 bg-gradient-to-br from-[#131b2e] to-[#00685f] relative flex items-center justify-center">
                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">{course.isoStandard}</span>
                    </div>
                    <GraduationCap className="w-20 h-20 text-white/20 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-black text-[#131b2e] leading-tight mb-4 flex-1">{course.title}</h3>
                    <div className="border-t border-[#f0f4f4] pt-4 mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#f0f4f4] flex items-center justify-center text-[10px] font-bold text-[#00685f]">
                            {course.creatorName.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-[#6d7a77]">{course.creatorName}</span>
                        </div>
                      </div>
                      
                      <div 
                        onClick={() => router.push(`/courses/${course.id}`)}
                        className="group relative w-full h-14 bg-slate-50 rounded-2xl overflow-hidden cursor-pointer border border-slate-100 hover:border-[#00685f]/30 transition-all mt-4"
                      >
                        {/* Sliding teal background */}
                        <div className="absolute inset-0 bg-[#00685f] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex items-center justify-between px-5">
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#131b2e] group-hover:text-white transition-colors duration-300 relative z-10">
                            View Course
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-[#00685f] group-hover:bg-white flex items-center justify-center transition-colors duration-300 relative z-10">
                            <ArrowRight size={16} className="text-white group-hover:text-[#00685f] transition-colors duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* METHODOLOGY */}
        <section ref={journeyRef} id="methodology" className="py-64 px-10 bg-white relative overflow-hidden">
          {/* Floating Particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 3 + i, 
                repeat: Infinity,
                delay: i * 0.8
              }}
              className={`absolute w-2 h-2 rounded-full bg-[#00685f]/40 ${
                i === 0 ? 'top-20 left-20' : 
                i === 1 ? 'top-40 right-32' : 
                'bottom-20 left-1/3'
              }`}
            />
          ))}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-6xl mx-auto space-y-32"
          >
              <div className="text-center space-y-10 max-w-4xl mx-auto">
                 <SectionNotice text="How It Works" />
                 <motion.div
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: false }}
                   transition={{ duration: 0.6 }}
                 >
                    <h2 className="text-4xl md:text-[5.5rem] font-black text-[#131b2e] tracking-tighter leading-[0.85] mb-12">
                      Your Learning <br/> <span className="text-[#00685f]">Journey.</span>
                    </h2>
                 </motion.div>
              </div>

              <div className="relative pt-20">
                 {/* Track line - always visible, darker grey for contrast */}
                 <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-1 md:w-1.5 -translate-x-1/2 bg-slate-200 z-0" />

                 {/* Animated teal fill - grows as you scroll */}
                 <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-1 md:w-1.5 -translate-x-1/2 z-0 overflow-hidden">
                    <motion.div
                      style={{ height: lineHeight }}
                      className="w-full bg-gradient-to-b from-[#00685f] via-[#00bfa5] to-[#00685f] origin-top shadow-[0_0_15px_rgba(0,104,95,0.3)]"
                    />
                 </div>



                 
                 <div className="space-y-56">
                    {[
                      { title: "Create Account", desc: "Join our community of compliance professionals and start your certification journey today.", icon: User, color: "bg-blue-500" },
                      { title: "Enroll in Course", desc: "Choose from our wide range of ISO certification courses tailored to your professional needs.", icon: Layers, color: "bg-[#00685f]" },
                      { title: "Learn at Your Pace", desc: "Engage with interactive content and track your learning progress with real-time analytics.", icon: Activity, color: "bg-[#00bfa5]" },
                      { title: "Earn Certificate", desc: "Receive industry-recognized ISO certifications that validate your expertise and drive career growth.", icon: Award, color: "bg-amber-400" },
                    ].map((step, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ 
                          duration: 0.7, 
                          delay: i * 0.3,
                          ease: "easeOut" 
                        }}
                        className={`flex items-start md:items-center flex-col md:flex-row ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''} gap-16 md:gap-32 relative group`}
                      >
                         <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: false }}
                            transition={{ 
                               type: "spring", 
                               stiffness: 200, 
                               delay: i * 0.3 + 0.2 
                            }}
                            className={`absolute left-[39px] md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 ${step.color} shadow-2xl shadow-[#00685f]/20 rounded-3xl flex items-center justify-center text-white z-10 transition-transform group-hover:rotate-12 group-hover:scale-110 border-4 border-white`}
                         >
                            <step.icon className="w-9 h-9" />
                         </motion.div>
                         <div className={`flex-1 space-y-6 text-left pl-28 md:pl-0 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 bg-[#bcc9c6]/10 rounded-full mb-2 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''} shadow-lg shadow-[#00685f]/5`}>
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
           </motion.div>
        </section>

        {/* ENTERPRISE */}
        <section id="enterprise" className="py-48 px-10 bg-white relative overflow-hidden flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-24 relative z-10"
          >
              <div className="flex-1 space-y-12">
                 <SectionNotice text="Our Community" />
                 <h2 className="text-4xl md:text-6xl font-black text-[#131b2e] tracking-tighter leading-tight">
                    Join the Global <br/> <span className="text-[#00685f]">Compliance Network.</span>
                 </h2>
                 <p className="text-lg font-medium text-[#6d7a77] leading-relaxed max-w-lg">
                    Connect with thousands of industry leaders and compliance experts who have accelerated their careers through our platform.
                 </p>
                 <div className="flex items-center gap-6 pt-6">
                    <div className="flex -space-x-4">
                       {[1, 2, 3, 4].map(i => (
                         <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-[#f0f4f4]" />
                       ))}
                    </div>
                    <p className="text-[11px] font-black uppercase text-[#00685f] tracking-widest">12,000+ Active Professionals</p>
                 </div>
              </div>
              <div className="flex-1 flex justify-center items-center">
                 <RadialIntro orbitItems={COMMUNITY_ITEMS} />
              </div>
           </motion.div>
        </section>

        {/* FINAL CTA */}
        <section className="py-64 px-10 bg-[#131b2e] relative overflow-hidden text-center flex flex-col items-center">
           <BubbleBackground 
             interactive={true}
             className="absolute inset-0 z-0 opacity-40"
           />
           <motion.div
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: false, margin: "-100px" }}
             transition={{ duration: 0.7, ease: "easeOut" }}
             className="max-w-6xl mx-auto relative z-10 space-y-24 flex flex-col items-center"
           >
              <div className="space-y-10">
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: false }}
                   className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/5 border border-white/20 rounded-full mb-8 shadow-sm group transition-colors"
                 >
                   <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-[#00bfa5] transition-colors animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">Start Your Journey</span>
                 </motion.div>
                 <h2 className="text-6xl md:text-[9rem] font-black text-white tracking-tighter leading-[0.8] mb-8">
                    Ready to <br className="md:hidden" /> <span className="text-[#00bfa5]">Certify?</span>
                 </h2>
                 <p className="text-xl font-medium text-white/60 max-w-xl mx-auto">
                    Join thousands of compliance leaders and start your certification journey today with our expert-led platform.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-6">
                 <button 
                   onClick={() => router.push('/login')}
                   className="w-full sm:w-auto px-20 py-8 bg-[#00685f] text-white rounded-[32px] text-lg font-black uppercase tracking-[0.4em] shadow-2xl hover:translate-y-[-4px] active:translate-y-0 transition-all"
                 >
                    Register Free
                 </button>
              </div>
           </motion.div>
        </section>
      </main>

      <footer className="bg-[#fafcfc] py-48 px-8 border-t-2 border-[#00685f]/10 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-32">
            <div className="space-y-12 group">
               <Logo size="md" destination="top" />
               <p className="text-xl font-medium text-[#6d7a77] leading-relaxed max-w-sm">The most refined ISO certification experience for compliance professionals.</p>
               <div className="flex gap-6">
                  {[Globe, Users, ExternalLink].map((Icon, i) => (
                    <div key={i} className="w-14 h-14 bg-[#fafcfc] border border-[#00685f]/5 rounded-2xl flex items-center justify-center text-[#131b2e] hover:bg-[#00685f] hover:text-white transition-all cursor-pointer shadow-sm">
                       <Icon className="w-6 h-6" />
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-24">
               {[
                 { title: "Platform", links: ["Courses", "Features", "About", "Community"] },
                 { title: "Company", links: ["About Us", "Blog", "Press", "Careers"] },
                 { title: "Standard", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Legal"] },
               ].map((group, i) => (
                  <div key={i} className="space-y-10">
                     <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00685f]">{group.title}</p>
                     <ul className="space-y-6">
                        {group.links.map(l => <li key={l}><a href="#" className="text-sm font-bold text-[#6d7a77] hover:text-[#00685f] transition-all">{l}</a></li>)}
                     </ul>
                  </div>
               ))}
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-32 mt-32 border-t border-[#00685f]/5 flex flex-col md:flex-row justify-between items-center gap-12">
            <p className="text-sm font-bold text-[#bcc9c6]">© 2026 Avid Trainings LLC. All rights reserved.</p>
            <div className="flex gap-16 text-sm font-bold text-[#bcc9c6]">
               <a href="#" className="hover:text-[#00685f] transition-colors">Twitter</a>
               <a href="#" className="hover:text-[#00685f] transition-colors">LinkedIn</a>
            </div>
         </div>
      </footer>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[2000] bg-white p-12 flex flex-col justify-between"
          >
             <div className="flex justify-between items-center">
                 <Logo size="md" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-4 bg-[#f7f9fb] rounded-3xl text-[#131b2e] active:scale-90 transition-all"><X className="w-8 h-8" /></button>
             </div>
             <div className="flex flex-col gap-10 overflow-y-auto pt-10">
                {[
                  { name: "Courses", id: "curriculum" },
                  { name: "Features", id: "features" },
                  { name: "About", id: "methodology" },
                  { name: "Contact", id: "enterprise" }
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
