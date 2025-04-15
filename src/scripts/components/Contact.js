/**
 * Contact component for the marketing agency website
 * Handles form validation, animations, and submission
 */

import { gsap } from 'gsap';
import contactData from '../data/contact-data';

class Contact {
  constructor() {
    this.contactSection = document.querySelector('#contact');
    this.formContainer = this.contactSection?.querySelector('.contact-form');
    this.ctaSection = document.querySelector('.cta-section');
    this.form = this.formContainer?.querySelector('form');
    this.formFields = {};
    this.formErrors = {};
    this.formSubmitting = false;
    
    if (!this.contactSection) return;
    
    this.init();
  }
  
  /**
   * Initialize the contact component
   */
  init() {
    this.renderForm();
    this.renderCTA();
    this.setupEventListeners();
    this.initAnimations();
    this.initFloatingCTA();
  }
  
  /**
   * Render the contact form
   */
  renderForm() {
    if (!this.form) return;
    
    const { fields } = contactData;
    
    // Create form fields container
    const fieldsContainer = document.createElement('div');
    fieldsContainer.className = 'form-fields';
    
    // Render each form field
    fields.forEach(field => {
      const fieldWrapper = document.createElement('div');
      fieldWrapper.className = `form-field ${field.required ? 'required' : ''}`;
      fieldWrapper.setAttribute('data-field', field.id);
      
      // Create different field types
      let inputHtml = '';
      
      switch(field.type) {
        case 'select':
          inputHtml = `
            <select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
              ${field.options.map(option => `
                <option value="${option.value}" ${option.disabled ? 'disabled' : ''} ${option.value === '' ? 'selected' : ''}>
                  ${option.label}
                </option>
              `).join('')}
            </select>
          `;
          break;
          
        case 'textarea':
          inputHtml = `
            <textarea id="${field.id}" name="${field.id}" 
                      placeholder="${field.placeholder}" 
                      ${field.required ? 'required' : ''}></textarea>
          `;
          break;
          
        default: // text, email, tel, etc.
          inputHtml = `
            <input type="${field.type}" id="${field.id}" name="${field.id}" 
                   placeholder="${field.placeholder}" 
                   ${field.required ? 'required' : ''}>
          `;
          break;
      }
      
      // Assemble the field HTML
      fieldWrapper.innerHTML = `
        <label for="${field.id}" class="field-label">${field.label}</label>
        <div class="field-input">
          ${inputHtml}
          <span class="field-error"></span>
        </div>
      `;
      
      // Add to container
      fieldsContainer.appendChild(fieldWrapper);
      
      // Store reference to field
      this.formFields[field.id] = {
        element: fieldWrapper,
        config: field
      };
    });
    
    // Create submit button
    const submitButton = document.createElement('div');
    submitButton.className = 'form-submit';
    submitButton.innerHTML = `
      <button type="submit" class="btn btn-primary">
        <span class="btn-text">Send Message</span>
        <span class="btn-loading">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" />
          </svg>
        </span>
      </button>
    `;
    
    // Clear form and add new elements
    this.form.innerHTML = '';
    this.form.appendChild(fieldsContainer);
    this.form.appendChild(submitButton);
  }
  
  /**
   * Render the CTA section
   */
  renderCTA() {
    if (!this.ctaSection) return;
    
    const { cta } = contactData;
    
    this.ctaSection.innerHTML = `
      <div class="cta-content">
        <h2>${cta.heading}</h2>
        <p>${cta.subheading}</p>
        <a href="${cta.buttonUrl}" class="btn btn-primary btn-large">${cta.buttonText}</a>
      </div>
      <div class="cta-background">
        <div class="cta-shape shape-1"></div>
        <div class="cta-shape shape-2"></div>
        <div class="cta-shape shape-3"></div>
      </div>
    `;
  }
  
  /**
   * Set up event listeners for form fields and submission
   */
  setupEventListeners() {
    if (!this.form) return;
    
    // Add input event listeners to all fields
    Object.keys(this.formFields).forEach(fieldId => {
      const field = this.formFields[fieldId];
      const input = field.element.querySelector('input, select, textarea');
      
      if (input) {
        // Validate on input
        input.addEventListener('input', () => {
          this.validateField(fieldId);
        });
        
        // Validate on blur
        input.addEventListener('blur', () => {
          this.validateField(fieldId, true);
        });
        
        // Special handling for select elements
        if (input.tagName === 'SELECT') {
          input.addEventListener('change', () => {
            this.validateField(fieldId, true);
          });
        }
      }
    });
    
    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }
  
  /**
   * Validate a specific form field
   * @param {string} fieldId - ID of the field to validate
   * @param {boolean} showError - Whether to show error message
   * @returns {boolean} - Whether the field is valid
   */
  validateField(fieldId, showError = false) {
    const field = this.formFields[fieldId];
    if (!field) return true;
    
    const input = field.element.querySelector('input, select, textarea');
    if (!input) return true;
    
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.config.required && value === '') {
      isValid = false;
      errorMessage = `${field.config.label} is required`;
    }
    
    // Pattern validation
    if (isValid && field.config.validation?.pattern && value !== '') {
      const regex = new RegExp(field.config.validation.pattern);
      if (!regex.test(value)) {
        isValid = false;
        errorMessage = field.config.validation.message;
      }
    }
    
    // Min length validation
    if (isValid && field.config.validation?.minLength && value !== '') {
      if (value.length < field.config.validation.minLength) {
        isValid = false;
        errorMessage = field.config.validation.message;
      }
    }
    
    // Update UI based on validation
    const errorElement = field.element.querySelector('.field-error');
    
    if (!isValid && showError) {
      // Show error
      field.element.classList.add('error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
        gsap.fromTo(errorElement, 
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3 }
        );
      }
    } else {
      // Clear error
      field.element.classList.remove('error');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }
    
    // If valid, add success class
    if (isValid && value !== '') {
      field.element.classList.add('success');
    } else {
      field.element.classList.remove('success');
    }
    
    // Store validation state
    this.formErrors[fieldId] = !isValid;
    
    return isValid;
  }
  
  /**
   * Validate all form fields
   * @returns {boolean} - Whether the form is valid
   */
  validateForm() {
    let isValid = true;
    
    // Validate each field
    Object.keys(this.formFields).forEach(fieldId => {
      const fieldValid = this.validateField(fieldId, true);
      if (!fieldValid) isValid = false;
    });
    
    return isValid;
  }
  
  /**
   * Handle form submission
   */
  handleSubmit() {
    // Prevent multiple submissions
    if (this.formSubmitting) return;
    
    // Validate form
    const isValid = this.validateForm();
    if (!isValid) {
      // Scroll to first error
      const firstError = Object.keys(this.formErrors).find(key => this.formErrors[key]);
      if (firstError) {
        const errorElement = this.formFields[firstError].element;
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Set submitting state
    this.formSubmitting = true;
    this.form.classList.add('submitting');
    
    // Get form data
    const formData = new FormData(this.form);
    const formValues = {};
    for (let [key, value] of formData.entries()) {
      formValues[key] = value;
    }
    
    // Simulate API call
    setTimeout(() => {
      // Show success message
      this.showFormMessage(true, contactData.submission.successMessage);
      
      // Reset form
      this.form.reset();
      Object.keys(this.formFields).forEach(fieldId => {
        this.formFields[fieldId].element.classList.remove('success', 'error');
      });
      
      // Reset submitting state
      this.formSubmitting = false;
      this.form.classList.remove('submitting');
    }, 2000);
    
    // In a real implementation, you would use fetch or axios to submit the form
    /*
    fetch(contactData.submission.endpoint, {
      method: contactData.submission.method,
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Show success message
      this.showFormMessage(true, contactData.submission.successMessage);
      
      // Reset form
      this.form.reset();
      Object.keys(this.formFields).forEach(fieldId => {
        this.formFields[fieldId].element.classList.remove('success', 'error');
      });
    })
    .catch(error => {
      // Show error message
      this.showFormMessage(false, contactData.submission.errorMessage);
    })
    .finally(() => {
      // Reset submitting state
      this.formSubmitting = false;
      this.form.classList.remove('submitting');
    });
    */
  }
  
  /**
   * Show a success or error message after form submission
   * @param {boolean} success - Whether the submission was successful
   * @param {string} message - The message to display
   */
  showFormMessage(success, message) {
    // Create message element if it doesn't exist
    let messageElement = this.formContainer.querySelector('.form-message');
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'form-message';
      this.formContainer.appendChild(messageElement);
    }
    
    // Set message content and class
    messageElement.textContent = message;
    messageElement.className = `form-message ${success ? 'success' : 'error'}`;
    
    // Animate message
    gsap.fromTo(messageElement,
      { opacity: 0, y: -20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        onComplete: () => {
          // Auto-hide message after delay
          if (success) {
            gsap.to(messageElement, {
              opacity: 0,
              delay: 5,
              duration: 0.5,
              onComplete: () => {
                messageElement.remove();
              }
            });
          }
        }
      }
    );
  }
  
  /**
   * Initialize animations for the contact section
   */
  initAnimations() {
    // Form fields animation
    gsap.from(this.form.querySelectorAll('.form-field'), {
      scrollTrigger: {
        trigger: this.form,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    });
    
    // Submit button animation
    gsap.from(this.form.querySelector('.form-submit'), {
      scrollTrigger: {
        trigger: this.form.querySelector('.form-submit'),
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      delay: 0.3,
      ease: 'power2.out'
    });
    
    // CTA section animations
    if (this.ctaSection) {
      // Content animation
      gsap.from(this.ctaSection.querySelector('.cta-content').children, {
        scrollTrigger: {
          trigger: this.ctaSection,
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out'
      });
      
      // Background shapes animation
      gsap.from(this.ctaSection.querySelectorAll('.cta-shape'), {
        scrollTrigger: {
          trigger: this.ctaSection,
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)'
      });
    }
  }
  
  /**
   * Initialize floating CTA button that appears on scroll
   */
  initFloatingCTA() {
    // Create floating CTA element
    const floatingCTA = document.createElement('div');
    floatingCTA.className = 'floating-cta';
    floatingCTA.innerHTML = `
      <a href="#contact" class="btn btn-primary">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
        <span>Contact Us</span>
      </a>
    `;
    
    // Add to body
    document.body.appendChild(floatingCTA);
    
    // Set up scroll listener
    window.addEventListener('scroll', () => {
      // Show after scrolling past hero section
      const heroSection = document.querySelector('#hero');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom < 0) {
          floatingCTA.classList.add('visible');
        } else {
          floatingCTA.classList.remove('visible');
        }
      }
      
      // Hide when contact section is visible
      if (this.contactSection) {
        const contactTop = this.contactSection.getBoundingClientRect().top;
        if (contactTop < window.innerHeight) {
          floatingCTA.classList.remove('visible');
        }
      }
    });
    
    // Add click event for smooth scroll
    const ctaLink = floatingCTA.querySelector('a');
    if (ctaLink) {
      ctaLink.addEventListener('click', (e) => {
        e.preventDefault();
        const href = ctaLink.getAttribute('href');
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }
}

export default Contact;