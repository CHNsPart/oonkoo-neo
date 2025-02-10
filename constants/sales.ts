export interface Sale {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  validUntil: string;
  icon: 'gift' | 'timer' | 'star' | 'sparkles';
  type: string;
}

export const salesData: Sale[] = [
  {
    id: 'winter-sale-2024',
    name: '🎄Winter Sale 💸56% OFF',
    description: 'Business Portfolio Landing Page with Branding Package',
    originalPrice: 559,
    salePrice: 245,
    validUntil: 'May, 2025',
    icon: 'gift',
    type: 'Winter'
  },
];