"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginWithEmail, loginWithGoogle, getRedirectPath } from "@/lib/services/authService";
import type { LoginCredentials } from "@/lib/types/auth";

import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null); // Clear error on typing
    setFormData((prev) => ({
      ...prev,
      [field]: field === "remember" ? e.target.checked : e.target.value,
    }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }
    setIsLoading(true);
    const result = await loginWithEmail(formData);
    if (result.success && result.user) {
      setIsSuccess(true);
      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push(getRedirectPath(result.user!.role));
        }
      }, 1500);
    } else {
      setError(result.error?.message ?? "Login failed.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    const result = await loginWithGoogle();
    if (result.success && result.user) {
      setIsSuccess(true);
      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push(getRedirectPath(result.user!.role));
        }
      }, 1500);
    } else {
      setError(result.error?.message ?? "Google login failed.");
      setIsGoogleLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass-panel border border-[#ffffff]/40 rounded-2xl p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,104,95,0.2)] flex flex-col items-center justify-center text-center transition-all bg-white/80">
          <div className="w-20 h-20 bg-[#e0f2f1] rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-[#ffffff]/30 animate-pulse-slow">
            <ShieldCheck className="w-10 h-10 text-[#00685f]" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[#131b2e] mb-2 tracking-tight">Access Granted</h2>
          <p className="text-[#3d4947] text-sm font-medium">Authenticating your secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="glass-panel border border-white/60 rounded-2xl p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.12)] transition-all duration-300">
        <div className="mb-8 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-[#131b2e] mb-1.5">Secure Login</h2>
          <p className="text-[#3d4947] text-sm">Please enter your credentials to access the atelier.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg animate-fade-in flex items-start gap-3 shadow-sm">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium text-red-800 leading-snug">{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[10px] font-bold text-[#131b2e] tracking-[0.15em] uppercase mb-1">
              Work Email
            </label>
            <div className="relative group shadow-sm rounded-lg hover:shadow-md transition-all duration-300">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#565e74] group-focus-within:text-[#00685f] transition-all duration-300 flex items-center justify-center z-10 pointer-events-none">
                <Mail className="w-4 h-4" strokeWidth={2.5} />
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange("email")}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3.5 bg-white/70 backdrop-blur-sm border border-[#bcc9c6]/60 rounded-lg text-sm text-[#131b2e] placeholder:text-[#6d7a77]/50 focus:bg-white focus:ring-4 focus:ring-[#00685f]/10 focus:border-[#00685f] transition-all duration-300 outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-[10px] font-bold text-[#131b2e] tracking-[0.15em] uppercase mb-1">
                Password
              </label>
              <Link href="/forgot-password" className="text-[10px] font-bold text-[#00685f] hover:text-[#008378] uppercase tracking-widest transition-all duration-300 hover:tracking-[0.18em]">
                Forgot Access?
              </Link>
            </div>
            <div className="relative group shadow-sm rounded-lg hover:shadow-md transition-all duration-300">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#565e74] group-focus-within:text-[#00685f] transition-all duration-300 flex items-center justify-center z-10 pointer-events-none">
                <Lock className="w-4 h-4 transition-transform duration-300 group-focus-within:scale-110" strokeWidth={2.5} />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange("password")}
                disabled={isLoading}
                className="w-full pl-11 pr-11 py-3.5 bg-white/70 backdrop-blur-sm border border-[#bcc9c6]/60 rounded-lg text-sm text-[#131b2e] placeholder:text-[#6d7a77]/50 focus:bg-white focus:ring-4 focus:ring-[#00685f]/10 focus:border-[#00685f] transition-all duration-300 outline-none disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6d7a77] hover:text-[#00685f] transition-colors flex items-center justify-center focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input
              id="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange("remember")}
              disabled={isLoading}
              className="w-4 h-4 rounded-sm border-[#bcc9c6] accent-[#00685f] cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-[#3d4947] cursor-pointer select-none">
              Maintain secure session for 30 days
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#00685f] to-[#008378] hover:to-[#00685f] text-white text-sm font-bold rounded-lg transition-all duration-500 shadow-[0_8px_20px_-6px_rgba(0,104,95,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(0,104,95,0.7)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in to Dashboard →"
            )}
            </span>
          </button>
        </form>

      </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#bcc9c6]/40" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 py-1 rounded-full border border-[#bcc9c6]/30 bg-white/60 backdrop-blur-md text-[10px] font-bold text-[#6d7a77] uppercase tracking-[0.2em] shadow-sm">
              Secured Integrations
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="group relative overflow-hidden flex items-center justify-center gap-2.5 py-3.5 bg-white/70 backdrop-blur-sm border border-[#bcc9c6]/60 rounded-lg hover:bg-white hover:border-[#00685f]/30 hover:shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {isGoogleLoading ? (
              <svg className="w-4 h-4 animate-spin text-[#6d7a77]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : <GoogleIcon />}
            <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#00685f] transition-colors">Google Workspace</span>
          </button>

          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2.5 py-3.5 bg-white/30 border border-[#bcc9c6]/20 rounded-lg opacity-50 cursor-not-allowed"
          >
            <span className="text-xs font-bold text-[#6d7a77]">Institutional SSO</span>
          </button>
        </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 px-2">
        <p className="text-xs text-[#3d4947] font-medium">
          New to Avid Trainings?{" "}
          <Link href="/register" className="text-[#00685f] font-bold hover:text-[#008378] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#00685f] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
            Register your institution
          </Link>
        </p>
        <div className="flex items-center gap-1.5 text-[#00685f]">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-widest">ISO 27001 Compliant</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={
        <div className="w-full max-w-md p-10 bg-white/50 animate-pulse rounded-2xl border border-white/20 h-[500px]" />
    }>
      <LoginFormContent />
    </Suspense>
  );
}
