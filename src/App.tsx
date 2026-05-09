import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useVelocity, useSpring, useAnimationFrame, useMotionValue, useMotionTemplate } from 'motion/react';
import { wrap } from 'motion';
import { ArrowUpRight, Github, Code, Mail, Linkedin } from 'lucide-react';
import { useLenis } from 'lenis/react';

const projects = [
  {
    title: 'ECOZY',
    role: 'UI/UX DESIGNER',
    date: 'APR 2026',
    description: 'AI Platform for Sustainable Commerce. Designed an intuitive product management interface reducing user effort by 70%. Built conversational UI flows for Lumi AI. The platform seamlessly integrates AI to enhance decision making for store owners.',
    fullCaseStudy: 'Our mission was to redefine sustainable commerce through AI. We conducted extensive user research to understand the pain points of store owners managing eco-friendly products. The solution involved a radical simplification of the product management dashboard, introducing AI-assisted tagging, automated product descriptions, and conversational flows with Lumi AI. This reduced the cognitive load for users and accelerated their workflow significantly. The visual language was designed to be clean, earthy, and trustworthy, using a palette that evokes nature while maintaining a modern tech aesthetic.',
    images: ['/images/ecozy-1.jpeg', '/images/ecozy-2.jpeg'],
    tags: ['Figma', 'Tailwind CSS', 'AI-Assisted Workflow'],
    link: 'https://ecozy.onrender.com/'
  },
  {
    title: 'VENTURELENS',
    role: 'PRODUCT DESIGNER',
    date: 'FEB 2026',
    description: 'Startup Intelligence SaaS Dashboard. Built data-driven flows focusing on reducing cognitive load while presenting complex startup profiles and insights. This tool empowers VCs to make faster, more informed decisions.',
    fullCaseStudy: 'VentureLens was built for Venture Capitalists who suffer from information overload. We architected a dashboard that prioritizes key metrics and predictive insights over raw data dumps. The design system was built from scratch to support high-density data visualizations that remain legible and intuitive. We utilized deep contrast and precise typography to guide the user\'s eye through complex startup profiles, cap tables, and market analyses. The end result is a polished SaaS platform that feels both powerful and effortless to use.',
    images: ['/images/venturelens-1.jpeg', '/images/venturelens-2.jpeg'],
    tags: ['Wireframing', 'Design Systems', 'Notion'],
    link: 'https://venturelens-eight.vercel.app/'
  },
  {
    title: 'MYANNITA',
    role: 'FREELANCE UI/UX',
    date: 'JAN 2026',
    description: 'Influencer Marketing Platform. Reimagined the visual language using a bold palette. Designed a strategic dual-onboarding framework for brands and creators to match seamlessly.',
    fullCaseStudy: 'MyAnnita connects brands with authentic creators. The challenge was designing a platform that appeals to two very different user bases while maintaining a unified brand identity. We implemented a bold, vibrant palette that breaks away from traditional corporate SaaS aesthetics, injecting energy and personality into the platform. The dual-onboarding framework carefully guides both brands and creators through tailored experiences, capturing necessary intelligence without feeling tedious. We also designed a robust matching system interface that highlights synergies between brand values and creator audiences.',
    images: ['/images/myannita-1.jpeg', '/images/myannita-2.jpeg.png'],
    tags: ['Creative Economy', 'Prototype', 'Social Proof'],
    link: 'https://www.figma.com/proto/HaLS6Del6ARjKayAFMcXqz/MYAnnita?page-id=0%3A1&node-id=1-2&viewport=203%2C-430%2C0.38&t=u9Ouip4wngvdBF0d-1&scaling=scale-down&content-scaling=fixed'
  },
  {
    title: 'BOLO ACADEMY',
    role: 'FREELANCE UI/UX',
    date: 'DEC 2025',
    description: 'Student Onboarding Platform. Led end-to-end design for scheduling and student assessments ensuring a seamless user journey from registration to first class.',
    fullCaseStudy: 'Bolo Academy needed a complete overhaul of their student onboarding experience. We started by mapping out the entire user journey, identifying friction points in scheduling and assessments. The new design introduces a stepped, focused approach to registration, making it feel less like a form and more like a conversation. We established a friendly, accessible design system that scales across web and mobile. The scheduling interface was completely rethought, utilizing intuitive drag-and-drop interactions and clear visual cues for availability.',
    images: ['/images/boloacademy-1.jpeg', '/images/boloacademy-2.jpeg'],
    tags: ['Framer', 'Prototyping', 'Design System'],
    link: '#'
  }
];

// Removed SwallowBird

const chars = '!<>-_\\\\/[]{}—=+*^?#________';

function ScrambleText({ text, active }: { text: string; active: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (active) {
      let iteration = 0;
      clearInterval(intervalRef.current as NodeJS.Timeout);

      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
        }

        iteration += 1 / 3;
      }, 30);
    } else {
      setDisplayText(text);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, text]);

  return <span>{displayText}</span>;
}

function ParallaxMarquee({ children, baseVelocity = 100 }: { children: React.ReactNode, baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex whitespace-nowrap overflow-hidden">
      <motion.div className="flex whitespace-nowrap flex-nowrap" style={{ x }}>
        {children}
      </motion.div>
    </div>
  );
}

function Clock({ format }: { format: 'sys' | 'local' }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (format === 'sys') {
    return <>{time.toISOString().split('T')[1].split('.')[0]}</>;
  }
  return <>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })} LOCAL</>;
}

export default function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { mass: 0.1, stiffness: 400, damping: 25 });
  const cursorY = useSpring(mouseY, { mass: 0.1, stiffness: 400, damping: 25 });
  const trailerX = useSpring(mouseX, { mass: 0.8, stiffness: 200, damping: 20 });
  const trailerY = useSpring(mouseY, { mass: 0.8, stiffness: 200, damping: 20 });

  const bgParallaxX = useTransform(cursorX, (x) => (x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * -0.05);
  const bgParallaxY = useTransform(cursorY, (y) => (y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * -0.05);
  const fgParallaxX = useTransform(cursorX, (x) => (x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.05);
  const fgParallaxY = useTransform(cursorY, (y) => (y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.05);

  const floatingX = useTransform(cursorX, (x) => x + 20);
  const floatingY = useTransform(cursorY, (y) => y + 20);

  const [isHovering, setIsHovering] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isInverseCursor, setIsInverseCursor] = useState(false);
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState("default");
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== id));
      }, 1000);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'works', 'about', 'playground', 'contact'];
      let currentSection = sections[0];
      let minDistance = Infinity;

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Distance from top of the screen to the element
          // We look for the element whose top is closest to the middle of the viewport
          const distance = Math.abs(rect.top - window.innerHeight / 3);
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = id;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lenis = useLenis();

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsInverseCursor(false);
    const element = document.getElementById(id);
    if (!element) return;
    
    if (lenis) {
      lenis.scrollTo(element, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      const targetPosition = element.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 1000;
      let start: number | null = null;
  
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        const easePercentage = easeInOutCubic(percentage);
        
        window.scrollTo(0, startPosition + distance * easePercentage);
        
        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  };

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Slower initialization
      current += Math.floor(Math.random() * 18) + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 900);
      }
      setLoadingProgress(current);
    }, 160);
    return () => clearInterval(interval);
  }, []);

  // Frame-by-Frame Reveal Ref & Scroll
  const revealRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: revealProgress } = useScroll({
    target: revealRef,
    offset: ["start center", "end center"]
  });
  const clipPathValue = useTransform(revealProgress, [0, 1], ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const sweepLeftValue = useTransform(revealProgress, [0, 1], ["0%", "100%"]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const designerX = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const creativeX = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);


  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutScroll } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });
  const aboutY = useTransform(aboutScroll, [0, 1], ["10%", "-10%"]);
  const aboutPhotoY = useTransform(aboutScroll, [0, 1], ["-10%", "10%"]);

  const worksHeadingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: worksScroll } = useScroll({
    target: worksHeadingRef,
    offset: ["start end", "center center"]
  });
  const worksHeadingY = useTransform(worksScroll, [0, 1], ["50%", "0%"]);
  const worksHeadingOpacity = useTransform(worksScroll, [0.5, 1], [0, 1]);
  const footerY = useTransform(scrollYProgress, [0.8, 1], ["400%", "0%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/rudramadhabpradhanx1000@gmail.com", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message
        })
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isLoading]);

  return (
    <div ref={containerRef} className="relative min-h-screen brutalist-grid overflow-x-hidden">
      {/* Top scroll progress */}
      <motion.div 
        className="fixed top-0 left-0 h-1 z-[100] origin-left bg-olive"
        style={{ scaleX: scrollYProgress, width: '100%' }}
      />
      <div className="grain-layer"></div>
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-50 bg-maroon-dark flex flex-col justify-center items-center p-6 md:p-12 overflow-hidden"
          >
            <div className="grain-layer mix-blend-multiply opacity-30"></div>
            
            {/* The Green Circle with Parallax */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1
              }}
              style={{
                x: bgParallaxX,
                y: bgParallaxY
              }}
              transition={{ 
                scale: { duration: 1, ease: "easeOut" },
                opacity: { duration: 1, ease: "easeOut" }
              }}
              className="absolute w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] bg-olive rounded-full mix-blend-screen opacity-40 ml-20 md:ml-40 -mt-10 md:-mt-20 blur-xl"
            />
            
            {/* The Quote Text with Parallax */}
            <motion.div 
              style={{ 
                x: fgParallaxX,
                y: fgParallaxY
              }}
              className="relative z-10 w-full max-w-4xl text-left pl-4 md:pl-0 flex flex-col items-start gap-0"
            >
               <motion.div 
                 initial="hidden"
                 animate="visible"
                 variants={{
                   hidden: { opacity: 0 },
                   visible: {
                     opacity: 1,
                     transition: {
                       staggerChildren: 0.1,
                       delayChildren: 0.1
                     }
                   }
                 }}
                 className="font-display text-[15vw] md:text-[8vw] leading-[0.80] tracking-tight text-cream uppercase overflow-hidden"
               >
                 {["DESIGN.", "CRAFT.", "CULTURE."].map((word, i) => (
                   <motion.div 
                     key={i} 
                     className="overflow-hidden"
                     variants={{
                       hidden: { y: "120%", opacity: 0, rotateZ: 5 },
                       visible: { y: "0%", opacity: 1, rotateZ: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                     }}
                   >
                     {word === "CRAFT." ? <span className="text-olive">{word}</span> : word}
                   </motion.div>
                 ))}
               </motion.div>
            </motion.div>
            
            {/* Progress indicators at bottom */}
            <div className="absolute bottom-12 left-6 right-6 md:left-12 md:right-12 flex justify-between items-end border-t border-cream/20 pt-4 z-10">
              <div className="font-mono text-xs text-cream/50 uppercase tracking-widest">
                [ INITIALIZING PORTFOLIO ]
              </div>
              <div className="font-display text-4xl md:text-6xl text-cream tracking-tight">
                {loadingProgress}%
              </div>
            </div>
            {/* Progress line */}
            <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 h-[2px] bg-cream/10 overflow-hidden z-10">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: `${loadingProgress - 100}%` }}
                transition={{ ease: "linear", duration: 0.2 }}
                className="absolute top-0 left-0 w-full h-full bg-cream"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
           <motion.div
             key="main-menu"
             initial={{ opacity: 0, y: "-100%" }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: "-100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
             transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
             className="fixed inset-0 z-50 flex flex-col md:flex-row overflow-hidden pointer-events-auto"
           >
              {/* Left Side (Cream) */}
              <div className="w-full h-[40%] md:h-full md:w-[45%] bg-cream p-6 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-maroon relative">
                 <div className="absolute top-6 right-6 md:hidden">
                   <button onClick={() => { setIsMenuOpen(false); setIsInverseCursor(false); }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="text-maroon p-2 hover:bg-maroon/10 rounded-full transition-colors cursor-pointer">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                 </div>
                 <div className="font-sans text-sm text-maroon opacity-70">
                   Hope you're having a great day ;)
                 </div>

                 <div className="mt-auto md:mt-0 font-sans text-lg text-maroon max-w-sm">
                   <span className="text-xs text-maroon/50 block mb-2 font-mono">/03</span>
                   Learn more about who i am, what drives me, and why we should work together.
                 </div>
              </div>

              {/* Right Side (Maroon Dark) */}
              <div 
                className="w-full h-[60%] md:h-full md:w-[55%] bg-maroon p-6 md:p-12 flex flex-col justify-center relative shadow-[-20px_0_50px_rgba(0,0,0,0.2)] z-10"
                onMouseEnter={() => setIsInverseCursor(true)}
                onMouseLeave={() => setIsInverseCursor(false)}
              >
                <div className="absolute top-6 right-6 md:top-12 md:right-12 hidden md:block">
                   <button onClick={() => { setIsMenuOpen(false); setIsInverseCursor(false); }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="text-cream hover:text-olive hover:rotate-90 transition-all duration-300 p-2 cursor-pointer">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                 </div>
                 <div className="absolute top-6 left-6 md:top-12 text-sm text-cream opacity-50 hidden md:block font-sans">
                   Rudra Madhab Pradhan — Portfolio {new Date().getFullYear()}
                 </div>
                 
                 <nav className="flex flex-col gap-2 md:gap-6 justify-center h-full items-end pr-8 md:pr-24 mt-4 md:mt-0">
                   {[
                     { num: "01/", label: "Home", id: "home" },
                     { num: "02/", label: "About", id: "about" },
                     { num: "03/", label: "Process", id: "process" },
                     { num: "04/", label: "Works", id: "works" },
                     { num: "05/", label: "Playground", id: "playground" },
                     { num: "06/", label: "Contact", id: "contact" }
                   ].map((item, i) => (
                      <motion.a 
                        key={item.label}
                        href={`#${item.id}`}
                        onClick={(e) => scrollToSection(item.id, e)}
                        onMouseEnter={handleMouseEnter} 
                        onMouseLeave={handleMouseLeave}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                        className={`group flex flex-col items-end md:flex-row md:items-center gap-2 md:gap-4 transition-colors relative ${activeSection === item.id ? 'text-olive' : 'text-cream hover:text-olive'}`}
                      >
                        <span className="font-mono text-[10px] md:text-sm opacity-50 md:absolute md:-left-16 hidden md:block">{item.num}</span>
                        <span className="font-display text-[12vw] md:text-8xl tracking-tight leading-[0.8] lowercase group-hover:pr-4 md:group-hover:pl-4 transition-all duration-300">{item.label}</span>
                      </motion.a>
                   ))}
                 </nav>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Cursor */}
      <motion.div 
        className={`custom-cursor hidden md:block cursor-${cursorVariant === 'view' && hoveredProjectIndex === expandedProjectIndex ? 'default' : cursorVariant} ${isHovering && hoveredProjectIndex !== expandedProjectIndex ? 'hovering' : ''} ${isInverseCursor ? 'inverse' : ''}`}
        style={{
          x: cursorX,
          y: cursorY,
          opacity: cursorText && !(cursorText === 'VIEW' && hoveredProjectIndex === expandedProjectIndex) ? 0 : 1
        }}
      />
      <motion.div 
        className={`custom-cursor-trailer hidden md:flex items-center justify-center cursor-${cursorVariant === 'view' && hoveredProjectIndex === expandedProjectIndex ? 'default' : cursorVariant} ${isHovering && hoveredProjectIndex !== expandedProjectIndex ? 'hovering' : ''} ${isLogoHovered ? 'logo-hover' : ''} ${isInverseCursor ? 'inverse' : ''}`}
        style={{
          x: trailerX,
          y: trailerY
        }}
      >
        <div className="cursor-ring absolute w-full h-full rounded-full border border-maroon pointer-events-none" />
        <span className="cursor-text uppercase font-mono text-[10px] sm:text-[11px] font-bold tracking-widest text-maroon absolute z-10 transition-colors">
          {cursorText === 'VIEW' && hoveredProjectIndex === expandedProjectIndex ? '' : cursorText}
        </span>
      </motion.div>

      {/* Floating Project Image */}
      <AnimatePresence>
        {hoveredProjectIndex !== null && hoveredProjectIndex !== expandedProjectIndex && projects[hoveredProjectIndex]?.images && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 z-[60] pointer-events-none hidden md:block overflow-hidden border border-maroon/20 shadow-2xl"
            style={{
              x: floatingX,
              y: floatingY,
              width: "320px",
              height: "180px"
            }}
          >
            <img 
              src={projects[hoveredProjectIndex].images[0]} 
              alt={projects[hoveredProjectIndex].title} 
              className="w-full h-full object-cover mix-blend-overlay grayscale contrast-125 saturate-50"
            />
            <div className="absolute inset-0 bg-olive/20 mix-blend-multiply z-10 pointer-events-none"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {clicks.map(click => (
          <motion.div
            key={click.id}
            initial={{ opacity: 1, top: click.y - 10, left: click.x }}
            animate={{ opacity: 0, top: click.y - 30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed z-[9999] pointer-events-none font-mono text-xs uppercase tracking-widest text-olive font-bold transform -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
          >
            *click*
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full p-4 md:p-8 flex justify-between items-start z-40 text-maroon pointer-events-none"
      >
        <div className="border border-maroon/30 p-2 md:p-4 bg-cream/80 backdrop-blur-sm pointer-events-auto">
          <div className="flex gap-4 items-center">
            <div 
              onMouseEnter={() => { handleMouseEnter(); setIsLogoHovered(true); }}
              onMouseLeave={() => { handleMouseLeave(); setIsLogoHovered(false); }}
              className="group relative cursor-pointer flex flex-col items-start gap-1"
            >
              <svg viewBox="0 0 160 80" className="h-[1.2rem] md:h-[1.5rem] w-auto transition-colors duration-500 text-maroon group-hover:text-olive">
                <g fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="butt">
                  {/* r */}
                  <path d="M 18 70 V 18" />
                  <path d="M 18 42 A 20 20 0 0 1 38 22" />
                  
                  {/* m */}
                  <path d="M 64 70 V 18" />
                  <path d="M 64 42 A 20 20 0 0 1 104 42 V 70" />
                  <path d="M 104 42 A 20 20 0 0 1 144 42 V 70" />
                </g>
              </svg>
              <div className="flex flex-col">
                <h2 className="font-sans font-bold text-[10px] md:text-[12px] tracking-tight leading-none lowercase text-maroon group-hover:text-olive transition-colors">
                  rudra
                </h2>
                <h2 className="font-sans font-bold text-[10px] md:text-[12px] tracking-tight leading-none lowercase text-maroon group-hover:text-olive transition-colors">
                  madhab
                </h2>
              </div>
              <p className="font-sans font-medium text-[5px] md:text-[6px] tracking-[0.2em] uppercase text-maroon/70 mt-[1px] transition-colors group-hover:text-olive/80">
                CREATIVE DEV
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 pointer-events-auto cursor-pointer mt-4 md:mt-2 mr-0 md:mr-[0.5rem]" onClick={() => setIsMenuOpen(true)}>
            <motion.div whileHover={{ x: -2 }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="font-mono text-xs uppercase tracking-widest relative overflow-hidden group px-3 py-2 w-full text-right bg-maroon/5 border border-maroon/20 hover:border-maroon/40 hover:text-olive flex items-center justify-between gap-6 backdrop-blur-sm">
              <span>MENU</span>
              <div className="flex flex-col gap-[3px] mt-[1px]">
                <div className="w-5 h-[1.5px] bg-current"></div>
                <div className="w-5 h-[1.5px] bg-current"></div>
              </div>
            </motion.div>
          </div>
      </motion.nav>

      <div className="relative w-full">
        {/* Sticky Hero Container */}
        <div 
          id="home" 
          className="h-screen sticky top-0 flex flex-col justify-center px-6 md:px-12 z-0 overflow-hidden bg-cream"
        >
          {/* Subtle slow-moving animated gradients */}
          <motion.div 
            animate={{ 
              x: ["-5%", "10%", "-5%"], 
              y: ["-5%", "10%", "-5%"],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-olive/10 blur-[100px] rounded-full pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              x: ["5%", "-10%", "5%"], 
              y: ["5%", "-10%", "5%"],
            }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-maroon/5 blur-[120px] rounded-full pointer-events-none" 
          />

          {/* Finer Overlay Grain/Grid */}
          <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#541421 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

          <motion.div style={{ y: heroY }} className="max-w-7xl mx-auto w-full relative pt-16 z-10">
            
            <div className="overflow-hidden">
              <div>
                <motion.h1 
                  initial={{ y: "100%" }}
                  animate={!isLoading ? { y: "0%" } : { y: "100%" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="font-display text-[10vw] md:text-[11vw] leading-[0.8] tracking-wider uppercase text-maroon transform-gpu origin-bottom"
                >
                  SHAPING
                </motion.h1>
              </div>
            </div>
            <div className="overflow-hidden relative">
              <div>
                <motion.h1 
                  initial={{ y: "100%" }}
                  animate={!isLoading ? { y: "0%" } : { y: "100%" }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-[8.5vw] md:text-[9vw] leading-[0.85] tracking-wider uppercase relative z-10 transform-gpu origin-bottom"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-olive to-maroon-dark block">MODERN</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-olive to-maroon-dark block">EXPERIENCES.</span>
                </motion.h1>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute right-[5%] top-0 text-olive text-[15vw] md:text-[18vw] font-display opacity-80 mix-blend-multiply leading-none pointer-events-none"
                >
                  *
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-4 mt-8 md:mt-12 gap-8 py-8 relative bg-cream-dark/30 backdrop-blur-sm border-t border-b border-maroon/20 p-6 md:p-8"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-maroon"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-maroon"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-maroon"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-maroon"></div>
              
              <div className="hidden md:block col-span-1 border-r border-maroon/10 relative">
                 <div className="font-mono text-[9px] text-maroon/40 leading-relaxed uppercase absolute bottom-0 left-0">
                   [SYS_INIT: <Clock format="sys" />]<br/>
                   PORTFOLIO.V1<br/>
                   SCROLL TO EXPLORE
                 </div>
              </div>
              <div className="font-mono text-[10px] text-maroon/70 uppercase tracking-widest leading-relaxed flex flex-col justify-between col-span-1 md:pl-8 gap-6 relative">
                <div className="flex flex-col items-start gap-2">
                  <span className="bg-maroon/5 text-maroon px-2 py-1 inline-block font-bold relative before:absolute before:-top-0.5 before:-left-0.5 before:w-1 absolute:h-1 before:bg-maroon/20 border border-maroon/20 hover:bg-maroon/10 transition-colors">LOCATION_</span>
                  <p className="ml-1 text-xs">Jalandhar, Punjab</p>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <span className="bg-maroon/5 text-maroon px-2 py-1 inline-block font-bold relative before:absolute before:-top-0.5 before:-left-0.5 before:w-1 absolute:h-1 before:bg-maroon/20 border border-maroon/20 hover:bg-maroon/10 transition-colors">ROLE_</span>
                  <p className="ml-1 text-xs">Creative UI/UX Designer</p>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 md:pl-8 border-t md:border-t-0 md:border-l border-maroon/10 pt-6 md:pt-0 relative">
                <div className="font-mono text-sm md:text-lg font-bold text-maroon max-w-2xl leading-relaxed uppercase border-l-[3px] border-olive pl-5 py-2">
                  IN THE END, I'M JUST A DESIGNER BUILDING AT THE INTERSECTION OF CODE, CRAFT, AND CULTURE. 
                  <br/><br/>
                  <span className="text-cream bg-maroon px-3 py-1 inline-block font-bold relative overflow-hidden group">
                    <span className="relative z-10">KEEP IT RAW.</span>
                    <motion.div 
                      className="absolute inset-0 bg-olive origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Content Slate */}
        <main className="relative z-10 bg-cream w-full px-6 md:px-12 pt-12 shadow-[0_-20px_50px_rgba(84,20,33,0.15)] border-t-[3px] border-maroon">
          
          {/* Intro/About Section with Photo */}
        <motion.section 
          ref={aboutRef}
          style={{ y: aboutY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          id="about" 
          className="max-w-7xl mx-auto py-8 relative z-10 mt-8 mb-12"
        >
          <div className="flex flex-col xl:flex-row gap-12 xl:gap-8 justify-between items-start py-8 md:py-12 border-t-[3px] border-b-[3px] border-maroon/20">
             {/* Left Text Content */}
             <div className="w-full xl:w-7/12 flex flex-col justify-start relative">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
                 className="font-mono text-xs text-maroon mb-12 flex items-start justify-between uppercase tracking-widest font-bold border-b border-maroon/20 pb-4 xl:-mt-[2px]"
               >
                 <div className="flex flex-col gap-1">
                   <span className="bg-maroon text-cream px-3 py-1 bg-clip-border">01 // ABOUT_ME</span>
                   <span className="text-[9px] opacity-60">FLD.03_BIO</span>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                   <span className="border border-maroon border-dashed px-2 py-[3px] bg-maroon/5">DOC.REF: 739</span>
                   <span className="text-[9px] text-olive font-bold">* PRIMARY PROFILE</span>
                 </div>
               </motion.div>
               
               <div className="overflow-hidden pb-1">
                 <motion.h2 
                   initial={{ y: "100%" }}
                   whileInView={{ y: "0%" }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                   className="font-display text-[7.5vw] md:text-[8vw] xl:text-[7vw] leading-[0.8] tracking-wider uppercase m-0 text-maroon block transform-gpu origin-bottom"
                 >
                   CLEAN UI.
                 </motion.h2>
               </div>
               
               <div className="overflow-hidden mb-12 sm:mb-16">
                 <motion.h2 
                   initial={{ y: "100%" }}
                   whileInView={{ y: "0%" }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                   className="font-display text-[7.5vw] md:text-[8vw] xl:text-[7vw] leading-[0.85] tracking-wider uppercase m-0 flex flex-col relative z-10 transform-gpu origin-bottom"
                 >
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-olive to-maroon-dark block">SMART UX.</span>
                 </motion.h2>
               </div>

               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="flex flex-col sm:flex-row gap-6 font-mono text-xs sm:text-sm leading-relaxed text-maroon font-medium border-l-[3px] border-maroon pl-6 mb-16"
               >
                 <div className="flex-1 max-w-sm">
                   <p className="mb-4">
                     With a background in Computer Science and specialized certifications from IBM and Google, I craft user-centric digital solutions across SaaS and web platforms. 
                   </p>
                 </div>
                 <div className="flex-1 max-w-sm">
                   <p>
                     My focus is on reducing friction, improving cognitive load, and defining clear, structured architectures that make complex data feel effortless.
                   </p>
                 </div>
               </motion.div>

               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.3 }}
                 className="mb-8 xl:mb-0 relative"
               >
                 <div className="font-mono text-[10px] tracking-widest text-maroon font-bold uppercase mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 bg-olive rounded-full inline-block"></span>
                   Tech_Stack
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {['React.js', 'Typescript', 'Node.js', 'Figma', 'Framer Motion', 'Tailwind CSS'].map((tech, i) => (
                     <span key={i} className="font-mono text-[10px] uppercase tracking-wider border border-maroon/30 px-3 py-1.5 text-maroon hover:border-maroon transition-colors cursor-default">
                       {tech}
                     </span>
                   ))}
                 </div>
               </motion.div>
             </div>

             {/* Right Image Content */}
             <div className="w-full xl:w-5/12 flex flex-col gap-10 xl:pl-8">
               <div className="w-full sm:w-10/12 md:w-8/12 xl:w-full flex-shrink-0 relative group p-3 sm:p-5 border border-maroon/40 bg-cream">
               {/* Decorative corner markers */}
               <div className="absolute top-0 left-0 w-3 h-3 border-t-[3px] border-l-[3px] border-maroon transition-all duration-300 group-hover:w-6 group-hover:h-6"></div>
               <div className="absolute top-0 right-0 w-3 h-3 border-t-[3px] border-r-[3px] border-maroon transition-all duration-300 group-hover:w-6 group-hover:h-6"></div>
               <div className="absolute bottom-0 left-0 w-3 h-3 border-b-[3px] border-l-[3px] border-maroon transition-all duration-300 group-hover:w-6 group-hover:h-6"></div>
               <div className="absolute bottom-0 right-0 w-3 h-3 border-b-[3px] border-r-[3px] border-maroon transition-all duration-300 group-hover:w-6 group-hover:h-6"></div>
               
               <div className="font-mono text-[10px] sm:text-xs z-20 flex justify-between items-center mb-4 uppercase tracking-widest text-maroon font-bold px-2">
                 <span>DOC_01.JPEG</span>
                 <span className="text-olive">[ ENG_DESIGN ]</span>
               </div>
               
               <div className="relative w-full aspect-video sm:aspect-[4/3] overflow-hidden bg-maroon/10">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoODQsMjAsMzMsMC4xNSkiLz48L3N2Zz4=')] z-20 pointer-events-none opacity-50 mix-blend-multiply"></div>
                  <motion.div style={{ y: aboutPhotoY }} className="absolute inset-0">
                    <img 
                      src="/images/my-profile.jpeg" 
                      alt="Rudra Madhab Pradhan" 
                      className="w-full h-full object-cover object-top scale-90 filter contrast-125 saturate-0 sepia-[.3] hue-rotate-[320deg] transition-all duration-700 group-hover:scale-95 group-hover:saturate-100 group-hover:sepia-0 group-hover:hue-rotate-0 group-hover:contrast-100"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-maroon mix-blend-screen opacity-20 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-700"></div>
               </div>
               
               <div className="mt-4 font-mono text-[9px] sm:text-[10px] text-maroon/70 text-center tracking-widest uppercase">
                  Subject focuses on intuitive architecture.
               </div>
               </div>

               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.4 }}
                 className="grid grid-cols-2 gap-8 sm:gap-12 pt-4 justify-between"
               >
                 <div className="flex flex-col items-start w-full">
                   <div className="font-display text-[3.5rem] sm:text-[4rem] text-maroon mb-1 leading-none flex items-baseline h-[3.5rem] sm:h-[4rem] overflow-visible">
                     07<span className="text-olive text-[0.8em] ml-1 relative translate-y-2">+</span>
                   </div>
                   <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-maroon/70">Product Case Studies</div>
                 </div>
                 <div className="flex flex-col items-start w-full">
                   <div className="font-display text-[3.5rem] sm:text-[4rem] text-maroon mb-1 leading-none flex items-baseline h-[3.5rem] sm:h-[4rem] overflow-visible">
                     10<span className="text-olive text-[0.8em] ml-1 relative translate-y-2">+</span>
                   </div>
                   <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-maroon/70">User Journeys</div>
                 </div>
                 <div className="flex flex-col items-start w-full">
                   <div className="font-display text-[3.5rem] sm:text-[4rem] text-maroon mb-1 leading-none flex items-baseline h-[3.5rem] sm:h-[4rem] overflow-visible">
                     05<span className="text-olive text-[0.8em] ml-1 relative translate-y-2">+</span>
                   </div>
                   <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-maroon/70">Startups Collaborated</div>
                 </div>
                 <div className="flex flex-col items-start w-full">
                   <div className="font-display text-[3.5rem] sm:text-[4rem] text-maroon mb-1 leading-none flex items-baseline h-[3.5rem] sm:h-[4rem] overflow-visible">
                     03<span className="text-olive text-[0.8em] ml-1 relative translate-y-2">+</span>
                   </div>
                   <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-maroon/70">Years Ex.</div>
                 </div>
               </motion.div>
             </div>
          </div>
        </motion.section>

        {/* Frame-by-Frame Reveal Showcase */}
        <section id="process" ref={revealRef} className="max-w-7xl mx-auto py-12 relative z-10 flex flex-col items-center border-t-[3px] border-maroon/5">
            <div className="w-full font-mono text-xs uppercase tracking-widest text-maroon/60 font-bold mb-8 flex justify-between border-b border-maroon/20 pb-4">
               <span>02 // THE PROCESS</span>
               <span className="text-olive">OBSERVE REVEAL</span>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[6vw] md:text-[7vw] leading-[0.8] tracking-wider uppercase m-0 text-maroon block origin-bottom mb-12 text-center transform-gpu"
            >
              FROM STRUCTURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-olive to-maroon-dark line-clamp-1 block md:inline">TO SHAPE.</span>
            </motion.h2>

            <div 
              className="relative w-full aspect-video md:aspect-[21/9] border-t-[3px] border-b-[3px] border-maroon/5 overflow-hidden group cursor-none bg-cream"
              onMouseEnter={() => { handleMouseEnter(); setCursorVariant('drag'); setCursorText('SCROLL'); }}
              onMouseLeave={() => { handleMouseLeave(); setCursorVariant('default'); setCursorText(''); }}
            >
              {/* Wireframe Layer (Bottom) */}
              <div className="absolute inset-0 p-6 md:p-10 lg:p-14 flex flex-col justify-between opacity-70 bg-[linear-gradient(rgba(84,20,33,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(84,20,33,0.25)_1px,transparent_1px)] bg-[size:16px_16px] font-rantera">
                 {/* Top Nav Wireframe */}
                 <div className="w-full flex justify-between items-start border-b border-maroon/30 pb-4 -rotate-1">
                    <div className="font-rantera text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-maroon/70 flex flex-col gap-1 -skew-x-3">
                      <div className="w-16 h-2 bg-maroon/20 mb-1 skew-y-1 rounded-[10px_2px_10px_2px/2px_10px_2px_10px]"></div>
                      <div className="w-20 h-2 bg-maroon/30 -rotate-1 rounded-[2px_10px_2px_5px/10px_2px_8px_2px]"></div>
                    </div>
                    <div className="hidden md:flex gap-8 font-rantera text-[9px] tracking-[0.2em] uppercase text-maroon/50 rotate-1">
                       <div className="w-12 h-2 bg-maroon/20 -skew-y-1 rounded-[5px_2px_8px_2px/2px_10px_2px_10px]"></div>
                       <div className="w-16 h-2 bg-maroon/20 skew-x-2 rounded-[2px_10px_2px_10px/10px_2px_5px_2px]"></div>
                       <div className="w-14 h-2 bg-maroon/20 rotate-2 rounded-[10px_2px_10px_2px/2px_10px_2px_10px]"></div>
                    </div>
                    <div className="font-rantera text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-maroon/70 flex flex-col gap-1 items-end skew-x-2">
                      <div className="w-12 h-2 bg-maroon/20 mb-1 -rotate-2 rounded-[2px_10px_2px_10px/10px_2px_10px_2px]"></div>
                      <div className="w-20 h-2 bg-maroon/30 skew-y-1 rounded-[10px_2px_5px_2px/2px_10px_2px_10px]"></div>
                    </div>
                 </div>
                 
                 {/* Main Title Area Wireframe */}
                 <div className="flex-1 flex flex-col items-center justify-center relative w-full pt-4 group">
                      {/* Measurement Lines */}
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[1px] border-b border-dashed border-maroon/30 hidden md:block rotate-[0.5deg]"></div>
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 h-full w-[1px] border-r border-dashed border-maroon/30 hidden md:block -rotate-[0.5deg]"></div>
                      
                      <div className="h-20 sm:h-28 md:h-36 lg:h-44 xl:h-48 w-[80%] border border-maroon/40 bg-maroon/5 flex flex-col items-center justify-center px-4 font-rantera text-xl md:text-2xl text-maroon/60 tracking-widest relative mt-0 -rotate-1 skew-x-1 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                        <div className="absolute -left-1 -top-1 w-2 h-2 border border-maroon/60 bg-cream rotate-12"></div>
                        <div className="absolute -right-1 -top-1 w-2 h-2 border border-maroon/60 bg-cream -rotate-6"></div>
                        <div className="absolute -left-1 -bottom-1 w-2 h-2 border border-maroon/60 bg-cream -rotate-12"></div>
                        <div className="absolute -right-1 -bottom-1 w-2 h-2 border border-maroon/60 bg-cream rotate-6"></div>
                        <span className="text-maroon/30 text-xs tracking-widest mb-2 rotate-1">[SEC_HDR: LEVEL 1]</span>
                        <div className="w-[60%] h-6 bg-maroon/20 -skew-x-3 rounded-[5px_10px_2px_8px/10px_2px_5px_5px]"></div>
                      </div>
                      <div className="h-10 sm:h-12 md:h-16 lg:h-20 w-[50%] border border-maroon/40 bg-maroon/5 flex items-center justify-center px-4 font-rantera text-sm md:text-xl text-maroon/40 tracking-widest relative mt-2 md:mt-4 rotate-1 -skew-x-2 rounded-[15px_255px_15px_225px/225px_15px_255px_15px]">
                        <div className="absolute -top-3 md:-top-5 left-1/2 -translate-x-1/2 w-[1px] h-3 md:h-5 bg-maroon/40 rotate-[15deg]"></div>
                        <div className="w-[40%] h-4 bg-maroon/20 skew-x-3 rounded-[10px_2px_8px_5px/2px_10px_5px_8px]"></div>
                      </div>
                 </div>

                 {/* Bottom Footer Wireframe */}
                 <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-end">
                    <div className="hidden md:block col-span-1 border-t border-maroon/30 pt-4 relative rotate-1">
                       <div className="absolute top-0 left-0 w-1.5 h-1.5 -translate-y-[4px] rotate-[35deg] border border-maroon/50 bg-cream"></div>
                       <div className="flex flex-col gap-2 mt-2 -skew-x-2">
                         <div className="w-full h-1.5 bg-maroon/20 rotate-[0.5deg] rounded-[5px_2px_5px_2px/2px_5px_2px_5px]"></div>
                         <div className="w-[90%] h-1.5 bg-maroon/20 -rotate-[0.5deg] rounded-[2px_5px_2px_5px/5px_2px_5px_2px]"></div>
                         <div className="w-[60%] h-1.5 bg-maroon/20 skew-y-1 rounded-[5px_2px_5px_2px/2px_5px_2px_5px]"></div>
                       </div>
                    </div>
                    
                    <div className="hidden md:flex col-span-1 justify-center items-center h-full">
                       <div className="w-32 h-10 border border-maroon/40 flex items-center justify-center font-rantera text-[8px] text-maroon/40 tracking-widest -rotate-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-maroon/5">
                         [ ACTION ]
                       </div>
                    </div>

                    <div className="col-span-1 border-t border-maroon/30 pt-4 relative -rotate-1">
                       <div className="absolute top-0 right-0 w-1.5 h-1.5 -translate-y-[4px] rotate-[55deg] border border-maroon/50 bg-cream"></div>
                       <div className="flex flex-col gap-2 mt-2 items-start skew-x-2">
                         <div className="w-full h-1.5 bg-maroon/20 -rotate-[0.5deg] rounded-[2px_5px_2px_5px/5px_2px_5px_2px]"></div>
                         <div className="w-[80%] h-1.5 bg-maroon/20 rotate-[0.5deg] rounded-[5px_2px_5px_2px/2px_5px_2px_5px]"></div>
                         <div className="w-[40%] h-1.5 bg-maroon/20 -skew-y-1 rounded-[2px_5px_2px_5px/5px_2px_5px_2px]"></div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Polished UI Layer (Top) */}
              <motion.div 
                style={{ clipPath: clipPathValue }}
                className="absolute inset-0 bg-gradient-to-r from-olive to-maroon-dark text-cream flex shadow-2xl border-r-[3px] border-maroon will-change-transform cursor-none overflow-hidden font-rantera"
                onMouseEnter={() => setIsInverseCursor(true)}
                onMouseLeave={() => setIsInverseCursor(false)}
              >
                 {/* Background Image */}
                 <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
                    <img 
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                      alt="Interior Architecture"
                      className="w-full h-full object-cover grayscale brightness-[0.8] contrast-[1.2] origin-center transition-transform duration-[5s] hover:scale-110"
                    />
                 </div>

                 {/* Content Layer */}
                 <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-10 lg:p-14 pointer-events-none text-cream">
                     
                     {/* Top Navigation */}
                     <div className="w-full flex justify-between items-start border-b border-cream/20 pb-4">
                        <div className="font-rantera text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-cream/70 flex flex-col gap-1">
                          <span className="opacity-50">Project Ref</span>
                          <span>INDEX [04]</span>
                        </div>
                        <div className="hidden md:flex gap-8 font-rantera text-[9px] tracking-[0.2em] uppercase text-cream/50">
                           <span className="text-cream font-bold cursor-pointer pointer-events-auto hover:text-cream/80 transition-colors">Concept</span>
                           <span className="cursor-pointer pointer-events-auto hover:text-cream transition-colors">Architecture</span>
                           <span className="cursor-pointer pointer-events-auto hover:text-cream transition-colors">Interiors</span>
                        </div>
                        <div className="font-rantera text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-cream/70 flex flex-col gap-1 items-end">
                          <span className="opacity-50">Region</span>
                          <span>PACIFIC NW</span>
                        </div>
                     </div>

                     {/* Main Title Area */}
                     <div className="flex-1 flex flex-col items-center justify-center relative w-full pt-4">
                           <h1 className="font-rantera text-[4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[8.5rem] xl:text-[9.5rem] leading-[0.8] tracking-tight uppercase text-cream text-center drop-shadow-2xl">
                             CASCADIA
                           </h1>
                           <h2 className="font-rantera text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] text-cream/90 font-light drop-shadow-xl uppercase tracking-[0.2em] mt-0 md:mt-2 text-center">
                             ESTATE
                           </h2>
                     </div>

                     {/* Bottom Info Blocks */}
                     <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-end">
                        <div className="hidden md:block col-span-1 border-t border-cream/30 pt-4 relative">
                           <div className="absolute top-0 left-0 w-1.5 h-1.5 -translate-y-[4px] rotate-45 bg-cream/50 text-cream"></div>
                           <p className="font-rantera text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-cream/90 leading-[2] pb-2 text-justify">
                             Finding harmony between modernist restraint and the untamed natural world. Heavy concrete lines gracefully yield to internal ecosystems.
                           </p>
                        </div>
                        
                        <div className="hidden md:flex col-span-1 justify-center items-center h-full">
                           <div className="font-rantera text-[8px] uppercase tracking-[0.4em] text-cream/40 border border-cream/20 px-4 py-2 rounded-full cursor-none">
                             [ EXPLORE ]
                           </div>
                        </div>

                        <div className="col-span-1 border-t border-cream/30 pt-4 relative">
                           <div className="absolute top-0 right-0 w-1.5 h-1.5 -translate-y-[4px] rotate-45 bg-cream/50 text-cream"></div>
                           <p className="font-rantera text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-cream/90 leading-[2] pb-2 text-justify">
                             A sanctuary redefining luxury through raw, unfinished textures and ambient light.
                           </p>
                        </div>
                     </div>
                 </div>
              </motion.div>
            </div>
            
            <div className="font-mono text-[9px] uppercase tracking-widest text-maroon/50 mt-4 self-end flex items-center gap-2">
              <span className="w-8 h-[1px] bg-maroon/50 block"></span>
              Scroll slowly to observe state transition.
            </div>
        </section>

        {/* Marquee */}
        <motion.section 
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="py-12 overflow-hidden border-y-[3px] border-maroon/5 -mx-6 md:-mx-12 mb-16 z-10 relative bg-cream-dark"
        >
          <ParallaxMarquee baseVelocity={-2}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-8 items-center px-4">
                <h2 className="font-display text-5xl md:text-7xl text-outline-maroon text-transparent tracking-tight opacity-50 uppercase">UI/UX DESIGN</h2>
                <svg className="w-8 h-8 md:w-10 md:h-10 text-olive mx-2 md:mx-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16M5.07 8l13.86 8M5.07 16l13.86-8"/></svg>
                <h2 className="font-display text-5xl md:text-7xl text-maroon tracking-tight uppercase">CREATIVE DEV</h2>
                <svg className="w-8 h-8 md:w-10 md:h-10 text-olive mx-2 md:mx-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16M5.07 8l13.86 8M5.07 16l13.86-8"/></svg>
                <h2 className="font-display text-5xl md:text-7xl text-outline-maroon text-transparent tracking-tight opacity-50 uppercase">PRODUCT STRATEGY</h2>
                <svg className="w-8 h-8 md:w-10 md:h-10 text-olive mx-2 md:mx-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16M5.07 8l13.86 8M5.07 16l13.86-8"/></svg>
                <h2 className="font-display text-5xl md:text-7xl text-maroon tracking-tight uppercase">ART DIRECTION</h2>
                <svg className="w-8 h-8 md:w-10 md:h-10 text-olive mx-2 md:mx-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16M5.07 8l13.86 8M5.07 16l13.86-8"/></svg>
              </div>
            ))}
          </ParallaxMarquee>
        </motion.section>
        <motion.section 
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          id="works" 
          className="max-w-7xl mx-auto relative z-10 mb-16 border-t-[3px] border-maroon/20 pt-16"
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-[3px] border-maroon pb-4" ref={worksHeadingRef}>
            <motion.h2 
              style={{ y: worksHeadingY, opacity: worksHeadingOpacity }}
              className="font-display text-5xl md:text-7xl uppercase tracking-widest text-maroon leading-none"
            >
              Select Works <sup className="text-2xl text-olive">[04]</sup>
            </motion.h2>
          </div>

          <div className="flex flex-col border-b border-maroon/20">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                id={`project-${index}`}
                onClick={() => {
                  setExpandedProjectIndex(expandedProjectIndex === index ? null : index);
                }}
                onMouseEnter={() => { handleMouseEnter(); setHoveredProjectIndex(index); setCursorText('VIEW'); setCursorVariant('view'); }}
                onMouseLeave={() => { handleMouseLeave(); setHoveredProjectIndex(null); setCursorText(''); setCursorVariant('default'); }}
                initial={{ opacity: 0, y: 50, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative border-t border-maroon/20 py-8 px-4 md:px-8 transition-colors duration-300 ease-out block overflow-hidden cursor-pointer ${expandedProjectIndex === index ? 'bg-maroon is-expanded' : 'hover:bg-maroon'}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-1 hidden md:block pt-2">
                    <p className="font-display text-4xl text-olive group-hover:text-cream group-[.is-expanded]:text-cream transition-colors duration-300 ease-out">{String(index + 1).padStart(2, '0')}.</p>
                  </div>
                  <div className="md:col-span-5 pt-2">
                    <h3 className="font-display text-4xl md:text-6xl uppercase text-maroon group-hover:text-cream group-[.is-expanded]:text-cream transition-colors duration-300 ease-out">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="border border-maroon/20 group-hover:border-cream/20 group-[.is-expanded]:border-cream/20 group-hover:text-cream group-[.is-expanded]:text-cream rounded-none px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-maroon transition-colors duration-300 ease-out">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-4 pt-2">
                    <div className="hidden md:block">
                      <p className={`font-mono text-sm text-maroon/60 group-hover:text-cream/80 group-[.is-expanded]:text-cream/80 transition-colors duration-300 ease-out ${expandedProjectIndex === index ? '' : 'line-clamp-2'}`}>{project.description}</p>
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          setExpandedProjectIndex(expandedProjectIndex === index ? null : index); 
                        }}
                        className="mt-2 text-[10px] uppercase font-mono tracking-widest text-olive hover:text-cream/90 group-[.is-expanded]:text-cream/90 transition-colors duration-300 ease-out underline relative z-20 pointer-events-auto"
                      >
                        {expandedProjectIndex === index ? 'Read Less' : 'Read More'}
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-2 pt-2">
                    <p className="font-mono text-xs text-maroon/50 group-hover:text-cream/60 group-[.is-expanded]:text-cream/60 transition-colors duration-300 ease-out uppercase pt-2">{project.date}</p>
                    <p className="font-mono text-xs border border-olive text-olive group-hover:bg-olive group-[.is-expanded]:bg-olive group-hover:text-cream group-[.is-expanded]:text-cream px-2 py-1 uppercase transition-colors duration-300 ease-out">{project.role}</p>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedProjectIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mt-8 pt-8 border-t border-maroon/10 group-hover:border-cream/10 group-[.is-expanded]:border-cream/10 transition-colors duration-300 ease-out">
                        <p className="font-mono text-sm leading-relaxed text-maroon/80 group-hover:text-cream/90 group-[.is-expanded]:text-cream/90 max-w-4xl mb-8 transition-colors duration-300 ease-out">
                          {project.fullCaseStudy}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.images?.map((img, i) => (
                            <motion.div
                              key={i}
                              initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
                              animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 * i }}
                              className="w-full h-64 sm:h-80 md:h-96 overflow-hidden group/img relative bg-maroon/10"
                            >
                              <img src={img} alt={`${project.title} view ${i + 1}`} className="absolute inset-0 w-full h-full object-cover block grayscale group-hover/img:grayscale-0 transition-transform duration-[3s] group-hover/img:scale-105 origin-center" />
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-8">
                          <a href={project.link} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-olive hover:text-cream uppercase font-mono text-xs tracking-widest transition-colors relative z-20 pointer-events-auto">
                            View Live Project <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>
        <motion.section 
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          id="playground"
          className="max-w-7xl mx-auto mt-40 mb-20 md:mb-32 relative z-10"
        >
           <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
              <div className="md:col-span-5 bg-cream p-8 border-[3px] border-maroon/20 relative overflow-hidden">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="font-display text-4xl md:text-5xl mb-12 uppercase tracking-wide text-maroon"
                >
                  CAPABILITIES
                </motion.h2>
                <div className="flex flex-wrap gap-2">
                  {['Figma', 'Framer', 'React', 'Tailwind', 'Product Management', 'C++', 'Python', 'UX Research'].map(skill => (
                    <div key={skill} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="border border-maroon/20 bg-maroon/5 px-3 py-2 font-mono text-xs uppercase tracking-wider hover:bg-olive hover:text-cream transition-colors cursor-default hover:border-olive text-maroon">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-7">
                <div className="flex justify-between items-center mb-8 border-b-[3px] border-maroon/20 pb-4">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-display text-4xl md:text-5xl uppercase tracking-wide text-maroon"
                  >
                    HISTORY_
                  </motion.h2>
                  <div className="font-mono text-xs text-maroon/50 px-2 py-1 border border-maroon/20">LOG.DATA</div>
                </div>
                <div className="border-b border-maroon/10 pb-6 mb-6 group relative">
                  <div className="absolute left-[-2rem] top-2 font-display text-2xl text-olive opacity-0 group-hover:opacity-100 transition-opacity">*</div>
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                    <h3 className="font-sans font-bold text-2xl text-maroon group-hover:text-olive transition-colors uppercase">Freelance UI/UX Designer</h3>
                    <span className="font-mono text-xs text-maroon/70 bg-maroon/10 px-2 py-1 w-fit">2024 - 2025</span>
                  </div>
                  <p className="font-mono text-sm text-maroon/60">Designed user-centric digital solutions across SaaS and web platforms, focusing on usability and accessibility.</p>
                </div>
                <div className="border-b border-maroon/10 pb-6 mb-6 group relative">
                  <div className="absolute left-[-2rem] top-2 font-display text-2xl text-olive opacity-0 group-hover:opacity-100 transition-opacity">*</div>
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                    <h3 className="font-sans font-bold text-2xl text-maroon group-hover:text-olive transition-colors uppercase">Product Management Sim.</h3>
                    <span className="font-mono text-xs text-maroon/70 bg-maroon/10 px-2 py-1 w-fit">Nov 2025</span>
                  </div>
                  <p className="font-mono text-sm text-maroon/60">Electronic Arts (Forage). Executed KPI selection and mapped player segments across mobile gaming ecosystems.</p>
                </div>
                <div className="border-b border-maroon/10 pb-6 group relative">
                  <div className="absolute left-[-2rem] top-2 font-display text-2xl text-olive opacity-0 group-hover:opacity-100 transition-opacity">*</div>
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                    <h3 className="font-sans font-bold text-2xl text-maroon group-hover:text-olive transition-colors uppercase">B.Tech Computer Science</h3>
                    <span className="font-mono text-xs text-maroon/70 bg-maroon/10 px-2 py-1 w-fit">2021 - 2025</span>
                  </div>
                  <p className="font-mono text-sm text-maroon/60">Lovely Professional University, Punjab. CGPA: 7.4.</p>
                </div>
             </div>
           </div>
        </motion.section>
        <section id="contact" onMouseEnter={() => setIsInverseCursor(true)} onMouseLeave={() => setIsInverseCursor(false)} className="pt-16 border-t-[8px] border-maroon relative z-10 bg-maroon-dark -mx-6 md:-mx-12 px-6 md:px-12 overflow-hidden">
          
          {/* Marquee */}
          <div className="absolute top-0 left-0 w-full overflow-hidden border-b border-maroon/30 py-4 bg-maroon-dark z-20">
            <ParallaxMarquee baseVelocity={1.5}>
              {[...Array(12)].map((_, i) => (
                <span key={i} className="font-mono text-sm tracking-widest uppercase text-cream/50 px-8 flex items-center gap-8">
                  OPEN FOR OPPORTUNITIES <span className="bg-olive w-2 h-2 rounded-full"></span>
                </span>
              ))}
            </ParallaxMarquee>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-7xl mx-auto pb-12 pt-24">
            <div className="md:col-span-8">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
                className="font-display text-[14vw] md:text-[10vw] leading-[0.8] tracking-[-0.02em] uppercase mb-8 text-cream drop-shadow-md flex flex-wrap"
              >
                {['LET\'S', 'TALK.'].map((word, i) => (
                   <motion.span 
                     key={i} 
                     className={`mr-[3vw] ${i === 1 ? 'text-olive' : ''}`}
                     variants={{
                       hidden: { y: "100%", opacity: 0, rotateZ: 5 },
                       visible: { y: "0%", opacity: 1, rotateZ: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                     }}
                   >
                     {word}
                   </motion.span>
                ))}
              </motion.div>
              {isSubmitted ? (
                <div className="mt-12 p-6 border border-olive text-olive font-mono bg-olive/10 inline-block w-full max-w-xl">
                  Message received. I will get back to you shortly.
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 mt-12 w-full max-w-xl">
                  <div className="flex flex-col md:flex-row gap-6">
                    <input
                      type="text"
                      placeholder="NAME"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-transparent border-b border-cream/30 px-0 py-3 text-cream outline-none focus:border-olive transition-colors font-mono uppercase w-full placeholder:text-cream/30"
                    />
                    <input
                      type="email"
                      placeholder="EMAIL"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-transparent border-b border-cream/30 px-0 py-3 text-cream outline-none focus:border-olive transition-colors font-mono uppercase w-full placeholder:text-cream/30"
                    />
                  </div>
                  <textarea
                    placeholder="MESSAGE"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-transparent border-b border-cream/30 px-0 py-3 text-cream outline-none focus:border-olive transition-colors font-mono uppercase w-full resize-none placeholder:text-cream/30"
                  />
                  <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isSubmitting}
                      onMouseEnter={handleMouseEnter} 
                      onMouseLeave={handleMouseLeave} 
                      className="inline-flex justify-between items-center gap-8 bg-cream text-maroon px-6 py-4 font-mono font-medium uppercase tracking-widest transition-colors hover:bg-olive hover:text-cream w-fit mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send message'} <ArrowUpRight className="w-5 h-5" />
                    </motion.button>
                </form>
              )}
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end items-end pb-8">
              <div className="flex flex-col gap-4 text-sm text-cream/70 font-mono w-full md:w-auto mt-4">
                <div className="flex items-start gap-8 md:gap-12 border-b border-cream/20 pb-4 mt-4 w-full">
                  <span className="w-28 shrink-0 text-left tracking-widest text-cream/70 font-bold border-r border-cream/20 pr-4">FLD.01_LOC</span>
                  <div className="flex-1 text-left pl-4">
                    <span className="text-cream block">Jalandhar, Punjab</span>
                    <span className="text-olive text-xs"><Clock format="local" /></span>
                  </div>
                </div>
                <div className="flex items-center gap-8 md:gap-12 border-b border-cream/20 pb-4 w-full">
                  <span className="w-28 shrink-0 text-left tracking-widest text-cream/70 font-bold border-r border-cream/20 pr-4">FLD.02_TEL</span>
                  <span className="flex-1 text-cream text-left pl-4">+91 9692709140</span>
                </div>
                <div className="flex items-center gap-8 md:gap-12 border-b border-cream/20 pb-4 w-full">
                  <span className="w-28 shrink-0 text-left tracking-widest text-cream/70 font-bold border-r border-cream/20 pr-4">FLD.03_SOC</span>
                  <div className="flex-1 flex gap-4 justify-start pl-4">
                    <a href="https://github.com/rudrax1000" target="_blank" rel="noreferrer" className="text-cream hover:text-olive hover:-translate-y-1 transition-transform">GitHub</a>
                    <a href="http://www.linkedin.com/in/rudrax1000/" target="_blank" rel="noreferrer" className="text-cream hover:text-olive hover:-translate-y-1 transition-transform">LinkedIn</a>
                    <a href="#" className="text-cream hover:text-olive hover:-translate-y-1 transition-transform">Twitter</a>
                  </div>
                </div>
                <div className="flex items-center gap-8 md:gap-12 pt-4 w-full">
                  <span className="w-28 shrink-0 text-left tracking-widest text-cream/70 font-bold border-r border-cream/20 pr-4">DOC.COPY</span>
                  <span className="flex-1 text-cream text-left pl-4">© {new Date().getFullYear()} R.M.P</span>
                </div>
              </div>
            </div>
          </div>

          {/* Huge Footer Text */}
          <motion.div style={{ y: footerY, maxHeight: "25vw" }} className="w-full flex items-center justify-center mt-8 mb-[-3vw] opacity-[0.03] pointer-events-none select-none overflow-hidden mix-blend-screen overflow-y-hidden">
            <h1 className="font-display text-[30vw] leading-[0.7] tracking-tighter text-cream m-0">RUDRA</h1>
          </motion.div>
        </section>
      </main>
      </div>
    </div>
  );
}
