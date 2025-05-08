// app/blogs/page.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, FilterIcon } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/cta-button";
import { BlogCard } from "@/components/pages/cards/BlogCard";
import { blogPosts } from "@/lib/data/blogs";

// Extract unique categories and tags for filtering
const allCategories = Array.from(new Set(blogPosts.map(post => post.category)));
const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter posts based on search, category, and tag filters
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || post.category === selectedCategory;
    
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  return (
    <main className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col justify-center items-center"
        >
          <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 inline-block">
            OonkoO Blog
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Insights & <span className="text-brand-primary">Expertise</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg mb-8">
            Explore our latest articles on digital transformation, web development, 
            and business strategy to stay ahead in the digital landscape.
          </p>
        </motion.div>
      </section>

      {/* Search and Filter Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            {/* Search */}
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
            </div>
            
            {/* Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              <FilterIcon className="w-4 h-4" />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          selectedCategory === category
                            ? 'bg-brand-primary text-black'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-3">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          selectedTag === tag
                            ? 'bg-brand-primary text-black'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-sm text-brand-primary hover:text-brand-primaryLight transition-colors"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 mb-16">
        {filteredPosts.length > 0 ? (
          <>
            {/* Featured Blog Post */}
            {filteredPosts.length > 0 && (
              <BlogCard 
                post={filteredPosts[0]} 
                index={0} 
                isFeatured={true} 
              />
            )}
            
            {/* Regular Blog Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredPosts.slice(1).map((post, index) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  index={index + 1} 
                  isFeatured={false} 
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">No matching articles found</h2>
            <p className="text-white/70 mb-6">{"Try adjusting your search or filters to find what you're looking for."}</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Signup CTA */}
      <section className="container mx-auto px-4 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex flex-col justify-center items-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-primary/20 to-black/40 backdrop-blur-sm p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated with Our Insights
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter to receive the latest articles, insights, and digital trends straight to your inbox.
          </p>
          
          <div className="flex flex-col items-center sm:flex-row w-full max-w-xl gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
            <HoverBorderGradient>
              <span className="flex items-center gap-2 whitespace-nowrap">
                Subscribe <ArrowRight className="w-4 h-4" />
              </span>
            </HoverBorderGradient>
          </div>

          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px]" />
        </motion.div>
      </section>
    </main>
  );
}