import React from 'react';
import { ABOUT_TEXT, RESUME_URL, CONTACT } from '../constants';
import { ResumeIcon, LinkedInIcon } from './Icons';
import useScrollAnimation from '../hooks/useScrollAnimation';

const About: React.FC = () => {
  const linkedInUrl = CONTACT.info.find(link => link.name === 'LinkedIn')?.href || '#';
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLDivElement>();
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [textRef, isTextVisible] = useScrollAnimation<HTMLDivElement>();
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [imageRef, isImageVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="about" className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`scroll-reveal ${isTitleVisible ? 'scroll-reveal--visible' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">
            About <span className="gradient-text">Me</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text Content */}
          <div 
            ref={textRef}
            className={`scroll-reveal ${isTextVisible ? 'scroll-reveal--visible' : ''}`}
          >
            <div className="space-y-4 text-slate-400 text-lg mb-8">
                <p>{ABOUT_TEXT.p1}</p>
                <p>{ABOUT_TEXT.p2}</p>
                <p>{ABOUT_TEXT.p3}</p>
                <p>{ABOUT_TEXT.p4}</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-100 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                <ResumeIcon className="w-5 h-5" />
                <span>Resume</span>
              </a>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-800 text-slate-100 font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors duration-300 border border-slate-700 shadow-md hover:shadow-lg"
              >
                <LinkedInIcon className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
          
          {/* Right Column: Image */}
          <div 
            ref={imageRef}
            className={`relative group order-first md:order-last w-4/5 md:w-full max-w-md mx-auto scroll-reveal ${isImageVisible ? 'scroll-reveal--visible' : ''}`}
            style={{ transitionDelay: '200ms' }}
          >
            <img 
              src="/component_images/about_me_image.jpeg" 
              alt="Aleti Vamshidar Reddy, professional portrait." 
              className="w-full h-auto object-cover rounded-full shadow-2xl border-2 border-slate-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-orange-500/30 aspect-square"
            />
             <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-orange-900/10 rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;