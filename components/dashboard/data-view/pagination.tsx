"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const renderPageButton = (pageNum: number) => (
    <button
      key={pageNum}
      onClick={() => onPageChange(pageNum)}
      className={`px-4 py-2 text-sm rounded-xl transition-colors ${
        currentPage === pageNum
          ? "bg-brand-primary text-black font-medium"
          : "text-white/70 hover:bg-white/10"
      }`}
    >
      {pageNum}
    </button>
  );

  const renderPageNumbers = () => {
    const elements: React.ReactNode[] = [];
    
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => renderPageButton(i + 1));
    }

    // Always show first page
    elements.push(renderPageButton(1));

    if (currentPage > 3) {
      elements.push(
        <span key="start-ellipsis" className="px-2 text-white/50">...</span>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      elements.push(renderPageButton(i));
    }

    if (currentPage < totalPages - 2) {
      elements.push(
        <span key="end-ellipsis" className="px-2 text-white/50">...</span>
      );
    }

    // Always show last page
    elements.push(renderPageButton(totalPages));

    return elements;
  };

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl text-white/70 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl text-white/70 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}