/**
 * Contact form data and validation rules
 */

const contactData = {
  // Form fields configuration
  fields: [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
      validation: {
        pattern: '^[a-zA-Z\\s]{2,}$',
        message: 'Please enter a valid name (at least 2 characters)'
      }
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email address',
      required: true,
      validation: {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        message: 'Please enter a valid email address'
      }
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: 'Enter your phone number',
      required: false,
      validation: {
        pattern: '^[0-9+\\-\\s()]{10,15}$',
        message: 'Please enter a valid phone number'
      }
    },
    {
      id: 'company',
      label: 'Company Name',
      type: 'text',
      placeholder: 'Enter your company name',
      required: false
    },
    {
      id: 'service',
      label: 'Service Interested In',
      type: 'select',
      placeholder: 'Select a service',
      required: true,
      options: [
        { value: '', label: 'Select a service', disabled: true },
        { value: 'branding', label: 'Branding & Strategy' },
        { value: 'social', label: 'Social Media Marketing' },
        { value: 'content', label: 'Content Creation' },
        { value: 'seo', label: 'SEO Optimization' },
        { value: 'ppc', label: 'PPC Advertising' },
        { value: 'web', label: 'Web Design & Development' },
        { value: 'other', label: 'Other Services' }
      ]
    },
    {
      id: 'budget',
      label: 'Monthly Budget',
      type: 'select',
      placeholder: 'Select your budget range',
      required: true,
      options: [
        { value: '', label: 'Select your budget range', disabled: true },
        { value: 'under-1000', label: 'Under $1,000' },
        { value: '1000-3000', label: '$1,000 - $3,000' },
        { value: '3000-5000', label: '$3,000 - $5,000' },
        { value: '5000-10000', label: '$5,000 - $10,000' },
        { value: 'over-10000', label: 'Over $10,000' }
      ]
    },
    {
      id: 'message',
      label: 'Project Details',
      type: 'textarea',
      placeholder: 'Tell us about your project and goals',
      required: true,
      validation: {
        minLength: 20,
        message: 'Please provide at least 20 characters about your project'
      }
    }
  ],
  
  // Form submission settings
  submission: {
    endpoint: '#', // Replace with actual endpoint in production
    method: 'POST',
    successMessage: 'Thank you for contacting us! We will get back to you within 1 business day.',
    errorMessage: 'There was an error submitting the form. Please try again or contact us directly.'
  },
  
  // CTA section configuration
  cta: {
    heading: 'Ready to Transform Your Digital Presence?',
    subheading: 'Get in touch with our team to discuss your project and goals.',
    buttonText: 'Schedule a Free Consultation',
    buttonUrl: '#contact'
  }
};

export default contactData;