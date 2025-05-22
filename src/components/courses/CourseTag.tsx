
import React from 'react';

interface CourseTagProps {
  tag: string;
  className?: string;
}

const CourseTag = ({ tag, className = "" }: CourseTagProps) => {
  return (
    <span className={`text-xs font-medium bg-gray-100 group-hover:bg-white px-2 py-1 rounded-full text-gray-700 transition-colors duration-300 ${className}`}>
      {tag}
    </span>
  );
};

export default CourseTag;
