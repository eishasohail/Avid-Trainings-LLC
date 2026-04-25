import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PenSquare,
  Library,
  BarChart2,
  ShieldCheck,
  User,
  LogOut,
  X,
} from "lucide-react";
import { logout } from "@/lib/services/authService";
import Logo from '@/components/shared/Logo';
import type { AuthUser } from "@/lib/types/auth";

export default function Sidebar({
  isOpen,
  setIsOpen,
  user,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: AuthUser;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", roles: ["learner", "creator", "admin"] },
    { label: "My Courses", icon: BookOpen, href: "/dashboard/my-courses", roles: ["learner", "creator", "admin"] },
    { label: "Course Library", icon: Library, href: "/dashboard/library", roles: ["learner", "creator", "admin"] },
    { label: "Editor", icon: PenSquare, href: "/dashboard/editor", roles: ["creator", "admin"] },
    { label: "Publications", icon: Library, href: "/dashboard/publications", roles: ["creator", "admin"] },
    { label: "Analytics", icon: BarChart2, href: "/dashboard/analytics", roles: ["creator", "admin"] },
    { label: "Admin Panel", icon: ShieldCheck, href: "/dashboard/admin", roles: ["admin"] },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-[#131b2e]/60 z-40 md:hidden backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#bcc9c6]/40 z-50 flex flex-col transition-transform duration-500 shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="px-6 py-5 flex items-center justify-between shrink-0 border-b border-[#bcc9c6]/10">
          <Logo size="sm" destination="/" />
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-[#6d7a77] p-2 hover:bg-black/5 rounded-lg transition-all"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Area - Teal Background */}
        <div className="flex-1 bg-[#00685f] flex flex-col overflow-hidden">
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3.5 text-[12px] font-black uppercase tracking-[0.1em] transition-all duration-300 rounded-xl ${
                    isActive
                      ? "bg-white/20 text-white shadow-xl shadow-black/5"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-white" : "text-white/40 group-hover:scale-110 group-hover:text-white"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 pb-6 space-y-1 shrink-0">
             <div className="h-[1px] bg-white/10 mx-2 mb-4" />
             <Link
               href="/dashboard/profile"
               onClick={() => setIsOpen(false)}
               className="group flex items-center gap-3 px-4 py-3.5 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 text-white/70 hover:text-white transition-all rounded-xl"
             >
               <User className="w-4 h-4 text-white/40 group-hover:scale-110 transition-transform duration-300" />
               <span>Profile Details</span>
             </Link>
             <button
               onClick={handleLogout}
               className="w-full group flex items-center gap-3 px-4 py-3.5 text-[11px] font-black uppercase tracking-widest hover:bg-red-500/20 text-red-100 hover:text-white transition-all rounded-xl"
             >
               <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
               <span>End Session</span>
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}
