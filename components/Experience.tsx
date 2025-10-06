import React, { useState } from 'react';
import { EXPERIENCE } from '../constants';
import { Experience as ExperienceType } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';

// A component to render the experience card content with animations.
const ExperienceCard: React.FC<{ item: ExperienceType }> = ({ item }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const IconComponent = item.icon;

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
      className={`group relative bg-slate-900/50 p-6 rounded-lg border border-slate-700 transition-all duration-300 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/20 hover:scale-[1.03] scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''}`}
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
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
            <IconComponent className="w-6 h-6 text-orange-400" />
          </div>
          <span className="text-sm text-slate-400 font-medium">{item.duration}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-1">{item.role}</h3>
        <p className="font-semibold text-slate-300 mb-3">{item.company}</p>
        <p className="text-slate-400 text-base">{item.description}</p>
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="experience" className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 scroll-reveal ${isTitleVisible ? 'scroll-reveal--visible' : ''}`}
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Work <span className="gradient-text">Experience</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-slate-400">
              My educational background and professional journey in the field of Electronics & Communication Engineering and VLSI.
            </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Lines for mobile and desktop */}
          <div className="absolute left-3 top-0 w-0.5 h-full bg-slate-700 md:hidden" aria-hidden="true"></div>
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-slate-700 -translate-x-1/2 hidden md:block" aria-hidden="true"></div>

          <div className="space-y-12 md:space-y-0">
            {EXPERIENCE.map((item, index) => (
              <div key={index} className="md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-8 md:items-center mb-0 md:mb-12">
                
                {/* Mobile Layout */}
                <div className="relative pl-12 md:hidden">
                  <div className="absolute left-3 top-2 -ml-[9px] w-5 h-5 bg-orange-500/20 rounded-full border-2 border-orange-500 shadow-[0_0_10px_theme(colors.orange.500)]" aria-hidden="true"></div>
                  <ExperienceCard item={item} />
                </div>
                
                {/* Desktop Layout */}
                {index % 2 === 0 ? (
                  <>
                    <div className="hidden md:block"><ExperienceCard item={item} /></div>
                    <div className="hidden md:flex justify-center">
                      <div className="w-5 h-5 bg-orange-500/20 rounded-full border-2 border-orange-500 z-10 relative shadow-[0_0_10px_theme(colors.orange.500)]"></div>
                    </div>
                    <div className="hidden md:block"></div>
                  </>
                ) : (
                  <>
                    <div className="hidden md:block"></div>
                    <div className="hidden md:flex justify-center">
                       <div className="w-5 h-5 bg-orange-500/20 rounded-full border-2 border-orange-500 z-10 relative shadow-[0_0_10px_theme(colors.orange.500)]"></div>
                    </div>
                    <div className="hidden md:block"><ExperienceCard item={item} /></div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;