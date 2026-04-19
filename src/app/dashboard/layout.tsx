"use client"

import { useEffect } from "react"
import AuthGuard from "@/components/auth/AuthGuard"
import { DUMMY_COURSES } from '@/lib/data/dummyData'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Run fresh initialization
    const initialized = localStorage.getItem('avid-pages-initialized-v1');
    
    if (!initialized) {
      // Clear any corrupted page data
      Object.keys(localStorage)
        .filter(k => k.startsWith('avid-pages-'))
        .forEach(k => localStorage.removeItem(k));
      
      // Initialize pages for ALL dummyData lectures
      DUMMY_COURSES.forEach(course => {
        course.sections.forEach(section => {
          section.lectures.forEach(lecture => {
            const storageKey = `avid-pages-${lecture.id}`;
            const pages = Array.from(
              { length: lecture.pages },
              (_, i) => ({
                id: `${lecture.id}-p${i + 1}`,
                lectureId: lecture.id,
                title: `Page ${i + 1}`,
                heading: '',
                layout: null,
                content: {},
                status: 'draft',
                infoPopup: null
              })
            );
            localStorage.setItem(storageKey, JSON.stringify(pages));
          });
        });
      });
      
      localStorage.setItem('avid-pages-initialized-v1', 'true');
    }

    const cleaned = localStorage.getItem('avid-storage-cleaned-v1');
    if (!cleaned) {
      localStorage.removeItem('avid-courses');
      localStorage.removeItem('avid-deleted-courses');
      localStorage.removeItem('avid-course-overrides');
      localStorage.setItem('avid-storage-cleaned-v1', 'true');
    }
  }, []);

  return <AuthGuard>{children}</AuthGuard>
}
