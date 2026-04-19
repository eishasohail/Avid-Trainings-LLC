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
    { label: "My Courses", icon: BookOpen, href: "/dashboard/courses", roles: ["learner", "creator", "admin"] },
    { label: "Course Library", icon: Library, href: "/dashboard/library", roles: ["learner", "creator", "admin"] },
    { label: "Editor", icon: PenSquare, href: "/dashboard/editor", roles: ["creator", "admin"] },
    { label: "Publications", icon: Library, href: "/dashboard/publications", roles: ["creator", "admin"] },
    { label: "Analytics", icon: BarChart2, href: "/dashboard/analytics", roles: ["creator", "admin"] },
    { label: "Admin Panel", icon: ShieldCheck, href: "/dashboard/admin", roles: ["admin"] },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#131b2e]/20 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#bcc9c6]/40 z-50 flex flex-col transition-transform duration-500 shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative px-6 py-8 flex flex-col h-full overflow-hidden z-10">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#00685f] flex items-center justify-center rounded-lg shadow-sm shrink-0">
                <span className="text-white font-black text-base">A</span>
              </div>
              <div>
                <h1 className="font-extrabold text-[#191c1e] tracking-tight text-lg leading-none">
                  Avid Trainings
                </h1>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#6d7a77] font-bold mt-1">
                  Precision Learning
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-[#6d7a77] hover:text-[#191c1e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 px-3 py-3 text-sm font-semibold transition-all duration-300 rounded-r-lg border-l-4 ${
                    isActive
                      ? "border-[#00685f] bg-[#00685f]/10 text-[#00685f]"
                      : "border-transparent text-[#3d4947] hover:bg-[#f7f9fb] hover:text-[#191c1e]"
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-[#00685f]" : "text-[#6d7a77] group-hover:scale-110"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-[#bcc9c6]/40 space-y-1.5 shrink-0">
             <Link
               href="/dashboard/profile"
               onClick={() => setIsOpen(false)}
               className="group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold tracking-wide hover:bg-[#f7f9fb] text-[#3d4947] hover:text-[#191c1e] transition-all rounded-lg border-l-4 border-transparent"
             >
               <User className="w-5 h-5 text-[#6d7a77] group-hover:scale-110 transition-transform duration-300" />
               <span>Profile</span>
             </Link>
             <button
               onClick={handleLogout}
               className="w-full group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold tracking-wide hover:bg-red-50 text-red-600 hover:text-red-700 transition-all rounded-lg border-l-4 border-transparent"
             >
               <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
               <span>Sign Out</span>
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}
