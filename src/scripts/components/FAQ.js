/**
 * FAQ component for the marketing agency website
 * Handles accordion functionality, category filtering, and search
 */

import { gsap } from 'gsap';
import faqData from '../data/faq-data';

class FAQ {
  constructor() {
    this.faqSection = document.querySelector('#faq');
    this.categoriesContainer = this.faqSection?.querySelector('.faq-categories');
    this.searchInput = this.faqSection?.querySelector('.faq-search input');
    this.accordionContainer = this.faqSection?.querySelector('.faq-accordion');
    this.activeCategory = 'all'; // Default active category
    this.activeAccordion = null; // Currently open accordion item
    
    if (!this.faqSection) return;
    
    this.init();
  }
  
  /**
   * Initialize the FAQ component
   */
  init() {
    this.renderCategories();
    this.renderAccordion();
    this.setupEventListeners();
    this.initAnimations();
  }
  
  /**
   * Render the category filters
   */
  renderCategories() {
    if (!this.categoriesContainer) return;
    
    const { categories } = faqData;
    
    const categoriesHtml = categories.map(category => `
      <button class="category-btn ${category.id === this.activeCategory ? 'active' : ''}" 
              data-category="${category.id}">
        ${category.label}
      </button>
    `).join('');
    
    this.categoriesContainer.innerHTML = categoriesHtml;
  }
  
  /**
   * Render the accordion items
   */
  renderAccordion() {
    if (!this.accordionContainer) return;
    
    // Clear previous content
    this.accordionContainer.innerHTML = '';
    
    // Filter questions based on active category
    const { questions } = faqData;
    const filteredQuestions = this.activeCategory === 'all' 
      ? questions 
      : questions.filter(q => q.category === this.activeCategory);
    
    // Create accordion items
    filteredQuestions.forEach(item => {
      const accordionItem = document.createElement('div');
      accordionItem.className = 'accordion-item';
      accordionItem.setAttribute('data-id', item.id);
      accordionItem.setAttribute('data-category', item.category);
      
      accordionItem.innerHTML = `
        <div class="accordion-header">
          <h3>${item.question}</h3>
          <div class="accordion-icon">
            <span class="plus">+</span>
            <span class="minus">-</span>
          </div>
        </div>
        <div class="accordion-content">
          <div class="accordion-body">
            <p>${item.answer}</p>
          </div>
        </div>
      `;
      
      this.accordionContainer.appendChild(accordionItem);
    });
    
    // If no questions match, show message
    if (filteredQuestions.length === 0) {
      this.accordionContainer.innerHTML = `
        <div class="no-results">
          <p>No questions found for this category.</p>
        </div>
      `;
    }
  }
  
  /**
   * Set up event listeners for category buttons, search, and accordion
   */
  setupEventListeners() {
    // Category filter buttons
    const categoryButtons = this.categoriesContainer?.querySelectorAll('.category-btn');
    if (categoryButtons) {
      categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.getAttribute('data-category');
          if (category && category !== this.activeCategory) {
            this.filterByCategory(category);
          }
        });
      });
    }
    
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        this.handleSearch();
      });
    }
    
    // Accordion headers
    this.setupAccordionListeners();
  }
  
  /**
   * Set up accordion click listeners
   */
  setupAccordionListeners() {
    const accordionHeaders = this.accordionContainer?.querySelectorAll('.accordion-header');
    if (!accordionHeaders) return;
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const accordionItem = header.closest('.accordion-item');
        this.toggleAccordion(accordionItem);
      });
    });
  }
  
  /**
   * Filter questions by category
   * @param {string} category - Category ID to filter by
   */
  filterByCategory(category) {
    // Update active category
    this.activeCategory = category;
    
    // Update category buttons
    const categoryButtons = this.categoriesContainer?.querySelectorAll('.category-btn');
    if (categoryButtons) {
      categoryButtons.forEach(button => {
        const btnCategory = button.getAttribute('data-category');
        if (btnCategory === category) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    }
    
    // Close any open accordion
    if (this.activeAccordion) {
      this.closeAccordion(this.activeAccordion);
      this.activeAccordion = null;
    }
    
    // Re-render accordion with filtered items
    this.renderAccordion();
    
    // Reattach event listeners
    this.setupAccordionListeners();
    
    // Animate the new items
    gsap.from(this.accordionContainer.querySelectorAll('.accordion-item'), {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }
  
  /**
   * Handle search functionality
   */
  handleSearch() {
    if (!this.searchInput || !this.accordionContainer) return;
    
    const searchTerm = this.searchInput.value.toLowerCase().trim();
    
    // If search is empty, reset to category filter
    if (searchTerm === '') {
      this.filterByCategory(this.activeCategory);
      return;
    }
    
    // Get all questions
    const { questions } = faqData;
    
    // Filter questions by search term and category (if not 'all')
    const filteredQuestions = questions.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchTerm) || 
                           q.answer.toLowerCase().includes(searchTerm);
      const matchesCategory = this.activeCategory === 'all' || q.category === this.activeCategory;
      return matchesSearch && matchesCategory;
    });
    
    // Clear accordion container
    this.accordionContainer.innerHTML = '';
    
    // Render filtered questions
    if (filteredQuestions.length > 0) {
      filteredQuestions.forEach(item => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        accordionItem.setAttribute('data-id', item.id);
        accordionItem.setAttribute('data-category', item.category);
        
        // Highlight matching text in question
        let highlightedQuestion = item.question;
        if (searchTerm) {
          const regex = new RegExp(`(${searchTerm})`, 'gi');
          highlightedQuestion = item.question.replace(regex, '<mark>$1</mark>');
        }
        
        accordionItem.innerHTML = `
          <div class="accordion-header">
            <h3>${highlightedQuestion}</h3>
            <div class="accordion-icon">
              <span class="plus">+</span>
              <span class="minus">-</span>
            </div>
          </div>
          <div class="accordion-content">
            <div class="accordion-body">
              <p>${item.answer}</p>
            </div>
          </div>
        `;
        
        this.accordionContainer.appendChild(accordionItem);
      });
    } else {
      // Show no results message
      this.accordionContainer.innerHTML = `
        <div class="no-results">
          <p>No questions found matching "${searchTerm}".</p>
        </div>
      `;
    }
    
    // Reattach event listeners
    this.setupAccordionListeners();
    
    // Animate the new items
    gsap.from(this.accordionContainer.querySelectorAll('.accordion-item'), {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }
  
  /**
   * Toggle accordion open/close state
   * @param {HTMLElement} accordionItem - The accordion item element
   */
  toggleAccordion(accordionItem) {
    if (!accordionItem) return;
    
    const isOpen = accordionItem.classList.contains('active');
    
    // If clicking on already open accordion, close it
    if (isOpen) {
      this.closeAccordion(accordionItem);
      this.activeAccordion = null;
      return;
    }
    
    // Close currently open accordion (if any)
    if (this.activeAccordion) {
      this.closeAccordion(this.activeAccordion);
    }
    
    // Open the clicked accordion
    this.openAccordion(accordionItem);
    this.activeAccordion = accordionItem;
  }
  
  /**
   * Open an accordion item
   * @param {HTMLElement} accordionItem - The accordion item to open
   */
  openAccordion(accordionItem) {
    if (!accordionItem) return;
    
    const content = accordionItem.querySelector('.accordion-content');
    const body = content.querySelector('.accordion-body');
    
    // Add active class
    accordionItem.classList.add('active');
    
    // Animate open
    gsap.to(content, {
      height: body.offsetHeight,
      duration: 0.4,
      ease: 'power2.out'
    });
    
    // Animate icon
    gsap.to(accordionItem.querySelector('.accordion-icon'), {
      rotation: 180,
      duration: 0.4,
      ease: 'power2.out'
    });
  }
  
  /**
   * Close an accordion item
   * @param {HTMLElement} accordionItem - The accordion item to close
   */
  closeAccordion(accordionItem) {
    if (!accordionItem) return;
    
    const content = accordionItem.querySelector('.accordion-content');
    
    // Remove active class
    accordionItem.classList.remove('active');
    
    // Animate close
    gsap.to(content, {
      height: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
    
    // Animate icon
    gsap.to(accordionItem.querySelector('.accordion-icon'), {
      rotation: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  }
  
  /**
   * Scroll to a specific question by ID
   * @param {string} questionId - The ID of the question to scroll to
   */
  scrollToQuestion(questionId) {
    const accordionItem = this.accordionContainer?.querySelector(`[data-id="${questionId}"]`);
    if (!accordionItem) return;
    
    // Get the question's category
    const category = accordionItem.getAttribute('data-category');
    
    // Switch to that category if needed
    if (category !== this.activeCategory && this.activeCategory !== 'all') {
      this.filterByCategory(category);
    }
    
    // Scroll to the question
    setTimeout(() => {
      accordionItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight the question briefly
      gsap.fromTo(accordionItem, 
        { backgroundColor: 'rgba(255, 221, 0, 0.2)' },
        { backgroundColor: 'transparent', duration: 1.5, delay: 0.5 }
      );
      
      // Open the accordion
      this.toggleAccordion(accordionItem);
    }, 300);
  }
  
  /**
   * Initialize animations for the FAQ section
   */
  initAnimations() {
    // Scroll trigger for section entry
    gsap.from(this.faqSection.querySelector('h2'), {
      scrollTrigger: {
        trigger: this.faqSection,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    // Staggered animation for category buttons
    gsap.from(this.categoriesContainer.querySelectorAll('.category-btn'), {
      scrollTrigger: {
        trigger: this.categoriesContainer,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    });
    
    // Animation for search input
    gsap.from(this.searchInput, {
      scrollTrigger: {
        trigger: this.searchInput,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
    
    // Staggered animation for accordion items
    gsap.from(this.accordionContainer.querySelectorAll('.accordion-item'), {
      scrollTrigger: {
        trigger: this.accordionContainer,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }
}

export default FAQ;