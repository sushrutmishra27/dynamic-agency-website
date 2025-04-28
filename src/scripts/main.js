/**
 * Main entry point for the application
 */

import '../styles/main.scss';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import LocomotiveScroll from 'locomotive-scroll';
import { isWebGLSupported } from './utils/three-utils';
import { select, selectAll, hasTouch, getDeviceType, prefersReducedMotion } from './utils/dom';
import { initGSAP, animateFadeIn, createScrollProgress } from './utils/animation-utils';
import HeroBackground from './animations/HeroBackground';
import { initPortfolioSection } from './components/Portfolio';
import { initTestimonialsSection } from './components/Testimonials';
import { initTeamSection } from './components/Team';
import initPricingSection from './components/Pricing';
import initFAQSection from './components/FAQ';
import initContactSection from './components/Contact';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global state
const state = {
  isLoaded: false,
  isMenuOpen: false,
  currentSection: 'hero',
  device: getDeviceType(),
  reducedMotion: prefersReducedMotion(),
  webglSupported: isWebGLSupported(),
  scroll: null,
};

/**
 * Initialize the application
 */
function init() {
  // Initialize GSAP
  initGSAP();
  
  // Initialize smooth scrolling
  initSmoothScroll();
  
  // Initialize UI components
  initUI();
  
  // Initialize animations
  initAnimations();
  
  // Initialize portfolio section
  initPortfolioSection();
  
  // Initialize testimonials section
  initTestimonialsSection();
  
  // Initialize team section
  initTeamSection();
  
  // Initialize pricing section with data
  initPricingSection({
    currency: 'USD',
    plans: window.pricingPlans || []
  });
  
  // Initialize FAQ section with data
  initFAQSection({
    questions: window.faqData || []
  });
  
  // Initialize contact section with config
  initContactSection({
    endpoint: '/api/contact',
    recaptcha: true
  });
  
  // Set loaded state
  state.isLoaded = true;
  document.documentElement.classList.add('is-loaded');
  
  // Hide loading overlay
  const loadingOverlay = select('.loading-overlay');
  if (loadingOverlay) {
    gsap.to(loadingOverlay, {
      opacity: 0,
      duration: 0.5,
      delay: 0.5,
      onComplete: () => {
        loadingOverlay.style.display = 'none';
      }
    });
  }
  
  // Log initialization
  console.log(`Initialized application:
    - Device: ${state.device}
    - Reduced motion: ${state.reducedMotion}
    - WebGL supported: ${state.webglSupported}
  `);
}

/**
 * Initialize smooth scrolling
 */
function initSmoothScroll() {
  // Initialize Locomotive Scroll
  const scrollContainer = select('[data-scroll-container]');
  
  if (scrollContainer) {
    state.scroll = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      multiplier: 1,
      lerp: 0.1,
      smartphone: {
        smooth: false,
      },
      tablet: {
        smooth: false,
      },
    });
    
    // Update ScrollTrigger on scroll
    state.scroll.on('scroll', ScrollTrigger.update);
    
    // Set up ScrollTrigger to work with Locomotive Scroll
    ScrollTrigger.scrollerProxy(scrollContainer, {
      scrollTop(value) {
        return arguments.length ? state.scroll.scrollTo(value, 0, 0) : state.scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: scrollContainer.style.transform ? 'transform' : 'fixed',
    });
    
    // Refresh ScrollTrigger and Locomotive Scroll
    ScrollTrigger.addEventListener('refresh', () => state.scroll.update());
    ScrollTrigger.refresh();
  }
}

/**
 * Initialize UI components
 */
function initUI() {
  // Initialize header
  initHeader();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize scroll progress indicator
  initScrollProgress();
  
  // Initialize smooth scroll links
  initSmoothScrollLinks();
  
  // Initialize form validation
  initFormValidation();
}

/**
 * Initialize header
 */
function initHeader() {
  const header = select('header');
  
  if (!header) return;
  
  // Add scroll event listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
  const menuToggle = select('.menu-toggle');
  const mobileMenu = select('.mobile-menu');
  
  if (!menuToggle || !mobileMenu) return;
  
  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    state.isMenuOpen = !state.isMenuOpen;
    menuToggle.classList.toggle('is-active', state.isMenuOpen);
    mobileMenu.classList.toggle('is-active', state.isMenuOpen);
    document.body.classList.toggle('menu-open', state.isMenuOpen);
  });
  
  // Close mobile menu on link click
  const mobileMenuLinks = selectAll('.mobile-menu a');
  
  mobileMenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      state.isMenuOpen = false;
      menuToggle.classList.remove('is-active');
      mobileMenu.classList.remove('is-active');
      document.body.classList.remove('menu-open');
    });
  });
}

/**
 * Initialize scroll progress indicator
 */
function initScrollProgress() {
  const scrollProgress = select('.scroll-progress');
  
  if (scrollProgress) {
    createScrollProgress(scrollProgress, {
      direction: 'horizontal',
      color: 'var(--color-primary)',
    });
  }
}

/**
 * Initialize smooth scroll links
 */
function initSmoothScrollLinks() {
  const scrollLinks = selectAll('a[href^="#"]');
  
  scrollLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetElement = select(targetId);
      
      if (targetElement) {
        if (state.scroll) {
          state.scroll.scrollTo(targetElement);
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/**
 * Initialize form validation
 */
function initFormValidation() {
  const forms = selectAll('form');
  
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate form
      const isValid = validateForm(form);
      
      if (isValid) {
        // Submit form
        const formData = new FormData(form);
        
        // Show loading state
        form.classList.add('is-loading');
        
        // Simulate form submission
        setTimeout(() => {
          // Hide loading state
          form.classList.remove('is-loading');
          
          // Show success message
          form.classList.add('is-success');
          
          // Reset form
          form.reset();
          
          // Remove success message after 3 seconds
          setTimeout(() => {
            form.classList.remove('is-success');
          }, 3000);
        }, 1500);
      }
    });
  });
}

/**
 * Validate form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} Whether the form is valid
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('input, textarea, select');
  let isValid = true;
  
  inputs.forEach((input) => {
    if (input.hasAttribute('required') && !input.value) {
      isValid = false;
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
    
    // Validate email
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(input.value)) {
        isValid = false;
        input.classList.add('is-invalid');
      }
    }
  });
  
  return isValid;
}

/**
 * Initialize animations
 */
function initAnimations() {
  // Initialize hero animations
  initHeroAnimations();
  
  // Initialize scroll animations
  initScrollAnimations();
}

/**
 * Initialize hero text animations
 */
function initHeroTextAnimations() {
  const textElements = {
    title: select('.hero-title'),
    subtitle: select('.hero-subtitle'),
    paragraphs: selectAll('.hero-text p'),
    highlights: selectAll('.hero-highlight')
  };

  if (!textElements.title) return;

  // Create text animation timeline
  const textTimeline = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });

  textTimeline
    .from(textElements.title, {
      opacity: 0,
      y: 50,
      duration: 1
    })
    .from(textElements.subtitle, {
      opacity: 0,
      y: 30,
      duration: 0.8
    }, '-=0.4')
    .from(textElements.paragraphs, {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6
    }, '-=0.2')
    .from(textElements.highlights, {
      backgroundColor: 'transparent',
      color: 'inherit',
      stagger: 0.1,
      duration: 0.4
    }, '-=0.3');

  return textTimeline;
}

function initHeroAnimations() {
  const heroSection = select('#hero');
  
  if (!heroSection) return;

  // Initialize text animations for hero section
  const heroTitle = select('.hero-title');
  const heroSubtitle = select('.hero-subtitle');
  const heroCta = select('.hero-cta');
  
  if (heroTitle) {
    gsap.from(heroTitle, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'back.out',
      delay: 0.5
    });
  }
  
  if (heroSubtitle) {
    gsap.from(heroSubtitle, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      delay: 1.2
    });
  }
  
  if (heroCta) {
    gsap.from(heroCta, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      delay: 1.8
    });
  }

  // Performance monitoring
  const perfMonitor = {
    fps: 0,
    frameTime: 0,
    lastTime: performance.now(),
    frames: 0,
    update: function() {
      const currentTime = performance.now();
      this.frames++;
      
      if (currentTime >= this.lastTime + 1000) {
        this.fps = this.frames;
        this.frameTime = (currentTime - this.lastTime) / this.frames;
        this.frames = 0;
        this.lastTime = currentTime;
        
        // Auto-adjust quality if performance drops
        if (this.fps < 30) {
          state.reducedQuality = true;
          if (window._heroBackground) {
            window._heroBackground.setQuality('low');
          }
        }
      }
    }
  };

  // Add to RAF loop
  const animate = () => {
    perfMonitor.update();
    requestAnimationFrame(animate);
  };
  animate();

  // Initialize hero background
  if (state.webglSupported && !state.reducedMotion) {
    const heroBackgroundContainer = select('.hero-background');
    
    if (heroBackgroundContainer) {
      // Configure responsive breakpoints
      const breakpoints = {
        mobile: {
          width: 480,
          scale: 0.5,
          particles: 0.3
        },
        tablet: {
          width: 768,
          scale: 0.7,
          particles: 0.6
        },
        desktop: {
          width: 1024,
          scale: 1,
          particles: 1
        }
      };

      // Get current breakpoint
      const getBreakpoint = () => {
        const width = window.innerWidth;
        if (width <= breakpoints.mobile.width) return 'mobile';
        if (width <= breakpoints.tablet.width) return 'tablet';
        return 'desktop';
      };

      const heroBackground = new HeroBackground(heroBackgroundContainer, {
        scale: breakpoints[getBreakpoint()].scale,
        particleDensity: breakpoints[getBreakpoint()].particles
      });

      // Update on resize
      window.addEventListener('resize', () => {
        const bp = getBreakpoint();
        heroBackground.updateConfig({
          scale: breakpoints[bp].scale,
          particleDensity: breakpoints[bp].particles
        });
      });
      
      // Store reference for cleanup
      window._heroBackground = heroBackground;

      // Add scroll-triggered animations
      ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          heroBackground.updateParallax(self.progress);
        },
        onEnter: () => heroBackground.show(),
        onLeave: () => heroBackground.hide(),
        scrub: true
      });
    }
  }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  // Animate section titles
  const sectionTitles = selectAll('.section-title');
  
  sectionTitles.forEach((title) => {
    gsap.from(title, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
      }
    });
  });
  
  // Animate fade in elements
  const fadeElements = selectAll('.fade-in');
  
  fadeElements.forEach((element) => {
    animateFadeIn(element, {
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
      },
    });
  });
  
  // Animate staggered elements
  const staggerContainers = selectAll('.stagger-container');
  
  staggerContainers.forEach((container) => {
    const items = container.querySelectorAll('.stagger-item');
    
    gsap.from(items, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
      },
    });
  });
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export state for debugging
window.appState = state;