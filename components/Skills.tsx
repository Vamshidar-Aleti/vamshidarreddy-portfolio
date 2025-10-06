import React from 'react';
import { SKILLS } from '../constants';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { Skill } from '../types';

interface SkillItemProps {
  skill: Skill;
  animationDelay: number;
}

const SkillItem: React.FC<SkillItemProps> = ({ skill, animationDelay }) => {
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const IconComponent = skill.icon;
  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center gap-2 p-4 bg-slate-800/50 border border-slate-700 rounded-lg w-28 h-28 transition-all duration-300 hover:bg-slate-800 hover:border-orange-500 scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''}`}
      style={{ transitionDelay: `${animationDelay}ms` }}
    >
      <IconComponent className="w-10 h-10 text-orange-400" />
      <span className="text-sm">{skill.name}</span>
    </div>
  );
};

const Skills: React.FC = () => {
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="skills" className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={`scroll-reveal ${isTitleVisible ? 'scroll-reveal--visible' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Technical <span className="gradient-text">Skills</span>
          </h2>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-12">
          {SKILLS.map((skillCategory, catIndex) => {
            // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
            const [catRef, isCatVisible] = useScrollAnimation<HTMLDivElement>();
            return (
              <div
                key={skillCategory.category}
                ref={catRef}
                className={`text-center scroll-reveal ${isCatVisible ? 'scroll-reveal--visible' : ''}`}
                style={{ transitionDelay: `${catIndex * 200}ms` }}
              >
                <h3 className="text-xl font-semibold text-slate-300 mb-6">{skillCategory.category}</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {skillCategory.items.map((skill, itemIndex) => (
                    <SkillItem
                      key={skill.name}
                      skill={skill}
                      animationDelay={itemIndex * 50}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;