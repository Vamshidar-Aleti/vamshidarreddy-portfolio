
import React, { useState, useEffect } from 'react';
import { HERO_TEXT } from '../constants';
import { ArrowDownIcon } from './Icons';

const Hero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [cursorState, setCursorState] = useState<'line1' | 'line2' | 'done'>('line1');
  const [nameAnimationPhase, setNameAnimationPhase] = useState<'scrambling' | 'resolving'>('scrambling');
  const [resolvedIndex, setResolvedIndex] = useState(0);

  useEffect(() => {
    const fullLine1 = HERO_TEXT.greeting;
    const fullLine2 = HERO_TEXT.name;
    let timeoutId: number;

    setLine1('');
    setLine2('');
    setCursorState('line1');
    setNameAnimationPhase('scrambling');
    setResolvedIndex(0);

    const getRandomBinary = (length: number) => 
      Array.from({ length }, () => Math.round(Math.random())).join('');

    const type = (phase: 'line1' | 'line2-scramble' | 'line2-resolve', index: number, scrambleCount = 0) => {
        if (phase === 'line1') {
            if (index <= fullLine1.length) {
                setLine1(fullLine1.substring(0, index));
                timeoutId = window.setTimeout(() => type('line1', index + 1), 120);
            } else {
                setCursorState('line2');
                setNameAnimationPhase('scrambling');
                timeoutId = window.setTimeout(() => type('line2-scramble', 0, 0), 300);
            }
        } else if (phase === 'line2-scramble') {
            if (scrambleCount < 15) { // Scramble for 15 frames
                setLine2(getRandomBinary(fullLine2.length));
                timeoutId = window.setTimeout(() => type('line2-scramble', 0, scrambleCount + 1), 70);
            } else {
                setNameAnimationPhase('resolving');
                setResolvedIndex(0);
                timeoutId = window.setTimeout(() => type('line2-resolve', 0), 200);
            }
        } else if (phase === 'line2-resolve') {
            if (index <= fullLine2.length) {
                setResolvedIndex(index);
                const resolvedPart = fullLine2.substring(0, index);
                const binaryPart = getRandomBinary(fullLine2.length - index);
                setLine2(resolvedPart + binaryPart);
                timeoutId = window.setTimeout(() => type('line2-resolve', index + 1), 150);
            } else {
                setLine2(fullLine2);
                setResolvedIndex(fullLine2.length);
                timeoutId = window.setTimeout(() => setCursorState('done'), 1500);
            }
        }
    };
    
    timeoutId = window.setTimeout(() => type('line1', 1, 0), 500); // Initial delay

    return () => clearTimeout(timeoutId);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section id="home" className="flex items-center justify-center min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* iPhone-like Hero Card - Horizontal */}
        <div 
          className="relative w-full max-w-7xl mx-auto aspect-[19.5/9] rounded-[5rem] overflow-hidden shadow-2xl bg-black transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(249,115,22,0.5)]"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          <img 
            src="/component_images/Hero_image.png" 
            alt="Vamshidar" 
            className="absolute inset-0 h-full w-full object-cover object-center grayscale" 
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10" />

          {/* Subtle Spotlight Effect */}
          <div 
            className="absolute inset-0 z-20 transition-opacity duration-500"
            style={{
              background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(236, 72, 153, 0.2), rgba(249, 115, 22, 0.1), transparent 80%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center items-start text-left p-12 lg:p-16 z-30">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white min-h-[8rem] md:min-h-[10rem]">
              <span className="gradient-text-pink-orange block">
                {line1}
                {cursorState === 'line1' && <span className="typing-cursor"></span>}
              </span>
              <span className="block mt-2">
                {nameAnimationPhase === 'resolving' ? (
                  <>
                    <span className="gradient-text-orange-yellow">
                      {line2.substring(0, resolvedIndex)}
                    </span>
                    <span className="text-white">
                      {line2.substring(resolvedIndex)}
                    </span>
                  </>
                ) : (
                  <span className="text-white">
                    {line2}
                  </span>
                )}
                {cursorState === 'line2' && <span className="typing-cursor"></span>}
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-300 max-w-2xl mt-4">{HERO_TEXT.subtitle}</p>
            <a 
              href="#about" 
              onClick={(e) => handleNavClick(e, '#about')}
              className="mt-8 flex items-center group cursor-pointer"
              aria-label="Scroll to About Me section"
            >
              <span className="text-2xl font-bold gradient-text-pink-orange group-hover:underline">
                {HERO_TEXT.aboutLink}
              </span>
              <ArrowDownIcon className="w-10 h-10 text-orange-400 transform -rotate-90 ml-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
