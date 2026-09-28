import React, { useState, useMemo } from 'react';
import { ArrowUpRight, Sparkles, Film, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { ProjectCardSkeleton } from './Skeleton';

interface ProjectsGridProps {
  projects: Project[];
  isLoading?: boolean;
  onSelectProject: (project: Project) => void;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, isLoading = false, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter only published projects for public display
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.isPublished !== false);
  }, [projects]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    publishedProjects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [publishedProjects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return publishedProjects;
    return publishedProjects.filter((p) => p.category === selectedCategory);
  }, [publishedProjects, selectedCategory]);

  return (
    <section id="work" className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-blue-600 dark:text-blue-400">
            Portfolio Showcase
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mt-1">
            Projects & Video Creatives
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-md">
            Click on any project below to watch the video, see sample images, and learn what tools were used.
          </p>
        </div>

        {/* Simple Category Filters */}
        <div className="flex flex-wrap gap-1.5 self-start md:self-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ProjectCardSkeleton key={n} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center text-neutral-500 dark:text-neutral-400 text-sm">
          No projects found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>
      )}
    </section>
  );
};
