
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  priceINR?: number;
  image: string;
  instructor: string;
  instructorRole?: string;
  instructorBio?: string;
  duration?: string;
  rating?: number;
  students?: number;
  tags?: string[];
  category?: string;
  short_description?: string;
  long_description?: string;
  curriculum_summary?: string;
  course_features?: string[];
  requirements?: string[];
  learning_objectives?: string[];
  curriculum?: any;
  features?: string[];
  reviews_count?: number;
  course_introduction?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle?: string;
  type: 'video' | 'reading' | 'quiz';
  content?: string;
  is_locked?: boolean;
  duration?: string;
}

export interface Module {
  id: string;
  title: string;
  weeks: Week[];
}

export interface Week {
  id: string;
  title: string;
  lessons: Lesson[];
}

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    
    if (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
    
    // Transform DB data to match interface
    const transformedCourses: Course[] = data?.map(course => {
      // First, safely extract course_introduction from metadata
      let courseIntroduction = null;
      if (course.metadata && typeof course.metadata === 'object' && !Array.isArray(course.metadata)) {
        courseIntroduction = course.metadata.course_introduction || null;
      }

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        short_description: course.short_description,
        long_description: course.long_description,
        price: course.price,
        priceINR: course.price_inr || Math.round(course.price * 83),
        image: course.image,
        instructor: course.instructor,
        instructorRole: course.instructor_role,
        instructorBio: course.instructor_bio,
        duration: course.duration,
        rating: course.rating,
        students: course.students,
        tags: course.tags,
        category: course.category,
        curriculum_summary: course.curriculum_summary,
        course_features: course.course_features,
        requirements: course.requirements,
        learning_objectives: course.learning_objectives,
        // Map additional properties from the database
        curriculum: course.course_curriculum,
        reviews_count: course.reviews_count,
        // Map features as an alias for course_features to maintain compatibility
        features: course.course_features,
        course_introduction: courseIntroduction
      };
    }) || [];
    
    return transformedCourses;
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    return [];
  }
};

export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Safely extract course_introduction from metadata
    let courseIntroduction = null;
    if (data.metadata && typeof data.metadata === 'object' && !Array.isArray(data.metadata)) {
      courseIntroduction = data.metadata.course_introduction || null;
    }
    
    // Transform DB data to match interface
    const course: Course = {
      id: data.id,
      title: data.title,
      description: data.description,
      short_description: data.short_description,
      long_description: data.long_description,
      price: data.price,
      priceINR: data.price_inr || Math.round(data.price * 83),
      image: data.image,
      instructor: data.instructor,
      instructorRole: data.instructor_role,
      instructorBio: data.instructor_bio,
      duration: data.duration,
      rating: data.rating,
      students: data.students,
      tags: data.tags,
      category: data.category,
      curriculum_summary: data.curriculum_summary,
      course_features: data.course_features,
      requirements: data.requirements,
      learning_objectives: data.learning_objectives,
      // Add additional properties to match the interface
      curriculum: data.course_curriculum,
      reviews_count: data.reviews_count,
      features: data.course_features,
      course_introduction: courseIntroduction
    };
    
    return course;
  } catch (error) {
    console.error('Error in getCourseById:', error);
    return null;
  }
};
