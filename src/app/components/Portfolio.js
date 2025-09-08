'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Github, Linkedin, ExternalLink, ArrowRight, FileText, Mail, MapPin, Calendar, GraduationCap, BookOpen, ArrowLeft, Code, Zap, Globe, Database, Cpu, Shield } from 'lucide-react';

const InteractiveTerminal = ({ scrollToSection }) => {
  const [lines, setLines] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const [showCursor, setShowCursor] = useState(true);

  const commandOutput = {
    help: (
      <div className="space-y-4 text-left">
        <p className="text-cyan-400">portfolio {"<command>"}</p>
        <p className="text-zinc-300">
          Available commands:
        </p>
        <div className="pl-4 space-y-1 text-sm text-zinc-400">
          <p><span className="text-cyan-400 font-mono">`whoami`</span> - Displays professional bio</p>
          <p><span className="text-cyan-400 font-mono">`experience`</span> - Shows work experience</p>
          <p><span className="text-cyan-400 font-mono">`education`</span> - View education details</p>
          <p><span className="text-cyan-400 font-mono">`skills`</span> - List technical skills</p>
          <p><span className="text-cyan-400 font-mono">`contact`</span> - Display contact information</p>
          <p><span className="text-cyan-400 font-mono">`clear`</span> - Clear terminal output</p>
        </div>
        <p className="text-zinc-300">All commands:</p>
        <div className="pl-4 space-y-1 text-sm text-zinc-400">
          <p>
            <span className="text-cyan-400 font-mono">about, whoami, experience, education, skills, contact, clear, help</span>
          </p>
        </div>
        <p className="text-zinc-500">
          Use `portfolio {"<command>"}` for specific info.
        </p>
      </div>
    ),
    about: (
      <div className="space-y-3 text-left">
        <p className="text-cyan-400">Loading profile...</p>
        <div className="space-y-2">
          <p className="text-zinc-200">Computer Science student at Columbia University with hands-on experience in full-stack development.</p>
          <p className="text-zinc-300">Specialized in React ecosystems, backend systems, and cloud infrastructure through internships at YC companies.</p>
        </div>
        <p className="text-zinc-500 animate-pulse">Executing scroll-to-about.sh...</p>
      </div>
    ),
    education: (
      <div className="space-y-2 text-left">
        <p className="text-cyan-400">Fetching academic records...</p>
        <div className="space-y-2 pl-4">
          <p className="text-zinc-200"><span className="text-cyan-400">Columbia University</span> - Bachelor of Science in Computer Science</p>
          <p className="text-zinc-400">Sept 2021 - May 2025 | New York, NY</p>
          <p className="text-zinc-300 text-sm">Relevant Coursework: Advanced Programming, Mobile iOS Development, Full-Stack Web Development, Databases, NLP, Distributed Systems, Cloud Computing</p>
        </div>
        <p className="text-zinc-500 animate-pulse">Executing scroll-to-about.sh...</p>
      </div>
    ),
    experience: (
      <div className="space-y-2 text-left">
        <p className="text-cyan-400">Parsing work history...</p>
        <p className="text-zinc-300">3 internship positions found</p>
        <p className="text-zinc-500 animate-pulse">Executing scroll-to-about.sh...</p>
      </div>
    ),
    skills: (
      <div className="space-y-2 text-left">
        <p className="text-cyan-400">Tech stack analysis:</p>
        <div className="grid grid-cols-2 gap-2 text-sm pl-4">
          <div><span className="text-cyan-400">Languages:</span> Python, JavaScript, TypeScript, Ruby</div>
          <div><span className="text-cyan-400">Frontend:</span> React, Next.js, React Native</div>
          <div><span className="text-cyan-400">Backend:</span> Node.js, Ruby on Rails, Firebase</div>
          <div><span className="text-cyan-400">Cloud:</span> AWS, GCP, Docker, Kubernetes</div>
          <div><span className="text-cyan-400">Databases:</span> PostgreSQL, MongoDB, Redis</div>
          <div><span className="text-cyan-400">Tools:</span> GitHub Actions, Sentry, RSpec</div>
        </div>
      </div>
    ),
    contact: (
      <div className="space-y-3 text-left">
        <p className="text-cyan-400">Contact information:</p>
        <div className="space-y-2 pl-4">
          <div className="flex items-center space-x-2">
            <Mail size={14} className="text-cyan-400" />
            <a href="mailto:ham2167@columbia.edu" className="text-zinc-200 hover:text-cyan-400 transition-colors">
              ham2167@columbia.edu
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Github size={14} className="text-cyan-400" />
            <a href="https://github.com/hm2156" className="text-zinc-200 hover:text-cyan-400 transition-colors">
              github.com/hm2156
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Linkedin size={14} className="text-cyan-400" />
            <a href="https://linkedin.com/in/huda-marta" className="text-zinc-200 hover:text-cyan-400 transition-colors">
              linkedin.com/in/huda-marta
            </a>
          </div>
        </div>
        <p className="text-zinc-500 animate-pulse">Executing scroll-to-contact.sh...</p>
      </div>
    ),
  };

  useEffect(() => {
    // Typewriter effect for initial message
    const welcomeMessage = "Hi! I'm Huda welcome to my portfolio. Type 'help' to explore.";
    setLines(['> cat welcome.txt']);
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < welcomeMessage.length) {
        setLines(prev => [
          '> cat welcome.txt',
          welcomeMessage.substring(0, i + 1) + (i < welcomeMessage.length - 1 ? '▋' : '')
        ]);
        i++;
      } else {
        setLines(prev => [
          '> cat welcome.txt',
          welcomeMessage,
          ''
        ]);
        clearInterval(typeInterval);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  const handleCommand = async (command) => {
    if (!command.trim()) return;
    
    setIsTyping(true);
    
    // Add command to history
    setLines(prev => [...prev, `> ${command}`]);
    
    // Update command history
    setHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'clear') {
      setLines(['']);
    } else if (cmd === 'about' || cmd === 'whoami') {
      setLines(prev => [...prev, commandOutput.about, '']);
      setTimeout(() => scrollToSection('about'), 500);
    } else if (cmd === 'education') {
      setLines(prev => [...prev, commandOutput.education, '']);
      setTimeout(() => scrollToSection('about'), 500);
    } else if (cmd === 'experience' || cmd === 'history') {
      setLines(prev => [...prev, commandOutput.experience, '']);
      setTimeout(() => scrollToSection('about'), 500);
    } else if (cmd === 'skills') {
      setLines(prev => [...prev, commandOutput.skills, '']);
    } else if (cmd === 'contact' || cmd === 'connect') {
      setLines(prev => [...prev, commandOutput.contact, '']);
      setTimeout(() => scrollToSection('contact'), 500);
    } else if (cmd === 'help') {
      setLines(prev => [...prev, commandOutput.help, '']);
    } else {
      setLines(prev => [...prev, `command not found: ${command}. Type 'help' for available commands.`, '']);
    }
    
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = inputValue.trim();
      handleCommand(command);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setInputValue(history[newIndex]);
        setHistoryIndex(newIndex);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setInputValue('');
          setHistoryIndex(-1);
        } else {
          setInputValue(history[newIndex]);
          setHistoryIndex(newIndex);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const commands = ['help', 'about', 'whoami', 'experience', 'education', 'skills', 'contact', 'clear'];
      const partial = inputValue.toLowerCase();
      const matches = commands.filter(cmd => cmd.startsWith(partial));
      if (matches.length === 1) {
        setInputValue(matches[0]);
      }
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div 
      className={`bg-zinc-900 border-2 rounded-xl overflow-hidden shadow-2xl shadow-black/50 max-w-3xl mx-auto cursor-text transition-all duration-300 ${
        isFocused ? 'border-cyan-400/50 shadow-cyan-400/20' : 'border-zinc-700 hover:border-zinc-600'
      }`}
      onClick={handleTerminalClick}
    >
      <div className="flex items-center px-6 py-4 bg-zinc-800 border-b border-zinc-700">
        <div className="flex space-x-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-sm font-mono text-zinc-400">
          huda-portfolio-terminal
        </div>
        <div className="w-16 text-right text-xs text-zinc-500">
          {isFocused ? 'active' : 'click to focus'}
        </div>
      </div>
      
      <div 
        className="p-6 font-mono text-sm max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800" 
        ref={terminalRef}
      >
        {lines.map((line, index) => (
          <div key={index} className="mb-1 text-left">
            {typeof line === 'string' ? (
              <span className={line.startsWith('>') ? "text-cyan-400" : "text-zinc-300"}>
                {line}
              </span>
            ) : (
              line
            )}
          </div>
        ))}
        
        <div className="flex items-center mb-1 text-left">
          <span className="text-cyan-400">{'>'} </span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-zinc-200 caret-transparent ml-1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoFocus
            spellCheck="false"
            disabled={isTyping}
            placeholder={!isFocused ? "Click to start typing..." : ""}
          />
          {(showCursor && isFocused) && (
            <span className="bg-cyan-400 text-zinc-900 ml-1 animate-pulse">█</span>
          )}
        </div>
        
        {isFocused && (
          <div className="text-xs text-zinc-600 mt-2">
            Use ↑/↓ for history, Tab for autocomplete, &apos;help&apos; for commands
          </div>
        )}
      </div>
    </div>
  );
};

const TimelineItem = ({ experience, index }) => {
  const itemRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={itemRef} 
      className={`relative flex items-start transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-cyan-400 mt-1.5 z-10 shadow-lg shadow-cyan-400/50" />
      <div className="ml-8 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-cyan-400 font-mono px-2 py-1 bg-cyan-400/10 rounded border border-cyan-400/20">
            {experience.date}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-zinc-100 mb-1">{experience.title}</h3>
        <p className="text-zinc-200 font-medium mb-3">{experience.company}</p>
        <p className="text-zinc-400 leading-relaxed">{experience.description}</p>
      </div>
    </div>
  );
};

const TerminalSection = ({ title, filename, icon: Icon, children, className = "" }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } ${className}`}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg font-mono text-sm text-zinc-400">
          <span className="text-cyan-400">$</span>
          <span>cat {filename}</span>
        </div>
        <div className="h-px bg-zinc-800 flex-1" />
      </div>
      
      {/* Section Title */}
      <h3 className="text-2xl font-semibold mb-8 text-zinc-100 flex items-center gap-3">
        {Icon && <Icon size={24} className="text-cyan-400" />}
        {title}
      </h3>
      
      {/* Content */}
      {children}
    </div>
  );
};

const TerminalAboutText = ({ skills }) => {
  return null; // This component is no longer used
};

const TerminalEducation = ({ education }) => {
  return (
    <TerminalSection title="Education" filename="transcript.txt" icon={GraduationCap}>
      <div className="space-y-6">
        <div className="relative p-6 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group">
          <div className="absolute -left-1 top-6 w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
            <div>
              <h4 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors">
                Columbia University
              </h4>
              <p className="text-cyan-400 font-medium">Bachelor of Science in Computer Science</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-zinc-400 font-mono px-3 py-1 bg-zinc-800 rounded border border-zinc-700">
                Sept 2021 - May 2025
              </span>
              <p className="text-sm text-zinc-500 mt-1">New York, NY</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <BookOpen size={16} className="text-cyan-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-zinc-400 mb-2">Relevant Coursework:</p>
                <div className="flex flex-wrap gap-2">
                  {education.courses.map((course, index) => (
                    <span 
                      key={index}
                      className="text-xs px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full hover:border-cyan-400/30 transition-colors"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TerminalSection>
  );
};

const TerminalExperience = ({ experiences }) => {
  return (
    <TerminalSection title="Work Experience" filename="internships.log" icon={Calendar}>
      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-zinc-800" />
        <div className="space-y-0">
          {experiences.map((exp, index) => (
            <TimelineItem key={index} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </TerminalSection>
  );
};

const TerminalProjectCard = ({ project, index, onViewDetails }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden transition-all duration-700 hover:border-zinc-700 hover:bg-zinc-800/50 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex items-center px-6 py-4 bg-zinc-800 border-b border-zinc-700">
        <div className="flex space-x-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-sm font-mono text-zinc-400">
          projects/{project.title.toLowerCase().replace(/\s+/g, '-')}.md
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="relative w-full h-56 overflow-hidden rounded-xl mb-6">
          <Image
            src={project.imageUrl}
            alt={`Screenshot of ${project.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-xl font-semibold text-zinc-200 group-hover:text-zinc-50 transition-colors duration-300 mb-2">
              {project.title}
            </h3>
            <p className="text-zinc-400 leading-relaxed">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span 
                key={tech}
                className="text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 transition-all duration-300 group-hover:border-zinc-600 group-hover:text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto pt-6">
            <div className="flex space-x-6">
              <button 
                onClick={() => onViewDetails(project)}
                className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-200 transition-colors duration-300 group/link"
              >
                <FileText size={16} className="group-hover/link:text-cyan-400 transition-colors" />
                <span className="text-sm">View Details</span>
              </button>
              <a 
                href={project.github}
                className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-200 transition-colors duration-300 group/link"
              >
                <Github size={16} className="group-hover/link:text-cyan-400 transition-colors" />
                <span className="text-sm">Code</span>
              </a>
              <a 
                href={project.live}
                className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-200 transition-colors duration-300 group/link"
              >
                <ExternalLink size={16} className="group-hover/link:text-cyan-400 transition-colors" />
                <span className="text-sm">Live Demo</span>
              </a>
            </div>
            <span className="text-xs text-zinc-600 font-mono">{project.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetail = ({ project, onBack }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const getProjectDetails = (projectTitle) => {
    const details = {
      "DNS Explorer": {
        overview: "DNS Explorer is a comprehensive full-stack web application that provides an interactive, visual demonstration of how DNS (Domain Name System) queries resolve from root servers down to final IP addresses. The application combines educational value with technical depth, making complex networking concepts accessible through animated visualizations.",
        features: [
          "Real-time animated DNS resolution flow visualization",
          "Interactive hop-by-hop timing metrics and performance analysis",
          "Step-by-step resolution narration with detailed explanations",
          "Hop details modal displaying raw DNS records and response data",
          "Performance dashboard with RTT (Round Trip Time) charts",
          "Support for JSON input for offline DNS record inspection",
          "Responsive design with fullscreen mode and mobile scrolling",
          "Custom iterative DNS resolver with intelligent caching"
        ],
        technical: [
          "Frontend built with React, Vite, and Framer Motion for smooth animations",
          "Recharts library for interactive data visualizations and performance metrics",
          "Backend implemented using FastAPI with Python for high-performance API",
          "Custom DNS resolver using dnspython library with TTL caching",
          "CORS configuration for seamless frontend-backend communication",
          "Deployed on Vercel (frontend) and Render (backend) for optimal performance"
        ],
        challenges: [
          "Implementing real-time packet flow visualization with accurate timing",
          "Creating an intuitive user interface for complex networking concepts",
          "Optimizing DNS resolution performance with intelligent caching strategies",
          "Ensuring cross-platform compatibility and responsive design"
        ]
      },
      "Daily Digest": {
        overview: "Daily Digest is an AI-powered news aggregation platform that revolutionizes how users consume news by providing intelligent curation, sentiment analysis, and trend visualization. The application combines multiple APIs and machine learning to deliver personalized news experiences.",
        features: [
          "AI-powered news curation with global headline aggregation",
          "Real-time category filtering and keyword search functionality",
          "Sentiment analysis on headlines using advanced NLP techniques",
          "Article summaries generated via Hugging Face API integration",
          "Dynamic topic trend chart showing keyword frequency over 7 days",
          "Responsive design with intuitive user interface",
          "Local storage for user preferences and reading history"
        ],
        technical: [
          "React with Vite for fast development and optimized builds",
          "Tailwind CSS for responsive and modern UI design",
          "Chart.js for interactive data visualizations and trend analysis",
          "NewsAPI integration for real-time news data",
          "Hugging Face API for AI-powered article summarization",
          "localStorage for persistent user data and preferences"
        ],
        challenges: [
          "Integrating multiple APIs while maintaining optimal performance",
          "Implementing real-time sentiment analysis on dynamic content",
          "Creating intuitive data visualizations for trend analysis",
          "Optimizing API calls and managing rate limits effectively"
        ]
      },
      "Reading the Room": {
        overview: "Reading the Room is an interactive data storytelling project that analyzes presidential tweets to reveal patterns in communication styles, sentiment, and messaging across different administrations. The project combines data science with compelling visualizations to tell stories hidden in social media data.",
        features: [
          "Comprehensive analysis of presidential tweets across administrations",
          "Sentiment analysis using VADER (Valence Aware Dictionary and sEntiment Reasoner)",
          "Topic frequency analysis and keyword tracking over time",
          "Interactive visualizations showing tone and messaging evolution",
          "D3.js-powered charts for dynamic data exploration",
          "Observable notebook integration for reproducible analysis",
          "Plot library for statistical visualizations and trend analysis"
        ],
        technical: [
          "Python for data processing and analysis pipeline",
          "VADER sentiment analysis for accurate emotional tone detection",
          "Observable platform for interactive data storytelling",
          "D3.js for custom data visualizations and user interactions",
          "Plot library for statistical analysis and trend visualization",
          "Natural Language Processing techniques for text analysis"
        ],
        challenges: [
          "Processing large datasets of social media content efficiently",
          "Implementing accurate sentiment analysis on political communication",
          "Creating meaningful visualizations from complex temporal data",
          "Ensuring reproducibility and transparency in data analysis"
        ]
      },
      "Inter-VLAN Routing Lab": {
        overview: "The Inter-VLAN Routing Lab is a comprehensive networking project that demonstrates advanced VLAN configuration, inter-VLAN routing, and access control list (ACL) implementation. This hands-on lab showcases enterprise-level network design principles and security configurations.",
        features: [
          "Two-switch network topology with 4 VLANs (Finance, HR, Sales, IT)",
          "Layer-3 switch configuration for inter-VLAN routing",
          "Layer-2 switch setup with VLAN access and trunking",
          "Access Control Lists (ACLs) for traffic flow management",
          "PC-to-PC connectivity testing and verification",
          "Comprehensive network documentation with diagrams",
          "GitHub repository with detailed configuration files"
        ],
        technical: [
          "Cisco Packet Tracer for network simulation and testing",
          "VLAN configuration and management across multiple switches",
          "Inter-VLAN routing implementation on Layer-3 switches",
          "ACL configuration for security and traffic control",
          "Network topology design and documentation",
          "Configuration backup and version control practices"
        ],
        challenges: [
          "Designing a scalable network topology with proper VLAN segmentation",
          "Implementing complex ACL rules while maintaining network functionality",
          "Troubleshooting connectivity issues across multiple VLANs",
          "Documenting network configurations for reproducibility"
        ]
      }
    };
    return details[projectTitle] || {
      overview: "Detailed project information coming soon.",
      features: ["Feature documentation in progress"],
      technical: ["Technical details being compiled"],
      challenges: ["Challenge analysis underway"]
    };
  };

  const projectDetails = getProjectDetails(project.title);

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-zinc-950 text-zinc-300 transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              <span>Back to Portfolio</span>
            </button>
            <div className="text-lg font-semibold text-zinc-100">
              {project.title}
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href={project.github}
                className="text-zinc-400 hover:text-cyan-400 transition-colors duration-300"
              >
                <Github size={20} />
              </a>
              <a 
                href={project.live}
                className="text-zinc-400 hover:text-cyan-400 transition-colors duration-300"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto py-12">
          
          {/* Project Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg font-mono text-sm text-zinc-400">
                <span className="text-cyan-400">$</span>
                <span>cat project-details.md</span>
              </div>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl font-bold text-zinc-100 mb-6">{project.title}</h1>
                <p className="text-xl text-zinc-300 leading-relaxed mb-8">{project.description}</p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.tech.map((tech) => (
                    <span 
                      key={tech}
                      className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-cyan-400/30 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-6">
                  <span className="text-sm text-zinc-500 font-mono">{project.year}</span>
                  <div className="flex space-x-4">
                    <a 
                      href={project.github}
                      className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <Github size={18} />
                      <span>View Code</span>
                    </a>
                    <a 
                      href={project.live}
                      className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <ExternalLink size={18} />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                  <div className="flex items-center px-6 py-4 bg-zinc-800 border-b border-zinc-700">
                    <div className="flex space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 text-center text-sm font-mono text-zinc-400">
                      project-preview.png
                    </div>
                  </div>
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={`Screenshot of ${project.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-16">
            
            {/* Overview */}
            <TerminalSection title="Project Overview" filename="overview.md" icon={Globe}>
              <div className="space-y-6">
                <p className="text-zinc-200 leading-relaxed text-lg">
                  {projectDetails.overview}
                </p>
              </div>
            </TerminalSection>

            {/* Features */}
            <TerminalSection title="Key Features" filename="features.md" icon={Zap}>
              <div className="grid md:grid-cols-2 gap-6">
                {projectDetails.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                    <p className="text-zinc-300">{feature}</p>
                  </div>
                ))}
              </div>
            </TerminalSection>

            {/* Technical Implementation */}
            <TerminalSection title="Technical Implementation" filename="technical.md" icon={Code}>
              <div className="space-y-6">
                {projectDetails.technical.map((tech, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <Cpu size={16} className="text-cyan-400 mt-1 flex-shrink-0" />
                    <p className="text-zinc-300">{tech}</p>
                  </div>
                ))}
              </div>
            </TerminalSection>

            {/* Challenges & Solutions */}
            <TerminalSection title="Challenges & Solutions" filename="challenges.md" icon={Shield}>
              <div className="space-y-6">
                {projectDetails.challenges.map((challenge, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <Database size={16} className="text-cyan-400 mt-1 flex-shrink-0" />
                    <p className="text-zinc-300">{challenge}</p>
                  </div>
                ))}
              </div>
            </TerminalSection>

          </div>
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedProject, setSelectedProject] = useState(null);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleViewProjectDetails = (project) => {
    setSelectedProject(project);
  };

  const handleBackToPortfolio = () => {
    setSelectedProject(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
          }
        }
      });
    };

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const experiences = [
    {
      title: "Software Engineering Intern",
      company: "Sirdab — YC W23",
      date: "June 2024 — Oct 2024",
      description: "Engineered an expiry management system with Ruby on Rails and PostgreSQL, integrating Sidekiq for background jobs. Optimized inventory tracking, migrating 16,000+ SKU records. Developed SEO enhancement pipeline with Next.js, increasing organic traffic by 29%."
    },
    {
      title: "Software Developer",
      company: "Wacafe",
      date: "Feb 2024 — May 2024", 
      description: "Developed a React.js reservation app with TypeScript and TailwindCSS, reducing booking abandonment by 25%. Engineered backend infrastructure using Firebase, integrating Moyasar payment gateway and Apple Pay support."
    },
    {
      title: "Software Engineering Intern",
      company: "Piflow",
      date: "July 2023 — Sept 2023",
      description: "Created a financial management app using React Native, integrated Firebase for real-time data synchronization. Implemented D3.js for dynamic visualizations and optimized data processing with Firebase Cloud Functions."
    }
  ];

  const education = {
    university: "Columbia University",
    degree: "Bachelor of Science in Computer Science",
    period: "Sept 2021 - May 2025",
    location: "New York, NY",
    courses: [
      "Advanced Programming",
      "Mobile iOS Development", 
      "Full-Stack Web Development",
      "Databases",
      "Natural Language Processing",
      "Distributed Systems",
      "Cloud Computing",
      "Computer Networks",
      "Data Structures & Algorithms"
    ]
  };

  const projects = [
    {
      title: "DNS Explorer",
      description: "A full-stack web application that visually demonstrates how DNS queries resolve step-by-step, from root servers down to final IP addresses. Features real-time animated visualization showing DNS packets moving between servers, hop-by-hop timing metrics, and resolution narration with responsive design.",
      imageUrl: "/dns5.png",
      tech: ["React", "Vite", "Framer Motion", "Recharts", "FastAPI", "Python", "dnspython"],
      github: "https://github.com/hm2156/dns-explorer",
      live: "https://dns-explorer.vercel.app/",
      year: "2025"
    },
    {
      title: "Daily Digest",
      description: "An AI-powered news aggregator that curates global headlines with real-time category filtering, keyword search, sentiment analysis on headlines, article summaries via Hugging Face, and a dynamic topic trend chart showing keyword frequency over the past 7 days.",
      imageUrl: "/dd8.png",
      tech: ["React", "Vite", "Tailwind CSS", "Chart.js", "NewsAPI", "Hugging Face API", "localStorage"],
      github: "https://github.com/hm2156/daily-digest",
      live: "https://mydailydigest.vercel.app/",
      year: "2025"
    },
    {
      title: "Reading the Room",
      description: "An interactive data storytelling project analyzing presidential tweets using sentiment analysis and topic frequency. Visualizes how tone and messaging changed across administrations using VADER, D3, and keyword tracking.",
      imageUrl: "/rtr.png",
      tech: ["Python", "VADER", "Observable", "D3.js", "Plot", "Natural Language Processing"],
      github: "https://github.com/cpreston123/readingtheroom", 
      live: "https://readingtheroom.info",
      year: "2025"
    },
    {
      title: "Inter-VLAN Routing Lab",
      description: "Designed a comprehensive two-switch network topology with 4 VLANs (Finance, HR, Sales, IT) implementing inter-VLAN routing on a Layer-3 switch. Configured ACLs to control traffic flow between Finance and HR VLANs, allowing HR to reply while blocking Finance from initiating traffic. Verified connectivity through PC-to-PC ping tests and documented the lab with detailed diagrams and configurations.",
      imageUrl: "/iv.png",
      tech: ["Cisco Packet Tracer", "Network Configuration", "VLAN", "ACL", "Inter-VLAN Routing"],
      github: "https://github.com/hm2156/intervlan-two-switches",
      live: "https://github.com/hm2156/intervlan-two-switches",
      year: "2024"
    }
  ];

  const skills = [
    "Python", "JavaScript", "TypeScript", "Ruby", "C/C++", "Golang",
    "React.js", "Next.js", "React Native", "Node.js", "Ruby on Rails", 
    "PostgreSQL", "MongoDB", "Firebase", "Redis", "AWS", "GCP", "Docker"
  ];

  // Show project detail page if a project is selected
  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={handleBackToPortfolio} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 overflow-x-hidden font-sans">
      {/* Subtle cursor effect */}
      <div
        className="fixed top-0 left-0 z-50 pointer-events-none w-32 h-32 rounded-full bg-cyan-400/20 blur-3xl -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
        style={{ 
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) translate(-50%, -50%)`
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-zinc-100">
              Huda Marta
            </div>
            <div className="hidden md:flex space-x-8">
              {['hero', 'about', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm capitalize transition-all duration-300 relative ${
                    activeSection === section 
                      ? 'text-cyan-400' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {section === 'hero' ? 'Home' : section}
                  {activeSection === section && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="text-zinc-400 hover:text-cyan-400 transition-colors duration-300"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                className="text-zinc-400 hover:text-cyan-400 transition-colors duration-300"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-16">
            <InteractiveTerminal scrollToSection={scrollToSection} />
          </div>
          <div className="space-y-8">
            <p className="text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto">
              Specializing in <span className="text-cyan-400 font-semibold">full-stack development</span>, 
              cloud infrastructure, and modern web technologies.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => scrollToSection('projects')}
                className="group flex items-center space-x-3 px-8 py-4 text-zinc-400 hover:text-zinc-200 font-medium rounded-xl  transition-all duration-300"
              >
                <span>View My Work</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 text-zinc-400 hover:text-zinc-200" />
              </button>
              <a 
                href="mailto:ham2167@columbia.edu"
                className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 transition-colors duration-300 px-6 py-4 rounded-xl "
              >
                <Mail size={18} />
                <span>Get in Touch</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 text-zinc-100">
              About Me
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Computer Science student passionate about building scalable solutions and learning cutting-edge technologies.
            </p>
          </div>
          <div className="space-y-20">
            {/* Three main sections - equal visual weight */}
            <div className="grid lg:grid-cols-3 gap-12 xl:gap-16">
              {/* About */}
              <div className="lg:col-span-1">
                <TerminalSection title="About" filename="profile.md">
                  <div className="space-y-6">
                    <p className="text-zinc-200 leading-relaxed">
                      Computer Science student at Columbia University with hands-on experience in full-stack development 
                      through internships at Y Combinator companies and tech startups.
                    </p>
                    <p className="text-zinc-300 leading-relaxed text-sm">
                      Built systems handling <span className="text-cyan-400 font-semibold">16,000+ SKU records</span> and 
                      developed applications that reduced booking abandonment by <span className="text-cyan-400 font-semibold">25%</span>.
                    </p>
                  </div>
                </TerminalSection>
              </div>
              
              {/* Education */}
              <div className="lg:col-span-1">
                <TerminalEducation education={education} />
              </div>
              
              {/* Experience */}
              <div className="lg:col-span-1">
                <TerminalExperience experiences={experiences} />
              </div>
            </div>
            
            {/* Tech Stack - full width section */}
            <div className="max-w-5xl mx-auto">
              <TerminalSection title="Tech Stack" filename="skills.json">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {skills.map((skill) => (
                    <div 
                      key={skill}
                      className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 transition-all duration-300 hover:border-cyan-400 hover:text-zinc-100 hover:bg-zinc-800 text-center"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </TerminalSection>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 text-zinc-100">
              Featured Projects
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              A selection of my recent work showcasing different technologies and approaches.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <TerminalProjectCard 
                key={project.title} 
                project={project} 
                index={index} 
                onViewDetails={handleViewProjectDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-zinc-100">
              Let&apos;s Build Something Amazing
            </h2>
            <p className="text-xl text-zinc-400">
              Ready to bring your ideas to life? Let&apos;s connect and discuss your next project.
            </p>
          </div>
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="flex items-center px-6 py-4 bg-zinc-800 border-b border-zinc-700">
              <div className="flex space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center text-sm font-mono text-zinc-400">
                contact/info.txt
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-8">
                <div className="text-lg text-zinc-200 leading-relaxed">
                  <p className="text-cyan-400 font-mono mb-4">$ cat contact-info</p>
                  <p className="mb-4">
                    I&apos;m always interested in hearing about new opportunities and exciting projects. 
                    Whether you&apos;re looking to build something from scratch or need help scaling an existing system.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors group">
                      <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Email</p>
                        <a href="mailto:ham2167@columbia.edu" className="text-zinc-200 hover:text-cyan-400 transition-colors">
                          ham2167@columbia.edu
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors group">
                      <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Location</p>
                        <p className="text-zinc-200">Jeddah, KSA</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-zinc-400 text-sm mb-4">Connect with me:</p>
                    <div className="flex flex-col space-y-3">
                      <a 
                        href="https://github.com/hm2156" 
                        className="flex items-center space-x-3 text-zinc-400 hover:text-zinc-200 transition-colors duration-300 group p-3 rounded-lg hover:bg-zinc-800"
                      >
                        <Github size={18} className="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                        <span>github.com/hm2156</span>
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <a 
                        href="https://linkedin.com/in/huda-marta" 
                        className="flex items-center space-x-3 text-zinc-400 hover:text-zinc-200 transition-colors duration-300 group p-3 rounded-lg hover:bg-zinc-800"
                      >
                        <Linkedin size={18} className="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                        <span>linkedin.com/in/huda-marta</span>
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <a 
                        href="/resume.pdf" 
                        download="Huda_Marta_Resume.pdf"
                        className="flex items-center space-x-3 text-zinc-400 hover:text-zinc-200 transition-colors duration-300 group p-3 rounded-lg hover:bg-zinc-800"
                      >
                        <FileText size={18} className="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                        <span>Download Resume</span>
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span>© 2024 Huda Marta</span>
              <span className="text-zinc-700">•</span>
              <span>Built with passion and coffee ☕</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Powered by</span>
              <span className="text-cyan-400">Next.js</span>
              <span className="text-zinc-700">•</span>
              <span className="text-cyan-400">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;