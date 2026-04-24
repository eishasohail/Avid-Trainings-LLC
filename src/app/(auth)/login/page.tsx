import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/shared/Logo"

export const metadata: Metadata = {
  title: "Login | Avid Trainings LLC",
  description: "Sign in to your Avid Trainings secure corporate learning portal.",
};

function BrandingPanel() {
  return (
    <section className="hidden lg:flex flex-col justify-between w-1/2 p-16 xl:p-24 relative z-10 bg-white shadow-[20px_0_40px_rgba(0,104,95,0.05)] rounded-r-[3rem] border-r border-[#bcc9c6]/30 overflow-hidden">
      {/* Super clean architectural backdrop */}
      <div className="absolute inset-0 bg-[#fbfcfc] z-0" />
      
      {/* Gradient Bars inside Branding Panel */}
      <div className="absolute top-0 right-0 w-full h-[600px] opacity-20 pointer-events-none mix-blend-multiply flex gap-8 transform rotate-12 -translate-y-20 translate-x-40">
        <div className="h-full w-24 bg-gradient-to-b from-[#00685f]/80 to-transparent blur-3xl animate-pulse-slow" />
        <div className="h-full w-32 bg-gradient-to-b from-[#008378]/60 to-transparent blur-[40px]" />
      </div>
      
      <header className="flex items-center gap-3 relative z-10">
        <Logo size="lg" destination="/" />
      </header>

      <div className="max-w-xl relative z-10">
        <h1 className="text-5xl xl:text-6xl font-extrabold text-[#131b2e] leading-[1.1] tracking-tight mb-6 relative">
          Precision in <br />
          <span className="text-[#00685f]">Professional</span> <br />
          Development.
        </h1>
        <p className="text-[#3d4947] text-lg leading-relaxed">
          Access your secure corporate learning portal. Designed for high-performance
          teams managing ISO 9001:2015 and ISO 27001 compliance standards.
        </p>
        
        <div className="mt-10 flex items-center gap-8 animate-fade-in-up stagger-1">
          <div className="flex flex-col group cursor-default">
            <span className="text-2xl font-bold text-[#131b2e] group-hover:text-[#00685f] transition-colors duration-300">ISO 27001</span>
            <span className="text-[10px] uppercase tracking-widest text-[#3d4947] mt-0.5">Certified Security</span>
          </div>
          <div className="w-px h-10 bg-[#bcc9c6]/40" />
          <div className="flex flex-col group cursor-default">
            <span className="text-2xl font-bold text-[#131b2e] group-hover:text-[#00685f] transition-colors duration-300">99.9%</span>
            <span className="text-[10px] uppercase tracking-widest text-[#3d4947] mt-0.5">Uptime SLA</span>
          </div>
        </div>
      </div>

      {/* Floating LMS Element */}
      <div className="absolute right-[-15%] top-[25%] lg:right-[-20%] xl:right-10 pointer-events-none opacity-90 hidden xl:flex z-[50] animate-float">
        <div className="bg-white/80 backdrop-blur-xl border border-[#00685f]/20 rounded-2xl p-6 shadow-[0_32px_64px_-16px_rgba(0,104,95,0.15)] flex items-center gap-5 translate-x-12 hover:-translate-y-2 transition-transform duration-500 hover:shadow-[0_40px_80px_-16px_rgba(0,104,95,0.25)]">
           {/* Animated Circular Progress Indicator */}
           <div className="relative w-16 h-16 shrink-0">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" fill="none" stroke="#e0f2f1" strokeWidth="8" />
               <circle cx="50" cy="50" r="45" fill="none" stroke="#00685f" strokeWidth="8" strokeLinecap="round" className="animate-[dash_2.5s_cubic-bezier(0.4,0,0.2,1)_forwards] shadow-sm" strokeDasharray="283" strokeDashoffset="283" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-[#00685f] font-black text-[13px] absolute">78%</span>
             </div>
           </div>
           
           <div>
             <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#00685f] block mb-1">Learning Ecosystem</span>
             <h4 className="text-sm font-bold text-[#131b2e]">ISO Audit Training</h4>
             <div className="h-1.5 w-32 bg-[#e0f2f1] rounded-full mt-2 overflow-hidden shadow-inner">
               <div className="h-full bg-[#00685f] animate-[width_2.5s_cubic-bezier(0.4,0,0.2,1)_forwards]" style={{ width: '0%' }} key="progress" />
             </div>
             <style>{`@keyframes width { to { width: 78%; } }`}</style>
           </div>
        </div>
      </div>

      <footer className="flex items-center gap-5 text-[#3d4947] text-[11px] uppercase tracking-wide relative z-10">
        <span>© 2026 Avid Trainings LLC</span>
        <span className="w-1 h-1 bg-[#bcc9c6] rounded-full" />
        <Link href="/privacy" className="hover:text-[#00685f] transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-[#00685f] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Privacy Policy</Link>
        <span className="w-1 h-1 bg-[#bcc9c6] rounded-full" />
        <Link href="/status" className="hover:text-[#00685f] transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-[#00685f] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Infrastructure Status</Link>
      </footer>
    </section>
  );
}

export default function LoginPage() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#00685f] via-[#008378] to-[#00685f] z-[100] shadow-[0_4px_15px_rgba(0,104,95,0.3)] bg-[length:200%_auto] animate-gradient" />
      
      {/* Retro Grid & Gradient Canvas */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#f3f6f8]">
        {/* Retro perspective grid */}
        <div 
          className="absolute inset-[0_-100%] h-[200%] top-[40%] origin-top opacity-30 pointer-events-none"
          style={{
            transform: 'perspective(500px) rotateX(60deg)',
            backgroundImage: `
              linear-gradient(to right, #00685f 1px, transparent 1px),
              linear-gradient(to bottom, #00685f 1px, transparent 1px)
            `,
            backgroundSize: '3rem 3rem'
          }}
        />
        
        {/* Sky gradient to blend out the horizon of the grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3f6f8] via-[#f3f6f8]/80 to-transparent pointer-events-none h-1/2" />
        
        {/* Soft elegant gradient orbs to add SaaS feel */}
        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-gradient-to-bl from-[#00685f]/[0.06] via-[#008378]/[0.03] to-transparent rounded-full blur-[100px] pointer-events-none" />
      </div>
      
      <main className="relative z-10 min-h-screen flex flex-col lg:flex-row items-stretch">
        <BrandingPanel />
        <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden">
          
          <header className="lg:hidden w-full max-w-md mb-10 flex flex-col items-center text-center relative z-10 animate-fade-in-up">
            <Logo size="lg" className="mb-3" destination="/" />
          </header>
          
          <div className="relative z-10 w-full flex justify-center animate-fade-in-up stagger-1">
            <LoginForm />
          </div>
        </section>
      </main>
    </>
  );
}