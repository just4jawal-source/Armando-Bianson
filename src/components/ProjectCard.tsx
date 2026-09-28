import React, { useRef, useState } from 'react';
import { ArrowUpRight, Play, Film } from 'lucide-react';
import { Project } from '../types';
import { BlurImage } from './BlurImage';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
  const cardRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const titleParallaxX = isHovered ? mousePos.x * 4 : 0;
  const titleParallaxY = isHovered ? mousePos.y * 2 : 0;

  return (
    <article
      ref={cardRef}
      onClick={() => onSelectProject(project)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer flex flex-col bg-white dark:bg-[#111215] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-1 will-change-transform"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <div className="w-full h-full">
          <BlurImage
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            containerClassName="w-full h-full"
          />
        </div>

        {/* Video / Play Pill */}
        {project.videoUrl && (
          <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-blue-600/90 text-white backdrop-blur-sm shadow-sm">
              <Play className="w-3 h-3 fill-current" />
              <span>Video</span>
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-neutral-900 text-xs font-semibold shadow-md transform scale-95 group-hover:scale-100 transition-transform">
            <span>View Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Category Tag */}
        <div className="absolute top-3 left-3 z-20">
          <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-white">
            {project.category}
          </span>
        </div>

        {/* Metrics Badge */}
        {project.metrics && (
          <div className="absolute bottom-3 left-3 z-20">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-600/90 text-white backdrop-blur-sm shadow-xs">
              {project.metrics}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3
              style={{
                transform: `translate3d(${titleParallaxX}px, ${titleParallaxY}px, 0)`,
                transition: isHovered ? 'transform 0.15s ease-out, color 0.15s' : 'transform 0.3s ease-out, color 0.15s'
              }}
              className="font-semibold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 will-change-transform"
            >
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
          </div>
          
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Tools Used Pills */}
        {project.toolsUsed && project.toolsUsed.length > 0 && (
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-neutral-400 uppercase font-medium mr-1">Tools:</span>
            {project.toolsUsed.slice(0, 3).map((tool, idx) => (
              <span
                key={idx}
                className="text-[11px] text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded"
              >
                {tool}
              </span>
            ))}
            {project.toolsUsed.length > 3 && (
              <span className="text-[10px] text-neutral-400">
                +{project.toolsUsed.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
