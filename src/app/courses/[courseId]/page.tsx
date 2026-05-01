"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Clock,
  BarChart2,
  Star,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Users,
  BookOpen,
  Infinity,
  CheckSquare,
  Monitor,
  Play,
  ChevronLeft,
  CheckCircle,
  Award,
  ArrowRight
} from "lucide-react";
import { getAllCourses } from '@/lib/utils/courseUtils';
import { 
  getLearnerCountForCourse, 
  DUMMY_COURSES,
  Course
} from '@/lib/data/dummyData';
import { auth } from "@/lib/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PublicCourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  const [user] = useAuthState(auth);

  const [course, setCourse] = useState<Course | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [relatedThumbnails, setRelatedThumbnails] = useState<Record<string, string>>({});
  const nextCourses = useMemo(() => {
    if (courseId === 'course-001') return ['course-002', 'course-003'];
    if (courseId === 'course-002') return ['course-001', 'course-004'];
    if (courseId === 'course-003') return ['course-004', 'course-002'];
    if (courseId === 'course-004') return ['course-003', 'course-001'];
    return [];
  }, [courseId]);

  const otherSuggested = useMemo(() => getAllCourses().filter(c => nextCourses.includes(c.id)), [nextCourses]);
  const moreBySyra = useMemo(() => getAllCourses().filter(c => c.id !== courseId && c.status === 'published'), [courseId]);


  useEffect(() => {
    const allCourses = getAllCourses();
    const found = allCourses.find(c => c.id === courseId);
    if (!found) {
      router.push('/courses');
      return;
    }
    setCourse(found);
    if (found.sections && found.sections.length > 0) {
      setExpandedSections([found.sections[0].id]);
    }

    // Check enrollment status
    if (typeof window !== 'undefined' && user) {
      const existing = localStorage.getItem('avid-enrolled-courses');
      const enrolled = existing ? JSON.parse(existing) : [];
      setIsEnrolled(enrolled.includes(courseId));

      // Load main thumbnail
      const savedThumb = localStorage.getItem(`avid-thumbnail-${found.id}`);
      if (savedThumb) setThumbnail(savedThumb);

      // Load related thumbnails
      const map: Record<string, string> = {};
      const relatedIds = [...moreBySyra.map(c => c.id), ...otherSuggested.map(c => c.id)];
      relatedIds.forEach(id => {
        const saved = localStorage.getItem(`avid-thumbnail-${id}`);
        if (saved) map[id] = saved;
      });
      setRelatedThumbnails(map);
    }
  }, [courseId, router, user, moreBySyra, otherSuggested]);

  const handleEnroll = () => {
    if (typeof window === 'undefined') return;

    if (!user) {
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }
    
    const existing = localStorage.getItem('avid-enrolled-courses');
    const enrolled: string[] = existing ? JSON.parse(existing) : [];
    
    if (!enrolled.includes(courseId)) {
      enrolled.push(courseId);
      localStorage.setItem('avid-enrolled-courses', JSON.stringify(enrolled));
      localStorage.setItem(
        `avid-progress-${courseId}`,
        JSON.stringify({ completedLectures: [] })
      );
    }
    
    router.push(`/dashboard/learn/${courseId}`);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(prev => prev === faqId ? null : faqId);
  };

  const courseRating = useMemo(() => {
    const ratings: Record<string, number> = {
      'course-001': 4.8,
      'course-002': 4.6,
      'course-003': 4.5,
      'course-004': 4.7
    };
    return ratings[courseId] || 4.7;
  }, [courseId]);

  const learningOutcomes = useMemo(() => {
    if (courseId === 'course-001') return [
      "Understand ISMS framework and scope",
      "Identify and assess information security risks",
      "Implement ISO 27001 controls effectively",
      "Prepare for Lead Auditor certification"
    ];
    if (courseId === 'course-002') return [
      "Understand Quality Management principles",
      "Apply process-based approach to QMS",
      "Conduct internal quality audits",
      "Prepare for ISO 9001 certification"
    ];
    if (courseId === 'course-003') return [
      "Identify workplace hazards and risks",
      "Implement OH&S management controls",
      "Understand legal compliance requirements",
      "Build a safety culture in your organization"
    ];
    if (courseId === 'course-004') return [
      "Understand environmental management systems",
      "Identify environmental aspects and impacts",
      "Implement sustainability practices",
      "Prepare for ISO 14001 certification"
    ];
    return ["Master the core principles of this standard", "Implement practical compliance frameworks", "Prepare for professional certification"];
  }, [courseId]);

  const whoIsThisFor = useMemo(() => {
    if (courseId === 'course-001') return [
      "IT Security professionals seeking ISO 27001 certification",
      "Compliance officers managing information security"
    ];
    if (courseId === 'course-002') return [
      "Quality managers implementing QMS in their organization",
      "Professionals preparing for ISO 9001 audit"
    ];
    if (courseId === 'course-003') return [
      "Health and safety officers and managers",
      "Operations managers responsible for workplace safety"
    ];
    if (courseId === 'course-004') return [
      "Environmental managers and sustainability officers",
      "Professionals seeking ISO 14001 certification"
    ];
    return ["Professionals looking to advance their career", "Managers responsible for compliance"];
  }, [courseId]);

  const prerequisites = useMemo(() => {
    if (courseId === 'course-001' || courseId === 'course-003') return [
      "Basic understanding of management systems",
      "No technical background required"
    ];
    return [
      "No prior experience required",
      "Open to all professionals"
    ];
  }, [courseId]);

  const faqs = useMemo(() => [
    {
      question: "Do I get a certificate after completing this course?",
      answer: "Yes, you will receive a Certificate of Completion upon finishing all lectures."
    },
    {
      question: "What are the prerequisites for this course?",
      answer: (courseId === 'course-001' || courseId === 'course-003') 
        ? "Basic understanding of management systems recommended." 
        : "No prior experience required. Suitable for beginners."
    }
  ], [courseId]);



  if (!course) return null;

  const totalLectures = course.sections.reduce((sum, s) => sum + s.lectures.length, 0);

  return (
    <div className="min-h-screen bg-[#fafcfc] font-sans selection:bg-[#00685f]/15 overflow-x-hidden antialiased text-[#11221f]">
      
      {/* Public Navbar */}
      <nav className="fixed top-0 inset-x-0 z-[1000] bg-white/80 backdrop-blur-xl border-b border-[#00685f]/5 py-4 shadow-sm">
        <div className="max-w-[1600px] w-full mx-auto px-8 xl:px-12 flex items-center justify-between">
          <Logo 
            size="sm" 
            destination={user ? '/dashboard' : '/'} 
          />
          <div className="flex items-center gap-8">
            {user ? (
               <button
                 onClick={() => router.push('/dashboard')}
                 className="px-6 py-2.5 bg-[#00685f] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#131b2e] transition-all"
               >
                 Go to Dashboard
               </button>
            ) : (
               <>
                 <Link href="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-[#6d7a77] hover:text-[#00685f] transition-all">Login</Link>
                 <Link href="/register" className="px-8 py-3 bg-[#131b2e] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-[#00685f] hover:translate-y-[-2px] active:translate-y-0 transition-all">
                   Get Started
                 </Link>
               </>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 relative bg-[#f7f9fb]">
        {/* Breadcrumb & Back */}
        <div className="max-w-7xl mx-auto px-8 py-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#565e74] font-black uppercase tracking-widest">
            <button 
              onClick={() => router.push('/courses')}
              className="hover:text-[#00685f] transition-colors flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> All Courses
            </button>
            <span className="text-[#bcc9c6]">/</span>
            <span className="text-[#131b2e] whitespace-normal break-words">{course.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-[#131b2e] text-white py-20 px-8 overflow-hidden rounded-[40px] max-w-7xl mx-auto mb-12 shadow-2xl">
          {thumbnail ? (
            <img src={thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
          ) : (
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00685f] rounded-full blur-[120px]"></div>
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00685f] rounded-full blur-[100px]"></div>
            </div>
          )}
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#00685f]/20 text-[#00685f] border border-[#00685f]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <Shield className="w-4 h-4" />
              {course.isoStandard} CERTIFIED
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-none uppercase whitespace-normal break-words">
              {course.title}
            </h1>
            <div className="flex flex-wrap gap-8 items-center text-[11px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2 text-[#00685f]">
                <Clock className="w-4 h-4" />
                {totalLectures} Lectures
              </div>
              <div className="flex items-center gap-2 text-[#bcc9c6]">
                <BarChart2 className="w-4 h-4" />
                {course.category}
              </div>
              <div className="flex items-center gap-2 text-white">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {courseRating}/5 Rating
              </div>
            </div>
          </div>
        </section>

        {/* Grid Content Wrapper */}
        <div className="max-w-7xl mx-auto px-8 relative grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-2 space-y-20">
            
            {/* About This Course */}
            <article>
              <div className="space-y-6 mb-12">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00685f]">Course Description</h2>
                 <h3 className="text-3xl font-black text-[#131b2e] tracking-tight uppercase">About this Course</h3>
              </div>
              <p className="text-[#565e74] leading-relaxed text-lg mb-10 font-medium">
                {course.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningOutcomes.map((item, index) => (
                  <div key={index} className="p-8 bg-white rounded-3xl border border-[#bcc9c6]/30 shadow-sm hover:shadow-xl hover:border-[#00685f]/30 transition-all group">
                    <ShieldCheck className="w-8 h-8 text-[#00685f] mb-6 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-black text-[#131b2e] leading-relaxed uppercase">{item}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* Who This Course Is For */}
            <section>
               <div className="space-y-6 mb-12">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00685f]">Target Audience</h2>
                  <h3 className="text-3xl font-black text-[#131b2e] tracking-tight uppercase">Who this course is for</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {whoIsThisFor.map((item, index) => (
                     <div key={index} className="p-8 bg-white border border-[#bcc9c6]/30 rounded-3xl flex items-start gap-5 hover:shadow-xl transition-all">
                        <CheckCircle className="w-6 h-6 text-[#00685f] shrink-0" />
                        <p className="text-sm font-black text-[#131b2e] uppercase leading-tight">{item}</p>
                     </div>
                  ))}
               </div>
            </section>

            {/* Prerequisites */}
            <section>
               <div className="space-y-6 mb-12">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00685f]">Requirements</h2>
                  <h3 className="text-3xl font-black text-[#131b2e] tracking-tight uppercase">Prerequisites</h3>
               </div>
               <div className="bg-white border border-[#bcc9c6]/30 rounded-[40px] p-10 space-y-6">
                  {prerequisites.map((item, index) => (
                     <div key={index} className="flex items-center gap-4 text-sm font-black text-[#131b2e] uppercase tracking-wide">
                        <CheckCircle className="w-5 h-5 text-[#00685f]" />
                        {item}
                     </div>
                  ))}
               </div>
            </section>

            {/* Course Structure */}
            <section>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
                <div className="space-y-3">
                   <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00685f]">Curriculum</h2>
                   <h3 className="text-3xl font-black text-[#131b2e] tracking-tight uppercase">Course Structure</h3>
                </div>
                <span className="text-[10px] font-black text-[#6d7a77] uppercase tracking-widest px-6 py-3 bg-white border border-[#bcc9c6]/30 rounded-2xl shadow-sm">
                  {course.sections.length} Sections • {totalLectures} Lectures
                </span>
              </div>
              <div className="space-y-5">
                {course.sections.map((section, idx) => (
                  <div key={section.id} className="bg-white rounded-3xl border border-[#bcc9c6]/30 overflow-hidden shadow-sm transition-all hover:border-[#00685f]/30">
                    <div 
                      onClick={() => toggleSection(section.id)}
                      className="p-8 flex items-center justify-between cursor-pointer bg-white hover:bg-[#ebfaf8] transition-colors group"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-[11px] font-black text-[#00685f] bg-[#00685f]/5 px-3 py-2 rounded-xl border border-[#00685f]/10">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-black text-xl text-[#131b2e] uppercase tracking-tight group-hover:text-[#00685f] transition-colors whitespace-normal break-words">{section.title}</h4>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedSections.includes(section.id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-6 h-6 text-[#bcc9c6] group-hover:text-[#00685f]" />
                      </motion.div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedSections.includes(section.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-[#f0f4f4] bg-[#fafcfc]"
                        >
                          <div className="py-4">
                            {section.lectures.map((lecture) => (
                              <div key={lecture.id} className="px-10 py-5 flex items-center justify-between hover:bg-white hover:shadow-inner transition-colors group cursor-default">
                                <div className="flex items-center gap-4">
                                  <BookOpen className="text-[#bcc9c6] group-hover:text-[#00685f] w-5 h-5 transition-colors" />
                                  <span className="text-sm font-black text-[#565e74] group-hover:text-[#131b2e] transition-colors uppercase tracking-wide whitespace-normal break-words">
                                    {lecture.title}
                                  </span>
                                </div>
                                <span className="text-[9px] font-black text-[#bcc9c6] uppercase tracking-widest">{lecture.pages} Pages</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>

            {/* Instructor */}
            <section className="p-12 bg-[#131b2e] rounded-[48px] text-white shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00685f]/5 rounded-bl-[120px]" />
              <div className="space-y-12 relative z-10">
                 <div className="space-y-3">
                    <h2 className="text-[11px] text-[#00d1b2] uppercase tracking-[0.5em] font-black">About the Instructor</h2>
                    <h3 className="text-3xl font-black tracking-tight uppercase">Meet Your Instructor</h3>
                 </div>
                 <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                   <div className="w-40 h-40 rounded-[40px] bg-gradient-to-br from-[#00685f] to-[#01a69a] flex items-center justify-center text-6xl font-black shadow-2xl ring-8 ring-[#131b2e]/50 ring-offset-4 ring-offset-[#131b2e] shrink-0">
                     S
                   </div>
                   <div className="text-center md:text-left space-y-6">
                     <div>
                       <h3 className="text-3xl font-black uppercase tracking-tight">Syra</h3>
                       <p className="font-black text-xs mt-2 uppercase tracking-widest text-[#00d1b2]">ISO Standards Specialist</p>
                     </div>
                     <p className="text-slate-400 text-base leading-relaxed max-w-xl font-medium">
                       Certified ISO professional with expertise across multiple ISO management standards. Passionate about making compliance accessible and practical for organizations of all sizes.
                     </p>
                     <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                       <div className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 backdrop-blur-md border border-white/5 shadow-inner">
                         <Users className="w-4 h-4 text-[#00d1b2]" />
                         {getLearnerCountForCourse(courseId).toLocaleString()} Learners
                       </div>
                       <div className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 backdrop-blur-md border border-white/5 shadow-inner">
                         <BookOpen className="w-4 h-4 text-[#00d1b2]" />
                         {DUMMY_COURSES.length} Courses
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </section>

            {/* Reviews Section */}
            <section>
               <div className="flex items-center justify-between mb-12">
                 <div className="space-y-3">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00685f]">Feedback</h2>
                    <h3 className="text-3xl font-black text-[#131b2e] tracking-tight uppercase">Learner Reviews</h3>
                 </div>
                 <div className="text-right">
                    <div className="text-4xl font-black text-[#131b2e]">{courseRating}</div>
                    <div className="flex items-center gap-0.5 mt-1">
                       {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(courseRating) ? 'text-yellow-500 fill-yellow-500' : 'text-[#bcc9c6]'}`} />
                       ))}
                    </div>
                    <div className="text-[9px] font-black text-[#6d7a77] uppercase tracking-widest mt-2">3 Reviews</div>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Ifra", rating: 5, date: "Apr 10, 2026", text: "Excellent course, very well structured and easy to follow. Highly recommend!" },
                    { name: "Menahil", rating: 4, date: "Apr 11, 2026", text: "Great content and practical examples. Helped me understand the standard clearly." },
                    { name: "Maryam", rating: 5, date: "Apr 12, 2026", text: "Very informative. The instructor explains everything in a simple way." }
                  ].map((review, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-[#bcc9c6]/30 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-black uppercase tracking-widest text-[#131b2e]">{review.name}</span>
                          <div className="flex">
                             {[...Array(5)].map((_, j) => (
                                <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-[#bcc9c6]'}`} />
                             ))}
                          </div>
                       </div>
                       <p className="text-sm font-medium text-[#565e74] leading-relaxed italic mb-6 flex-1">"{review.text}"</p>
                       <span className="text-[10px] font-black text-[#bcc9c6] uppercase tracking-[0.2em]">{review.date}</span>
                    </div>
                  ))}
               </div>
            </section>

            {/* FAQ */}
            <section>
              <div className="space-y-3 mb-12">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00685f]">Help Center</h2>
                 <h3 className="text-3xl font-black text-[#131b2e] tracking-tight uppercase">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-5">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-[#bcc9c6]/30 overflow-hidden hover:border-[#00685f]/30 transition-all shadow-sm">
                    <button
                      onClick={() => toggleFaq(`faq-${idx}`)}
                      className="w-full p-8 flex items-center justify-between font-black text-left text-[#131b2e] uppercase tracking-tight hover:bg-[#ebfaf8] transition-colors group"
                    >
                      <span className="group-hover:text-[#00685f] transition-colors">{faq.question}</span>
                      <motion.div animate={{ rotate: expandedFaq === `faq-${idx}` ? 180 : 0 }}>
                        <ChevronDown className="w-6 h-6 text-[#bcc9c6]" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedFaq === `faq-${idx}` && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-[#fafcfc] border-t border-[#f0f4f4]"
                        >
                          <div className="p-8 text-[#565e74] leading-relaxed font-medium">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>

            {/* More by Syra */}
            <section>
               <div className="space-y-3 mb-10">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00685f]">Instructor Profile</h2>
                  <h3 className="text-3xl font-black text-[#131b2e] tracking-tight uppercase">More by Syra</h3>
               </div>
               <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
                  {moreBySyra.map(c => (
                     <div 
                        key={c.id} 
                        onClick={() => router.push(`/courses/${c.id}`)}
                        className="min-w-[320px] bg-white rounded-[40px] border border-[#bcc9c6]/30 p-8 shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all cursor-pointer group shrink-0 relative overflow-hidden"
                      >
                         {relatedThumbnails[c.id] && (
                           <img src={relatedThumbnails[c.id]} alt={c.title} className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity" />
                         )}
                         <div className="relative z-10">
                           <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00685f]/5 text-[#00685f] rounded-full text-[9px] font-black uppercase tracking-widest border border-[#00685f]/10 mb-6">
                              {c.isoStandard}
                           </div>
                           <h4 className="text-xl font-black text-[#131b2e] uppercase leading-tight group-hover:text-[#00685f] transition-colors mb-4 whitespace-normal break-words">{c.title}</h4>
                           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#6d7a77]">
                              <span>{c.category}</span>
                              <span>{getLearnerCountForCourse(c.id)} Learners</span>
                           </div>
                         </div>
                      </div>
                  ))}
               </div>
            </section>

            {/* What to Take Next */}
            <section>
               <div className="space-y-3 mb-10">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00685f]">Progression Path</h2>
                  <h3 className="text-3xl font-black text-[#131b2e] tracking-tight uppercase">What to Take Next</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {otherSuggested.map(c => (
                     <div 
                        key={c.id} 
                        onClick={() => router.push(`/courses/${c.id}`)}
                        className="bg-white rounded-[40px] border border-[#bcc9c6]/30 p-10 shadow-sm hover:shadow-2xl hover:border-[#00685f]/30 transition-all cursor-pointer group relative overflow-hidden"
                      >
                         {relatedThumbnails[c.id] && (
                           <img src={relatedThumbnails[c.id]} alt={c.title} className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity" />
                         )}
                         <div className="relative z-10">
                           <div className="w-14 h-14 bg-[#ebfaf8] rounded-2xl flex items-center justify-center text-[#00685f] mb-8 shadow-inner group-hover:scale-110 transition-transform">
                              <Award className="w-8 h-8" />
                           </div>
                           <h4 className="text-2xl font-black text-[#131b2e] uppercase leading-tight group-hover:text-[#00685f] transition-colors mb-4 whitespace-normal break-words">{c.title}</h4>
                           <p className="text-[11px] font-black uppercase tracking-widest text-[#6d7a77]">{c.isoStandard} • {c.category}</p>
                         </div>
                      </div>
                  ))}
               </div>
            </section>
          </div>

          {/* Right Column (Sidebar CTA) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-10">
              
              <div className="bg-white rounded-[40px] border border-[#bcc9c6]/40 overflow-hidden shadow-2xl shadow-[#131b2e]/10 animate-fade-in stagger-3">
                <div className="aspect-[4/3] relative bg-[#131b2e] overflow-hidden group">
                  {thumbnail ? (
                    <img src={thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#131b2e] to-[#00685f] opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Play className="w-16 h-16 text-white/40 drop-shadow-2xl" />
                  </div>
                </div>
                
                <div className="p-10">
                  <div className="space-y-1 mb-8">
                     <p className="text-[10px] font-black text-[#6d7a77] uppercase tracking-[0.3em]">{getLearnerCountForCourse(courseId)} learners enrolled</p>
                  </div>

                  <button 
                    onClick={handleEnroll}
                    className="w-full py-6 bg-[#00685f] text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#00685f]/20 hover:bg-[#131b2e] active:scale-95 transition-all mb-10 flex items-center justify-center gap-3"
                  >
                    {isEnrolled ? "Continue Learning" : "Enroll Now"} <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-[#565e74] uppercase tracking-[0.5em] mb-8">This course includes:</p>
                    
                    <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-widest text-[#131b2e] group/item transition-all">
                      <div className="w-10 h-10 rounded-2xl bg-[#ebfaf8] flex items-center justify-center border border-[#00685f]/10 shadow-inner group-hover/item:scale-110 transition-transform">
                        <CheckSquare className="w-5 h-5 text-[#00685f]" />
                      </div>
                      <span className="flex-1 opacity-70 group-hover/item:opacity-100 transition-opacity">Certificate of Completion</span>
                    </div>

                    <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-widest text-[#131b2e] group/item transition-all">
                      <div className="w-10 h-10 rounded-2xl bg-[#ebfaf8] flex items-center justify-center border border-[#00685f]/10 shadow-inner group-hover/item:scale-110 transition-transform">
                        <Infinity className="w-5 h-5 text-[#00685f]" />
                      </div>
                      <span className="flex-1 opacity-70 group-hover/item:opacity-100 transition-opacity">Full Lifetime Access</span>
                    </div>

                    <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-widest text-[#131b2e] group/item transition-all">
                      <div className="w-10 h-10 rounded-2xl bg-[#ebfaf8] flex items-center justify-center border border-[#00685f]/10 shadow-inner group-hover/item:scale-110 transition-transform">
                        <Monitor className="w-5 h-5 text-[#00685f]" />
                      </div>
                      <span className="flex-1 opacity-70 group-hover/item:opacity-100 transition-opacity">Access on All Devices</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white py-24 px-8 border-t border-[#00685f]/5 text-center flex flex-col items-center">
         <div className="mb-8">
            <Logo size="md" destination="top" />
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">
              Back to top
            </p>
         </div>
         <p className="text-sm font-bold text-[#bcc9c6]">© 2026 Avid Trainings LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
