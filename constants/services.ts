import { ServicePlan } from "@/types/service";

export const servicePlans: ServicePlan[] = [
  {
    id: 'maintenance',
    title: 'OonkoO Website Maintenance',
    description: 'Keep your digital solutions running smoothly with our comprehensive maintenance service.',
    serviceDescription: [
      'Regular updates and bug fixes',
      'Security patches and monitoring',
      'Performance optimization',
      'Technical support',
      'Code refactoring when needed',
      'Database optimization',
      'API maintenance and updates',
      'Monthly performance reports'
    ],
    icon: 'https://img.icons8.com/?size=100&id=cjKG0gGVVbhH&format=png&color=3cb371',
    price: {
      monthly: 400,
      annually: 3840, // 20% off annual
    }
  },
  {
    id: 'hosting',
    title: 'OonkoO Hosting',
    description: 'Secure and scalable hosting solutions for your digital presence.',
    serviceDescription: [
      'High-performance servers',
      'SSL certificates included',
      'Daily backups',
      'DDoS protection',
      'CDN integration',
      'Load balancing',
      '99.9% uptime guarantee',
      '24/7 monitoring'
    ],
    icon: 'https://img.icons8.com/?size=100&id=bhn6F8a5I0FI&format=png&color=3cb371',
    price: {
      monthly: 10,
      annually: 96, // 20% off annual
    }
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Boost your online presence with our comprehensive digital marketing solutions.',
    serviceDescription: [
      'SEO optimization',
      'Content marketing',
      'Email campaigns',
      'Social media ads',
      'Analytics tracking',
      'PPC management',
      'Conversion optimization',
      'Monthly performance reports',
      'Market trend analysis'
    ],
    icon: 'https://img.icons8.com/?size=100&id=11158&format=png&color=3cb371',
    price: {
      monthly: 300,
      annually: 2880, // 20% off annual
    }
  },
  {
    id: 'social-media',
    title: 'Social Media Management',
    description: 'Engaging social media presence with strategic content and community management.',
    serviceDescription: [
      'Content creation',
      'Social media strategy',
      'Community management',
      'Engagement monitoring',
      'Brand consistency',
      'Monthly analytics',
      'Competitor analysis',
      'Trend optimization'
    ],
    icon: 'https://img.icons8.com/?size=100&id=36872&format=png&color=3cb371',
    price: {
      monthly: 300,
      annually: 2880, // 20% off annual
    }
  },
  {
    id: 'blog-marketing',
    title: 'Blog & SEO Management',
    description: 'Maximize your blogs potential with our expert SEO and content management services. We will write weekly 5-7 blogs for you with keyword research and SEO optimization.',
    serviceDescription: [
      'Dedicated blog site creation',
      'Subdomain integration',
      'Social media sharing',
      'Blog posting',
      'Backlinks creation',
      'Keyword research',
      'Content creation',
      'SEO optimization',
      'Monthly analytics',
      'Competitor analysis',
      'Trend optimization',
      'Blog content calendar'
    ],
    icon: 'https://img.icons8.com/?size=100&id=58240&format=png&color=3cb371',
    price: {
      monthly: 300,
      annually: 2880, // 20% off annual
    }
  },
  {
    id: 'branding-design',
    title: 'Branding & Graphic Design',
    description: 'Create a powerful brand identity with custom designs that leave a lasting impression.',
    serviceDescription: [
      'Logo design & brand guidelines',
      'Business card & stationery design',
      'Brochures, flyers & posters',
      'Social media graphics',
      'Website & UI design assets',
      'Custom illustrations & infographics',
      'Packaging design',
      'Rebranding strategy'
    ],
    icon: 'https://img.icons8.com/?size=100&id=YSL0gJ5Ivncu&format=png&color=3cb371',
    price: {
      monthly: 350,
      annually: 3360, // 20% off annual
    }
  },
];