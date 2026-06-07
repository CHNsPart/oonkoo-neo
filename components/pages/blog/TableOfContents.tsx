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
    <div>
      <div
        style={{ fontFamily: 'var(--font-geist-mono)' }}
        className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40"
      >
        <List className="h-3.5 w-3.5 text-brand-primary" />
        On this page
      </div>
      <nav>
        <ul className="space-y-1 border-l border-white/10">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id}>
                <button
                  onClick={() => scrollToHeading(section.id)}
                  className={`-ml-px block w-full border-l py-1.5 pl-4 text-left text-sm leading-snug transition-colors duration-200 ${
                    isActive
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  {section.title}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;