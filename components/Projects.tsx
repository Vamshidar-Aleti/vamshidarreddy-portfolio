import React from 'react';
import { PROJECTS } from '../constants';
import ProjectCard from './ProjectCard';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Projects: React.FC = () => {
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="projects" className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`scroll-reveal ${isTitleVisible ? 'scroll-reveal--visible' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            My <span className="gradient-text">Projects</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={index} project={project} animationDelay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;