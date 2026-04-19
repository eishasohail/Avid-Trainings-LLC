"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { RadialIntro } from '@/components/animate-ui/components/community/radial-intro';
import { RadialNav } from '@/components/animate-ui/components/community/radial-nav';
import { DUMMY_COURSES, getPublishedCourses } from '@/lib/data/dummyData';

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

const StatCounter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
    viewport={{ once: true }}
    className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white border border-[#00685f]/15 rounded-full mb-8 shadow-sm group hover:border-[#00685f]/30 transition-colors"
  >
    <div className="w-1.5 h-1.5 rounded-full bg-[#00685f]/40 group-hover:bg-[#00685f] transition-colors animate-pulse" />
    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00685f]">{text}</span>
  </motion.div>
);

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const sections = ["home", "features", "curriculum", "methodology", "enterprise"];
  const { scrollYProgress } = useScroll();

  const featuredCourses = useMemo(() => getPublishedCourses().slice(0, 3), []);

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
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-14">
            <button onClick={() => scrollToSection('home')} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#131b2e] rounded-xl flex items-center justify-center text-white transition-all group-hover:scale-105 group-hover:rotate-6 shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-[#131b2e] tracking-tighter">Avid <span className="text-[#00685f]">Trainings</span></span>
            </button>
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
            <Link href="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-[#6d7a77] hover:text-[#00685f] transition-all">Login</Link>
            <Link href="/register" className="px-8 py-3 bg-[#131b2e] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-[#00685f] hover:translate-y-[-2px] active:translate-y-0 transition-all">
              Get Started
            </Link>
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
             <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#00685f]/5 blur-[120px] rounded-full animate-pulse" />
             <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#00bfa5]/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 text-center space-y-16">
            <SectionNotice text="ISO Certified Academy 2026" />

            <div className="space-y-8">
                <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl sm:text-8xl md:text-[9rem] font-black text-[#131b2e] tracking-tighter leading-[0.85]"
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

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-24 max-w-4xl mx-auto">
              <StatCounter value={50} label="Premium Courses" suffix="+" />
              <StatCounter value={1200} label="Professionals" suffix="+" />
              <StatCounter value={98} label="Success Rate" suffix="%" />
              <StatCounter value={24} label="Support" suffix="/7" />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-64 px-8 bg-white relative overflow-hidden">
           <div className="max-w-7xl mx-auto space-y-32">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                 {[
                   { title: "Course Builder", desc: "Engaging ISO standards translated into interactive, retention-optimized paths.", icon: Layers, color: "bg-[#ebfaf8]" },
                   { title: "Progress Analytics", desc: "Live tracking and performance metrics to keep your learning goals on schedule.", icon: Activity, color: "bg-[#f0fdf4]" },
                   { title: "Data Security", desc: "Enterprise-grade protection for your professional and corporate training data.", icon: ShieldCheck, color: "bg-[#fffaf0]" },
                   { title: "Global Accessibility", desc: "Seamless course delivery across any device, anywhere in the world.", icon: Globe2, color: "bg-[#f5faff]" },
                   { title: "Expert Support", desc: "Access to compliance specialists to guide you through complex certification steps.", icon: MessageCircle, color: "bg-[#fef2f2]" },
                   { title: "Recognition", desc: "Industry-recognized seals and certificates to validate your professional expertise.", icon: Trophy, color: "bg-[#fffbeb]" },
                 ].map((feat, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -10 }}
                      className="p-12 bg-[#fafcfc] border border-[#00685f]/5 rounded-[44px] space-y-8 transition-all hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,104,95,0.08)] group"
                    >
                       <div className={`w-16 h-16 ${feat.color} rounded-2xl flex items-center justify-center text-[#131b2e] shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                          <feat.icon className="w-8 h-8" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-2xl font-black text-[#131b2e] tracking-tight">{feat.title}</h3>
                          <p className="text-base font-medium text-[#6d7a77] leading-relaxed">{feat.desc}</p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* CURRICULUM */}
        <section id="curriculum" className="py-64 px-8 bg-[#fafcfc] relative">
           <div className="max-w-7xl mx-auto space-y-32 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-16">
                 <div className="space-y-10">
                   <SectionNotice text="Featured Courses" />
                   <h2 className="text-5xl md:text-8xl font-black text-[#131b2e] tracking-tighter leading-[0.85]">
                      Premier <br/> ISO <span className="text-[#00685f]">Library.</span>
                   </h2>
                 </div>
                 <p className="max-w-[320px] text-xl font-semibold text-[#6d7a77] leading-relaxed italic opacity-70">
                    A curated selection of the world's most sought-after ISO certifications.
                 </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 {featuredCourses.map((course, i) => {
                    const grads = [
                      "from-[#131b2e] to-[#0b514c]",
                      "from-[#00685f] to-[#00bfa5]",
                      "from-[#00bfa5] to-emerald-400"
                    ];
                    return (
                      <motion.div 
                        key={course.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        onClick={() => router.push(`/courses/${course.id}`)}
                        className="group bg-white border border-[#00685f]/5 rounded-[56px] overflow-hidden shadow-sm hover:shadow-[0_60px_120px_-20px_rgba(0,104,95,0.12)] transition-all duration-1000 flex flex-col cursor-pointer"
                      >
                         <div className={`h-[300px] bg-gradient-to-br ${grads[i % grads.length]} p-14 flex flex-col justify-between relative group-hover:scale-105 transition-transform duration-1000`}>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                            <div className="flex justify-between items-start relative z-10">
                               <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.4em]">{course.isoStandard}</span>
                               <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#00685f] transition-all">
                                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                            <h4 className="text-4xl font-black text-white tracking-[0.1em] leading-none uppercase relative z-10">{course.isoStandard}</h4>
                         </div>
                         <div className="p-14 flex flex-col justify-between flex-1 relative bg-white">
                            <div className="space-y-6">
                               <h3 className="text-3xl font-black text-[#131b2e] group-hover:text-[#00685f] transition-all duration-500">{course.title}</h3>
                               <p className="text-base font-medium text-[#6d7a77] line-clamp-2 leading-relaxed">{course.description}</p>
                               <div className="inline-block px-3 py-1 bg-[#f0f4f4] text-[#00685f] text-[9px] font-black uppercase tracking-widest rounded-lg">
                                  {course.category}
                               </div>
                            </div>
                            <div className="flex items-center pt-10 border-t border-[#f0f4f4] mt-8">
                               <div 
                                className="px-10 py-4 border-2 border-[#131b2e]/5 text-[#131b2e] rounded-2xl text-[11px] font-black uppercase tracking-widest group-hover:border-[#00685f] group-hover:bg-[#00685f] group-hover:text-white transition-all duration-500 shadow-sm flex items-center gap-3"
                               >
                                  View Course <ArrowRight className="w-4 h-4" />
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    );
                 })}
              </div>

              <div className="flex justify-center pt-8">
                 <button 
                  onClick={() => router.push('/courses')}
                  className="text-[#00685f] text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:gap-4 transition-all"
                 >
                    Explore All Courses <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </section>

        {/* METHODOLOGY */}
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
                      { title: "Create Account", desc: "Join our community of compliance professionals and start your certification journey today.", icon: User, color: "bg-blue-500" },
                      { title: "Enroll in Course", desc: "Choose from our wide range of ISO certification courses tailored to your professional needs.", icon: Layers, color: "bg-[#00685f]" },
                      { title: "Learn at Your Pace", desc: "Engage with interactive content and track your learning progress with real-time analytics.", icon: Activity, color: "bg-[#00bfa5]" },
                      { title: "Earn Certificate", desc: "Receive industry-recognized ISO certifications that validate your expertise and drive career growth.", icon: Award, color: "bg-amber-400" },
                    ].map((step, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 1, y: 30 }}
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

        {/* ENTERPRISE */}
        <section id="enterprise" className="py-48 px-10 bg-white relative overflow-hidden flex flex-col items-center">
           <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-24 relative z-10">
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
           </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-64 px-10 bg-[#fafcfc] relative overflow-hidden text-center flex flex-col items-center">
           <div className="max-w-6xl mx-auto relative z-10 space-y-24 flex flex-col items-center">
              <div className="space-y-10">
                 <SectionNotice text="Start Your Journey" />
                 <h2 className="text-6xl md:text-[9rem] font-black text-[#131b2e] tracking-tighter leading-[0.8] mb-8">
                    Ready to <br className="md:hidden" /> <span className="text-[#00685f]">Certify?</span>
                 </h2>
                 <p className="text-xl font-medium text-[#6d7a77] max-w-xl mx-auto">
                    Join thousands of compliance leaders and start your certification journey today with our expert-led platform.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-6">
                 <Link href="/register" className="w-full sm:w-auto px-20 py-8 bg-[#131b2e] text-white rounded-[32px] text-lg font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-[#00685f] hover:translate-y-[-4px] active:translate-y-0 transition-all">
                    Register Free
                 </Link>
                 <button className="w-full sm:w-auto px-16 py-8 bg-white border border-[#131b2e]/10 text-[#131b2e] rounded-[32px] text-lg font-black uppercase tracking-[0.4em] shadow-sm hover:border-[#131b2e] hover:shadow-xl transition-all">
                    Contact Sales
                 </button>
              </div>
           </div>
        </section>
      </main>

      <footer className="bg-white py-48 px-8 border-t border-[#00685f]/5 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-32">
            <div className="space-y-12 group">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-[#131b2e] rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform group-hover:rotate-[15deg]">
                   <ShieldCheck className="w-8 h-8" />
                 </div>
                 <span className="text-3xl font-black text-[#131b2e] tracking-tighter leading-none">Avid <span className="text-[#00685f]">Trainings</span></span>
               </div>
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
