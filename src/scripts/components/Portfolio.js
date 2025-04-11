/**
 * Portfolio module for handling portfolio grid, filtering, and case study modal
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { select, selectAll } from '../utils/dom';
import { createPortfolioGridAnimation } from '../utils/animation-utils';
import { portfolioItems, portfolioCategories } from '../data/portfolio-data';
import * as THREE from 'three';
import { createCaseStudyCard3D } from '../utils/three-utils';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize portfolio section
 */
export function initPortfolioSection() {
  // Initialize portfolio grid
  initPortfolioGrid();
  
  // Initialize portfolio filters
  initPortfolioFilters();
  
  // Initialize case study modal
  initCaseStudyModal();
}

/**
 * Initialize portfolio grid
 */
function initPortfolioGrid() {
  const portfolioGrid = select('.portfolio-grid');
  
  if (!portfolioGrid) return;
  
  // Clear existing items
  portfolioGrid.innerHTML = '';
  
  // Create portfolio items
  portfolioItems.forEach((item, index) => {
    // Create portfolio item element
    const portfolioItem = document.createElement('div');
    portfolioItem.className = 'portfolio-item';
    portfolioItem.dataset.id = item.id;
    portfolioItem.dataset.category = item.category;
    portfolioItem.dataset.categories = item.categories.join(' ');
    
    // Create HTML structure
    portfolioItem.innerHTML = `
      <div class="portfolio-item-image">
        <img src="${item.thumbnail}" alt="${item.title}">
        <div class="portfolio-item-overlay">
          <span class="view-project">View Project</span>
        </div>
      </div>
      <div class="portfolio-item-content">
        <h3 class="portfolio-item-title">${item.title}</h3>
        <div class="portfolio-item-category">${item.client} / ${portfolioCategories.find(cat => cat.id === item.category)?.name || item.category}</div>
        <p class="portfolio-item-description">${item.description}</p>
      </div>
    `;
    
    // Add to grid
    portfolioGrid.appendChild(portfolioItem);
    
    // Add click event listener
    portfolioItem.addEventListener('click', () => {
      openCaseStudyModal(item.id);
    });
    
    // Initialize 3D effect if WebGL is supported
    if (window.appState?.webglSupported && !window.appState?.reducedMotion) {
      // Add 3D effect with a slight delay to prevent layout thrashing
      setTimeout(() => {
        createCaseStudyCard3D(portfolioItem, {
          depth: 30,
          sensitivity: 30,
          perspective: 800,
          layerDistance: 5,
          transitionDuration: 0.5
        });
      }, 100 + (index * 50));
    }
  });
  
  // Initialize portfolio grid animation
  createPortfolioGridAnimation(portfolioGrid);
}

/**
 * Initialize portfolio filters
 */
function initPortfolioFilters() {
  const filterButtons = selectAll('.portfolio-filter .filter-btn');
  const portfolioItems = selectAll('.portfolio-item');
  
  if (!filterButtons.length || !portfolioItems.length) return;
  
  // Add click event listener to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get filter value
      const filterValue = button.dataset.filter;
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter items
      if (filterValue === 'all') {
        // Show all items
        portfolioItems.forEach(item => {
          gsap.to(item, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power3.out',
            clearProps: 'transform',
            onStart: () => {
              item.style.display = 'block';
            }
          });
        });
      } else {
        // Filter items
        portfolioItems.forEach(item => {
          const categories = item.dataset.categories.split(' ');
          
          if (categories.includes(filterValue)) {
            // Show item
            gsap.to(item, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'power3.out',
              clearProps: 'transform',
              onStart: () => {
                item.style.display = 'block';
              }
            });
          } else {
            // Hide item
            gsap.to(item, {
              opacity: 0,
              scale: 0.8,
              duration: 0.5,
              ease: 'power3.out',
              onComplete: () => {
                item.style.display = 'none';
              }
            });
          }
        });
      }
    });
  });
}

/**
 * Initialize case study modal
 */
function initCaseStudyModal() {
  const modal = select('#case-study-modal');
  const modalOverlay = modal?.querySelector('.modal-overlay');
  const modalClose = modal?.querySelector('.modal-close');
  
  if (!modal) return;
  
  // Add click event listener to modal overlay
  modalOverlay?.addEventListener('click', () => {
    closeCaseStudyModal();
  });
  
  // Add click event listener to modal close button
  modalClose?.addEventListener('click', () => {
    closeCaseStudyModal();
  });
  
  // Add escape key event listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeCaseStudyModal();
    }
  });
}

/**
 * Open case study modal
 * @param {string} id - Portfolio item ID
 */
function openCaseStudyModal(id) {
  const modal = select('#case-study-modal');
  const portfolioItem = portfolioItems.find(item => item.id === id);
  
  if (!modal || !portfolioItem) return;
  
  // Update modal content
  updateCaseStudyModalContent(portfolioItem);
  
  // Show modal
  document.body.classList.add('modal-open');
  modal.classList.add('active');
  
  // Animate modal opening
  const modalContainer = modal.querySelector('.modal-container');
  
  gsap.fromTo(modalContainer, {
    opacity: 0,
    y: 50
  }, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power3.out'
  });
}

/**
 * Close case study modal
 */
function closeCaseStudyModal() {
  const modal = select('#case-study-modal');
  
  if (!modal) return;
  
  // Animate modal closing
  const modalContainer = modal.querySelector('.modal-container');
  
  gsap.to(modalContainer, {
    opacity: 0,
    y: 50,
    duration: 0.3,
    ease: 'power3.in',
    onComplete: () => {
      // Hide modal
      document.body.classList.remove('modal-open');
      modal.classList.remove('active');
    }
  });
}

/**
 * Update case study modal content
 * @param {Object} portfolioItem - Portfolio item data
 */
function updateCaseStudyModalContent(portfolioItem) {
  const modal = select('#case-study-modal');
  
  if (!modal || !portfolioItem) return;
  
  // Update title
  const title = modal.querySelector('.case-study-title');
  if (title) title.textContent = portfolioItem.title;
  
  // Update meta
  const client = modal.querySelector('.case-study-client');
  if (client) client.textContent = `Client: ${portfolioItem.client}`;
  
  const year = modal.querySelector('.case-study-year');
  if (year) year.textContent = `Year: ${portfolioItem.year}`;
  
  const category = modal.querySelector('.case-study-category');
  if (category) {
    const categoryName = portfolioCategories.find(cat => cat.id === portfolioItem.category)?.name || portfolioItem.category;
    category.textContent = `Category: ${categoryName}`;
  }
  
  // Update featured image
  const featuredImage = modal.querySelector('.case-study-featured-image');
  if (featuredImage) {
    featuredImage.innerHTML = `<img src="${portfolioItem.featuredImage}" alt="${portfolioItem.title}">`;
  }
  
  // Update description
  const description = modal.querySelector('.case-study-description');
  if (description) description.textContent = portfolioItem.description;
  
  // Update challenge
  const challenge = modal.querySelector('.challenge-content');
  if (challenge) challenge.textContent = portfolioItem.challenge;
  
  // Update solution
  const solution = modal.querySelector('.solution-content');
  if (solution) solution.textContent = portfolioItem.solution;
  
  // Update results
  const resultsList = modal.querySelector('.results-list');
  if (resultsList) {
    resultsList.innerHTML = '';
    portfolioItem.results.forEach(result => {
      const li = document.createElement('li');
      li.textContent = result;
      resultsList.appendChild(li);
    });
  }
  
  // Update gallery
  const galleryThumbnails = modal.querySelector('.gallery-thumbnails');
  const galleryMain = modal.querySelector('.gallery-main');
  
  if (galleryThumbnails && galleryMain && portfolioItem.gallery) {
    galleryThumbnails.innerHTML = '';
    galleryMain.innerHTML = '';
    
    // Add first image to main gallery
    if (portfolioItem.gallery.length > 0) {
      const firstImage = portfolioItem.gallery[0];
      galleryMain.innerHTML = `
        <img src="${firstImage.src}" alt="${firstImage.alt}">
        <div class="caption">${firstImage.caption}</div>
      `;
    }
    
    // Add thumbnails
    portfolioItem.gallery.forEach((image, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = `gallery-thumbnail${index === 0 ? ' active' : ''}`;
      thumbnail.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
      
      // Add click event listener
      thumbnail.addEventListener('click', () => {
        // Update active thumbnail
        const activeThumbnail = galleryThumbnails.querySelector('.gallery-thumbnail.active');
        if (activeThumbnail) activeThumbnail.classList.remove('active');
        thumbnail.classList.add('active');
        
        // Update main image
        galleryMain.innerHTML = `
          <img src="${image.src}" alt="${image.alt}">
          <div class="caption">${image.caption}</div>
        `;
      });
      
      galleryThumbnails.appendChild(thumbnail);
    });
  }
  
  // Update testimonial
  const testimonial = modal.querySelector('.case-study-testimonial');
  if (testimonial && portfolioItem.testimonial) {
    testimonial.innerHTML = `
      <p class="testimonial-quote">${portfolioItem.testimonial.quote}</p>
      <div class="testimonial-author">${portfolioItem.testimonial.author}</div>
      <div class="testimonial-position">${portfolioItem.testimonial.position}</div>
    `;
  }
  
  // Update technologies
  const technologiesList = modal.querySelector('.technologies-list');
  if (technologiesList) {
    technologiesList.innerHTML = '';
    portfolioItem.technologies.forEach(tech => {
      const li = document.createElement('li');
      li.textContent = tech;
      technologiesList.appendChild(li);
    });
  }
}