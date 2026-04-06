"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/services/authService";
import type { AuthUser } from "@/lib/types/auth";
import PageTransitionLoader from "@/components/ui/PageTransitionLoader";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          if (pathname.startsWith("/dashboard")) {
            router.replace("/login");
          }
        } else {
          setUser(currentUser);
        }
      } catch (err) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return <PageTransitionLoader />;
  }

  if (!user && pathname.startsWith("/dashboard")) {
    return null;
  }

  return <>{children}</>;
}
