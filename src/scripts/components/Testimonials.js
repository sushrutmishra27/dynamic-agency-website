/**
 * Testimonials module for handling testimonial carousel, client logos, and statistics counter
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { select, selectAll } from '../utils/dom';
import { createTestimonialCarouselAnimation, createStatisticsCounterAnimation } from '../utils/animation-utils';
import { testimonials, clientLogos, statistics } from '../data/testimonials-data';
import { createTestimonialCard3D } from '../utils/three-utils';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize testimonials section
 */
export function initTestimonialsSection() {
  // Initialize testimonial carousel
  initTestimonialCarousel();
  
  // Initialize client logos
  initClientLogos();
  
  // Initialize statistics counter
  initStatisticsCounter();
}

/**
 * Initialize testimonial carousel
 */
function initTestimonialCarousel() {
  const carouselContainer = select('.carousel-container');
  
  if (!carouselContainer) return;
  
  // Create carousel track
  const carouselTrack = document.createElement('div');
  carouselTrack.className = 'carousel-track';
  carouselContainer.appendChild(carouselTrack);
  
  // Add testimonials to carousel
  testimonials.forEach((testimonial, index) => {
    // Create testimonial slide
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide';
    slide.dataset.index = index;
    
    // Create testimonial card
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    // Create HTML structure
    card.innerHTML = `
      <div class="testimonial-content">
        <p class="testimonial-quote">${testimonial.quote}</p>
        <div class="client-info">
          <div class="client-image">
            <img src="${testimonial.image}" alt="${testimonial.author}">
          </div>
          <div class="client-details">
            <div class="client-name">${testimonial.author}</div>
            <div class="client-position">${testimonial.position}</div>
            <div class="client-rating">
              ${Array(testimonial.rating).fill('<span class="star"><i class="fas fa-star"></i></span>').join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add to slide
    slide.appendChild(card);
    
    // Add to carousel track
    carouselTrack.appendChild(slide);
    
    // Initialize 3D effect if WebGL is supported
    if (window.appState?.webglSupported && !window.appState?.reducedMotion) {
      // Add 3D effect with a slight delay to prevent layout thrashing
      setTimeout(() => {
        createTestimonialCard3D(card, {
          depth: 20,
          sensitivity: 20,
          perspective: 800,
          rotationFactor: 0.5,
          transitionDuration: 0.3
        });
      }, 100);
    }
  });
  
  // Create carousel dots
  const carouselDots = select('.carousel-dots');
  
  if (carouselDots) {
    // Clear existing dots
    carouselDots.innerHTML = '';
    
    // Add dots
    testimonials.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
      dot.dataset.index = index;
      
      // Add click event listener
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
      
      carouselDots.appendChild(dot);
    });
  }
  
  // Add click event listeners to carousel controls
  const prevButton = select('.carousel-prev');
  const nextButton = select('.carousel-next');
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const currentIndex = getCurrentSlideIndex();
      const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      goToSlide(prevIndex);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const currentIndex = getCurrentSlideIndex();
      const nextIndex = (currentIndex + 1) % testimonials.length;
      goToSlide(nextIndex);
    });
  }
  
  // Set up auto-rotation
  let autoRotateInterval;
  
  function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
      const currentIndex = getCurrentSlideIndex();
      const nextIndex = (currentIndex + 1) % testimonials.length;
      goToSlide(nextIndex);
    }, 5000);
  }
  
  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }
  
  // Start auto-rotation
  startAutoRotate();
  
  // Pause auto-rotation on hover
  carouselContainer.addEventListener('mouseenter', stopAutoRotate);
  carouselContainer.addEventListener('mouseleave', startAutoRotate);
  
  // Initialize carousel animation
  createTestimonialCarouselAnimation(carouselTrack);
}

/**
 * Get current slide index
 * @returns {number} Current slide index
 */
function getCurrentSlideIndex() {
  const activeSlide = select('.testimonial-slide.active');
  
  if (activeSlide) {
    return parseInt(activeSlide.dataset.index, 10);
  }
  
  return 0;
}

/**
 * Go to slide
 * @param {number} index - Slide index
 */
function goToSlide(index) {
  const carouselTrack = select('.carousel-track');
  const slides = selectAll('.testimonial-slide');
  const dots = selectAll('.carousel-dot');
  
  if (!carouselTrack || !slides.length || !dots.length) return;
  
  // Update active slide
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
  
  // Update active dot
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
  
  // Animate carousel track
  gsap.to(carouselTrack, {
    x: `-${index * 100}%`,
    duration: 0.5,
    ease: 'power3.out'
  });
}

/**
 * Initialize client logos
 */
function initClientLogos() {
  const clientsGrid = select('.clients-grid');
  
  if (!clientsGrid) return;
  
  // Clear existing logos
  clientsGrid.innerHTML = '';
  
  // Add client logos
  clientLogos.forEach(client => {
    // Create client logo element
    const clientLogo = document.createElement('div');
    clientLogo.className = 'client-logo';
    clientLogo.innerHTML = `<img src="${client.logo}" alt="${client.name}">`;
    
    // Add to grid
    clientsGrid.appendChild(clientLogo);
  });
  
  // Add scroll animation
  ScrollTrigger.create({
    trigger: clientsGrid,
    start: 'top 80%',
    onEnter: () => {
      gsap.from(clientsGrid.querySelectorAll('.client-logo'), {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      });
    },
    once: true
  });
}

/**
 * Initialize statistics counter
 */
function initStatisticsCounter() {
  const statisticsGrid = select('.statistics-grid');
  
  if (!statisticsGrid) return;
  
  // Clear existing statistics
  statisticsGrid.innerHTML = '';
  
  // Add statistics
  statistics.forEach(stat => {
    // Create statistic element
    const statisticItem = document.createElement('div');
    statisticItem.className = 'statistic-item';
    statisticItem.innerHTML = `
      <div class="statistic-icon"><i class="fas ${stat.icon}"></i></div>
      <div class="statistic-value" data-value="${stat.value}" data-prefix="${stat.prefix}" data-suffix="${stat.suffix}">
        ${stat.prefix}0${stat.suffix}
      </div>
      <div class="statistic-label">${stat.label}</div>
    `;
    
    // Add to grid
    statisticsGrid.appendChild(statisticItem);
  });
  
  // Initialize counter animation
  createStatisticsCounterAnimation(statisticsGrid, statistics);
}