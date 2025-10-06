import React from 'react';
import { CodeIcon, SkillsIcon, ExperienceIcon, MailIcon } from './Icons';
import useScrollAnimation from '../hooks/useScrollAnimation';

const NAV_CARDS_DATA = [
  {
    title: 'Projects',
    subtitle: 'See my latest work',
    href: '#projects',
    Icon: CodeIcon,
  },
  {
    title: 'Skills',
    subtitle: 'My technical expertise',
    href: '#skills',
    Icon: SkillsIcon,
  },
  {
    title: 'Experience',
    subtitle: 'My journey so far',
    href: '#experience',
    Icon: ExperienceIcon,
  },
  {
    title: 'Contact Me',
    subtitle: 'Get in touch with me',
    href: '#contact',
    Icon: MailIcon,
  },
];

const AnimatedNavCard = ({ card, animationDelay }: { card: typeof NAV_CARDS_DATA[0], animationDelay: number }) => {
    // FIX: Specify HTMLAnchorElement for useScrollAnimation hook to match the `<a>` element.
    const [ref, isVisible] = useScrollAnimation<HTMLAnchorElement>();
    
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', href);
        }
    };

    return (
        <a
            ref={ref}
            key={card.title}
            href={card.href}
            onClick={(e) => handleNavClick(e, card.href)}
            className={`group block p-8 bg-black rounded-lg text-center transition-all duration-300 hover:bg-slate-900 hover:-translate-y-2 border border-slate-700 hover:border-orange-500 shadow-lg hover:shadow-2xl hover:shadow-orange-500/40 scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''}`}
            style={{ transitionDelay: `${animationDelay}ms` }}
            aria-label={`Navigate to ${card.title} section: ${card.subtitle}`}
        >
            <card.Icon className="w-10 h-10 mx-auto mb-4 text-slate-400 group-hover:text-orange-400 transition-colors" />
            <h3 className="text-xl font-bold text-slate-100 mb-1">{card.title}</h3>
            <p className="text-slate-400">{card.subtitle}</p>
        </a>
    );
};

const NavCards: React.FC = () => {
  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {NAV_CARDS_DATA.map((card, index) => (
            <AnimatedNavCard key={card.title} card={card} animationDelay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NavCards;