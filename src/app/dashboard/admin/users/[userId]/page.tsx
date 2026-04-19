"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ChevronLeft, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  Award, 
  Clock, 
  Star, 
  Play, 
  ChevronRight,
  ShieldCheck,
  Download,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Mail,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";

const dummyLearner = {
  id: 'u1',
  name: 'Fatima Sohail',
  email: 'fatima@gmail.com',
  avatar: 'F',
  role: 'learner',
  joinedDate: 'Apr 1, 2026',
  lastActive: '2 hours ago',
  totalTimeSpent: '24h 30m',
  learningStreak: 7,
};

const stats = [
  { label: 'Courses Enrolled', value: 3, icon: BookOpen, color: 'bg-blue-500' },
  { label: 'Courses Completed', value: 1, icon: CheckCircle, color: 'bg-emerald-500' },
  { label: 'Avg Progress', value: '68%', icon: TrendingUp, color: 'bg-[#00685f]' },
  { label: 'Certificates Earned', value: 1, icon: Award, color: 'bg-amber-500' },
];

const dummyCourseProgress = [
  {
    id: 'course-1',
    title: 'ISO 27001 Information Security',
    isoStandard: 'ISO 27001',
    enrolledDate: 'Apr 1, 2026',
    progress: 75,
    sectionsCompleted: 3,
    totalSections: 8,
    lecturesCompleted: 18,
    totalLectures: 42,
    status: 'In Progress',
    lastAccessed: '2 hours ago',
    quizScore: 85,
  },
  {
    id: 'course-2',
    title: 'ISO 9001 Quality Management',
    isoStandard: 'ISO 9001',
    enrolledDate: 'Mar 15, 2026',
    progress: 100,
    sectionsCompleted: 6,
    totalSections: 6,
    lecturesCompleted: 24,
    totalLectures: 24,
    status: 'Completed',
    lastAccessed: '1 week ago',
    quizScore: 92,
    certificateDate: 'Apr 5, 2026',
  },
  {
    id: 'course-3',
    title: 'ISO 45001 Health & Safety',
    isoStandard: 'ISO 45001',
    enrolledDate: 'Apr 8, 2026',
    progress: 20,
    sectionsCompleted: 1,
    totalSections: 7,
    lecturesCompleted: 5,
    totalLectures: 35,
    status: 'In Progress',
    lastAccessed: '3 days ago',
    quizScore: 70,
  },
];

const dummyQuizzes = [
  { course: 'ISO 27001', type: 'Multiple Choice', score: 85, date: 'Apr 5', passed: true },
  { course: 'ISO 27001', type: 'True or False', score: 90, date: 'Apr 3', passed: true },
  { course: 'ISO 9001', type: 'Multiple Choice', score: 92, date: 'Mar 28', passed: true },
  { course: 'ISO 45001', type: 'True or False', score: 70, date: 'Apr 9', passed: true },
];

const dummyActivity = [
  { action: 'Completed ISO 9001 course', time: '1 week ago', icon: CheckCircle, color: 'bg-emerald-500' },
  { action: 'Earned ISO 9001 Certificate', time: '1 week ago', icon: Award, color: 'bg-amber-500' },
  { action: 'Started ISO 45001 course', time: '5 days ago', icon: Play, color: 'bg-blue-500' },
  { action: 'Completed lecture: Risk Assessment', time: '3 days ago', icon: BookOpen, color: 'bg-[#00685f]' },
  { action: 'Scored 85% on ISO 27001 quiz', time: '2 days ago', icon: Star, color: 'bg-purple-500' },
  { action: 'Accessed ISO 27001 course', time: '2 hours ago', icon: Clock, color: 'bg-slate-500' },
];

const dummyCertificates = [
  {
    id: 'cert-1',
    name: 'ISO 9001 Quality Management Certificate',
    course: 'ISO 9001 Quality Management',
    earnedDate: 'Apr 5, 2026',
  }
];

export default function LearnerAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  return (
    <DashboardWrapper loadingMessage="Securely loading profile data...">
      {(user) => (
        <div className="space-y-10 animate-fade-in-up pb-20">
          
          {/* Top Section */}
          <header className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-[#565e74] font-semibold">
              <button 
                onClick={() => router.back()}
                className="hover:text-[#00685f] transition-colors flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <span className="text-[#bcc9c6]">/</span>
              <span>Analytics</span>
              <span className="text-[#bcc9c6]">/</span>
              <span className="text-[#131b2e]">Learner Profile</span>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#bcc9c6]/40 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#00685f]/5 blur-3xl rounded-full -translate-y-24 translate-x-24" />
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[28px] bg-[#00685f] flex items-center justify-center text-white text-3xl font-black shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                      {dummyLearner.avatar}
                    </div>
                    <div className="space-y-1.5">
                      <h1 className="text-3xl font-black text-[#191c1e] tracking-tight">{dummyLearner.name}</h1>
                      <p className="text-sm font-medium text-[#6d7a77] flex items-center gap-2">
                         <Mail className="w-4 h-4 text-[#bcc9c6]" /> {dummyLearner.email}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-1">
                        <span className="px-3 py-1 bg-[#131b2e] text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                          Learner
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6d7a77]">
                           <Calendar className="w-4 h-4" /> Joined {dummyLearner.joinedDate}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00685f]">
                           <Activity className="w-4 h-4" /> Active {dummyLearner.lastActive}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <div className="px-6 py-4 bg-[#f7f9fb] rounded-2xl border border-[#bcc9c6]/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] mb-1">Total Time Spent</p>
                        <p className="text-lg font-black text-[#131b2e]">{dummyLearner.totalTimeSpent}</p>
                     </div>
                     <div className="px-6 py-4 bg-[#00685f]/5 rounded-2xl border border-[#00685f]/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#00685f] mb-1">Learning Streak</p>
                        <p className="text-lg font-black text-[#00685f]">{dummyLearner.learningStreak} Days</p>
                     </div>
                  </div>
               </div>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-1">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-[#bcc9c6]/40 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] mb-0.5">{stat.label}</p>
                  <h3 className="text-3xl font-black text-[#191c1e]">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 stagger-2">
            
            {/* Left Column (60%) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Course Progress Section */}
              <section className="space-y-6">
                <h2 className="text-xl font-black text-[#191c1e] flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-[#00685f] flex items-center justify-center text-white">
                      <BookOpen className="w-4 h-4" />
                   </div>
                   Course Progress
                </h2>
                <div className="space-y-4">
                  {dummyCourseProgress.map((course) => (
                    <div key={course.id} className="bg-white border border-[#bcc9c6]/40 rounded-[32px] p-8 shadow-sm group hover:border-[#00685f]/40 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className="px-2.5 py-1 bg-[#131b2e]/5 text-[#131b2e] text-[9px] font-black uppercase tracking-widest rounded-lg border border-[#131b2e]/10">
                                {course.isoStandard}
                             </span>
                             <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${
                               course.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                             }`}>
                                {course.status}
                             </span>
                          </div>
                          <h3 className="text-xl font-black text-[#191c1e] group-hover:text-[#00685f] transition-colors">{course.title}</h3>
                        </div>
                        {course.status === 'Completed' && (
                          <div className="flex items-center gap-3 animate-bounce">
                             <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest">
                                <Award className="w-4 h-4" /> Certificate Issued
                             </div>
                             <button className="p-2 bg-white border border-[#bcc9c6]/40 rounded-xl hover:bg-[#00685f] hover:text-white transition-all">
                                <Download className="w-4 h-4" />
                             </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
                         <div className="lg:col-span-2 space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#6d7a77]">
                               <span>Overall Progress</span>
                               <span className="text-[#00685f]">{course.progress}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-[#f0f4f4] rounded-full overflow-hidden shadow-inner">
                               <div className="h-full bg-gradient-to-r from-[#00685f] to-[#01a69a] transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                            </div>
                         </div>
                         <div className="flex flex-col justify-center gap-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#bcc9c6]">Completion Breakdown</p>
                            <p className="text-sm font-black text-[#131b2e]">
                               {course.sectionsCompleted}/{course.totalSections} <span className="text-[#6d7a77] text-xs font-bold uppercase ml-1 tracking-widest">Sections</span>
                            </p>
                            <p className="text-[11px] font-medium text-[#6d7a77]">
                               {course.lecturesCompleted}/{course.totalLectures} Lectures finished
                            </p>
                         </div>
                         <div className="flex flex-col justify-center gap-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#bcc9c6]">Performance Metrics</p>
                            <div className="flex items-center gap-2">
                               <Star className="w-4 h-4 text-purple-500 fill-purple-500" />
                               <span className="text-sm font-black text-[#131b2e]">Quiz Score: {course.quizScore}%</span>
                            </div>
                            <p className="text-[11px] font-medium text-[#6d7a77]">
                               Enrolled {course.enrolledDate}
                            </p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quiz Performance Table Section */}
              <section className="bg-white rounded-[40px] border border-[#bcc9c6]/40 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-[#bcc9c6]/10 flex items-center justify-between bg-[#fcfdfe]">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00685f]" />
                    <h3 className="text-xl font-black text-[#191c1e]">Quiz Performance</h3>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#f7f9fb] text-[10px] font-black uppercase tracking-widest text-[#6d7a77] border-b border-[#bcc9c6]/20">
                        <th className="px-8 py-5">Course</th>
                        <th className="px-8 py-5">Quiz Type</th>
                        <th className="px-8 py-5">Score</th>
                        <th className="px-8 py-5">Date</th>
                        <th className="px-8 py-5">Pass/Fail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#bcc9c6]/10">
                      {dummyQuizzes.map((quiz, idx) => (
                        <tr key={idx} className="hover:bg-[#fcfdfe] transition-colors">
                          <td className="px-8 py-5 border-l-4 border-transparent hover:border-[#00685f]">
                             <span className="text-sm font-black text-[#131b2e]">{quiz.course}</span>
                          </td>
                          <td className="px-8 py-5">
                             <span className="text-xs font-bold text-[#6d7a77] uppercase tracking-widest">{quiz.type}</span>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <div className="h-1.5 w-12 bg-[#f0f4f4] rounded-full overflow-hidden">
                                   <div className={`h-full ${quiz.score >= 80 ? 'bg-[#00685f]' : 'bg-amber-500'}`} style={{ width: `${quiz.score}%` }} />
                                </div>
                                <span className="text-sm font-black text-[#131b2e]">{quiz.score}%</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-[#6d7a77]">{quiz.date}</td>
                          <td className="px-8 py-5">
                             <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                               quiz.passed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                             }`}>
                                {quiz.passed ? 'Passed' : 'Failed'}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right Column (40%) */}
            <div className="space-y-8">
              
              {/* Activity Timeline */}
              <section className="bg-[#131b2e] rounded-[40px] p-10 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00685f]/20 blur-3xl rounded-full translate-x-12 -translate-y-12" />
                <h3 className="text-xl font-black mb-10 flex items-center gap-3 relative z-10">
                   <Activity className="w-6 h-6 text-[#00685f]" /> Activity Timeline
                </h3>
                <div className="space-y-10 relative px-2 z-10">
                   <div className="absolute left-[26px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-white/20 via-[#00685f]/40 to-white/20" />
                   {dummyActivity.map((item, i) => (
                      <div key={i} className="relative pl-14 group/timeline">
                         <div className={`absolute left-0 top-0 w-10 h-10 rounded-2xl ${item.color} border-4 border-[#131b2e] flex items-center justify-center z-10 shadow-lg group-hover/timeline:scale-125 transition-transform`}>
                            <item.icon className="w-5 h-5 text-white" />
                         </div>
                         <div className="space-y-1 transform group-hover/timeline:translate-x-1 transition-transform">
                            <h4 className="text-[13px] font-black leading-tight">{item.action}</h4>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</span>
                         </div>
                      </div>
                   ))}
                </div>
              </section>

              {/* Certificates Section */}
              <section className="space-y-6">
                <h3 className="text-xl font-black text-[#191c1e] flex items-center gap-3">
                   <Award className="w-6 h-6 text-amber-500" /> Earned Certificates
                </h3>
                <div className="space-y-4">
                  {dummyCertificates.map((cert) => (
                    <div key={cert.id} className="bg-white border border-[#bcc9c6]/40 rounded-[32px] p-8 shadow-sm group hover:border-amber-500/40 transition-all duration-500">
                       <div className="flex items-start gap-4 mb-6">
                          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 border border-amber-100 group-hover:rotate-12 transition-transform">
                             <Award className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="text-base font-black text-[#191c1e] group-hover:text-amber-600 transition-colors leading-tight">{cert.name}</h4>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] mt-1">{cert.course}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between pt-6 border-t border-[#bcc9c6]/10">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#bcc9c6]">Earned {cert.earnedDate}</span>
                          <button className="text-[10px] font-black uppercase tracking-widest text-[#00685f] flex items-center gap-2 hover:gap-3 transition-all">
                             Download PDF <ChevronRight className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

          </div>

        </div>
      )}
    </DashboardWrapper>
  );
}
