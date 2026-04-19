// src/lib/data/dummyData.ts

// ─── TYPES ────────────────────────────────────
export type CourseStatus = 'published' | 'draft' | 'unpublished';
export type EnrollmentStatus = 'inProgress' | 'completed' | 'notStarted';

export interface Lecture {
  id: string;
  title: string;
  pages: number;
}

export interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  isoStandard: string;
  category: string;
  status: CourseStatus;
  creatorName: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
}

export interface Enrollment {
  id: string;
  learnerName: string;
  courseId: string;
  progress: number;
  status: EnrollmentStatus;
  enrolledAt: string;
}

// ─── COURSES ──────────────────────────────────
export const DUMMY_COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'ISO 27001 Information Security Management',
    description: 'Master the complete ISO 27001 framework for information security management systems.',
    isoStandard: 'ISO 27001',
    category: 'Intermediate',
    status: 'published',
    creatorName: 'Syra',
    creatorId: 'creator-001',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-13',
    sections: [
      { id: 'sec-001', title: 'Introduction to ISO 27001', lectures: [
        { id: 'lec-001', title: 'What is ISO 27001?', pages: 3 },
        { id: 'lec-002', title: 'Key Concepts', pages: 5 },
        { id: 'lec-003', title: 'Scope and Objectives', pages: 4 }
      ]},
      { id: 'sec-002', title: 'Risk Assessment', lectures: [
        { id: 'lec-004', title: 'Risk Identification', pages: 3 },
        { id: 'lec-005', title: 'Risk Treatment', pages: 4 }
      ]},
      { id: 'sec-003', title: 'Implementation', lectures: [
        { id: 'lec-006', title: 'Controls and Annexure A', pages: 6 },
        { id: 'lec-007', title: 'Documentation Requirements', pages: 3 }
      ]}
    ]
  },
  {
    id: 'course-002',
    title: 'ISO 9001 Quality Management Systems',
    description: 'Learn to implement and audit quality management systems to ISO 9001 standards.',
    isoStandard: 'ISO 9001',
    category: 'Beginner',
    status: 'published',
    creatorName: 'Syra',
    creatorId: 'creator-001',
    createdAt: '2026-04-03',
    updatedAt: '2026-04-13',
    sections: [
      { id: 'sec-004', title: 'QMS Fundamentals', lectures: [
        { id: 'lec-008', title: 'Quality Principles', pages: 4 },
        { id: 'lec-009', title: 'Process Approach', pages: 3 }
      ]},
      { id: 'sec-005', title: 'Planning and Support', lectures: [
        { id: 'lec-010', title: 'Risk Based Thinking', pages: 5 },
        { id: 'lec-011', title: 'Documented Information', pages: 3 }
      ]}
    ]
  },
  {
    id: 'course-003',
    title: 'ISO 45001 Occupational Health and Safety',
    description: 'Comprehensive training on occupational health and safety management systems.',
    isoStandard: 'ISO 45001',
    category: 'Intermediate',
    status: 'draft',
    creatorName: 'Syra',
    creatorId: 'creator-001',
    createdAt: '2026-04-05',
    updatedAt: '2026-04-13',
    sections: [
      { id: 'sec-006', title: 'OH&S Fundamentals', lectures: [
        { id: 'lec-012', title: 'Hazard Identification', pages: 4 },
        { id: 'lec-013', title: 'Legal Requirements', pages: 3 }
      ]},
      { id: 'sec-007', title: 'Implementation', lectures: [
        { id: 'lec-014', title: 'Operational Controls', pages: 5 }
      ]}
    ]
  },
  {
    id: 'course-004',
    title: 'ISO 14001 Environmental Management',
    description: 'Learn environmental management systems and sustainability practices.',
    isoStandard: 'ISO 14001',
    category: 'Beginner',
    status: 'draft',
    creatorName: 'Syra',
    creatorId: 'creator-001',
    createdAt: '2026-04-07',
    updatedAt: '2026-04-13',
    sections: [
      { id: 'sec-008', title: 'Environmental Context', lectures: [
        { id: 'lec-015', title: 'Environmental Aspects', pages: 3 },
        { id: 'lec-016', title: 'Compliance Obligations', pages: 4 }
      ]}
    ]
  }
];

// ─── ENROLLMENTS ──────────────────────────────
export const DUMMY_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-001',
    learnerName: 'Ifra',
    courseId: 'course-001',
    progress: 65,
    status: 'inProgress',
    enrolledAt: '2026-04-10'
  },
  {
    id: 'enr-002',
    learnerName: 'Ifra',
    courseId: 'course-002',
    progress: 30,
    status: 'inProgress',
    enrolledAt: '2026-04-11'
  },
  {
    id: 'enr-003',
    learnerName: 'Menahil',
    courseId: 'course-001',
    progress: 100,
    status: 'completed',
    enrolledAt: '2026-04-09'
  },
  {
    id: 'enr-004',
    learnerName: 'Maryam',
    courseId: 'course-003',
    progress: 20,
    status: 'inProgress',
    enrolledAt: '2026-04-12'
  }
];

// ─── HELPER FUNCTIONS ─────────────────────────

// Count unique learner names across all enrollments
export const getTotalLearners = () => {
  const uniqueLearners = new Set(DUMMY_ENROLLMENTS.map(e => e.learnerName));
  return uniqueLearners.size;
};

// Total count of courses
export const getTotalCourses = () => DUMMY_COURSES.length;

// Filter published courses
export const getPublishedCourses = () => 
  DUMMY_COURSES.filter(c => c.status === 'published');

// Filter draft courses
export const getDraftCourses = () => 
  DUMMY_COURSES.filter(c => c.status === 'draft');

// Find course by id
export const getCourseById = (courseId: string) => 
  DUMMY_COURSES.find(c => c.id === courseId);

// Filter enrollments by courseId
export const getEnrollmentsForCourse = (courseId: string) => 
  DUMMY_ENROLLMENTS.filter(e => e.courseId === courseId);

// Count enrollments for that course
export const getLearnerCountForCourse = (courseId: string) => 
  getEnrollmentsForCourse(courseId).length;

// Average of all enrollment progress values, rounded
export const getAvgCompletionRate = () => {
  if (DUMMY_ENROLLMENTS.length === 0) return 0;
  const totalProgress = DUMMY_ENROLLMENTS.reduce((sum, e) => sum + e.progress, 0);
  return Math.round(totalProgress / DUMMY_ENROLLMENTS.length);
};

// Enrollments for that course, sorted by enrolledAt desc
export const getRecentEnrollments = (courseId: string) => {
  return getEnrollmentsForCourse(courseId)
    .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt));
};

// Courses sorted by learner count desc
export const getTopCourses = () => {
  return [...DUMMY_COURSES].sort((a, b) => {
    const countA = getLearnerCountForCourse(a.id);
    const countB = getLearnerCountForCourse(b.id);
    return countB - countA;
  });
};
