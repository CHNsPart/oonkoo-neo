// lib/blog.ts
import { BlogPost } from "@/types/blog";
import { blogs } from "./data/blog-data";

// Get all blogs for listing
export async function getAllBlogs(): Promise<BlogPost[]> {
  return blogs.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Get a specific blog by slug
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  return blogs.find(blog => blog.slug === slug) || null;
}

// Get all blog slugs for static paths
export async function getAllBlogSlugs(): Promise<string[]> {
  return blogs.map(blog => blog.slug);
}

// Get related blogs based on tags
export async function getRelatedBlogs(currentSlug: string, tags: string[], limit: number = 3): Promise<BlogPost[]> {
  const otherBlogs = blogs.filter(blog => blog.slug !== currentSlug);
  
  const scoredBlogs = otherBlogs.map(blog => {
    const commonTags = blog.tags.filter(tag => tags.includes(tag));
    return {
      blog,
      score: commonTags.length
    };
  });
  
  return scoredBlogs
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.blog);
}