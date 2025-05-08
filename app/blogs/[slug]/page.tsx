// app/blogs/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage from "@/components/pages/blog/BlogPostPage";
import { getBlogBySlug, getAllBlogSlugs, getRelatedBlogs } from "@/lib/blog";

// Add this export for the viewport warning
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  // Next.js 15 requires awaiting the params object itself
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    return {
      title: "Blog Not Found | OonkoO",
      description: "The requested blog could not be found",
    };
  }
  
  return {
    title: blog.seo.metaTitle,
    description: blog.seo.metaDescription,
    keywords: blog.seo.keywords.join(", "),
    openGraph: {
      type: "article",
      title: blog.title,
      description: blog.excerpt,
      url: `https://oonkoo.com/blogs/${blog.slug}`,
      images: [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      publishedTime: blog.date,
      authors: [blog.author],
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function BlogPage({ params }: BlogPageProps) {
  // Next.js 15 requires awaiting the params object itself
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    notFound();
  }
  
  const relatedPosts = await getRelatedBlogs(slug, blog.tags, 3);
  
  return <BlogPostPage blog={blog} relatedPosts={relatedPosts} />;
}