"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerWithEmail, getRedirectPath } from "@/lib/services/authService";
import type { RegisterCredentials } from "@/lib/types/auth";

import { Mail, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";

// ─── Input Component (Moved outside to prevent losing focus) ───
const Input = ({
  id, label, type = "text", placeholder, value, onChange, icon, error: fieldError, isPassword, showPassword, onTogglePassword, isLoading,
}: {
  id: keyof RegisterCredentials;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  error?: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  isLoading?: boolean;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#131b2e] mb-1 block">
        {label}
      </label>
      {isPassword && label === "Password" && onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="text-[10px] font-bold text-[#00685f] hover:text-[#008378] tracking-widest uppercase transition-all duration-300 hover:tracking-[0.18em]"
          tabIndex={-1}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
    </div>
    <div className="relative group shadow-sm rounded-lg hover:shadow-md transition-all duration-300">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#565e74] group-focus-within:text-[#00685f] transition-all duration-300 flex items-center justify-center z-10 pointer-events-none">
        <span className="transition-transform duration-300 group-focus-within:scale-110 flex items-center justify-center">
          {icon}
        </span>
      </span>
      <input
        id={id}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={isLoading}
        className={`w-full pl-11 pr-4 py-3.5 bg-white/70 backdrop-blur-sm border rounded-lg text-sm text-[#131b2e] placeholder:text-[#6d7a77]/50 focus:bg-white focus:ring-4 focus:ring-[#00685f]/10 focus:border-[#00685f] transition-all duration-300 outline-none disabled:opacity-60 ${
          fieldError ? "border-red-400 ring-4 ring-red-100" : "border-[#bcc9c6]/60"
        }`}
      />
    </div>
    {fieldError && (
      <p className="text-[11px] text-red-500 font-medium">{fieldError}</p>
    )}
  </div>
);

// ─── Register Form ────────────────────────────────────────────
export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterCredentials>({
    firstName:       "",
    lastName:        "",
    email:           "",
    password:        "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterCredentials>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // ─── Handlers ───────────────────────────────────────────────
  const handleChange = (field: keyof RegisterCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = (): boolean => {
    const errors: Partial<RegisterCredentials> = {};
    if (!formData.firstName.trim())   errors.firstName = "First name is required";
    if (!formData.lastName.trim())    errors.lastName  = "Last name is required";
    if (!formData.email.trim())       errors.email     = "Email is required";
    if (!formData.password)           errors.password  = "Password is required";
    if (formData.password && formData.password.length < 6) errors.password  = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      setError("Passwords do not match. Please review your entries.");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0 && formData.password === formData.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setIsLoading(true);

    const result = await registerWithEmail(formData);

    if (result.success && result.user) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(result.error?.message ?? "Registration failed.");
      setIsLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass-panel border border-[#ffffff]/40 rounded-2xl p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,104,95,0.2)] flex flex-col items-center justify-center text-center transition-all bg-white/80">
          <div className="w-20 h-20 bg-[#e0f2f1] rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-[#ffffff]/30 animate-pulse-slow">
            <ShieldCheck className="w-10 h-10 text-[#00685f]" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[#131b2e] mb-2 tracking-tight">Account Created</h2>
          <p className="text-[#3d4947] text-sm font-medium mb-1">Your professional learning profile is ready.</p>
          <p className="text-[#00685f] text-xs font-bold uppercase tracking-widest">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel w-full max-w-md p-8 md:p-10 rounded-2xl shadow-[0_32px_64px_-16px_rgba(15,23,42,0.12)] border border-white/60">
      <header className="mb-0">
        <h2 className="text-2xl font-bold text-[#131b2e] tracking-tight">
          Create Account
        </h2>
        <p className="text-sm text-[#565e74] mt-2 mb-6">
          Enter your professional credentials to access the portal.
        </p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg animate-fade-in flex items-start gap-3 shadow-sm">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-medium text-red-800 leading-snug">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            label="First Name"
            placeholder="Alexander"
            value={formData.firstName}
            onChange={handleChange("firstName")}
            icon={<User className="w-4 h-4" strokeWidth={2.5} />}
            error={fieldErrors.firstName}
            isLoading={isLoading}
          />
          <Input
            id="lastName"
            label="Last Name"
            placeholder="Sterling"
            value={formData.lastName}
            onChange={handleChange("lastName")}
            icon={<User className="w-4 h-4" strokeWidth={2.5} />}
            error={fieldErrors.lastName}
            isLoading={isLoading}
          />
        </div>

        {/* Email */}
        <Input
          id="email"
          label="Work Email"
          type="email"
          placeholder="name@company.com"
          value={formData.email}
          onChange={handleChange("email")}
          icon={<Mail className="w-4 h-4" strokeWidth={2.5} />}
          error={fieldErrors.email}
          isLoading={isLoading}
        />

        {/* Password */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="password"
            label="Password"
            type="password"
            isPassword={true}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange("password")}
            icon={<Lock className="w-4 h-4" strokeWidth={2.5} />}
            error={fieldErrors.password}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            isLoading={isLoading}
          />
          <Input
            id="confirmPassword"
            label="Confirm"
            type="password"
            isPassword={true}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            icon={<ShieldCheck className="w-4 h-4" strokeWidth={2.5} />}
            error={fieldErrors.confirmPassword}
            showPassword={showPassword}
            isLoading={isLoading}
          />
        </div>

        {/* Submit */}
        <div className="pt-2 space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-[#00685f] to-[#008378] hover:to-[#00685f] text-white font-bold rounded-lg transition-all duration-500 shadow-[0_8px_20px_-6px_rgba(0,104,95,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(0,104,95,0.7)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            </span>
          </button>

          <div className="text-center font-medium">
            <Link href="/login" className="text-sm text-[#3d4947]">
              Already have an account?{" "}
              <span className="text-[#00685f] font-bold hover:text-[#008378] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#00685f] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
                Login here
              </span>
            </Link>
          </div>
        </div>
      </form>

      {/* Terms */}
      <div className="mt-8 pt-6 border-t border-[#bcc9c6]/30">
        <p className="text-[11px] text-center text-[#6d7a77] leading-relaxed px-4">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[#00685f]">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-[#00685f]">Privacy Policy</Link>
          {" "}within the LMS ecosystem.
        </p>
      </div>
    </div>
  );
}
