import type { UserRole } from "@/lib/types/auth";

export interface DashboardStats {
  label: string;
  value: number | string;
  sub: string;
  icon: string;
}

export interface RecentItem {
  id: string;
  title: string;
  type?: string;
  [key: string]: any;
}

export interface DashboardData {
  stats: DashboardStats[];
  recentTitle: string;
  recentEmptyMessage: string;
  recentItems: RecentItem[];
}

export const fetchDashboardData = async (uid: string, role: UserRole): Promise<DashboardData> => {
  // In a real app, you would query Firestore here.
  let stats: DashboardStats[] = [];
  let recentTitle = "";
  let recentEmptyMessage = "";

  switch (role) {
    case "learner":
      stats = [
        { label: "Enrolled Courses", value: 0, sub: "Currently enrolled", icon: "book" },
        { label: "Completed", value: 0, sub: "Successfully finished", icon: "check" },
        { label: "In Progress", value: 0, sub: "Needs your attention", icon: "clock" },
        { label: "Certificates Earned", value: 0, sub: "ISO standard badges", icon: "award" },
      ];
      recentTitle = "Continue Learning";
      recentEmptyMessage = "You haven't enrolled in any precision compliance training modules yet. Start your certification journey today.";
      break;
    case "creator":
      stats = [
        { label: "Total Courses Created", value: 0, sub: "Published modules", icon: "layers" },
        { label: "Total Learners", value: 0, sub: "Active students", icon: "users" },
        { label: "Avg Completion Rate", value: "0%", sub: "Global completion", icon: "activity" },
        { label: "Publications", value: 0, sub: "Pending review", icon: "library" },
      ];
      recentTitle = "My Recent Courses";
      recentEmptyMessage = "You haven't drafted or published any courses yet. Begin crafting your first module.";
      break;
    case "admin":
      stats = [
        { label: "Total Users", value: 0, sub: "Across all active roles", icon: "users" },
        { label: "Total Creators", value: 0, sub: "Verified instructors", icon: "shield" },
        { label: "Total Learners", value: 0, sub: "Enrolled individuals", icon: "graduation" },
        { label: "Total Courses", value: 0, sub: "Platform-wide modules", icon: "database" },
      ];
      recentTitle = "Recent Activity";
      recentEmptyMessage = "No recent user registrations or course creations found in the ecosystem.";
      break;
  }

  return {
    stats,
    recentTitle,
    recentEmptyMessage,
    recentItems: [], // empty for now to force the empty state view
  };
};
