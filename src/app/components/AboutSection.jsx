'use client';

import PaintScene from './Scene';
import AboutText from './AboutText';

const AboutSection = () => (
  <section
    id="about"
    className="relative h-[80vh] min-h-[560px] bg-white text-gray-900 flex items-center justify-center overflow-hidden"
  >
    <div className="absolute inset-0 bg-white" />

    <div className="absolute top-13 w-full flex justify-center z-40 pointer-events-none">
      <span className="hero-heading px-8 py-3 text-base sm:text-lg uppercase tracking-[0.45em] text-[#ffe9d1] bg-black rounded-full font-bold shadow-[0_10px_45px_rgba(0,0,0,0.4)] border border-white/60">
        Scratch to reveal
      </span>
    </div>

    <AboutText className="z-10" />
    <PaintScene />
  </section>
);

export default AboutSection;
