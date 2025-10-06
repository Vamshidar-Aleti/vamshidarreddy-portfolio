import React, { useState } from 'react';
import { Project } from '../types';
import { GitHubIcon, ExternalLinkIcon } from './Icons';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface ProjectCardProps {
  project: Project;
  animationDelay?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, animationDelay = 0 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col bg-slate-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.03] border border-slate-700 scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''}`}
      style={{ transitionDelay: `${animationDelay}ms` }}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-lg transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(249, 115, 22, 0.15), transparent 80%)`,
        }}
      />
      
      {/* Card Content */}
      <div className="relative">
        <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-slate-100">{project.title}</h3>
        <p className="text-slate-400 mb-4 flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span key={tag} className="bg-orange-900/50 text-orange-300 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="mt-auto pt-4">
          {project.isFeaturedLink ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors duration-300 shadow-md hover:shadow-lg"
              aria-label={`Explore more projects on GitHub`}
            >
              <span>View on GitHub</span>
              <GitHubIcon className="w-5 h-5" />
              <ExternalLinkIcon className="w-5 h-5" />
            </a>
          ) : (
            project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 text-slate-100 font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors duration-300 border border-slate-700 shadow-md hover:shadow-lg"
                aria-label={`View project ${project.title} on GitHub`}
              >
                <span>View Project</span>
                <ExternalLinkIcon className="w-5 h-5" />
              </a>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;