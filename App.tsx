
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import About from './components/About';
import NavCards from './components/NavCards';
import Waveform from './components/Waveform';

const App: React.FC = () => {
  return (
    <div className="bg-black text-slate-300 antialiased selection:bg-orange-300 selection:text-orange-900">
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <Waveform />
          <About />
          <NavCards />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;