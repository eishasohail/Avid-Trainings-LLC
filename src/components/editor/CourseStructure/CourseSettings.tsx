"use client";

import { Camera, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Course } from "@/lib/data/dummyData";

interface CourseSettingsProps {
  course: Course;
  sectionsCount: number;
  lecturesCount: number;
  pagesCount: number;
  onDeleteCourse: () => void;
  onUpdateMetadata: (fields: Partial<Course>) => void;
}

export default function CourseSettings({ 
  course, 
  sectionsCount, 
  lecturesCount, 
  pagesCount, 
  onDeleteCourse,
  onUpdateMetadata
}: CourseSettingsProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  
  // Load thumbnail from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`avid-thumbnail-${course.id}`);
      if (saved) setThumbnail(saved);
    }
  }, [course.id]);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setThumbnail(base64String);
        localStorage.setItem(`avid-thumbnail-${course.id}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const totalMinutes = pagesCount * 3;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <aside className="w-full xl:w-[420px] shrink-0 sticky top-32 space-y-10 order-1 xl:order-2 animate-fade-in-up stagger-2">
      <div className="bg-white/70 backdrop-blur-xl border border-[#bcc9c6]/30 rounded-[48px] overflow-hidden shadow-2xl p-10 space-y-12">
        <header className="space-y-4">
           <h2 className="text-3xl font-black text-[#191c1e] tracking-tight uppercase">Settings</h2>
        </header>

        <div className="space-y-6">
           <div className="relative aspect-[16/10] bg-gradient-to-br from-[#131b2e] to-[#00685f] rounded-[32px] overflow-hidden group shadow-inner">
              {thumbnail ? (
                <img src={thumbnail} alt="Course Thumbnail" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                     <div className="w-16 h-16 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl flex items-center justify-center text-white/40 shadow-2xl">
                        <Camera className="w-8 h-8" />
                     </div>
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Upload Thumbnail</p>
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <label className="px-8 py-3 bg-white text-[#191c1e] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all cursor-pointer hover:bg-[#00685f] hover:text-white">
                    Upload Identity
                    <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                 </label>
              </div>
           </div>
        </div>

        <div className="space-y-10">
           <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] ml-4">ISO Standard</label>
                 <div className="relative">
                    <select 
                      value={course.isoStandard}
                      onChange={(e) => onUpdateMetadata({ isoStandard: e.target.value })}
                      className="w-full px-8 py-5 bg-[#f7f9fb] border border-[#bcc9c6]/30 rounded-2xl outline-none focus:border-[#00685f] transition-all font-bold text-[#191c1e] appearance-none cursor-pointer"
                    >
                       {['ISO 27001', 'ISO 9001', 'ISO 45001', 'ISO 14001', 'ISO 50001', 'ISO 31000'].map(std => (
                          <option key={std} value={std}>{std}</option>
                       ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d7a77] pointer-events-none" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] ml-4">Category</label>
                 <div className="relative">
                    <select 
                      value={course.category}
                      onChange={(e) => onUpdateMetadata({ category: e.target.value })}
                      className="w-full px-8 py-5 bg-[#f7f9fb] border border-[#bcc9c6]/30 rounded-2xl outline-none focus:border-[#00685f] transition-all font-bold text-[#191c1e] appearance-none cursor-pointer"
                    >
                       <option>Beginner</option>
                       <option>Intermediate</option>
                       <option>Advanced</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d7a77] pointer-events-none" />
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] ml-4">Status</label>
              <div className="flex bg-[#f7f9fb] border border-[#bcc9c6]/30 p-1.5 rounded-2xl">
                 <button 
                  onClick={() => onUpdateMetadata({ status: 'draft' })}
                  className={`flex-1 py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${course.status === 'draft' ? 'bg-[#131b2e] text-white shadow-xl' : 'text-[#6d7a77] hover:text-[#191c1e]'}`}
                 >
                    Draft
                 </button>
                 <button 
                  onClick={() => onUpdateMetadata({ status: 'published' })}
                  className={`flex-1 py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${course.status === 'published' ? 'bg-[#00685f] text-white shadow-xl' : 'text-[#6d7a77] hover:text-[#191c1e]'}`}
                 >
                    Published
                 </button>
              </div>
           </div>
        </div>

        <div className="border-t border-[#bcc9c6]/20 pt-10 space-y-8">
           <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#6d7a77]">Course Stats</h3>
           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-[#f7f9fb] border border-[#bcc9c6]/20 rounded-3xl space-y-1 transition-all hover:border-[#00685f]/20">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6d7a77]">Total Sections</p>
                 <p className="text-xl font-black text-[#131b2e]">{sectionsCount}</p>
              </div>
              <div className="p-6 bg-[#f7f9fb] border border-[#bcc9c6]/20 rounded-3xl space-y-1 transition-all hover:border-[#00685f]/20">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6d7a77]">Total Lectures</p>
                 <p className="text-xl font-black text-[#131b2e]">{lecturesCount}</p>
              </div>
              <div className="p-6 bg-[#f7f9fb] border border-[#bcc9c6]/20 rounded-3xl space-y-1 transition-all hover:border-[#00685f]/20">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6d7a77]">Total Pages</p>
                 <p className="text-xl font-black text-[#131b2e]">{pagesCount}</p>
              </div>
              <div className="p-6 bg-[#f7f9fb] border border-[#bcc9c6]/20 rounded-3xl space-y-1 transition-all hover:border-[#00685f]/20">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6d7a77]">Est. Runtime</p>
                 <p className="text-xl font-black text-[#131b2e]">{hours}h {mins}m</p>
              </div>
           </div>
        </div>

        <div className="pt-10 border-t border-[#bcc9c6]/20 space-y-6">
           <div className="p-10 border-2 border-red-500/10 bg-red-50/20 rounded-[40px] space-y-6 text-center">
              <div className="space-y-1">
                 <h3 className="text-lg font-black text-red-600 uppercase tracking-tighter">Delete Course</h3>
              </div>
              <button 
                onClick={onDeleteCourse}
                className="w-full py-5 bg-white border-2 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/5 active:scale-95"
              >
                 Delete Course
              </button>
           </div>
        </div>
      </div>
    </aside>
  );
}
