
/// <reference types="vite/client" />

// Extend the Course interface with more specific types
interface CurriculumLesson {
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz';
}

interface CurriculumSection {
  title: string;
  lessons: CurriculumLesson[];
}

// This helps TypeScript understand the structure of course curriculum
interface CourseCurriculum {
  sections?: CurriculumSection[];
  [key: string]: any; // To allow for different curriculum formats
}
