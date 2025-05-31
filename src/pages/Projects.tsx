
import React, { useState } from 'react';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectTabs from '@/components/projects/ProjectTabs';
import ProjectCard from '@/components/projects/ProjectCard';

interface Project {
  id: string;
  title: string;
  description: string;
  type: 'minor' | 'major';
  category: string;
  deadline: string;
  status: 'pending' | 'done' | 'submitted';
}

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'done'>('all');
  const [filterValue, setFilterValue] = useState('Today');

  // Sample project data - this would come from your API/database
  const projects: Project[] = [
    {
      id: '1',
      title: 'Redesign doord app to increase customer interest',
      description: 'Create a Wireframe for a Mobile App – Design a basic wireframe using Figma or Adobe XD',
      type: 'minor',
      category: 'UI/UX Design',
      deadline: 'Wed, 05 Mar',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Weather App (API Integration)',
      description: 'Fetch real-time weather data using an API like OpenWeatherMap',
      type: 'minor',
      category: 'Python',
      deadline: 'Wed, 05 Mar',
      status: 'done'
    },
    {
      id: '3',
      title: 'Blog Platform (CRUD Operations)',
      description: 'Develop a simple blog where users can create, edit, and delete posts using Django/Flask or Node.js',
      type: 'major',
      category: 'Web development',
      deadline: 'Wed, 05 Mar',
      status: 'done'
    },
    {
      id: '4',
      title: 'E-commerce Mobile App',
      description: 'Build a complete mobile application with shopping cart functionality',
      type: 'major',
      category: 'Java',
      deadline: 'Wed, 05 Mar',
      status: 'pending'
    }
  ];

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return project.status === 'pending';
    if (activeTab === 'done') return project.status === 'done';
    return true;
  });

  const handleProjectCheck = (projectId: string) => {
    console.log('Checking project:', projectId);
    // Handle project check action - navigate to project details, etc.
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <ProjectHeader 
          title="Projects"
          filterValue={filterValue}
          onFilterChange={setFilterValue}
        />
        
        <div className="mb-8">
          <ProjectTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onCheck={() => handleProjectCheck(project.id)}
            />
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
