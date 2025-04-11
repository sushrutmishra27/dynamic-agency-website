/**
 * Portfolio data for case studies and projects
 */

export const portfolioItems = [
  {
    id: 'project-1',
    title: 'SaaS Platform Redesign',
    category: 'web-design',
    categories: ['web-design', 'ui-ux'],
    thumbnail: 'assets/images/portfolio/project1-thumb.jpg',
    featuredImage: 'assets/images/portfolio/project1-featured.jpg',
    client: 'TechFlow Solutions',
    year: '2024',
    description: 'Complete redesign of a SaaS platform dashboard, improving user engagement by 45% and reducing customer support tickets by 30%.',
    challenge: 'The client\'s existing platform suffered from poor user engagement and high bounce rates. The interface was cluttered and navigation was confusing for users.',
    solution: 'We reimagined the entire user experience with a focus on simplicity and task-oriented workflows. Our redesign included a customizable dashboard, streamlined navigation, and improved data visualization.',
    results: [
      '45% increase in user engagement',
      '30% reduction in support tickets',
      '22% improvement in task completion rates',
      '18% increase in user retention'
    ],
    testimonial: {
      quote: "The redesign transformed our platform completely. Our users love the new interface and we've seen significant improvements in all our key metrics.",
      author: "Sarah Johnson",
      position: "Product Manager, TechFlow Solutions"
    },
    gallery: [
      {
        src: 'assets/images/portfolio/project1-gallery1.jpg',
        alt: 'Dashboard overview showing key metrics',
        caption: 'The redesigned dashboard with customizable widgets'
      },
      {
        src: 'assets/images/portfolio/project1-gallery2.jpg',
        alt: 'User profile and settings page',
        caption: 'Simplified user settings with intuitive controls'
      },
      {
        src: 'assets/images/portfolio/project1-gallery3.jpg',
        alt: 'Data visualization components',
        caption: 'Enhanced data visualization for better insights'
      }
    ],
    technologies: ['Figma', 'React', 'CSS Grid', 'D3.js'],
    modelPath: 'assets/models/dashboard.glb' // 3D model path for Three.js
  },
  {
    id: 'project-2',
    title: 'E-commerce Brand Identity',
    category: 'branding',
    categories: ['branding', 'graphic-design'],
    thumbnail: 'assets/images/portfolio/project2-thumb.jpg',
    featuredImage: 'assets/images/portfolio/project2-featured.jpg',
    client: 'Urban Lifestyle Co.',
    year: '2023',
    description: 'Comprehensive brand identity design for a fashion e-commerce platform, resulting in 60% brand recognition improvement and 35% sales increase.',
    challenge: 'The client needed a distinctive brand identity that would stand out in the crowded fashion e-commerce market and appeal to their target demographic of urban millennials.',
    solution: 'We developed a bold, modern brand identity with a distinctive color palette, custom typography, and a flexible design system that works across all touchpoints.',
    results: [
      '60% improvement in brand recognition',
      '35% increase in sales after rebranding',
      '42% higher engagement on social media',
      '28% increase in email marketing open rates'
    ],
    testimonial: {
      quote: "Our new brand identity perfectly captures our company's vision and resonates with our audience. The comprehensive design system has made our marketing efforts much more cohesive.",
      author: "Michael Chen",
      position: "CEO, Urban Lifestyle Co."
    },
    gallery: [
      {
        src: 'assets/images/portfolio/project2-gallery1.jpg',
        alt: 'Brand logo and color palette',
        caption: 'The new logo with primary and secondary color palettes'
      },
      {
        src: 'assets/images/portfolio/project2-gallery2.jpg',
        alt: 'Typography and brand elements',
        caption: 'Custom typography and brand elements'
      },
      {
        src: 'assets/images/portfolio/project2-gallery3.jpg',
        alt: 'Marketing materials and packaging',
        caption: 'Brand application on marketing materials and packaging'
      }
    ],
    technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'InDesign', 'After Effects'],
    modelPath: 'assets/models/brand-identity.glb' // 3D model path for Three.js
  },
  {
    id: 'project-3',
    title: 'Multi-channel Marketing Campaign',
    category: 'marketing',
    categories: ['marketing', 'social-media'],
    thumbnail: 'assets/images/portfolio/project3-thumb.jpg',
    featuredImage: 'assets/images/portfolio/project3-featured.jpg',
    client: 'GreenLife Organics',
    year: '2024',
    description: 'Integrated marketing campaign across digital and traditional channels, driving 85% increase in website traffic and 40% growth in customer acquisition.',
    challenge: 'The client wanted to expand their market reach and increase brand awareness for their organic product line, targeting health-conscious consumers across multiple demographics.',
    solution: 'We created a cohesive multi-channel marketing strategy, combining digital advertising, content marketing, influencer partnerships, and targeted PR campaigns.',
    results: [
      '85% increase in website traffic',
      '40% growth in new customer acquisition',
      '65% higher conversion rate on campaign landing pages',
      '3.2x ROI on marketing spend'
    ],
    testimonial: {
      quote: "The campaign exceeded all our expectations. The strategic approach across multiple channels gave us unprecedented reach and the results speak for themselves.",
      author: "Emily Rodriguez",
      position: "Marketing Director, GreenLife Organics"
    },
    gallery: [
      {
        src: 'assets/images/portfolio/project3-gallery1.jpg',
        alt: 'Digital ad creatives',
        caption: 'Digital advertising creatives across platforms'
      },
      {
        src: 'assets/images/portfolio/project3-gallery2.jpg',
        alt: 'Social media campaign',
        caption: 'Social media content and influencer collaborations'
      },
      {
        src: 'assets/images/portfolio/project3-gallery3.jpg',
        alt: 'Campaign analytics dashboard',
        caption: 'Performance analytics showing campaign results'
      }
    ],
    technologies: ['Google Ads', 'Facebook Ads', 'HubSpot', 'SEMrush', 'Mailchimp'],
    modelPath: 'assets/models/marketing-campaign.glb' // 3D model path for Three.js
  },
  {
    id: 'project-4',
    title: 'Mobile App UX/UI Design',
    category: 'ui-ux',
    categories: ['ui-ux', 'web-design'],
    thumbnail: 'assets/images/portfolio/project4-thumb.jpg',
    featuredImage: 'assets/images/portfolio/project4-featured.jpg',
    client: 'HealthTrack',
    year: '2023',
    description: 'Comprehensive UX/UI design for a health tracking mobile application, improving user retention by 55% and session duration by 40%.',
    challenge: 'The client\'s existing app had high initial downloads but poor retention rates due to complicated user flows and an unintuitive interface.',
    solution: 'We conducted extensive user research and redesigned the entire app experience with a focus on simplicity, accessibility, and engaging data visualization.',
    results: [
      '55% improvement in user retention',
      '40% increase in average session duration',
      '62% more daily active users',
      '4.8/5 App Store rating after redesign'
    ],
    testimonial: {
      quote: "The redesign transformed our app completely. User feedback has been overwhelmingly positive and our key metrics have improved dramatically.",
      author: "David Park",
      position: "Product Lead, HealthTrack"
    },
    gallery: [
      {
        src: 'assets/images/portfolio/project4-gallery1.jpg',
        alt: 'App onboarding screens',
        caption: 'Redesigned onboarding flow with progress indicators'
      },
      {
        src: 'assets/images/portfolio/project4-gallery2.jpg',
        alt: 'Main dashboard and tracking screens',
        caption: 'Main dashboard with intuitive health metrics tracking'
      },
      {
        src: 'assets/images/portfolio/project4-gallery3.jpg',
        alt: 'Data visualization and reports',
        caption: 'Enhanced data visualization for health insights'
      }
    ],
    technologies: ['Figma', 'Sketch', 'Principle', 'Adobe XD'],
    modelPath: 'assets/models/mobile-app.glb' // 3D model path for Three.js
  },
  {
    id: 'project-5',
    title: 'SEO Optimization Campaign',
    category: 'marketing',
    categories: ['marketing', 'seo'],
    thumbnail: 'assets/images/portfolio/project5-thumb.jpg',
    featuredImage: 'assets/images/portfolio/project5-featured.jpg',
    client: 'Global Education Network',
    year: '2024',
    description: 'Comprehensive SEO strategy and implementation, resulting in 120% increase in organic traffic and 45% improvement in conversion rates.',
    challenge: 'The client had strong content but poor search visibility, limiting their reach in the competitive online education market.',
    solution: 'We developed a data-driven SEO strategy focusing on technical optimization, content enhancement, and strategic link building to improve search rankings.',
    results: [
      '120% increase in organic search traffic',
      '45% improvement in conversion rates',
      'First page rankings for 85% of target keywords',
      '65% reduction in bounce rate'
    ],
    testimonial: {
      quote: "The SEO campaign delivered exceptional results. Our organic traffic has more than doubled and we're seeing much higher quality leads coming through our website.",
      author: "Jennifer Moore",
      position: "Digital Director, Global Education Network"
    },
    gallery: [
      {
        src: 'assets/images/portfolio/project5-gallery1.jpg',
        alt: 'Search ranking improvements chart',
        caption: 'Keyword ranking improvements over the campaign period'
      },
      {
        src: 'assets/images/portfolio/project5-gallery2.jpg',
        alt: 'Content optimization examples',
        caption: 'Content structure and optimization examples'
      },
      {
        src: 'assets/images/portfolio/project5-gallery3.jpg',
        alt: 'Traffic analytics dashboard',
        caption: 'Analytics dashboard showing traffic growth'
      }
    ],
    technologies: ['Ahrefs', 'SEMrush', 'Google Analytics', 'Screaming Frog', 'Google Search Console'],
    modelPath: 'assets/models/seo-campaign.glb' // 3D model path for Three.js
  },
  {
    id: 'project-6',
    title: 'Corporate Website Redesign',
    category: 'web-design',
    categories: ['web-design', 'ui-ux'],
    thumbnail: 'assets/images/portfolio/project6-thumb.jpg',
    featuredImage: 'assets/images/portfolio/project6-featured.jpg',
    client: 'Quantum Financial Services',
    year: '2023',
    description: 'Complete redesign and development of a corporate website, improving lead generation by 75% and reducing bounce rate by 40%.',
    challenge: 'The client\'s outdated website failed to convey their brand positioning and had poor performance metrics, particularly on mobile devices.',
    solution: 'We redesigned the website with a modern, responsive approach, focusing on clear messaging, intuitive navigation, and strategic conversion points.',
    results: [
      '75% increase in lead generation',
      '40% reduction in bounce rate',
      '65% improvement in page load speed',
      '50% increase in mobile engagement'
    ],
    testimonial: {
      quote: "The new website has transformed our digital presence. It perfectly represents our brand and has significantly improved our lead generation efforts.",
      author: "Robert Wilson",
      position: "CMO, Quantum Financial Services"
    },
    gallery: [
      {
        src: 'assets/images/portfolio/project6-gallery1.jpg',
        alt: 'Homepage design',
        caption: 'Redesigned homepage with clear value proposition'
      },
      {
        src: 'assets/images/portfolio/project6-gallery2.jpg',
        alt: 'Service pages and navigation',
        caption: 'Service pages with intuitive navigation'
      },
      {
        src: 'assets/images/portfolio/project6-gallery3.jpg',
        alt: 'Mobile responsive views',
        caption: 'Responsive design across different device sizes'
      }
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'WordPress', 'PHP'],
    modelPath: 'assets/models/website.glb' // 3D model path for Three.js
  }
];

// Portfolio categories for filtering
export const portfolioCategories = [
  {
    id: 'all',
    name: 'All Projects'
  },
  {
    id: 'web-design',
    name: 'Web Design'
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design'
  },
  {
    id: 'branding',
    name: 'Branding'
  },
  {
    id: 'marketing',
    name: 'Marketing'
  },
  {
    id: 'seo',
    name: 'SEO'
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design'
  },
  {
    id: 'social-media',
    name: 'Social Media'
  }
];