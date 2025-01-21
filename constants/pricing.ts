import { Plan } from "@/types/pricing";

export const pricingPlans: Plan[] = [
  {
    id: 'uiux',
    name: 'UI/UX Design',
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
        description: 'Includes logo, brand guidelines, and graphics',
      },
    ],
  },
  {
    id: 'webdev',
    name: 'Web Development',
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
    features: [
      {
        id: 'static',
        name: 'Static Project',
        type: 'toggle',
        cost: 800,
      },
      {
        id: 'micro_backend',
        name: 'Micro Backend + Database',
        type: 'toggle',
        cost: 1500,
      },
      {
        id: 'full_backend',
        name: 'Full Backend + Database',
        type: 'toggle',
        cost: 2500,
      },
      {
        id: 'brand_package',
        name: 'Brand Package',
        type: 'toggle',
        cost: 300,
      },
      {
        id: 'pwa',
        name: 'PWA Features',
        type: 'toggle',
        cost: 100,
      },
      {
        id: 'seo',
        name: 'SEO Optimization',
        type: 'included',
      },
    ],
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
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
    features: [
      {
        id: '1',
        name: 'Static Project',
        type: 'toggle',
        cost: 1000,
      },
      {
        id: '2',
        name: 'Micro Backend + Database',
        type: 'toggle',
        cost: 1500,
      },
      {
        id: '3',
        name: 'Full Backend + Database',
        type: 'toggle',
        cost: 2500,
      },
      {
        id: '4',
        name: 'Brand Package',
        type: 'toggle',
        cost: 300,
      },
      {
        id: '5',
        name: 'Platform',
        type: 'select',
        options: [
          { id: 'android', name: 'Android', cost: 200 },
          { id: 'ios', name: 'iOS', cost: 500 },
          { id: 'both', name: 'Both Platforms', cost: 600 },
        ],
      },
      {
        id: '6',
        name: 'SEO Optimization',
        type: 'included',
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
    features: [],
    isEnterprise: true,
  },
];