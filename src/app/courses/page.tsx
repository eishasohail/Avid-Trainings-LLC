"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { getPublishedCourses } from '@/lib/data/dummyData';
import { getAllCourses } from "@/lib/utils/courseUtils";
import Logo from "@/components/shared/Logo"

export default function PublicCoursesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  const allPublished = useMemo(() => getAllCourses().filter(c => c.status === 'published'), []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const map: Record<string, string> = {};
      allPublished.forEach(c => {
        const saved = localStorage.getItem(`avid-thumbnail-${c.id}`);
        if (saved) map[c.id] = saved;
      });
      setThumbnails(map);
    }
  }, [allPublished]);

  const courses = useMemo(() => {
    return allPublished.filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.isoStandard.toLowerCase().includes(search.toLowerCase())
    );
  }, [allPublished, search]);

  return (
    <div className="min-h-screen bg-[#fafcfc] font-sans selection:bg-[#00685f]/15 overflow-x-hidden antialiased text-[#11221f]">
      {/* Public Navbar (Copied from Landing Page) */}
      <nav className="fixed top-0 inset-x-0 z-[1000] bg-white/80 backdrop-blur-xl border-b border-[#00685f]/5 py-4 shadow-sm">
        <div className="max-w-[1600px] w-full mx-auto px-8 xl:px-12 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-8">
            <Link href="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-[#6d7a77] hover:text-[#00685f] transition-all">Login</Link>
            <Link href="/register" className="px-8 py-3 bg-[#131b2e] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-[#00685f] hover:translate-y-[-2px] active:translate-y-0 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-32 px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white border border-[#00685f]/15 rounded-full shadow-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#00685f]/40 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00685f]">Experience the Standard</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-[#131b2e] tracking-tighter leading-none">
                  ISO Certification <br/> <span className="text-[#00685f]">Catalog.</span>
                </h1>
             </div>
             <div className="relative group w-full md:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bcc9c6] group-focus-within:text-[#00685f] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-[#bcc9c6]/40 rounded-2xl text-sm outline-none focus:border-[#00685f] shadow-sm transition-all font-bold text-[#131b2e]"
                />
             </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {courses.map((course, i) => {
              const grads = [
                "from-[#131b2e] to-[#0b514c]",
                "from-[#00685f] to-[#00bfa5]",
                "from-[#00bfa5] to-emerald-400"
              ];
              return (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white border border-[#00685f]/5 rounded-[56px] overflow-hidden shadow-sm hover:shadow-[0_60px_120px_-20px_rgba(0,104,95,0.12)] transition-all duration-1000 flex flex-col cursor-pointer"
                  onClick={() => router.push(`/courses/${course.id}`)}
                >
                   <div className={`h-[240px] bg-gradient-to-br ${grads[i % grads.length]} p-8 flex flex-col justify-between relative group-hover:scale-105 transition-transform duration-1000`}>
                      {thumbnails[course.id] ? (
                        <img src={thumbnails[course.id]} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                      )}
                      <div className="flex justify-between items-start relative z-10">
                        <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 shadow-lg">
                          <span className="text-[10px] font-black text-[#131b2e] uppercase tracking-widest">{course.isoStandard}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-[#00685f] group-hover:border-[#00685f] transition-all duration-500 shadow-md">
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                   </div>
                   <div className="p-12 flex flex-col justify-between flex-1 relative bg-white">
                      <div className="space-y-6">
                         <h3 className="text-2xl font-black text-[#131b2e] group-hover:text-[#00685f] transition-all duration-500 whitespace-normal break-words">{course.title}</h3>
                         <p className="text-sm font-medium text-[#6d7a77] leading-relaxed whitespace-normal break-words">{course.description}</p>
                         <div className="inline-block px-3 py-1 bg-[#f0f4f4] text-[#00685f] text-[9px] font-black uppercase tracking-widest rounded-lg">
                            {course.category}
                         </div>
                      </div>
                      <div className="flex items-center justify-between pt-10 border-t border-[#f0f4f4] mt-8">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#131b2e] group-hover:text-[#00685f] transition-colors">Learn More</span>
                         <div className="w-10 h-10 rounded-xl bg-[#f0f4f4] flex items-center justify-center text-[#131b2e] group-hover:bg-[#00685f] group-hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                         </div>
                      </div>
                   </div>
                </motion.div>
              );
            })}
          </div>

          {courses.length === 0 && (
            <div className="py-32 text-center space-y-6 bg-white border border-[#bcc9c6]/30 rounded-[40px]">
               <div className="w-20 h-20 bg-[#f7f9fb] rounded-full flex items-center justify-center mx-auto text-[#bcc9c6]">
                  <Search className="w-8 h-8" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-[#131b2e] uppercase tracking-tight">No courses found</h3>
                 <p className="text-sm font-medium text-[#6d7a77]">Try searching for a different standard or topic.</p>
               </div>
               <button 
                onClick={() => setSearch("")}
                className="px-8 py-3 bg-[#00685f]/10 text-[#00685f] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00685f] hover:text-white transition-all"
               >
                 Clear Search
               </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white py-24 px-8 border-t border-[#00685f]/5 text-center">
         <p className="text-sm font-bold text-[#bcc9c6]">© 2026 Avid Trainings LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
