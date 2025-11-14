'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Mail,
  ChevronDown,
  FileText,
  ChevronUp,
} from 'lucide-react';
import useMousePosition from '../utils/useMousePosition';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';

const useIsVisible = (ref, threshold = 0.15) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold });
    const node = ref.current;
    if (node) observer.observe(node);
    return () => node && observer.unobserve(node);
  }, [ref, threshold]);

  return visible;
};

const PillButton = ({ active = false, onClick, label, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
      active
        ? 'bg-gray-900 text-white border-gray-900'
        : 'text-gray-600 border-gray-200 hover:border-gray-300'
    }`}
  >
    <span>{label}</span>
    {typeof count === 'number' && <span className="ml-2 text-xs opacity-80">{count}</span>}
  </button>
);

const PillTag = ({ children, dark = false }) => (
                    <span 
    className={`px-2.5 py-1 text-xs rounded-full ${
      dark ? 'border border-white/30 text-white/80' : 'border border-gray-200 text-gray-600'
    }`}
                    >
    {children}
                    </span>
);

const ProjectCard = ({ project, index, onSelect }) => {
  const cardRef = useRef(null);
  const visible = useIsVisible(cardRef, 0.2);
  const isQalamCover = project.title?.toLowerCase().includes('qalam');
  const isTeaBrand = project.title?.toLowerCase().includes('tea brand');
  const isKhadrat = project.title?.toLowerCase().includes('khadrat colombo');

  return (
    <article
      ref={cardRef}
      className={`group rounded-3xl border border-white/12 bg-white/5 backdrop-blur overflow-hidden transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-col">
        <div
          className={`relative rounded-3xl overflow-hidden border-b border-white/10 ${
            isQalamCover
              ? 'h-48 bg-white flex items-center justify-center'
              : isKhadrat
              ? 'h-40 flex items-center justify-center bg-[#61181c]'
              : 'h-56'
          } ${isTeaBrand && !isKhadrat ? 'bg-[#61181c]' : ''}`}
        >
          <Image
            src={project.imageUrl}
            alt={`Screenshot of ${project.title}`}
            fill
            className={`opacity-90 transition-transform duration-700 group-hover:scale-[1.02] ${
              isQalamCover
                ? 'object-contain p-4'
                : isKhadrat
                ? 'object-contain p-6'
                : isTeaBrand
                ? 'object-contain p-4'
                : `object-cover ${project.title === 'Reading the Room' ? 'object-center' : 'object-top'}`
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="p-6 lg:p-8 flex flex-col gap-6 text-white">
          <div className="flex items-start justify-between gap-6">
          <div>
              <p className="text-sm uppercase tracking-[0.55em] text-white/70 hero-heading">
                {project.category} project
              </p>
              <h3 className="hero-heading text-4xl font-semibold">{project.title}</h3>
            </div>
            <span className="text-sm text-white/50">{project.year}</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 5).map((tech) => (
              <PillTag key={tech} dark>
                {tech}
              </PillTag>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm mt-auto">
            <div className="flex items-center gap-4">
              {project.github && (
              <a 
                href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/70 hover:text-white"
              >
                  <Github size={16} />
                  Code
              </a>
              )}
              {project.live && (
              <a 
                href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/70 hover:text-white"
              >
                  <ExternalLink size={16} />
                  Live
              </a>
              )}
            </div>
            <button
              onClick={() => onSelect(project)}
              className="inline-flex items-center gap-1 text-white/80 hover:text-white"
            >
              <FileText size={16} /> Details
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const ProjectDetail = ({ project, onBack }) => {
  const [expandedImage, setExpandedImage] = useState(null);
  const [expandedTitle, setExpandedTitle] = useState('');
  const [carouselIndex, setCarouselIndex] = useState({});

  useEffect(() => {
    if (!expandedImage) return;
    const onKey = (event) => {
      if (event.key === 'Escape') setExpandedImage(null);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedImage]);

  useEffect(() => {
    if (!project?.featureSections) {
      setCarouselIndex({});
      return;
    }
    setCarouselIndex(
      project.featureSections.reduce((acc, feature) => {
        acc[feature.title] = 0;
        return acc;
      }, {})
    );
  }, [project]);

  const handleCarousel = (title, total, direction) => {
    setCarouselIndex((prev) => {
      const current = prev[title] || 0;
      const nextIndex =
        direction === 'next'
          ? (current + 1) % total
          : (current - 1 + total) % total;
      return { ...prev, [title]: nextIndex };
    });
  };

  return (
    <>
  <div className="min-h-screen bg-black text-white">
    <header className="sticky top-0 z-30 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => {
            onBack();
            if (typeof window !== 'undefined') {
              setTimeout(() => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }
          }}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm tracking-[0.3em] uppercase hero-heading"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4 text-sm text-white/70">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              GitHub
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Live
            </a>
          )}
        </div>
      </div>
    </header>

    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-16 space-y-16">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.5em] text-white/60 hero-heading">Case Study</p>
        <div className="space-y-4">
          <h1 className="hero-heading text-5xl sm:text-6xl font-semibold">{project.title}</h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-3xl">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <PillTag key={tech} dark>
              {tech}
            </PillTag>
          ))}
        </div>
      </div>

      <div
        className="relative w-full h-[420px] rounded-3xl overflow-hidden flex items-center justify-center p-6"
        style={(() => {
          if (project.heroImageBg) return { backgroundColor: project.heroImageBg };
          if (['Inter-VLAN Routing Lab', 'Reading the Room', 'DNS Explorer'].includes(project.title)) {
            return { backgroundColor: '#000000' };
          }
          if (project?.brandSummaryHeading === 'Saffron & Palm Tea House') {
            return { backgroundColor: '#61181c' };
          }
          return { backgroundColor: '#ffffff' };
        })()}
      >
        <Image
          src={project.imageUrl}
          alt={`Screenshot of ${project.title}`}
          fill
          className={`object-contain max-w-full ${
            project?.brandSummaryHeading === 'Saffron & Palm Tea House' ? 'max-h-[85%]' : 'max-h-full'
          }`}
        />
      </div>

      <section className="grid md:grid-cols-2 gap-8 text-sm">
        <div className="space-y-4">
          <h2 className="hero-heading text-lg font-semibold tracking-[0.3em] uppercase text-white/70">
            Metadata
          </h2>
          <div className="space-y-2 text-white/70">
            <p>
              <span className="text-white/40 uppercase tracking-[0.4em] text-xs mr-3">Category</span>
              {project.category}
            </p>
            <p>
              <span className="text-white/40 uppercase tracking-[0.4em] text-xs mr-3">Year</span>
              {project.year}
            </p>
            <p className="text-white/50">
              Need more context? I can share private demos or artifacts on request.
            </p>
            <a
              href={`mailto:${project?.contact || 'ham2167@columbia.edu'}`}
              className="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium"
            >
              <Mail size={16} /> Contact me about this project
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="hero-heading text-lg font-semibold tracking-[0.3em] uppercase text-white/70">
            Stack & tooling
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <PillTag key={tech} dark>
                {tech}
              </PillTag>
            ))}
          </div>
        </div>
      </section>

          {project.brandSummary && (
            <section className="grid gap-8 md:grid-cols-[1.1fr,0.9fr] items-center">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.45em] text-white/60 hero-heading">
                  Brand story
                </p>
                <h3 className="hero-heading text-3xl font-semibold">{project.brandSummaryHeading || 'Tea House System'}</h3>
                <p className="text-white/75 leading-relaxed">{project.brandSummary}</p>
              </div>
            </section>
          )}

          {project.colorPalette && (
            <section className="space-y-6">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.45em] text-white/60 hero-heading">Color palette</p>
                <h3 className="hero-heading text-2xl font-semibold">
                  {project.colorPaletteTitle || 'Black Tea Tones'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-6">
                {project.colorPalette.map((swatch) => (
                  <div
                    key={`${swatch.hex}-${swatch.name}`}
                    className="flex flex-col items-center text-center gap-3 max-w-[160px]"
                  >
                    <span
                      className="h-20 w-20 rounded-full border border-white/10 shadow-lg"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="space-y-1">
                      {swatch.name && (
                        <span className="block text-white/60 text-xs uppercase tracking-[0.25em]">{swatch.name}</span>
                      )}
                      <span className="text-white/90 text-sm font-medium">{swatch.hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.typographyImages && (
            <section className="space-y-6">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.45em] text-white/60 hero-heading">Typography</p>
                <h3 className="hero-heading text-2xl font-semibold">Letterforms for Ritual</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {project.typographyImages.map((type) => (
                  <div
                    key={type.label}
                    className="rounded-3xl border border-white/10 bg-[#61181c] p-6 flex flex-col gap-4 items-center"
                  >
                    <span className="text-white/80 uppercase tracking-[0.3em] text-xs">{type.label}</span>
                    <div className="relative w-full h-52">
                      <Image
                        src={type.src}
                        alt={type.label}
                        fill
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.patterns && (
            <section className="space-y-6">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.45em] text-white/60 hero-heading">Patterns</p>
                <h3 className="hero-heading text-2xl font-semibold">Tabletop stories</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {project.patterns.map((pattern) => (
                  <div key={pattern.label} className="rounded-3xl border border-white/10 overflow-hidden bg-white/5">
                    <div className="p-4 flex items-center justify-between text-white/80 text-sm uppercase tracking-[0.3em]">
                      <span>{pattern.label}</span>
                      <span>Textile study</span>
                    </div>
                    <div className="relative w-full h-72 bg-white">
                      <Image src={pattern.src} alt={pattern.label} fill className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.brandElements && (
            <section className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.45em] text-white/60 hero-heading">Brand elements</p>
                <h3 className="hero-heading text-2xl font-semibold">{project.brandElementsHeading}</h3>
                <p className="text-white/75 leading-relaxed">{project.brandElements}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {project.elementImages?.map((element) => (
                  <div
                    key={element}
                    className="rounded-3xl border border-white/10 bg-[#fff5e1] overflow-hidden flex items-center justify-center p-4"
                  >
                    <div className="relative w-full h-40">
                      <Image src={element} alt="Hijazi element" fill className="object-contain" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

      {project.featureSections && (
        <section className="space-y-10">
          <h2 className="hero-heading text-3xl font-semibold">Feature tour</h2>
          <div className="space-y-10">
                {project.featureSections.map((feature, idx) => {
                  const imageFirst = feature.forceTextFirst ? false : idx % 2 !== 0;

                  return (
              <div
                key={feature.title}
                className={`grid gap-6 items-center ${
                  idx % 2 === 0 ? 'md:grid-cols-[1.1fr,0.9fr]' : 'md:grid-cols-[0.9fr,1.1fr]'
                }`}
              >
                      <div className={`${imageFirst ? 'md:order-2' : ''} space-y-3`}>
                  <p className="text-xs uppercase tracking-[0.45em] text-white/60 hero-heading">
                    Feature {idx + 1}
                  </p>
                  <h3 className="hero-heading text-2xl font-semibold">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
                      <div className={`${imageFirst ? 'md:order-1' : ''} rounded-2xl border border-white/10 bg-white/5 p-4`}>
                        <div className="flex items-center gap-4 justify-center">
                          <button
                            type="button"
                            onClick={() => handleCarousel(feature.title, feature.images.length, 'prev')}
                            disabled={feature.images.length <= 1}
                            className="p-3 rounded-full border border-white/10 text-white/70 hover:text-white disabled:opacity-30"
                            aria-label={`Previous ${feature.title} screenshot`}
                          >
                            <ArrowLeft size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedImage(feature.images[carouselIndex[feature.title] || 0]);
                              setExpandedTitle(feature.title);
                            }}
                            className="relative w-full max-w-2xl h-72 md:h-80 rounded-3xl border border-white/10 bg-white overflow-hidden flex items-center justify-center group"
                            aria-label={`Expand ${feature.title} screenshot`}
                          >
                    <Image
                              src={feature.images[carouselIndex[feature.title] || 0]}
                      alt={feature.title}
                              width={1400}
                              height={850}
                              className="w-full h-full object-contain"
                            />
                            <span className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-opacity duration-200" />
                            <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.35em] uppercase text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Tap to expand
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCarousel(feature.title, feature.images.length, 'next')}
                            disabled={feature.images.length <= 1}
                            className="p-3 rounded-full border border-white/10 text-white/70 hover:text-white disabled:opacity-30"
                            aria-label={`Next ${feature.title} screenshot`}
                          >
                            <ArrowRight size={18} />
                          </button>
                        </div>
                        {feature.images.length > 1 && (
                          <p className="text-center text-xs uppercase tracking-[0.35em] text-white/60 mt-4">
                            {String((carouselIndex[feature.title] || 0) + 1).padStart(2, '0')} /{' '}
                            {String(feature.images.length).padStart(2, '0')}
                          </p>
                        )}
                      </div>
                </div>
                  );
                })}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h2 className="hero-heading text-3xl font-semibold">Highlights</h2>
        <ul className="space-y-4 text-white/75 leading-relaxed">
          {(project.detailPoints || ['Detailed write-up coming soon.']).map((point) => (
            <li key={point} className="pl-5 border-l border-white/20">{point}</li>
          ))}
        </ul>
      </section>
    </main>
  </div>

      {expandedImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur flex flex-col items-center justify-center px-4">
          <button
            type="button"
            onClick={() => setExpandedImage(null)}
            className="self-end text-white/70 hover:text-white uppercase tracking-[0.35em] text-xs mb-4"
          >
            Close ×
          </button>
          <div className="relative w-full max-w-5xl h-[70vh] rounded-3xl border border-white/20 bg-white overflow-hidden">
            <Image
              src={expandedImage}
              alt={expandedTitle || 'Expanded screenshot'}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 90vw, 70vw"
            />
          </div>
        </div>
      )}
    </>
  );
};

  const projects = [
    {
    title: 'Qalam — Arabic Publishing Platform',
    description:
      'Qalam is an Arabic-first writing and publishing platform inspired by classic literary salons. It combines a distraction-free editor, personalized feeds, and author tools tailored to right-to-left storytelling. The name “Qalam” nods to the Arabic word for pen—the original interface for ideas.',
    imageUrl: '/qalam-logo.png',
    tech: ['Next.js', 'Tailwind CSS', 'Supabase', 'TipTap', 'Edge Functions'],
    year: '2025',
    category: 'Dev',
    live: 'https://qalamm.com/',
    github: 'https://github.com/hm2156/qalam',
    detailPoints: [
      'Custom RTL-aware editor with drafting, autosave, and publishing flows',
      'Personalized reading feed with follow graph + topic curation in Arabic',
      'Author dashboards for notifications, profile curation, and analytics-lite stats',
    ],
    featureSections: [
      {
        title: 'Explore & interact',
        description:
          'A curated Arabic feed surfaces essays, poetry, and opinions with a typography system tuned for readability. Readers can like, comment, and follow authors directly from the stream.',
        images: ['/qalam-expore.png', '/qalam-comments.png'],
      },
      {
        title: 'Writing studio',
        description:
          'A TipTap-based editor respects RTL input, custom callouts, references, and in-line diacritics. Drafts autosave, and publishing includes tags, cover selection, and preview links.',
        forceTextFirst: true,
        images: ['/qalam-publish.png'],
      },
      {
        title: 'Author profiles & following',
        description:
          'Each writer gets a profile with featured pieces, social links, and a follow CTA. Readers can explore author libraries, follow them, and comment in-thread with rich text replies.',
        images: ['/qalam-authorpagefollowwtc.png'],
      },
      {
        title: 'Notifications & settings',
        description:
          'Author dashboards summarize reads, reactions, and follower growth. A settings hub lets writers tweak newsletters, notification cadence, and Arabic/English UI toggles.',
        forceTextFirst: true,
        images: ['/qalam-dashboard.png', '/qalam-profilesettings.png'],
      },
    ],
  },
  {
    title: 'DNS Explorer',
    description: 'Interactive DNS resolver visualizer bridging infrastructure and education with real-time storytelling.',
    imageUrl: '/dns5.png',
    tech: ['React', 'FastAPI', 'Framer Motion', 'dnspython'],
    github: 'https://github.com/hm2156/dns-explorer',
    live: 'https://dns-explorer.vercel.app/',
    year: '2025',
    category: 'Dev',
    detailPoints: [
      'Animated resolver map tracking each hop with latency overlays',
      'Custom FastAPI resolver with caching for deterministic demos',
      'Designed for classroom walkthroughs and self-paced learning',
    ],
  },
  {
    title: 'Daily Digest',
    description: 'AI-powered news companion featuring sentiment analysis, topic trends, and adaptive reading modes.',
    imageUrl: '/dd8.png',
    tech: ['React', 'Tailwind', 'NewsAPI', 'Hugging Face'],
    github: 'https://github.com/hm2156/daily-digest',
    live: 'https://mydailydigest.vercel.app/',
    year: '2025',
    category: 'Dev',
    detailPoints: [
      'Semantic filters, offline reading list, and rapid search',
      'Hugging Face inference for summarization and tone detection',
      'Chart.js visualizations surface seven-day topic velocity',
    ],
  },
  {
    title: 'Reading the Room',
    description: 'Presidential tweet analysis blending NLP, journalism, and tactile visualization.',
    imageUrl: '/rtr.png',
    tech: ['Python', 'VADER', 'D3.js', 'Observable'],
    github: 'https://github.com/cpreston123/readingtheroom',
    live: 'https://readingtheroom.info',
    year: '2025',
    category: 'Dev',
    detailPoints: [
      'VADER sentiment pipeline seeded from archival data',
      'Observable notebooks for reproducible data storytelling',
      'Comparative tone clustering across administrations',
    ],
  },
  {
    title: 'Inter-VLAN Routing Lab',
    description: 'Packet-tracer lab documenting VLAN design, routing, and ACL policies for Finance ↔ HR segmentation.',
    imageUrl: '/iv.png',
    tech: ['Cisco Packet Tracer', 'Networking', 'ACL'],
    github: 'https://github.com/hm2156/intervlan-two-switches',
    live: 'https://github.com/hm2156/intervlan-two-switches',
    year: '2024',
    category: 'Dev',
  },
  {
    title: 'Khadrat Colombo Brand Identity',
    description: 'Visual identity for a Hijazi black-tea house, blending heirloom rituals with modern hospitality cues.',
    imageUrl: '/mainlogowithtext.png',
    tech: ['Brand Identity', 'Graphic Design', 'Illustration', 'Adobe Illustrator'],
    category: 'Design',
    detailPoints: [
      'Crafted a bilingual logo suite for packaging, retail, and merch',
      'Codified palette + typography to balance warmth with premium cues',
      'Documented iconography inspired by Hijazi architecture and glassware',
    ],
    brandSummaryHeading: 'Khadrat Colombo',
    brandSummary:
      'This brand identity was created to honor my mother’s cherished black-tea blend, transforming a family treasure into a heartfelt commercial brand. The design system draws deeply from Hijazi architectural elements—geometric patterns, warm earth tones, and the interplay of light and shadow—while the naming and storytelling reflect the personal heritage and hospitality at the brand’s core.',
    brandMarkImage: '/brandmark.png',
    brandMarkBg: '#efbd80',
    heroImageBg: '#61181c',
    colorPaletteTitle: 'Black Tea Tones',
    colorPalette: [
      {
        name: 'Mashrabiyyah Morning',
        hex: '#fff4e3',
        description:
          'The soft, filtered light that streams through carved wooden screens at dawn, when the world is quiet and the first pot of tea is brewing.',
      },
      {
        name: 'Desert Sun',
        hex: '#efbd80',
        description:
          'The golden warmth of afternoon light on sandstone walls, reminiscent of the welcoming glow of gathering spaces.',
      },
      {
        name: 'Copper Glow',
        hex: '#c46d28',
        description:
          'Rich and inviting, like the burnished copper of traditional tea serving vessels—a color that speaks of quality and craft.',
      },
      {
        name: 'Pomegranate Heart',
        hex: '#a4272e',
        description:
          'Deep, vibrant, and full of life— inspired by the jeweled fruit that adorns our gatherings and symbolizes abundance.',
      },
      {
        name: 'Red Tea Heart',
        hex: '#771213',
        description:
          'The deep, lustrous color of the tea itself—warm and unmistakable, the signature hue of my mother’s blend.',
      },
      {
        name: 'Palm Grove',
        hex: '#174632',
        description:
          'The cool, shaded green of palm fronds in Hijazi courtyards, offering respite and moments of calm.',
      },
      {
        name: 'Evening Garden',
        hex: '#0c291f',
        description:
          'The deepest green of night gardens, where conversations continue under the stars and tea is poured one last time.',
      },
    ],
    typographyImages: [
      { label: 'Display serif', src: '/typography-header.png' },
      { label: 'Body grotesk', src: '/typography-body.png' },
    ],
    patterns: [
      { label: 'Pattern 01', src: '/pattern1.png' },
      { label: 'Pattern 02', src: '/patternmain.png' },
    ],
    brandElementsHeading: 'Brand Elements – Inspired by Hijazi Architecture',
    brandElements:
      'Our icons reimagine the geometric patterns, arches, and palm motifs of traditional Hijazi architecture in a modern, minimal style. Each element reflects the warmth of our heritage—from carved mashrabiyyah panels to the iconic tea glass—telling a story of hospitality, community, and timeless flavor.',
    elementImages: ['/e1.png', '/e2.png', '/e3.png', '/e4.png', '/e5.png', '/e6.png', '/e7.png', '/e8.png', '/e9.png', '/e10.png', '/e11.png'],
  },
  ];

  const skills = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Ruby',
  'React',
  'Next.js',
  'FastAPI',
  'Rails',
  'PostgreSQL',
  'Tailwind CSS',
  'Framer Motion',
  'AWS',
];

const Hero = ({ profile }) => {
  const heroRef = useRef(null);
  const { x = 0, y = 0 } = useMousePosition();
  const [maskPos, setMaskPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const size = isHovered ? 320 : 100;

  useEffect(() => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    if (maskPos.x === 0 && maskPos.y === 0) {
      setMaskPos({ x: rect.width * 0.35, y: rect.height * 0.4 });
    }
    let raf;
    const update = () => {
      setMaskPos({
        x: x - rect.left,
        y: y - rect.top,
      });
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [x, y, maskPos.x, maskPos.y]);

  const renderHeroCopy = (inverted = false, handlers = {}) => {
    const labelColor = inverted ? 'text-white/70' : 'text-gray-400';
    const headingColor = inverted ? 'text-white' : 'text-gray-900';
    const bodyColor = inverted ? 'text-white/80' : 'text-gray-600';
    return (
      <div className={`space-y-6 ${inverted ? 'mix-blend-difference text-white' : ''}`} {...handlers}>
        <div className={`flex items-center gap-3 text-sm uppercase tracking-[0.3em] font-medium ${inverted ? 'text-white/80' : 'text-gray-700'}`}>
          <span>Portfolio</span>
          <span>•</span>
          <span>{new Date().getFullYear()}</span>
        </div>
        <p className={`text-sm uppercase tracking-[0.4em] font-medium ${labelColor}`}>Huda Marta</p>
        <h1 className={`hero-heading text-6xl sm:text-7xl lg:text-8xl font-semibold leading-tight max-w-4xl ${headingColor}`}>
          Hi, I&apos;m Huda.
        </h1>
        <p className={`text-lg sm:text-xl max-w-3xl leading-relaxed ${bodyColor}`}>
          I&apos;m a developer who sometimes designs, or maybe a designer who won&apos;t stop coding. Either way, here&apos;s some of my work.
        </p>
      </div>
    );
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-screen overflow-hidden bg-white text-gray-900"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ 
          backgroundColor: '#050505',
          WebkitMaskImage: "url('/mask.svg')",
          maskImage: "url('/mask.svg')",
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
        animate={{
          WebkitMaskPosition: `${maskPos.x - size / 2}px ${maskPos.y - size / 2}px`,
          maskPosition: `${maskPos.x - size / 2}px ${maskPos.y - size / 2}px`,
          WebkitMaskSize: `${size}px`,
          maskSize: `${size}px`,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.4 }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-5xl w-full">
            {renderHeroCopy(true)}
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-5xl w-full">
          {renderHeroCopy(false, {
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
          })}
        </div>
          </div>

      <div className="absolute bottom-10 inset-x-0 z-10 flex justify-center">
              <button 
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-gray-500 hover:text-gray-900 animate-bounce"
          aria-label="Scroll to about"
              >
          <ChevronDown size={32} />
              </button>
        </div>
      </section>
  );
};


const CategoryToggle = ({ selected, onChange, counts }) => (
// ... (CategoryToggle remains the same)
  <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 p-1 text-sm font-medium backdrop-blur">
    {['Dev', 'Design'].map((option) => {
      const active = selected === option;
      return (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`relative px-4 py-1.5 transition-all ${
            active ? 'text-black' : 'text-white/70'
          }`}
        >
          <span
            className={`absolute inset-0 rounded-full transition ${
              active ? 'bg-white text-black shadow-sm' : 'bg-transparent'
            }`}
          />
          <span className="relative z-10 flex items-center gap-2">
            {option}
            <span className="text-xs">
              {typeof counts[option] === 'number' ? counts[option] : 0}
            </span>
          </span>
        </button>
      );
    })}
                    </div>
);

const Portfolio = () => {
  const profile = {
    name: 'Huda Marta',
    email: 'ham2167@columbia.edu',
    github: 'https://github.com/hm2156',
    linkedin: 'https://linkedin.com/in/huda-marta',
  };

  const [selectedCategory, setSelectedCategory] = useState('Dev');
  const [selectedProject, setSelectedProject] = useState(null);

  const counts = projects.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const filtered = projects.filter((p) => p.category === selectedCategory);

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Hero profile={profile} />

      <AboutSection />

      <section id="projects" className="pt-40 pb-32 px-6 bg-black text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.5em] text-white/60 hero-heading">Selected work</p>
              <h2 className="hero-heading text-6xl sm:text-7xl font-semibold">{selectedCategory} Projects</h2>
                </div>
            <div className="text-sm text-white">
              <CategoryToggle selected={selectedCategory} onChange={setSelectedCategory} counts={counts} />
            </div>
          </div>

          <div className="grid gap-12">
            {filtered.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} onSelect={setSelectedProject} />
            ))}
          </div>
        </div>
      </section>

      <ContactSection profile={profile} />



      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className="fixed bottom-4 right-4 z-40 inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-300 bg-white text-gray-700 shadow-lg hover:bg-gray-50"
      >
        <ChevronUp size={18} />
      </button>
    </div>
  );
};

export default Portfolio;