/**
 * Pricing component for the marketing agency website
 * Handles pricing table rendering, toggle functionality, and animations
 */

import { gsap } from 'gsap';
import { create3DCardEffect, createScrollToAction } from '../utils/animation-utils';
import { createPricingCard3D } from '../utils/three-utils';
import pricingData from '../data/pricing-data';

class Pricing {
  constructor() {
    this.pricingSection = document.querySelector('#pricing');
    this.pricingContainer = this.pricingSection?.querySelector('.pricing-container');
    this.toggleContainer = this.pricingSection?.querySelector('.pricing-toggle');
    this.plansContainer = this.pricingSection?.querySelector('.pricing-plans');
    this.currentBilling = 'monthly'; // Default billing period
    this.cards3D = []; // Store 3D card instances
    
    if (!this.pricingSection) return;
    
    this.init();
  }
  
  /**
   * Initialize the pricing component
   */
  init() {
    this.renderToggle();
    this.renderPlans();
    this.setupEventListeners();
    this.initAnimations();
  }
  
  /**
   * Render the billing toggle (monthly/annual)
   */
  renderToggle() {
    if (!this.toggleContainer) return;
    
    const { billingOptions } = pricingData;
    
    const toggleHtml = `
      <div class="toggle-wrapper">
        <span class="toggle-label ${this.currentBilling === 'monthly' ? 'active' : ''}" data-billing="monthly">
          ${billingOptions[0].label}
        </span>
        <div class="toggle-switch">
          <div class="toggle-track">
            <div class="toggle-thumb"></div>
          </div>
        </div>
        <span class="toggle-label ${this.currentBilling === 'annual' ? 'active' : ''}" data-billing="annual">
          ${billingOptions[1].label}
          <span class="discount-badge">${billingOptions[1].discount}</span>
        </span>
      </div>
    `;
    
    this.toggleContainer.innerHTML = toggleHtml;
  }
  
  /**
   * Render the pricing plans
   */
  renderPlans() {
    if (!this.plansContainer) return;
    
    const { plans } = pricingData;
    
    // Clear previous content
    this.plansContainer.innerHTML = '';
    
    // Render each pricing plan
    plans.forEach(plan => {
      const planElement = document.createElement('div');
      planElement.className = `pricing-plan ${plan.recommended ? 'recommended' : ''}`;
      planElement.setAttribute('data-plan', plan.id);
      
      // Determine current price based on billing period
      const currentPrice = this.currentBilling === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
      
      // Create HTML for the plan
      planElement.innerHTML = `
        ${plan.recommended ? '<div class="recommended-badge">Most Popular</div>' : ''}
        <div class="plan-header">
          <h3 class="plan-name">${plan.name}</h3>
          <p class="plan-description">${plan.description}</p>
        </div>
        <div class="plan-price">
          <span class="currency">${plan.currency}</span>
          <span class="amount">${currentPrice}</span>
          <span class="period">/${this.currentBilling === 'monthly' ? 'mo' : 'yr'}</span>
        </div>
        <ul class="plan-features">
          ${plan.features.map(feature => `
            <li class="feature-item ${feature.included ? 'included' : 'not-included'}">
              <span class="feature-icon">${feature.included ? '✓' : '×'}</span>
              <span class="feature-name">${feature.name}</span>
            </li>
          `).join('')}
        </ul>
        <div class="plan-cta">
          <a href="${plan.cta.url}" class="btn ${plan.recommended ? 'btn-primary' : 'btn-outline'}">${plan.cta.text}</a>
        </div>
      `;
      
      // Add to the container
      this.plansContainer.appendChild(planElement);
    });
    
    // Initialize 3D effects for cards after they're added to the DOM
    this.init3DCards();
  }
  
  /**
   * Initialize 3D card effects for pricing plans
   */
  init3DCards() {
    // Clear previous 3D cards
    this.cards3D.forEach(card => card.dispose());
    this.cards3D = [];
    
    // Get all pricing plan elements
    const planElements = this.plansContainer.querySelectorAll('.pricing-plan');
    
    // Create 3D effect for each plan
    planElements.forEach((planElement, index) => {
      const isRecommended = planElement.classList.contains('recommended');
      const card3D = createPricingCard3D(planElement, {
        depth: isRecommended ? 40 : 30,
        rotationFactor: 0.5,
        shadowIntensity: isRecommended ? 0.5 : 0.3,
        highlightColor: isRecommended ? '#ffdd00' : '#ffffff'
      });
      
      this.cards3D.push(card3D);
    });
  }
  
  /**
   * Set up event listeners for toggle and plan interactions
   */
  setupEventListeners() {
    // Toggle switch event
    const toggleSwitch = this.toggleContainer?.querySelector('.toggle-switch');
    const toggleLabels = this.toggleContainer?.querySelectorAll('.toggle-label');
    
    if (toggleSwitch) {
      toggleSwitch.addEventListener('click', () => {
        this.toggleBillingPeriod();
      });
    }
    
    if (toggleLabels) {
      toggleLabels.forEach(label => {
        label.addEventListener('click', () => {
          const billing = label.getAttribute('data-billing');
          if (billing && billing !== this.currentBilling) {
            this.toggleBillingPeriod();
          }
        });
      });
    }
    
    // Plan hover effects are handled by the 3D cards
  }
  
  /**
   * Toggle between monthly and annual billing
   */
  toggleBillingPeriod() {
    // Update current billing period
    this.currentBilling = this.currentBilling === 'monthly' ? 'annual' : 'monthly';
    
    // Update toggle appearance
    const toggleThumb = this.toggleContainer?.querySelector('.toggle-thumb');
    const toggleLabels = this.toggleContainer?.querySelectorAll('.toggle-label');
    
    if (toggleThumb) {
      if (this.currentBilling === 'annual') {
        gsap.to(toggleThumb, { x: 20, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(toggleThumb, { x: 0, duration: 0.3, ease: 'power2.out' });
      }
    }
    
    if (toggleLabels) {
      toggleLabels.forEach(label => {
        const billing = label.getAttribute('data-billing');
        if (billing === this.currentBilling) {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
      });
    }
    
    // Update pricing display
    this.updatePricing();
  }
  
  /**
   * Update pricing display when billing period changes
   */
  updatePricing() {
    const { plans } = pricingData;
    const planElements = this.plansContainer?.querySelectorAll('.pricing-plan');
    
    if (!planElements) return;
    
    planElements.forEach((planElement, index) => {
      const planId = planElement.getAttribute('data-plan');
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) return;
      
      const priceElement = planElement.querySelector('.plan-price');
      const amountElement = priceElement?.querySelector('.amount');
      const periodElement = priceElement?.querySelector('.period');
      
      if (amountElement && periodElement) {
        const newPrice = this.currentBilling === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
        const newPeriod = this.currentBilling === 'monthly' ? '/mo' : '/yr';
        
        // Animate price change
        gsap.to(amountElement, {
          duration: 0.4,
          y: -20,
          opacity: 0,
          ease: 'power2.in',
          onComplete: () => {
            amountElement.textContent = newPrice;
            gsap.fromTo(amountElement, 
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
          }
        });
        
        // Update period
        periodElement.textContent = newPeriod;
      }
    });
  }
  
  /**
   * Initialize animations for the pricing section
   */
  initAnimations() {
    // Scroll trigger for section entry
    gsap.from(this.pricingSection.querySelector('h2'), {
      scrollTrigger: {
        trigger: this.pricingSection,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    // Staggered animation for pricing plans
    gsap.from(this.plansContainer.querySelectorAll('.pricing-plan'), {
      scrollTrigger: {
        trigger: this.plansContainer,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      y: 70,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });
    
    // Toggle animation
    gsap.from(this.toggleContainer, {
      scrollTrigger: {
        trigger: this.toggleContainer,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
  }
  
  /**
   * Clean up resources when component is destroyed
   */
  dispose() {
    // Dispose 3D cards
    this.cards3D.forEach(card => card.dispose());
    this.cards3D = [];
    
    // Remove event listeners
    const toggleSwitch = this.toggleContainer?.querySelector('.toggle-switch');
    const toggleLabels = this.toggleContainer?.querySelectorAll('.toggle-label');
    
    if (toggleSwitch) {
      toggleSwitch.removeEventListener('click', this.toggleBillingPeriod);
    }
    
    if (toggleLabels) {
      toggleLabels.forEach(label => {
        label.removeEventListener('click', this.toggleBillingPeriod);
      });
    }
  }
}

export default Pricing;