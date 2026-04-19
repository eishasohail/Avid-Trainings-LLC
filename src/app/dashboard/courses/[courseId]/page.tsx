"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ChevronLeft, 
  Edit3, 
  Users, 
  Layers, 
  BookOpen, 
  Target, 
  Activity, 
  Trash2, 
  CheckCircle2, 
  Clock,
  Layout,
  Info,
  X
} from "lucide-react";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { 
  getCourseById, 
  getEnrollmentsForCourse, 
  getLearnerCountForCourse,
  DUMMY_ENROLLMENTS,
  DUMMY_COURSES 
} from "@/lib/data/dummyData";
import { getAllCourses } from "@/lib/utils/courseUtils";

export default function CourseOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (courseId) {
      const allCourses = getAllCourses();
      const found = allCourses.find(c => c.id === courseId);
      if (found) {
        setCourse(found);
      }
    }
    setIsLoading(false);
  }, [courseId]);

  const handleToggleStatus = () => {
    if (!course) return;
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    const updatedCourse = { ...course, status: newStatus };

    const isDummy = DUMMY_COURSES.some(dc => dc.id === course.id);

    if (isDummy) {
      const overridesString = localStorage.getItem('avid-course-overrides');
      const overrides = overridesString ? JSON.parse(overridesString) : {};
      overrides[course.id] = { ...overrides[course.id], status: newStatus };
      localStorage.setItem('avid-course-overrides', JSON.stringify(overrides));
    } else {
      const stored = localStorage.getItem('avid-courses');
      const localCourses = stored ? JSON.parse(stored) : [];
      const updatedLocal = localCourses.map((c: any) => 
        c.id === course.id ? updatedCourse : c
      );
      localStorage.setItem('avid-courses', JSON.stringify(updatedLocal));
    }

    setCourse(updatedCourse);
  };

  const handleDeleteCourse = () => {
    if (!course) return;

    const isDummy = DUMMY_COURSES.some(dc => dc.id === course.id);

    if (isDummy) {
      const deletedString = localStorage.getItem('avid-deleted-courses');
      const deletedIds = deletedString ? JSON.parse(deletedString) : [];
      if (!deletedIds.includes(course.id)) {
        deletedIds.push(course.id);
        localStorage.setItem('avid-deleted-courses', JSON.stringify(deletedIds));
      }
    } else {
      const stored = localStorage.getItem('avid-courses');
      const localCourses = stored ? JSON.parse(stored) : [];
      const filtered = localCourses.filter((c: any) => c.id !== course.id);
      localStorage.setItem('avid-courses', JSON.stringify(filtered));
    }

    router.push('/dashboard/courses');
  };

  if (!course && !isLoading) {
    return (
      <DashboardWrapper>
        {() => (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
            <div className="w-20 h-20 rounded-3xl bg-[#f7f9fb] flex items-center justify-center mb-6 border border-[#bcc9c6]/40 shadow-inner">
               <Info className="w-10 h-10 text-[#bcc9c6]" />
            </div>
            <h2 className="text-2xl font-black text-[#191c1e] tracking-tight">Course not found</h2>
            <p className="text-[#6d7a77] mt-2 font-medium">The course you are looking for does not exist or has been removed.</p>
            <button 
              onClick={() => router.push('/dashboard/courses')}
              className="mt-10 px-10 py-4 bg-[#00685f] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#00685f]/20 hover:bg-[#004d46] transition-all active:scale-95"
            >
              Back to My Courses
            </button>
          </div>
        )}
      </DashboardWrapper>
    );
  }

  // Derive stats from dummyData
  const courseEnrollments = course ? getEnrollmentsForCourse(course.id) : [];
  const learnerCount = course ? getLearnerCountForCourse(course.id) : 0;
  const avgProgress = courseEnrollments.length > 0 
    ? Math.round(courseEnrollments.reduce((sum, e) => sum + e.progress, 0) / courseEnrollments.length)
    : 0;

  // Total counts
  const totalSections = course?.sections?.length || 0;
  const totalLectures = course?.sections?.reduce((acc: number, sec: any) => acc + sec.lectures.length, 0) || 0;

  return (
    <DashboardWrapper loadingMessage="Loading Course Analytics...">
      {(user) => (
        <div className="space-y-10 animate-fade-in-up pb-20">
          
          {/* Top Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-[#565e74] font-semibold">
                  <button 
                    onClick={() => router.push('/dashboard/courses')}
                    className="hover:text-[#00685f] transition-colors flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> My Courses
                  </button>
                  <span className="text-[#bcc9c6]">/</span>
                  <span className="text-[#131b2e] truncate max-w-[200px]">{course?.title}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h1 className="text-3xl sm:text-4xl font-black text-[#191c1e] tracking-tighter">
                    {course?.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#00685f]/10 text-[#00685f] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#00685f]/20">
                      {course?.isoStandard}
                    </span>
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
                      course?.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {course?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => router.push(`/dashboard/editor/${courseId}`)}
                  className="w-full sm:w-auto px-8 py-4 bg-[#00685f] text-white rounded-[20px] text-xs font-black uppercase tracking-widest hover:bg-[#004d46] transition-all shadow-xl shadow-[#00685f]/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Edit in Editor
                </button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-1">
            {[
              { label: "Total Enrolled Learners", value: learnerCount, icon: Users, color: "bg-blue-500" },
              { label: "Completion Rate", value: `${avgProgress}%`, icon: Target, color: "bg-purple-500" },
              { label: "Total Sections", value: totalSections, icon: Layers, color: "bg-[#00685f]" },
              { label: "Total Lectures", value: totalLectures, icon: BookOpen, color: "bg-amber-500" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-[#bcc9c6]/40 shadow-sm flex items-center gap-5 group hover:shadow-xl transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-black text-[#191c1e]">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 stagger-2">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Course Details Card */}
              <section className="bg-white rounded-[40px] border border-[#bcc9c6]/40 p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-[#bcc9c6]/10 pb-6">
                  <Info className="w-6 h-6 text-[#00685f]" />
                  <h3 className="text-xl font-black text-[#191c1e]">Course Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] mb-2">Description</p>
                      <p className="text-sm font-medium text-[#191c1e] leading-relaxed">{course?.description}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] mb-2">ISO Standard</p>
                      <span className="px-4 py-1.5 bg-[#f7f9fb] border border-[#bcc9c6]/30 rounded-lg text-xs font-bold text-[#131b2e]">
                        {course?.isoStandard}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] mb-2">Category</p>
                        <p className="text-sm font-bold text-[#131b2e]">{course?.category}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] mb-2">Status</p>
                        <p className="text-sm font-bold capitalize text-[#131b2e]">{course?.status}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] mb-2">Created</p>
                        <p className="text-sm font-bold text-[#131b2e]">{course?.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#6d7a77] mb-2">Last Updated</p>
                        <p className="text-sm font-bold text-[#131b2e]">{course?.updatedAt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recent Enrollments Table */}
              <section className="bg-white rounded-[40px] border border-[#bcc9c6]/40 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-[#bcc9c6]/10 flex items-center justify-between bg-[#fcfdfe]">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-[#00685f]" />
                    <h3 className="text-xl font-black text-[#191c1e]">Recent Enrollments</h3>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#f7f9fb] text-[10px] font-black uppercase tracking-widest text-[#6d7a77] border-b border-[#bcc9c6]/20">
                        <th className="px-8 py-5">Learner</th>
                        <th className="px-8 py-5">Enrolled</th>
                        <th className="px-8 py-5">Progress</th>
                        <th className="px-8 py-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#bcc9c6]/10">
                      {courseEnrollments.map((enr) => (
                        <tr key={enr.id} className="hover:bg-[#fcfdfe] transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#00685f]/10 flex items-center justify-center text-[10px] font-black text-[#00685f]">
                                {enr.learnerName.charAt(0)}
                              </div>
                              <span className="text-sm font-bold text-[#131b2e]">{enr.learnerName}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-medium text-[#6d7a77]">{enr.enrolledAt}</span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4 w-32">
                              <div className="h-1.5 flex-1 bg-[#f0f4f4] rounded-full overflow-hidden">
                                <div className="h-full bg-[#00685f]" style={{ width: `${enr.progress}%` }} />
                              </div>
                              <span className="text-[11px] font-black text-[#131b2e]">{enr.progress}%</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                             <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                               enr.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-[#131b2e]/5 text-[#131b2e] border-[#131b2e]/10'
                             }`}>
                               {enr.status}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              
              {/* Quick Actions Card */}
              <section className="bg-[#131b2e] rounded-[40px] p-8 shadow-2xl text-white space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00685f]/20 blur-3xl rounded-full" />
                <h3 className="text-xl font-black relative z-10">Quick Actions</h3>
                <div className="space-y-4 relative z-10">
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-400">Published Status</span>
                       <button 
                         onClick={handleToggleStatus}
                         className={`w-12 h-6 rounded-full transition-all relative ${course?.status === 'published' ? 'bg-[#00685f]' : 'bg-slate-700'}`}
                       >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${course?.status === 'published' ? 'right-1' : 'left-1'}`} />
                       </button>
                    </div>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-3"
                    >
                       <Trash2 className="w-4 h-4" /> Delete Course Permanently
                    </button>
                  </div>
                </div>
              </section>

            </div>
          </div>
          
          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 h-screen w-screen overflow-hidden">
              <div className="absolute inset-0 bg-[#131b2e]/60 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)} />
              <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                  <X className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-[#191c1e] mb-4">Are you sure?</h2>
                <p className="text-sm font-medium text-[#6d7a77] mb-10 leading-relaxed">
                  Are you sure you want to delete this course? This action cannot be undone.
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-5 bg-[#f7f9fb] text-[#6d7a77] rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#ebedef]"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteCourse}
                    className="flex-1 py-5 bg-red-500 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-red-600 shadow-xl shadow-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </DashboardWrapper>
  );
}
