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
      dark
        ? 'border border-[#f7dfc4]/40 text-[#f7dfc4]/90'
        : 'border border-gray-200 text-gray-600'
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
      className={`group rounded-3xl border border-white/12 bg-white/5 backdrop-blur overflow-hidden transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(project);
        }
      }}
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
              onClick={(event) => {
                event.stopPropagation();
                onSelect(project);
              }}
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [project]);

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
          {project.caseStudyLink && (
            <a href={project.caseStudyLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Case study
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
        {(project.github || project.live) && (
          <div className="flex items-center gap-4 pt-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ExternalLink size={18} />
                <span>Live Site</span>
              </a>
            )}
          </div>
        )}
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

          {project.caseStudySections?.length > 0 && (
            <section className="space-y-8">
              {project.caseStudySections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.45em] text-white/60 hero-heading">{section.badge || 'Case study'}</p>
                  <h3 className="hero-heading text-2xl font-semibold">{section.title}</h3>
                  <div className="space-y-3 text-white/75 leading-relaxed">
                    {section.paragraphs.map((para) => (
                      <p key={para.slice(0, 30)}>{para}</p>
                    ))}
                  </div>
                </div>
              ))}
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
    title: 'Qalam — قَلم',
    description:
      'A fully-fledged Arabic publishing pipeline engineered for performance, editorial control, and RTL-native authoring. The system combines Next.js ISR/SSR hybrid rendering with Supabase Postgres + RLS for secure, scalable content management, TipTap editor extensions for Arabic-first writing, and event-driven notifications via Brevo.',
    imageUrl: '/banner1.png',
    tech: ['Next.js', 'Supabase', 'PostgreSQL', 'TipTap', 'Brevo', 'Tailwind CSS'],
    year: '2025',
    category: 'Dev',
    live: 'https://qalamm.com/',
    github: 'https://github.com/hm2156/qalam',
    detailPoints: [
      'Extended TipTap with strict RTL defaults, Arabic-aware cursor behavior, and server-side draft validation for native Arabic writing experience',
      'Stateful moderation pipeline: draft → pending_review → approve/reject workflow with versioned revisions, admin comments, and audit trails via Row-Level Security policies',
      'Normalized social graph with follows, likes, and threaded comments, plus event-driven notification system queued through Brevo for non-blocking delivery',
      'ISR/SSR hybrid rendering for fast article loads, optimized Postgres indexes for read-heavy workloads, and edge-rendered metadata for sharing previews',
    ],
    featureSections: [
      {
        title: 'Arabic-First Editing Engine',
        description:
          'Most editors fail with Arabic because cursor movement, bidirectional text, and line-breaking patterns aren\'t handled correctly. I extended TipTap with strict RTL defaults across all nodes, custom text direction normalization, Arabic-aware selection/cursor behavior, autosave with debounced server writes, and server-side validation of draft content. This prevents corrupted text states and ensures that Arabic writing feels native at every interaction.',
        images: ['/qalam-publish.png'],
        forceTextFirst: true,
      },
      {
        title: 'Moderation Pipeline & Policy Enforcement',
        description:
          'Qalam uses a stateful publishing workflow rather than simple flags. Each article moves through draft → pending_review (locked from further editing) → admin dashboard decision (approve → published, or reject → rejected with reviewer comments). The system implements role-protected admin routes via RLS + server actions, versioned article revisions for traceability, admin comments linked to specific drafts for full auditability, and rejection reasoning attached to the writer\'s dashboard with actionable feedback. This ensures editorial consistency, safety, and integrity.',
        images: ['/qalam-dashboard.png', '/qalam-profilesettings.png'],
        forceTextFirst: true,
      },
      {
        title: 'Social Graph & Event-Driven Notifications',
        description:
          'A normalized follows table models follower → author relationships with per-author notification preferences. Interactions are transactionally safe with unique constraints on likes to prevent duplicates, threaded comments with hierarchical parent IDs, and notification events generated on insert triggers via server actions. Policies + settings define who gets notified and when: authors get notified on new followers, followers get emailed on new published posts, and writers get alerts when their submissions are reviewed. All notifications are queued and sent via Brevo, ensuring non-blocking UI, resilient delivery, and structured templates for consistency.',
        images: ['/qalam-expore.png', '/qalam-comments.png', '/qalam-authorpagefollowwtc.png'],
      },
      {
        title: 'Infrastructure & Performance Architecture',
        description:
          'Qalam applies SSR for article pages (ideal for SEO and initial load), client-side hydration for interactivity (likes, comments, follow), edge-rendered metadata for sharing links and previews, optimized Postgres indexes on author_id, status, and created_at, and caching for anonymous readers to reduce DB load. The platform also implements RTL-aware CSS with logical properties, mirrored UI flows where necessary, Arabic numbers & formatting, custom typography tokens tuned for readability, and correct text shaping across browsers. This model scales well for read-heavy publishing platforms while ensuring a first-class Arabic reading and writing experience.',
        images: ['/qalam-main.png'],
        forceTextFirst: true,
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
    description: 'Presidential tweet analysis comparing Obama and Trump timelines using NLP and exploratory visualizations.',
    imageUrl: '/rtr.png',
    tech: ['Python', 'VADER', 'D3.js', 'Observable', 'Observable Framework'],
    github: 'https://github.com/cpreston123/readingtheroom',
    live: 'https://readingtheroom.info',
    caseStudyLink: 'https://medium.com/@cpp2129/reading-the-room-3d67b0743d53',
    year: '2025',
    category: 'Dev',
    detailPoints: [
      'Analyzed 8 years of Obama + Trump tweets with VADER sentiment scoring and topic lookups',
      'Built Observable visualizations for tone shifts over time plus country-specific mentions',
      'Documented findings and related research in a long-form Medium case study',
    ],
    longDescription:
      'Reading the Room is a comparative sentiment analysis of President Obama’s (2013–2017) and President Trump’s (2017–2021) Twitter archives. We wanted to understand how official messaging tone and subject ebb and flow with political and economic events, so we paired large-scale tweet scraping with VADER scoring, keyword lookups, and interactive Observable charts.',
    caseStudySections: [
      {
        title: 'Introduction & Related Work',
        badge: 'Medium excerpt',
        paragraphs: [
          'Twitter has become a primary venue for political communication, so we treated presidential tweets as signals for agenda, tone, and priority. We asked how shifts in language align with real political and economic events.',
          'We drew inspiration from PoliTweet.org’s archives, Bloomberg’s coverage of market reactions to Trump’s tweets, Cornell’s data-viz studios, and numerous Medium walkthroughs on sentiment analysis with VADER. That prior art shaped both our methodology and storytelling goals.',
        ],
      },
      {
        title: 'Methodology',
        paragraphs: [
          'Twitter’s API limits kept us from collecting everything ourselves, so we combined two vetted datasets: Obama’s official tweets (2013–2017) and Trump’s (2017–2021). The identical four-year windows let us compare tone head-to-head.',
          'After cleaning the data, we used VADER (Valence Aware Dictionary and sEntiment Reasoner) to calculate positive, neutral, negative, and compound scores for every tweet. We then appended counts of country mentions via lookup tables to empower geographic analysis.',
        ],
      },
      {
        title: 'Design',
        paragraphs: [
          'Our first visualization is a sentiment-over-time scatterplot with color-coded administrations, dot-size emphasis on search matches, and interactive keyword filters. We tested bar/area charts but they hid tweet-level nuance.',
          'The second view is a country mention timeline that turns into a line chart when filtered to a single country. Throughout the site we added “how to explore” tips after classmates asked for clearer affordances.',
        ],
      },
      {
        title: 'Implementation',
        paragraphs: [
          'We built the experience in Observable Framework using D3/Plot. Data wrangling and scoring happened in Python; we cached processed datasets so interactions stayed responsive. The combination let us prototype quickly while keeping the client lightweight.',
        ],
      },
      {
        title: 'Discussion',
        paragraphs: [
          'Classmates appreciated the scale of the data and the clarity of the visual storytelling. The project made it easier to examine how tone shifts map to world events and what role language plays in political communication. The work also sharpened our approach to NLP + visualization handoffs.',
        ],
      },
      {
        title: 'Future Work',
        paragraphs: [
          'We plan to formalize statistical correlations between tone, topics, and events, and to run sentiment analyses by thematic groups (healthcare, economy, foreign policy) using topic models like BERTopic. Longer term, we’d like to embed those findings back into the visualization.',
        ],
      },
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
      'Arabic Signature: Arabic-only logo with geometric letterforms inspired by Hijazi arches, balancing minimalism with cultural resonance',
      'Brand Mark: A scalable, abstract symbol of the tea ritual (cup and architectural framing), anchoring the identity across all touchpoints',
      'Iconography: Minimal illustrated elements (palm silhouettes, stylized mashrabiyyah) derived from Hijazi architecture, maintained by a cohesive stroke system',
      'Color Palette: Comprehensive tones drawn from the red tea and warm Desert Sun environment, establishing a rich, grounded atmosphere',
      'Typography: A balanced bilingual system pairing an expressive display serif for heritage with a clean grotesk for modern readability',
      'Textile Patterns: Geometric compositions simplifying Hijazi mashrabiyyah screens, used for added cultural texture in packaging and merchandise',
      'Premium Packaging: Tactile, warm presentation utilizing deep color fields and the Arabic logo as the focal point, reflecting the ritual of service',
    ],
    brandSummaryHeading: 'Khadrat Colombo',
    brandSummary:
      'Khadrat Colombo is a brand identity created for my mother\'s signature red-tea blend, a homegrown recipe deeply tied to Hijazi hospitality and the rituals of serving tea to guests. I designed a complete visual system that translates this emotional world into a modern, culturally rooted brand—spanning logo, patterns, illustrations, packaging, color theory, and typography. The identity blends Hijazi architectural motifs, warm tea-house textures, and contemporary minimalism to create a brand that feels both handcrafted and premium.',
    brandMarkImage: '/brandmark.png',
    brandMarkBg: '#efbd80',
    heroImageBg: '#61181c',
    colorPaletteTitle: 'Red Tea & Hijazi Palette',
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
    brandElementsHeading: 'Illustrated Elements & Iconography – Inspired by Hijazi Architecture',
    brandElements:
      'I designed a suite of illustrated elements inspired by Hijazi architecture and home rituals, reimagined through a minimal, modern lens. These include geometric palm motifs, mashrabiyyah-inspired linework, abstract arches and windows, and tea-related silhouettes. All elements share consistent stroke weights, curvature logic, and spacing systems so the identity remains cohesive across applications.',
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
  const currentYear = new Date().getFullYear();

    return (
    <section
      id="hero"
      className="relative min-h-screen bg-black text-white flex flex-col justify-center overflow-hidden px-6 sm:px-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,1)_70%)]" />

      <div className="relative z-10 max-w-5xl mx-auto w-full space-y-10">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-white/50">{currentYear} — Portfolio</p>
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">Huda Marta</p>
        </div>

        <h1 className="hero-heading text-[16vw] sm:text-[10vw] font-semibold leading-[0.9] text-[#f7dfc4] drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          Hi, I&apos;m Huda
        </h1>

        <p className="text-white/70 text-base sm:text-lg max-w-2xl leading-relaxed">
        I build things somewhere between engineering and design —
from distributed systems and backend architecture to interfaces that actually feel good to use.
          </p>

        <div className="flex gap-5 pt-6 text-white/70">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github size={22} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={22} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="hover:text-white transition-colors"
            aria-label="Email"
          >
            <Mail size={22} />
          </a>
          </div>
        </div>

      <div className="absolute bottom-10 inset-x-0 flex justify-center">
              <button 
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-white/60 hover:text-white animate-bounce"
          aria-label="Scroll to projects"
              >
          <ChevronDown size={32} />
              </button>
        </div>
      </section>
  );
};


const CategoryToggle = ({ selected, onChange, counts }) => (
  <div className="inline-flex items-center rounded-2xl border border-white/20 bg-white/10 p-1.5 text-base font-medium backdrop-blur">
    {['Dev', 'Design'].map((option) => {
      const active = selected === option;
      return (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`relative px-6 py-3 transition-all ${
            active ? 'text-black' : 'text-white/70 hover:text-white'
          }`}
        >
          <span
            className={`absolute inset-0 rounded-xl transition ${
              active ? 'bg-[#f7dfc4] text-black shadow-lg' : 'bg-transparent'
            }`}
          />
          <span className="relative z-10 flex items-center gap-2 font-semibold">
            {option}
            <span className="text-sm opacity-80">
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
  const otherCarouselRef = useRef(null);

  const counts = projects.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const filtered = projects.filter((p) => p.category === selectedCategory);
  const featuredMap = {
    Dev: 'Qalam — قَلم',
    Design: 'Khadrat Colombo Brand Identity',
  };
  const featuredProject = projects.find(
    (p) => p.title === featuredMap[selectedCategory]
  );
  const nonFeatured = featuredProject
    ? filtered.filter((p) => p.title !== featuredProject.title)
    : filtered;

  const scrollOtherCarousel = (direction) => {
    if (!otherCarouselRef.current) return;
    const amount = otherCarouselRef.current.offsetWidth || 400;
    otherCarouselRef.current.scrollBy({
      left: direction * amount,
      behavior: 'smooth',
    });
  };

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Hero profile={profile} />

      <section id="projects" className="pt-25 pb-32 px-6 bg-black text-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.5em] text-[#f7dfc4]/70 hero-heading">Selected work</p>
              <CategoryToggle selected={selectedCategory} onChange={setSelectedCategory} counts={counts} />
              <h2 className="hero-heading text-6xl sm:text-7xl font-semibold text-[#f7dfc4]">{selectedCategory} Projects</h2>
              <p className="text-sm uppercase tracking-[2em] text-[#f7dfc4]/70 hero-heading font-boldpt-2">Click on project for more details</p>
            </div>
          </div>

              {featuredProject && (
            <div className="hidden lg:block">
              <button
                type="button"
                onClick={() => setSelectedProject(featuredProject)}
                className="group w-full text-left"
                aria-label={`View ${featuredProject.title} details`}
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5">
                  <div className="grid grid-cols-[1.1fr,0.9fr] gap-8 items-center p-10">
                    <div className="space-y-5">
                      <span className="inline-flex items-center gap-2 text-base uppercase tracking-[0.45em] text-[#f7dfc4] font-semibold hero-heading">
                        Featured
                      </span>
                      <h3 className="hero-heading text-3xl font-semibold">{featuredProject.title}</h3>
                      <p className="text-white/75 leading-relaxed max-w-2xl">
                        {featuredProject.description}
                      </p>
                      <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-[#f7dfc4]">
                        <span className="rounded-full border border-[#f7dfc4]/30 px-3 py-1 bg-[#f7dfc4]/10 group-hover:bg-[#f7dfc4]/20 transition">
                          View details
                        </span>
                        <ArrowRight size={16} className="text-[#f7dfc4]" />
                      </div>
                    </div>
                    <div className={`relative w-full h-[340px] rounded-2xl border border-white/10 overflow-hidden ${
                      featuredProject.title?.toLowerCase().includes('qalam') 
                        ? 'bg-white' 
                        : featuredProject.title?.toLowerCase().includes('khadrat')
                        ? 'bg-[#61181c]'
                        : 'bg-white/5'
                    }`}>
                      <Image
                        src={featuredProject.imageUrl}
                        alt={featuredProject.title}
                        fill
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <span className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.35em] uppercase opacity-0 group-hover:opacity-100 transition ${
                        featuredProject.title?.toLowerCase().includes('qalam')
                          ? 'text-gray-700'
                          : 'text-white/70'
                      }`}>
                        Click to view
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Mobile/Tablet list (grid) */}
          <div className="grid gap-12 lg:hidden">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                onSelect={setSelectedProject}
              />
            ))}
          </div>

          {/* Large-screen horizontal carousel for other selected work */}
          {nonFeatured.length > 0 && (
            <div className="relative hidden lg:block">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xl uppercase tracking-[0.35em] text-white hero-heading font-semibold">
                  Other selected work
                </p>
                <div className="flex items-center gap-3">
                        <button
                          type="button"
                    onClick={() => scrollOtherCarousel(-1)}
                    className="p-3 rounded-full border border-white/20 text-white/80 hover:text-white bg-black/40"
                          aria-label="Scroll previous projects"
                        >
                          <ArrowLeft size={18} />
                        </button>
                        <button
                          type="button"
                    onClick={() => scrollOtherCarousel(1)}
                    className="p-3 rounded-full border border-white/20 text-white/80 hover:text-white bg-black/40"
                          aria-label="Scroll next projects"
                        >
                          <ArrowRight size={18} />
                        </button>
                </div>
              </div>
                    <div
                ref={otherCarouselRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pr-4 pb-4 [&::-webkit-scrollbar]:hidden"
                      style={{ scrollbarWidth: 'none' }}
                aria-label="Other selected projects carousel"
              >
                {nonFeatured.map((project, index) => (
                  <div key={project.title} className="min-w-[560px] snap-start">
                              <ProjectCard
                                project={project}
                                index={index}
                                onSelect={setSelectedProject}
                              />
                        </div>
                      ))}
                  </div>
                </div>
              )}
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