// components/pages/blog/TableOfContents.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ sections }) => {
  const [activeId, setActiveId] = useState<string>('');
  
  useEffect(() => {
    if (sections.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );
    
    // Observe all section headings
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    
    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [sections]);
  
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  if (sections.length === 0) return null;

  return (
    <div className="sticky top-24">
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-5 h-5 text-brand-primary" />
          <h2 className="font-semibold">Table of Contents</h2>
        </div>
        <nav>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToHeading(section.id)}
                  className={`text-left text-sm hover:text-brand-primary transition-colors w-full ${
                    activeId === section.id 
                      ? 'text-brand-primary font-medium' 
                      : 'text-white/70'
                  }`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TableOfContents;