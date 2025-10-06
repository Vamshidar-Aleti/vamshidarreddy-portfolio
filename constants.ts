import { Project, Skill, NavLink, Experience } from './types';
import {
  BriefcaseIcon,
  ExperienceIcon,
  CIcon,
  PythonIcon,
  EmbeddedCIcon,
  VerilogIcon,
  UvmIcon,
  TclIcon,
  CodeIcon,
  CssIcon,
  GitHubIcon,
  VscodeIcon,
  ArduinoIcon,
  XilinxIcon,
  TinkercadIcon,
  VcsIcon,
  EdaIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  LocationIcon,
} from './components/Icons';


export const NAV_LINKS: NavLink[] = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

export const RESUME_URL = 'https://drive.google.com/file/d/1C6IdP9rIDsc9jWwd6wxs3WZd4HZJDLqL/view?usp=sharing';

export const HERO_TEXT = {
  greeting: "HELLO! I'M",
  name: "VAMSHIDAR",
  subtitle: "ECE '24 Graduate | Aspiring VLSI Design Verification Engineer",
  aboutLink: "About Me"
};

export const ABOUT_TEXT = {
  p1: "I'm Aleti Vamshidar Reddy, a passionate Design Verification Engineer with a strong foundation in Digital Design and a drive to ensure hardware performs flawlessly.", 
  p2: "My background as an Electronics and Communication Engineering (ECE) graduate, combined with intensive training in advanced verification methodologies, has equipped me to tackle complex industry challenges.",
  p3: "I am proficient in debugging and verification using powerful tools like Synopsys VCS. I am now eager to apply my skills in an entry-level Design Verification Engineer role, where I can contribute to innovative chip verification projects and grow within a dynamic team.",
  p4: "Let's connect and build the future of VLSI!"
};


export const EXPERIENCE: Experience[] = [
  {
    role: 'Training and Internship',
    company: 'Sumedha IT, Telangana, India',
    duration: 'June,2024 - Present',
    description: "Gained hands-on experience in VLSI design and verification, specializing in digital circuits. Utilized industry-standard tools like Synopsys VCS to conduct simulations, validate designs, and ensure functionality while optimizing for performance.",
    icon: BriefcaseIcon,
  },
  {
    role: 'B.Tech in Electronics and Communication Engineering',
    company: 'Nalla malla Reddy Engineering College (NMREC)',
    duration: '2020 - 2024',
    description: "Specializing in digital electronics, communication systems, and VLSI. Developed expertise in circuit simulation, HDL design, and embedded C programming. Demonstrated strong teamwork, problem-solving, and communication skills.",
    icon: ExperienceIcon,
  },
];

export const PROJECTS: Project[] = [
  {
    title: 'Synchronous FIFO UVM Verification',
    description: 'Developed a comprehensive UVM testbench to verify a Synchronous FIFO design. Implemented scoreboard, sequences, and functional coverage to ensure robust functionality.',
    tags: ['UVM', 'SystemVerilog', 'FIFO', 'Verification', 'VCS'],
    imageUrl: '/project_images/sync_fifo_image.png',
    repoUrl: 'https://github.com/Vamshidar-Aleti/Sync-FIFO-UVM_TB',
  },
  {
    title: 'APB Protocol Verification IP',
    description: 'Created a reusable APB (Advanced Peripheral Bus) Verification IP (VIP). The VIP includes a master agent, slave agent, and monitor for plug-and-play verification of APB-based systems.',
    tags: ['SystemVerilog', 'APB Protocol', 'UVM', 'VIP', 'QuestaSim'],
    imageUrl: '/project_images/apb_image.png',
    repoUrl: 'https://github.com/Vamshidar-Aleti/APB-Protocol-VIP',
  },
  {
    title: 'Dual-Port RAM (DPRAM) Verification',
    description: 'Conducted rigorous verification of a high-speed Dual-Port RAM. Focused on handling concurrent read/write access and ensuring data integrity with SystemVerilog Assertions (SVA).',
    tags: ['SystemVerilog', 'DPRAM', 'SVA', 'Verification', 'Memory'],
    imageUrl: '/project_images/dual-image.png',
    repoUrl: 'https://github.com/Vamshidar-Aleti/Dual-Port-RAM-Verification',
  },
  {
    title: 'Single-Port RAM (SPRAM) Design',
    description: 'Designed a synthesizable Single-Port RAM (SPRAM) using Verilog. Optimized for low-power and high-performance, including logic for read/write operations and address decoding.',
    tags: ['Verilog', 'RTL Design', 'SPRAM', 'FPGA', 'Xilinx Vivado'],
    imageUrl: '/project_images/spram-image.jpg',
    repoUrl: 'https://github.com/Vamshidar-Aleti/SPRAM-Design-UVM-TB',
  },
  {
    title: 'Asynchronous FIFO UVM Verification',
    description: 'Verified an Asynchronous FIFO, focusing on Clock Domain Crossing (CDC). Implemented a UVM testbench with checkers and coverage to ensure data integrity.',
    tags: ['UVM', 'SystemVerilog', 'Async FIFO', 'CDC', 'Verification'],
    imageUrl: '/project_images/asyc_image.png',
    repoUrl: 'https://github.com/Vamshidar-Aleti/Asynchronous-FIFO-First-In-First-Out-Buffer---Verilog-Implementation',
  },
  {
    title: 'Explore More Projects',
    description: 'Visit my GitHub profile to see a complete collection of my work, including other verification projects, RTL designs, and various experiments.',
    tags: ['GitHub', 'All Projects', 'Open Source'],
    imageUrl: '/project_images/exp_image.png',
    repoUrl: 'https://github.com/Vamshidar-Aleti',
    isFeaturedLink: true,
  },
];

export const SKILLS: { category: string; items: Skill[] }[] = [
  {
    category: 'Programming & Web Technologies',
    items: [
      { name: 'C/C++', icon: CIcon },
      { name: 'Python', icon: PythonIcon },
      { name: 'Embedded C', icon: EmbeddedCIcon },
      { name: 'Verilog', icon: VerilogIcon },
      { name: 'SystemVerilog', icon: VerilogIcon },
      { name: 'UVM', icon: UvmIcon },
      { name: 'TCL Scripting', icon: TclIcon },
      { name: 'HTML', icon: CodeIcon },
      { name: 'CSS', icon: CssIcon },
    ],
  },
  {
    category: 'Tools & Platforms',
    items: [
      { name: 'GitHub', icon: GitHubIcon },
      { name: 'VSCode', icon: VscodeIcon },
      { name: 'Arduino IDE', icon: ArduinoIcon },
      { name: 'Xilinx Vivado', icon: XilinxIcon },
      { name: 'Tinkercad', icon: TinkercadIcon },
      { name: 'Synopsys VCS', icon: VcsIcon },
      { name: 'EDA Playground', icon: EdaIcon },
    ],
  },
];

export const CONTACT = {
  description: "Feel free to reach out for collaborations, opportunities, or just a friendly chat about electronics and technology.",
  info: [
    { name: 'LinkedIn', value: 'linkedin.com/in/vamshidarreddy-aleti', href: 'https://linkedin.com/in/vamshidarreddy-aleti', icon: LinkedInIcon },
    { name: 'GitHub', value: 'github.com/Vamshidar-Aleti', href: 'https://github.com/Vamshidar-Aleti', icon: GitHubIcon },
    { name: 'Email', value: 'vamshidharreddyaleti19@gmail.com', href: 'mailto:vamshidharreddyaleti19@gmail.com', icon: MailIcon },
    { name: 'Phone', value: '+91 9553583440', href: 'tel:+919553583440', icon: PhoneIcon },
    { name: 'Location', value: 'Hyderabad, Telangana, India', icon: LocationIcon },
  ]
};