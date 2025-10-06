import React from 'react';
import { CONTACT } from '../constants';

const Footer: React.FC = () => {
  // Filter for the social links we want in the footer
  const socialLinks = CONTACT.info.filter(item => 
    ['LinkedIn', 'GitHub', 'Email'].includes(item.name)
  );

  return (
    <footer className="py-6 border-t border-slate-800 text-slate-500 text-sm">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; 2025 Aleti Vamshidar Reddy. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit my ${link.name}`}
                className="text-slate-400 hover:text-orange-400 transition-colors duration-300"
              >
                {IconComponent && <IconComponent className="w-6 h-6" />}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;