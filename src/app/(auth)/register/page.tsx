import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Register | Avid Trainings LLC",
  description: "Create your Avid Trainings account and begin your ISO certification journey.",
};

function BrandingPanel() {
  return (
    <section className="hidden lg:flex flex-col justify-between w-1/2 min-h-screen p-16 xl:p-24 relative z-10 bg-white shadow-[20px_0_40px_rgba(0,104,95,0.05)] rounded-r-[3rem] border-r border-[#bcc9c6]/30 overflow-hidden">
      {/* Super clean architectural backdrop */}
      <div className="absolute inset-0 bg-[#fbfcfc] z-0" />
      
      {/* Bubble Gradients inside Branding Panel */}
      <div className="absolute top-[10%] -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#00685f]/15 to-[#008378]/5 blur-[80px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#e0f2f1] to-transparent blur-[100px] pointer-events-none mix-blend-multiply" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <header className="flex items-center gap-3 animate-fade-in-up">
          <div className="w-10 h-10 bg-[#00685f] flex items-center justify-center rounded-lg shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="text-white font-bold text-lg relative z-10">A</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#131b2e]">
            Avid Trainings LLC
          </span>
        </header>

        <div className="max-w-xl animate-fade-in-up stagger-1 py-12">
          <h1 className="text-5xl xl:text-6xl font-extrabold text-[#131b2e] leading-[1.1] tracking-tight mb-6">
            Join the <br />
            <span className="text-[#00685f]">Professional</span> <br />
            Atelier.
          </h1>
          <p className="text-[#3d4947] text-lg leading-relaxed">
            Precision in compliance starts with architectural rigor. Begin your certification journey within our refined learning ecosystem.
          </p>
          
          {/* Screenshot-Inspired Glass ISO Standard Badge */}
          <div className="mt-12 group animate-fade-in-up stagger-2">
            <div className="inline-flex items-center gap-5 p-5 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] animate-float">
              <div className="w-14 h-14 rounded-full bg-white/80 border-2 border-white flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                 <ShieldCheck className="w-7 h-7 text-[#00685f]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00685f]/80 block mb-1">Standard 9001:2015</span>
                <p className="text-[13px] font-bold text-[#131b2e]">Verified ISO Compliance</p>
                <p className="text-[11px] font-medium text-[#565e74]">Learning Environment</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="flex items-center gap-5 text-[#3d4947] text-[11px] uppercase tracking-wide animate-fade-in-up stagger-2 mt-auto">
          <span>© 2026 Avid Trainings LLC</span>
          <span className="w-1 h-1 bg-[#bcc9c6] rounded-full" />
          <Link href="/privacy" className="hover:text-[#00685f] transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-[#00685f] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Privacy Policy</Link>
          <span className="w-1 h-1 bg-[#bcc9c6] rounded-full" />
          <Link href="/status" className="hover:text-[#00685f] transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-[#00685f] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Infrastructure Status</Link>
        </footer>
      </div>
    </section>
  );
}

export default function RegisterPage() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#00685f] via-[#008378] to-[#00685f] z-[100] shadow-[0_4px_15px_rgba(0,104,95,0.3)] bg-[length:200%_auto] animate-gradient" />
      
      {/* Retro Grid & Bubbles Canvas */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#f3f6f8]">
        {/* Retro perspective grid rising UP instead of down */}
        <div 
          className="absolute inset-[0_-100%] h-[200%] bottom-[40%] origin-bottom opacity-20 pointer-events-none"
          style={{
            transform: 'perspective(500px) rotateX(-60deg)',
            backgroundImage: `
              linear-gradient(to right, #008378 1px, transparent 1px),
              linear-gradient(to top, #008378 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem'
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#f3f6f8] via-[#f3f6f8]/80 to-transparent pointer-events-none h-1/2 bottom-0 absolute" />
        
        {/* Colorful gradient bubble in the main background area */}
        <div className="absolute top-[20%] left-[5%] w-[800px] h-[800px] bg-gradient-to-br from-[#00685f]/[0.05] via-[#008378]/[0.08] to-transparent rounded-full blur-[120px] pointer-events-none" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col lg:flex-row items-stretch">
        <BrandingPanel />

        <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden">
          <header className="lg:hidden w-full max-w-md mb-10 flex flex-col items-center text-center relative z-10 animate-fade-in-up">
            <div className="w-12 h-12 bg-[#00685f] flex items-center justify-center rounded-xl shadow-lg mb-3">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h2 className="text-xl font-bold text-[#131b2e]">Avid Trainings LLC</h2>
          </header>
          
          <div className="relative z-10 w-full flex justify-center animate-fade-in-up stagger-1">
            <RegisterForm />
          </div>
        </section>
      </main>
    </>
  );
}
