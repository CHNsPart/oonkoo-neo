import { Plan } from "@/types/pricing";

export const pricingPlans: Plan[] = [
  {
    id: 'uiux',
    name: 'UI/UX Design',
    icon: 'https://img.icons8.com/?size=100&id=AfSNmGLRTzlC&format=png&color=3cb371',
    description: 'Transform your vision into stunning, user-centric designs.',
    basePrice: {
      monthly: 0,
      annually: 0,
    },
    maintenanceCost: {
      monthly: 200,
      annually: 1920, // 20% discount
    },
    hostingCost: {
      monthly: 0,
      annually: 0, // 20% discount
    },
    digitalMarketingCost: {
      monthly: 0,
      annually: 0, // 20% discount
    },
    socialMediaCost: {
      monthly: 0,
      annually: 0, // 20% discount
    },
    hideDigital: true,
    hideSocial: true,
    hideHosting: true,
    features: [
      {
        id: 'pages',
        name: 'Total Pages',
        type: 'tiers',
        tiers: [
          { id: '5-pages', name: '5 Pages', cost: 300 },
          { id: '10-pages', name: '10 Pages', cost: 500 },
          { id: '25-pages', name: '25 Pages', cost: 1500 },
          { id: '25-plus', name: '25+ Pages', cost: 2000 },
        ],
      },
      {
        id: 'prototype',
        name: 'Interactive Prototype',
        type: 'toggle',
        cost: 250,
        description: 'Clickable prototype with animations',
      },
      {
        id: 'brand',
        name: 'Brand Package',
        type: 'toggle',
        cost: 300,
        description: 'Professional logo design, color scheme, typography, and brand guidelines.',
      },
    ],
  },
  {
    id: 'webdev',
    name: 'Web Development',
    icon: 'https://img.icons8.com/?size=100&id=120448&format=png&color=3cb371',
    description: 'Build powerful, scalable web applications.',
    basePrice: {
      monthly: 0,
      annually: 0,
    },
    maintenanceCost: {
      monthly: 400,
      annually: 3840, // 20% discount
    },
    hostingCost: {
      monthly: 10,
      annually: 96, // 20% discount
    },
    digitalMarketingCost: {
      monthly: 350,
      annually: 3360, // 20% discount
    },
    socialMediaCost: {
      monthly: 200,
      annually: 1920, // 20% discount
    },
    features: [
      {
        id: 'static',
        name: 'Static Project',
        type: 'toggle',
        cost: 559,
        description: 'A complete website with multiple pages, responsive design, and basic interactions. e.g- Business Landing Page/portfolio.',
      },
      {
        id: 'micro_backend',
        name: 'Micro Backend + Database',
        type: 'toggle',
        cost: 999,
        description: 'Server-side functionality with a lightweight database for basic data storage and user management.',
      },
      {
        id: 'full_backend',
        name: 'Full Backend + Database',
        type: 'toggle',
        cost: 1799,
        description: 'Complete server infrastructure with advanced database management, authentication, admin-panel and API integrations.',
      },
      {
        id: 'brand_package',
        name: 'Brand Package',
        type: 'toggle',
        cost: 250,
        description: 'Professional logo design, color scheme, typography, and brand guidelines.',
      },
      {
        id: 'pwa',
        name: 'PWA Features',
        type: 'toggle',
        cost: 99,
        description: 'Make your website installable on mobile devices with offline capabilities.',
      },
      {
        id: 'seo',
        name: 'SEO Optimization',
        type: 'included',
        description: 'We will optimize your website for search engines.',
      },
    ],
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    icon: 'https://img.icons8.com/?size=100&id=97043&format=png&color=3cb371',
    description: 'Create engaging mobile experiences for iOS and Android.',
    basePrice: {
      monthly: 0,
      annually: 0,
    },
    maintenanceCost: {
      monthly: 400,
      annually: 3840, // 20% discount
    },
    hostingCost: {
      monthly: 10,
      annually: 96, // 20% discount
    },
    digitalMarketingCost: {
      monthly: 350,
      annually: 3360, // 20% discount
    },
    socialMediaCost: {
      monthly: 200,
      annually: 1920, // 20% discount
    },
    features: [
      {
        id: 'static',
        name: 'Static Project',
        type: 'toggle',
        cost: 699,
        description: 'A static application with a single or upto 5 pages.',
      },
      {
        id: 'micro_backend',
        name: 'Micro Backend + Database',
        type: 'toggle',
        cost: 1049,
        description: 'Server-side functionality with a lightweight database for basic data storage and user management.',
      },
      {
        id: 'full_backend',
        name: 'Full Backend + Database',
        type: 'toggle',
        cost: 1799,
        description: 'Complete server infrastructure with advanced database management, authentication, and API integrations.',
      },
      {
        id: 'brand_package',
        name: 'Brand Package',
        type: 'toggle',
        cost: 250,
        description: 'Professional logo design, color scheme, typography, and brand guidelines.',
      },
      {
        id: 'platform',
        name: 'Platform',
        type: 'select',
        options: [
          { id: 'android', name: 'Android', cost: 139, icon: "https://img.icons8.com/?size=100&id=xYzLkOHZVwS8&format=png&color=000000" },
          { id: 'ios', name: 'iOS', cost: 349, icon: "https://img.icons8.com/?size=100&id=uoRwwh0lz3Jp&format=png&color=000000" },
          { id: 'both', name: 'Both Platforms', cost: 419 },
        ],
        description: 'Select the platform for your application.',
      },
      {
        id: 'seo',
        name: 'SEO Optimization',
        type: 'included',
        description: 'Our team will optimize your application for search engines.',
      },
    ],
  },
  {
    id: 'builder',
    name: 'Website Builder',
    icon: 'https://img.icons8.com/?size=100&id=85473&format=png&color=3cb371',
    description: 'Create engaging mobile experiences for iOS and Android.',
    basePrice: {
      monthly: 0,
      annually: 0,
    },
    maintenanceCost: {
      monthly: 400,
      annually: 3840, // 20% discount
    },
    hostingCost: {
      monthly: 0,
      annually: 0, // 20% discount
    },
    digitalMarketingCost: {
      monthly: 350,
      annually: 3360, // 20% discount
    },
    socialMediaCost: {
      monthly: 200,
      annually: 1920, // 20% discount
    },
    hideHosting: true,
    features: [
      {
        id: 'static',
        name: 'Landing Page',
        type: 'toggle',
        cost: 699,
        description: 'Business landing page with a call-to-action.',
      },
      {
        id: 'commerce',
        name: 'E-commerce',
        type: 'toggle',
        cost: 1000,
        description: 'E-commerce platform with product management and payment gateways. With all the features of the landing page.',
      },
      {
        id: 'brand_package',
        name: 'Brand Package',
        type: 'toggle',
        cost: 250,
        description: 'Professional logo design, color scheme, typography, and brand guidelines.',
      },
      {
        id: 'platform',
        name: 'Platform',
        type: 'select',
        options: [
          { id: 'wordpress', name: 'Wordpress', cost: 100, icon: 'https://static-00.iconduck.com/assets.00/wordpress-icon-256x256-1fsw4nlq.png' },
          { id: 'shopify', name: 'Shopify', cost: 250, icon: "https://pbs.twimg.com/profile_images/1730319820238049280/FYF6hwoK_400x400.jpg" },
          { id: 'squarespace', name: 'Square Space', cost: 250, icon: "https://seekvectors.com/files/download/Squarespace-01.jpg" },
          { id: 'wix', name: 'Wix', cost: 300, icon: "https://images.ctfassets.net/y2vv62dcl0ut/11SAcFWUCSxV5o8Hl2YTd0/82fe1e932b6c3a6f4b46d047c310487c/Wix_App_Icon_10.5_512x512_.png" },
          { id: 'framer', name: 'Framer', cost: 350, icon: "https://pbs.twimg.com/profile_images/1469296240991125519/xpZr8yYS_400x400.jpg" },
        ],
        description: 'Select the platform for your application.',
      },
      {
        id: 'seo',
        name: 'SEO Optimization',
        type: 'included',
        description: 'Our team will optimize your application for search engines.',
      },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Solutions',
    description: 'Custom solutions for large-scale business needs.',
    basePrice: {
      monthly: 0,
      annually: 0,
    },
    maintenanceCost: {
      monthly: 0,
      annually: 0,
    },
    hostingCost: {
      monthly: 0,
      annually: 0,
    },
    digitalMarketingCost: {
      monthly: 0,
      annually: 0, // 20% discount
    },
    socialMediaCost: {
      monthly: 0,
      annually: 0, // 20% discount
    },
    features: [],
    isEnterprise: true,
  },
];