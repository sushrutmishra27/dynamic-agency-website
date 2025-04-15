/**
 * FAQ data for the marketing agency website
 * Contains categories, questions and answers
 */

const faqData = {
  // FAQ Categories
  categories: [
    { id: 'all', label: 'All Questions' },
    { id: 'services', label: 'Services' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'process', label: 'Process' },
    { id: 'support', label: 'Support' }
  ],
  
  // FAQ Questions and Answers
  questions: [
    {
      id: 'faq-1',
      category: 'services',
      question: 'What services does your agency offer?',
      answer: 'Our agency offers a comprehensive range of digital marketing services including brand strategy, social media management, content creation, email marketing, SEO optimization, PPC campaign management, web design and development, and analytics reporting. We tailor our services to meet the specific needs of your business.'
    },
    {
      id: 'faq-2',
      category: 'pricing',
      question: 'How is your pricing structured?',
      answer: 'We offer three main pricing tiers: Basic, Professional, and Enterprise. Each tier includes a different set of services and deliverables. We also offer custom packages tailored to your specific needs. You can choose between monthly or annual billing, with annual billing offering a 20% discount.'
    },
    {
      id: 'faq-3',
      category: 'process',
      question: 'What is your typical process for new clients?',
      answer: 'Our process begins with a discovery phase where we learn about your business, goals, and target audience. We then develop a custom strategy, implement the planned activities, and continuously monitor and optimize performance. We provide regular reports and maintain open communication throughout our partnership.'
    },
    {
      id: 'faq-4',
      category: 'services',
      question: 'Do you work with businesses in specific industries?',
      answer: 'We work with businesses across various industries, including technology, healthcare, education, retail, finance, and more. Our team has experience adapting our strategies to different market requirements and industry-specific challenges.'
    },
    {
      id: 'faq-5',
      category: 'pricing',
      question: 'Can I upgrade or downgrade my plan later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new pricing will be prorated for the remainder of your billing cycle. If you downgrade, the new pricing will take effect at the start of your next billing cycle.'
    },
    {
      id: 'faq-6',
      category: 'process',
      question: 'How long does it take to see results?',
      answer: 'The timeline for results varies depending on your goals, industry, competition, and chosen strategies. Some activities like PPC can show immediate results, while SEO and content marketing typically take 3-6 months to show significant impact. We provide regular progress updates and focus on both short-term wins and long-term growth.'
    },
    {
      id: 'faq-7',
      category: 'support',
      question: 'How often will we communicate about progress?',
      answer: 'We provide monthly comprehensive reports and schedule regular check-in calls to discuss performance and strategy. Additionally, you'll have a dedicated account manager who is available for questions or concerns throughout the month. We believe in transparent, open communication with all our clients.'
    },
    {
      id: 'faq-8',
      category: 'support',
      question: 'What if I'm not satisfied with the results?',
      answer: 'Client satisfaction is our priority. If you're not satisfied with the results, we'll work with you to understand your concerns and adjust our strategy accordingly. We offer a 30-day satisfaction guarantee for new clients. If you're not happy with our services within the first 30 days, we'll refund your investment.'
    },
    {
      id: 'faq-9',
      category: 'services',
      question: 'Do you provide content creation services?',
      answer: 'Yes, we offer comprehensive content creation services including blog posts, social media content, email newsletters, video scripts, infographics, and more. Our content team works closely with you to ensure all content aligns with your brand voice and marketing objectives.'
    },
    {
      id: 'faq-10',
      category: 'pricing',
      question: 'Are there any long-term contracts?',
      answer: 'We offer both month-to-month services and annual contracts. Annual contracts come with a 20% discount on our standard rates. While we believe in the value of long-term partnerships for achieving sustainable results, we don't lock clients into lengthy commitments if that doesn't suit their needs.'
    }
  ]
};

export default faqData;