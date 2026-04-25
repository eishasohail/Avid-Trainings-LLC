"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Layers, BookOpen, Users, CheckCircle2, ShieldCheck } from "lucide-react";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { getAllCourses } from '@/lib/utils/courseUtils';
import { getLearnerCountForCourse } from '@/lib/data/dummyData';

export default function CourseLibraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search');

  const [enrollments, setEnrollments] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isoFilter, setIsoFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [isLoadingCourse, setIsLoadingCourse] = useState<string | null>(null);

  useEffect(() => {
    setEnrollments(JSON.parse(localStorage.getItem('enrollments') || '[]'));
  }, []);

  useEffect(() => {
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  const allCourses = useMemo(() => getAllCourses(), []);
  
  const publishedCourses = useMemo(() => {
    return allCourses.filter(c => c.status === 'published');
  }, [allCourses]);

  const isoOptions = useMemo(() => {
    const standards = allCourses.map(c => c.isoStandard);
    return Array.from(new Set(standards)).sort();
  }, [allCourses]);

  const levelOptions = useMemo(() => {
    const categories = allCourses.map(c => c.category);
    return Array.from(new Set(categories)).sort();
  }, [allCourses]);

  const isEnrolled = (courseId: string) => enrollments.includes(courseId);

  const filteredCourses = useMemo(() => {
    return publishedCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());
      const matchesISO = isoFilter === 'all' || course.isoStandard === isoFilter;
      const matchesLevel = levelFilter === 'all' || course.category === levelFilter;
      return matchesSearch && matchesISO && matchesLevel;
    });
  }, [publishedCourses, search, isoFilter, levelFilter]);

  const handleAction = (courseId: string) => {
    setIsLoadingCourse(courseId);
    if (isEnrolled(courseId)) {
      setTimeout(() => router.push(`/learn/${courseId}`), 400);
    } else {
      setTimeout(() => router.push(`/dashboard/library/${courseId}`), 400);
    }
  };

  return (
    <DashboardWrapper loadingMessage="Opening Global Library...">
      {() => (
        <div className="space-y-10 animate-fade-in-up pb-10">
          
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck className="w-6 h-6 text-[#00685f]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00685f]">Course Catalog</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter uppercase">Course Library</h1>
              <p className="text-sm sm:text-base font-medium text-[#6d7a77] mt-2">Explore our ISO certification courses and expand your professional expertise.</p>
            </div>
            <div className="text-[10px] font-black text-[#6d7a77] uppercase tracking-[0.2em] bg-white px-6 py-3 rounded-xl border border-[#bcc9c6]/40 shadow-sm">
              {filteredCourses.length} Courses Found
            </div>
          </header>

          {/* Filters Bar */}
          <div className="bg-white border border-[#bcc9c6]/40 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bcc9c6] group-focus-within:text-[#00685f] transition-colors" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#f7f9fb] border border-[#bcc9c6]/40 rounded-[20px] text-sm outline-none focus:border-[#00685f] focus:bg-white transition-all font-bold text-[#191c1e]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-56">
                <select 
                  value={isoFilter}
                  onChange={(e) => setIsoFilter(e.target.value)}
                  className="w-full pl-5 pr-12 py-4 bg-[#f7f9fb] border border-[#bcc9c6]/40 rounded-[20px] text-xs font-black text-[#131b2e] uppercase tracking-widest outline-none focus:border-[#00685f] appearance-none cursor-pointer"
                >
                  <option value="all">All Standards</option>
                  {isoOptions.map(iso => (
                    <option key={iso} value={iso}>{iso}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                  <Filter className="w-4 h-4 text-[#bcc9c6]" />
                </div>
              </div>
              <div className="relative w-full sm:w-48">
                <select 
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full pl-5 pr-12 py-4 bg-[#f7f9fb] border border-[#bcc9c6]/40 rounded-[20px] text-xs font-black text-[#131b2e] uppercase tracking-widest outline-none focus:border-[#00685f] appearance-none cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  {levelOptions.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                  <Layers className="w-4 h-4 text-[#bcc9c6]" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredCourses.map((course, idx) => {
              const lectureCount = course.sections.reduce((sum, s) => sum + s.lectures.length, 0);
              const learnerCount = getLearnerCountForCourse(course.id);
              
              return (
                <div key={course.id} className="group flex flex-col bg-white rounded-[40px] border border-[#bcc9c6]/40 overflow-hidden shadow-sm hover:shadow-3xl hover:border-[#00685f]/30 transition-all duration-700 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#131b2e]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#131b2e] to-[#00685f] opacity-80" />
                    <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                    
                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-3xl rounded-2xl border border-white/20 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-2xl">
                       {course.isoStandard}
                    </div>
                    
                    {isEnrolled(course.id) && (
                      <div className="absolute top-6 right-6 bg-[#00685f] p-3 rounded-2xl text-white shadow-2xl shadow-[#00685f]/40">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}

                    <div className="absolute bottom-6 left-6 flex gap-3">
                      <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black text-white flex items-center gap-2 border border-white/10 uppercase tracking-widest">
                        <Users className="w-3.5 h-3.5" />
                        {learnerCount} Learners
                      </div>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border bg-[#f7f9fb] text-[#6d7a77] border-[#bcc9c6]/30">
                        {course.category}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#191c1e] leading-tight mb-4 line-clamp-2 min-h-[64px] group-hover:text-[#00685f] transition-colors uppercase tracking-tight">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm font-medium text-[#6d7a77] line-clamp-2 mb-8 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-8 py-6 border-t border-[#f0f4f4] text-[#131b2e]">
                      <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest">
                        <Layers className="w-4 h-4 text-[#00685f]" />
                        {course.sections.length} Sections
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest">
                        <BookOpen className="w-4 h-4 text-[#00685f]" />
                        {lectureCount} Lectures
                      </div>
                    </div>

                    <button 
                      onClick={() => handleAction(course.id)}
                      className={`mt-6 w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                        isEnrolled(course.id)
                          ? "bg-[#131b2e] hover:bg-[#1f2937] text-white shadow-[#131b2e]/20"
                          : "bg-[#00685f] hover:bg-[#131b2e] text-white shadow-[#00685f]/20"
                      }`}
                    >
                      {isEnrolled(course.id) ? "Continue Learning" : "View Course"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center bg-white border border-[#bcc9c6]/30 rounded-[64px]">
              <div className="w-24 h-24 bg-[#f7f9fb] border-2 border-[#bcc9c6]/20 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <Search className="w-10 h-10 text-[#bcc9c6]" />
              </div>
              <h3 className="text-2xl font-black text-[#131b2e] uppercase tracking-tight">No courses found</h3>
              <p className="text-sm font-medium text-[#6d7a77] mt-3 max-w-sm">Try adjusting your filters or search keywords.</p>
              <button 
                onClick={() => { setSearch(''); setIsoFilter('all'); setLevelFilter('all'); }}
                className="mt-8 px-8 py-4 bg-[#00685f] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#131b2e] transition-all shadow-xl shadow-[#00685f]/20"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
    </DashboardWrapper>
  );
}
