import type { FC, SVGProps } from 'react';

export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl?: string;
  repoUrl?: string;
  isFeaturedLink?: boolean;
}

export interface Skill {
  name:string;
  icon: FC<SVGProps<SVGSVGElement>>;
}

export interface NavLink {
    name: string;
    href: string;
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
  icon: FC<SVGProps<SVGSVGElement>>;
}