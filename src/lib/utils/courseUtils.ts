import { DUMMY_COURSES, Course } from '@/lib/data/dummyData'

export const getAllCourses = (): Course[] => {
  if (typeof window === 'undefined') return DUMMY_COURSES
  const stored = localStorage.getItem('avid-courses')
  const localCourses: Course[] = stored ? JSON.parse(stored) : []
  const deletedIds: string[] = JSON.parse(
    localStorage.getItem('avid-deleted-courses') || '[]'
  )
  const overrides = JSON.parse(
    localStorage.getItem('avid-course-overrides') || '{}'
  )
  return [
    ...DUMMY_COURSES,
    ...localCourses.filter(lc => !DUMMY_COURSES.find(dc => dc.id === lc.id))
  ]
  .filter(c => !deletedIds.includes(c.id))
  .map(c => ({ ...c, ...(overrides[c.id] || {}) }))
}
