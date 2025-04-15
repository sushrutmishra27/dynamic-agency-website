/**
 * Pricing data for the marketing agency website
 * Contains pricing plans, features, and options for monthly/annual billing
 */

const pricingData = {
  // Toggle options
  billingOptions: [
    { id: 'monthly', label: 'Monthly Billing' },
    { id: 'annual', label: 'Annual Billing', discount: '20% off' }
  ],
  
  // Pricing plans
  plans: [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for small businesses just getting started',
      monthlyPrice: 499,
      annualPrice: 399,
      currency: '$',
      features: [
        { name: 'Brand Strategy', included: true },
        { name: 'Social Media Management', included: true },
        { name: 'Content Creation (5 posts/week)', included: true },
        { name: 'Monthly Performance Report', included: true },
        { name: 'Email Marketing', included: false },
        { name: 'SEO Optimization', included: false },
        { name: 'PPC Campaign Management', included: false },
        { name: 'Dedicated Account Manager', included: false }
      ],
      cta: {
        text: 'Get Started',
        url: '#contact'
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses looking to expand',
      monthlyPrice: 999,
      annualPrice: 799,
      currency: '$',
      recommended: true,
      features: [
        { name: 'Brand Strategy', included: true },
        { name: 'Social Media Management', included: true },
        { name: 'Content Creation (10 posts/week)', included: true },
        { name: 'Monthly Performance Report', included: true },
        { name: 'Email Marketing', included: true },
        { name: 'SEO Optimization', included: true },
        { name: 'PPC Campaign Management', included: false },
        { name: 'Dedicated Account Manager', included: true }
      ],
      cta: {
        text: 'Get Started',
        url: '#contact'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Comprehensive solution for established companies',
      monthlyPrice: 1999,
      annualPrice: 1599,
      currency: '$',
      features: [
        { name: 'Brand Strategy', included: true },
        { name: 'Social Media Management', included: true },
        { name: 'Content Creation (20 posts/week)', included: true },
        { name: 'Monthly Performance Report', included: true },
        { name: 'Email Marketing', included: true },
        { name: 'SEO Optimization', included: true },
        { name: 'PPC Campaign Management', included: true },
        { name: 'Dedicated Account Manager', included: true }
      ],
      cta: {
        text: 'Get Started',
        url: '#contact'
      }
    }
  ],
  
  // Additional pricing information
  additionalInfo: [
    'All prices are in USD',
    'Annual billing is charged yearly',
    'No hidden fees or charges',
    'Cancel anytime with 30-day notice'
  ]
};

export default pricingData;