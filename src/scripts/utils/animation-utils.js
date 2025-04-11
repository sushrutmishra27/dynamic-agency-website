/**
 * Animation utilities using GSAP
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
// Import these plugins only if you have the Club GreenSock membership
// import { SplitText } from 'gsap/SplitText';
// import { CustomEase } from 'gsap/CustomEase';
// import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

// Register GSAP plugins
gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin
  // SplitText,
  // CustomEase,
  // DrawSVGPlugin
);

// Custom eases - uncomment if you have CustomEase plugin
// CustomEase.create('custom-bounce', 'M0,0 C0.2,0 0.1,1 0.5,1 0.9,1 0.6,0 1,0');
// CustomEase.create('custom-expo', 'M0,0 C0.05,0 0.133,1 1,1');
// CustomEase.create('custom-circ', 'M0,0 C0.5,0 0.5,1 1,1');

/**
 * Initialize GSAP and ScrollTrigger
 */
export const initGSAP = () => {
  // Set defaults
  gsap.defaults({
    ease: 'power3.out',
    duration: 1,
    overwrite: 'auto',
    lazy: true,
    immediateRender: false
  });
  
  // Set ScrollTrigger defaults
  ScrollTrigger.defaults({
    markers: false, // Set to true for debugging
    start: 'top bottom',
    end: 'bottom top',
    toggleActions: 'play none none reverse',
  });
  
  // Clear ScrollTrigger on page refresh
  ScrollTrigger.clearMatchMedia();
  
  // Add refresh on resize
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
};

/**
 * Animate fade in
 * @param {string|Element} element - Element selector or element
 * @param {Object} options - Animation options
 * @returns {Object} Animation timeline
 */
export const animateFadeIn = (element, options = {}) => {
  const {
    duration = 1,
    ease = 'power2.out',
    delay = 0,
    from = { opacity: 0, y: 20 },
    stagger = 0,
    scrollTrigger = null,
  } = options;
  
  const elements = typeof element === 'string' ? document.querySelectorAll(element) : [element];
  const timeline = gsap.timeline({
    delay,
    scrollTrigger,
  });
  
  // Set initial state
  gsap.set(elements, from);
  
  // Animate
  timeline.to(elements, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease,
  });
  
  return timeline;
};

/**
 * Create a scroll-based animation
 * @param {string|Element} element - Element selector or element
 * @param {Object} options - Animation options
 * @returns {Object} ScrollTrigger instance
 */
export const createScrollAnimation = (element, options = {}) => {
  const {
    animation,
    trigger = element,
    start = 'top bottom',
    end = 'bottom top',
    scrub = false,
    pin = false,
    pinSpacing = true,
    markers = false,
    toggleActions = 'play none none reverse',
    onEnter = null,
    onLeave = null,
    onEnterBack = null,
    onLeaveBack = null,
  } = options;
  
  return ScrollTrigger.create({
    trigger: typeof trigger === 'string' ? document.querySelector(trigger) : trigger,
    start,
    end,
    scrub,
    pin,
    pinSpacing,
    markers,
    toggleActions,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
    animation,
  });
};

/**
 * Create a scroll progress indicator
 * @param {string|Element} element - Element selector or element
 * @param {Object} options - Progress options
 * @returns {Object} Progress controller
 */
export const createScrollProgress = (element, options = {}) => {
  const {
    direction = 'horizontal', // 'horizontal' or 'vertical'
    ease = 'none',
    color = '#000000',
  } = options;
  
  const progressElement = typeof element === 'string' ? document.querySelector(element) : element;
  
  if (!progressElement) return;
  
  // Set initial styles
  gsap.set(progressElement, {
    [direction === 'horizontal' ? 'scaleX' : 'scaleY']: 0,
    transformOrigin: direction === 'horizontal' ? 'left center' : 'center bottom',
    backgroundColor: color,
  });
  
  // Create scroll progress animation
  const animation = gsap.to(progressElement, {
    [direction === 'horizontal' ? 'scaleX' : 'scaleY']: 1,
    ease,
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });
  
  // Return controller
  return {
    animation,
    update: () => {
      ScrollTrigger.refresh();
    },
    setColor: (newColor) => {
      progressElement.style.backgroundColor = newColor;
    },
  };
};

/**
 * Animate hero text with GSAP
 * @param {string|Element} element - Element selector or element
 * @param {Object} options - Animation options
 * @returns {Object} Animation timeline
 */
export const animateHeroText = (element, options = {}) => {
  const {
    duration = 1.2,
    stagger = 0.1,
    ease = 'power3.out',
    y = 50,
    delay = 0
  } = options;

  const elements = typeof element === 'string' ? document.querySelectorAll(element) : [element];
  
  return gsap.timeline({ delay })
    .from(elements, {
      opacity: 0,
      y,
      duration,
      stagger,
      ease
    });
};

/**
 * Create split text animation
 * @param {string|Element} element - Element selector or element
 * @param {Object} options - Animation options
 * @returns {Object} Animation timeline
 */
export const createTextSplitAnimation = (element, options = {}) => {
  const {
    type = 'chars',  // 'chars', 'words', or 'lines'
    duration = 1,
    stagger = 0.05,
    ease = 'power2.out',
    y = 30,
    rotationX = 45,
    opacity = 0,
    delay = 0
  } = options;

  const elements = typeof element === 'string' ? document.querySelectorAll(element) : [element];
  const timeline = gsap.timeline({ delay });

  elements.forEach(el => {
    const splits = el.textContent.split(type === 'words' ? ' ' : '');
    el.innerHTML = splits.map(item => `<span style="display: inline-block">${item}${type === 'words' ? ' ' : ''}</span>`).join('');
    
    timeline.from(el.children, {
      opacity,
      y,
      rotationX,
      duration,
      stagger,
      ease
    });
  });

  return timeline;
};

/**
 * Create hero section scroll animations
 * @param {string} heroSelector - Hero section selector
 * @param {Object} options - Animation options
 * @returns {Object} ScrollTrigger instance
 */
export const createHeroScrollAnimations = (heroSelector, options = {}) => {
  const {
    parallaxElements = '.hero-parallax',
    fadeElements = '.hero-fade',
    speed = 1,
    start = 'top top',
    end = 'bottom top'
  } = options;

  const hero = document.querySelector(heroSelector);
  if (!hero) return;

  // Parallax effect
  const parallaxItems = hero.querySelectorAll(parallaxElements);
  parallaxItems.forEach(item => {
    gsap.to(item, {
      y: item.offsetHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start,
        end,
        scrub: true
      }
    });
  });

  // Fade effect
  const fadeItems = hero.querySelectorAll(fadeElements);
  fadeItems.forEach(item => {
    gsap.to(item, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start,
        end,
        scrub: true
      }
    });
  });
};

/**
 * Create hero scroll effects
 * @param {string} selector - Hero section selector
 * @param {Object} options - Effect options
 * @returns {Object} Animation controller
 */
export const createHeroScrollEffects = (selector, options = {}) => {
  const {
    scale = 1.1,
    blur = 10,
    opacity = 0.6,
    pin = true,
    scrub = true
  } = options;

  const hero = document.querySelector(selector);
  if (!hero) return;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=100%',
      pin,
      scrub,
      anticipatePin: 1
    }
  });

  timeline
    .to(hero, {
      scale,
      filter: `blur(${blur}px)`,
      opacity,
      ease: 'none'
    });

  return {
    timeline,
    update: () => ScrollTrigger.refresh(),
    kill: () => timeline.kill()
  };
};

/**
 * Export GSAP and plugins for direct use
 */
export { gsap, ScrollTrigger, ScrollToPlugin };