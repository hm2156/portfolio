const AboutText = ({ inverted = false, className = '' }) => {
  const headingColor = inverted ? 'text-white' : 'text-gray-900';
  const paragraphColor = inverted ? 'text-white/85' : 'text-gray-600';

  return (
    <div className={`relative max-w-4xl text-center px-6 pt-16 sm:px-8 sm:pt-10 ${className}`}>
      <h2 className={`hero-heading text-3xl sm:text-5xl font-semibold mb-5 sm:mb-8 ${headingColor}`}>About Me</h2>
      <p className={`${paragraphColor} text-base leading-relaxed sm:text-2xl sm:leading-[1.7]`}>
        Hey, I&apos;m Huda. I studied CS at Columbia and I&apos;m now doing my master&apos;s in CS at KAUST. I&apos;m mainly interested in backend work,
        networks, and distributed systems, but I also enjoy designing interfaces and making small visual projects on the side. This portfolio is a mix
        of the engineering I build and the design work I do when I feel like switching gears.
      </p>
    </div>
  );
};

export default AboutText;
