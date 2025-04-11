/**
 * Team members data for the team section
 */

export const teamMembers = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Creative Director",
    department: "creative",
    image: "assets/images/team/team-1.jpg",
    bio: "Alex leads our creative team with over 15 years of experience in brand strategy and design. Previously worked with top agencies in New York and London, bringing a global perspective to every project.",
    expertise: ["Brand Strategy", "Creative Direction", "Design Leadership", "Client Communication"],
    education: "MFA in Design, Rhode Island School of Design",
    quote: "Great design is not just about aesthetics, it's about solving problems and creating meaningful experiences.",
    social: {
      linkedin: "https://linkedin.com/in/alexmorgan",
      twitter: "https://twitter.com/alexmorgan",
      dribbble: "https://dribbble.com/alexmorgan"
    },
    featured: true
  },
  {
    id: 2,
    name: "Sophia Chen",
    role: "UX/UI Design Lead",
    department: "design",
    image: "assets/images/team/team-2.jpg",
    bio: "Sophia specializes in user-centered design with a focus on creating intuitive and engaging digital experiences. Her background in psychology helps her understand user behavior and design for optimal user journeys.",
    expertise: ["User Experience Design", "Interface Design", "User Research", "Prototyping", "Accessibility"],
    education: "MS in Human-Computer Interaction, Carnegie Mellon University",
    quote: "Good design is invisible. It's about creating experiences so intuitive that users don't even notice the design.",
    social: {
      linkedin: "https://linkedin.com/in/sophiachen",
      twitter: "https://twitter.com/sophiachen",
      dribbble: "https://dribbble.com/sophiachen"
    },
    featured: true
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Digital Marketing Director",
    department: "marketing",
    image: "assets/images/team/team-3.jpg",
    bio: "Marcus brings strategic insight to all our marketing campaigns with over 10 years of experience in digital marketing. His data-driven approach ensures measurable results for our clients.",
    expertise: ["Digital Strategy", "Performance Marketing", "SEO/SEM", "Analytics", "Marketing Automation"],
    education: "MBA, Northwestern University Kellogg School of Management",
    quote: "Marketing is no longer about the stuff you make, but about the stories you tell and the data that proves it works.",
    social: {
      linkedin: "https://linkedin.com/in/marcusjohnson",
      twitter: "https://twitter.com/marcusjohnson"
    },
    featured: true
  },
  {
    id: 4,
    name: "Olivia Rodriguez",
    role: "Web Development Lead",
    department: "development",
    image: "assets/images/team/team-4.jpg",
    bio: "Olivia leads our development team with expertise in front-end and back-end technologies. She ensures our creative designs are implemented with clean, efficient code that performs flawlessly.",
    expertise: ["Front-end Development", "Back-end Architecture", "Performance Optimization", "Technical Leadership"],
    education: "BS in Computer Science, MIT",
    quote: "Great web development is a perfect balance between beautiful code, performance, and user experience.",
    social: {
      linkedin: "https://linkedin.com/in/oliviarodriguez",
      github: "https://github.com/oliviarodriguez",
      twitter: "https://twitter.com/oliviarodriguez"
    },
    featured: true
  },
  {
    id: 5,
    name: "Daniel Kim",
    role: "Motion Designer",
    department: "creative",
    image: "assets/images/team/team-5.jpg",
    bio: "Daniel specializes in motion design and animation, bringing static designs to life with engaging movement and interaction. His background in film gives him a unique perspective on visual storytelling.",
    expertise: ["Motion Graphics", "Animation", "Video Editing", "Interactive Design"],
    education: "BFA in Motion Graphics, California Institute of the Arts",
    quote: "Animation is not just moving pictures, it's adding time as a dimension to design and storytelling.",
    social: {
      linkedin: "https://linkedin.com/in/danielkim",
      vimeo: "https://vimeo.com/danielkim",
      instagram: "https://instagram.com/danielkim"
    },
    featured: false
  },
  {
    id: 6,
    name: "Emma Wilson",
    role: "Content Strategist",
    department: "marketing",
    image: "assets/images/team/team-6.jpg",
    bio: "Emma develops content strategies that align with business goals and audience needs. Her background in journalism and SEO helps her create compelling narratives that drive engagement and conversions.",
    expertise: ["Content Strategy", "Copywriting", "SEO Content", "Brand Voice", "Editorial Planning"],
    education: "MA in Communications, Columbia University",
    quote: "Great content doesn't just fill space, it starts conversations and builds relationships with your audience.",
    social: {
      linkedin: "https://linkedin.com/in/emmawilson",
      twitter: "https://twitter.com/emmawilson"
    },
    featured: false
  },
  {
    id: 7,
    name: "James Taylor",
    role: "SEO Specialist",
    department: "marketing",
    image: "assets/images/team/team-7.jpg",
    bio: "James is our SEO expert with a deep understanding of search algorithms and optimization strategies. He combines technical SEO knowledge with content strategy to improve organic visibility for our clients.",
    expertise: ["Technical SEO", "Keyword Research", "Content Optimization", "Link Building", "Analytics"],
    education: "BS in Marketing, University of Texas at Austin",
    quote: "SEO is a marathon, not a sprint. It's about building a solid foundation and consistently improving over time.",
    social: {
      linkedin: "https://linkedin.com/in/jamestaylor",
      twitter: "https://twitter.com/jamestaylor"
    },
    featured: false
  },
  {
    id: 8,
    name: "Aisha Patel",
    role: "Project Manager",
    department: "operations",
    image: "assets/images/team/team-8.jpg",
    bio: "Aisha ensures all our projects run smoothly from kickoff to completion. Her exceptional organizational skills and client communication make her an invaluable link between our creative team and clients.",
    expertise: ["Project Management", "Client Relations", "Resource Allocation", "Risk Management", "Agile Methodologies"],
    education: "PMP Certification, MBA from University of Chicago Booth School of Business",
    quote: "Great project management is invisible. When everything runs smoothly, that's when you know we've done our job well.",
    social: {
      linkedin: "https://linkedin.com/in/aishapatel"
    },
    featured: false
  }
];

// Team departments for filtering
export const teamDepartments = [
  {
    id: "all",
    name: "All Team"
  },
  {
    id: "creative",
    name: "Creative"
  },
  {
    id: "design",
    name: "Design"
  },
  {
    id: "development",
    name: "Development"
  },
  {
    id: "marketing",
    name: "Marketing"
  },
  {
    id: "operations",
    name: "Operations"
  }
];