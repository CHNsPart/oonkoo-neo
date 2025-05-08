// types/blog.ts
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  coverImage: string;
  category: string;
  tags: string[];
  content: {
    introduction?: string;
    sections: BlogSection[];
    faq?: BlogFAQ[];
    conclusion?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    structuredData: Record<string, unknown>;
  };
}

export interface BlogSection {
  id: string;
  title: string;
  content: string;
  image?: string;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}