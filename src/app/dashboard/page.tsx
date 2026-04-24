"use client";

import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import LearnerDashboard from "@/components/dashboard/LearnerDashboard";
import CreatorDashboard from "@/components/dashboard/CreatorDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import type { AuthUser } from "@/lib/types/auth";

export default function DashboardPage() {
  return (
    <DashboardWrapper loadingMessage="Personalizing Workspace...">
      {(user: AuthUser) => {
        const normalizedRole = user.role.trim().toLowerCase();
        return (
          <div className="animate-fade-in-up">
            {normalizedRole === 'admin' && <AdminDashboard user={user} />}
            {normalizedRole === 'creator' && <CreatorDashboard user={user} />}
            {normalizedRole === 'learner' && <LearnerDashboard user={user} />}
          </div>
        );
      }}
    </DashboardWrapper>
  );
}