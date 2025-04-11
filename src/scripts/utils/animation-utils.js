/**
 * Animation utility functions for the application
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { select, selectAll } from './dom';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize GSAP
 */
export function initGSAP() {
  // Default easing
  gsap.defaults({
    ease: 'power3.out',
    duration: 1
  });
}

/**
 * Create scroll progress indicator
 * @param {HTMLElement} element - The element to use as the progress indicator
 * @param {Object} options - Options for the progress indicator
 * @param {string} options.direction - Direction of the progress indicator (horizontal or vertical)
 * @param {string} options.color - Color of the progress indicator
 */
export function createScrollProgress(element, options = {}) {
  const { direction = 'horizontal', color = 'var(--color-primary)' } = options;
  
  // Set initial styles
  gsap.set(element, {
    position: 'fixed',
    top: direction === 'horizontal' ? 0 : 'auto',
    left: direction === 'vertical' ? 0 : 'auto',
    bottom: direction === 'vertical' ? 'auto' : 0,
    right: 'auto',
    width: direction === 'horizontal' ? 0 : '4px',
    height: direction === 'vertical' ? 0 : '4px',
    backgroundColor: color,
    zIndex: 9999
  });
  
  // Create scroll trigger
  ScrollTrigger.create({
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      if (direction === 'horizontal') {
        gsap.to(element, {
          width: `${self.progress * 100}%`,
          duration: 0.1,
          ease: 'none'
        });
      } else {
        gsap.to(element, {
          height: `${self.progress * 100}%`,
          duration: 0.1,
          ease: 'none'
        });
      }
    }
  });
}

/**
 * Animate fade in
 * @param {HTMLElement} element - The element to animate
 * @param {Object} options - Animation options
 */
export function animateFadeIn(element, options = {}) {
  const {
    y = 30,
    duration = 1,
    delay = 0,
    stagger = 0,
    scrollTrigger = null
  } = options;
  
  const animation = {
    opacity: 0,
    y,
    duration,
    stagger,
    delay,
    clearProps: 'transform'
  };
  
  if (scrollTrigger) {
    animation.scrollTrigger = {
      trigger: scrollTrigger.trigger || element,
      start: scrollTrigger.start || 'top 80%',
      toggleActions: scrollTrigger.toggleActions || 'play none none none',
      ...scrollTrigger
    };
  }
  
  return gsap.from(element, animation);
}

/**
 * Create portfolio grid animation
 * @param {HTMLElement} grid - The portfolio grid element
 */
export function createPortfolioGridAnimation(grid) {
  if (!grid) return;
  
  const items = grid.querySelectorAll('.portfolio-item');
  
  ScrollTrigger.create({
    trigger: grid,
    start: 'top 80%',
    onEnter: () => {
      gsap.from(items, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform'
      });
    },
    once: true
  });
}

/**
 * Create testimonial carousel animation
 * @param {HTMLElement} carousel - The carousel element
 */
export function createTestimonialCarouselAnimation(carousel) {
  if (!carousel) return;
  
  const slides = carousel.querySelectorAll('.testimonial-slide');
  
  // Set initial state
  gsap.set(slides, {
    opacity: 0,
    y: 30
  });
  
  // Set first slide as active
  if (slides.length > 0) {
    slides[0].classList.add('active');
    
    gsap.to(slides[0], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
}

/**
 * Create statistics counter animation
 * @param {HTMLElement} container - The statistics container element
 * @param {Array} statistics - The statistics data
 */
export function createStatisticsCounterAnimation(container, statistics) {
  if (!container) return;
  
  const statItems = container.querySelectorAll('.statistic-value');
  
  ScrollTrigger.create({
    trigger: container,
    start: 'top 80%',
    onEnter: () => {
      statItems.forEach((item, index) => {
        const value = parseInt(item.dataset.value, 10);
        const prefix = item.dataset.prefix || '';
        const suffix = item.dataset.suffix || '';
        const duration = statistics[index]?.duration || 2;
        
        gsap.to(item, {
          innerText: value,
          duration,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: () => {
            item.innerHTML = `${prefix}${Math.floor(item.innerText)}${suffix}`;
          }
        });
      });
    },
    once: true
  });
}

/**
 * Create team grid animation
 * @param {HTMLElement} grid - The team grid element
 */
export function createTeamGridAnimation(grid) {
  if (!grid) return;
  
  const items = grid.querySelectorAll('.team-member');
  
  ScrollTrigger.create({
    trigger: grid,
    start: 'top 80%',
    onEnter: () => {
      gsap.from(items, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform'
      });
    },
    once: true
  });
}