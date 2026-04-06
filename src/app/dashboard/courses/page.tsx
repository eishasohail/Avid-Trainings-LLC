"use client";

import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import LearnerMyCourses from "@/components/dashboard/LearnerMyCourses";
import CreatorMyCourses from "@/components/dashboard/CreatorMyCourses";

export default function CoursesPage() {
  return (
    <DashboardWrapper loadingMessage="Securing Library...">
      {(user) => {
        const normalizedRole = user.role.trim().toLowerCase();
        return (
          <div className="animate-fade-in-up">
            {(normalizedRole === 'admin' || normalizedRole === 'creator') ? (
              <CreatorMyCourses user={user} />
            ) : (
              <LearnerMyCourses user={user} />
            )}
          </div>
        );
      }}
    </DashboardWrapper>
  );
}
