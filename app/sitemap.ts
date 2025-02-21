import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oonkoo.com';
  
  // Current date for lastModified
  const currentDate = new Date();
  
  // Define static routes
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/culture`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Optional: Fetch dynamic routes from your database
  // For example, product pages, blog posts, etc.
  // This is just an example - replace with your actual data fetching logic
  // const productSlugs = await fetchProductSlugs();
  // const productRoutes = productSlugs.map((slug) => ({
  //   url: `${baseUrl}/products/${slug}`,
  //   lastModified: currentDate,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }));

  // Combine all routes
  const routes = [
    ...staticRoutes,
    // ...productRoutes, // Uncomment when you implement dynamic routes
  ];

  return routes;
}