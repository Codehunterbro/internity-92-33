
// Define the content structure type
export interface LessonVideoContent {
  title: string;
  subtitle: string;
  videoType: 'youtube' | null;
  videoId: string | null;
  videoTitle: string;
  videoDescription: string;
  resources: {
    name: string;
    type: string;
    size: string;
  }[];
}

// Lesson Content Structure with videos for all days
export const lessonContent: Record<string, LessonVideoContent> = {
  "Day 1: HTML Fundamentals": {
    title: "Getting Started with HTML",
    subtitle: "Learn the fundamentals of HTML",
    videoType: "youtube",
    videoId: "pQN-pnXPaVg",
    videoTitle: "HTML Basics",
    videoDescription: "Introduction to HTML structure and tags...",
    resources: [
      { name: "HTML Cheat Sheet", type: "PDF", size: "2.4 MB" },
      { name: "Starter Code", type: "ZIP", size: "1.8 MB" }
    ]
  },
  "Day 2: CSS Basics": {
    title: "Introduction to CSS",
    subtitle: "Master CSS styling basics",
    videoType: "youtube",
    videoId: "yfoY53QXEnI",
    videoTitle: "CSS Fundamentals",
    videoDescription: "Learn CSS selectors and properties...",
    resources: [
      { name: "CSS Cheat Sheet", type: "PDF", size: "1.9 MB" }
    ]
  },
  "Day 3: Layout & Positioning": {
    title: "Layout & Positioning",
    subtitle: "CSS layout techniques",
    videoType: "youtube",
    videoId: "VqTpiK63F_Q",
    videoTitle: "CSS Layout",
    videoDescription: "Master positioning and layout with CSS...",
    resources: []
  },
  "Day 4: Forms & Tables": {
    title: "Forms & Tables",
    subtitle: "Build HTML forms and tables",
    videoType: "youtube",
    videoId: "rN9Hv3XvYLQ",
    videoTitle: "Forms and Tables",
    videoDescription: "Create interactive forms and tables...",
    resources: []
  },
  "Day 5: CSS Frameworks": {
    title: "CSS Frameworks",
    subtitle: "Introduction to CSS frameworks",
    videoType: "youtube",
    videoId: "9zBsdzdE4sM",
    videoTitle: "Bootstrap Basics",
    videoDescription: "Learn Bootstrap framework...",
    resources: []
  },
  "Day 6: LIVE CLASS": {
    title: "Week 1 Live Class",
    subtitle: "Interactive session on HTML & CSS",
    videoType: "youtube",
    videoId: "UB1O30fR-EE",
    videoTitle: "Live Q&A and Demo",
    videoDescription: "Review of Week 1 topics...",
    resources: []
  },
  "Day 7: MINOR PROJECT SUBMISSION": {
    title: "Minor Project",
    subtitle: "Submit your Week 1 project",
    videoType: null,
    videoId: null,
    videoTitle: "",
    videoDescription: "",
    resources: []
  }
};

// Add other days and weeks as needed - these are the most relevant ones
// The full dataset from the user's code can be added here

// Helper function to get lesson content by ID
export const getLessonById = (id: number): LessonVideoContent | null => {
  // Map IDs to lesson keys
  const idToLessonMap: Record<number, string> = {
    101: "Day 1: HTML Fundamentals",
    102: "Day 2: CSS Basics",
    103: "Day 3: Layout & Positioning",
    104: "Day 4: Forms & Tables",
    105: "Day 5: CSS Frameworks",
    106: "Day 6: LIVE CLASS",
    107: "Day 7: MINOR PROJECT SUBMISSION",
    201: "Day 1: Intro to JavaScript",
    202: "Day 2: Control Flow"
  };

  const lessonKey = idToLessonMap[id];
  if (lessonKey && lessonContent[lessonKey]) {
    return lessonContent[lessonKey];
  }
  return null;
};

// Add the missing export function to fetch lesson content by lesson ID
export const getLessonContent = async (lessonId: string) => {
  try {
    // For now, just return a default content structure
    // In a real implementation, this would fetch from a database based on lessonId
    return {
      title: "Lesson Content",
      subtitle: "Learning module content",
      videoType: "youtube",
      videoId: "pQN-pnXPaVg", // Default to HTML tutorial
      videoTitle: "Tutorial",
      videoDescription: "Step-by-step guide for this lesson topic...",
      resources: [
        { name: "Lesson Notes", type: "PDF", size: "1.2 MB" },
        { name: "Exercise Files", type: "ZIP", size: "3.4 MB" }
      ]
    };
  } catch (error) {
    console.error('Error fetching lesson content:', error);
    return null;
  }
};
