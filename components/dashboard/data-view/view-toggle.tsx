"use client";

import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full p-2">
      <button
        onClick={() => onViewChange("list")}
        className={`p-2 rounded-full transition-colors ${
          view === "list"
            ? "bg-brand-primary text-black"
            : "text-white/70 hover:bg-white/10"
        }`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange("grid")}
        className={`p-2 rounded-full transition-colors ${
          view === "grid"
            ? "bg-brand-primary text-black"
            : "text-white/70 hover:bg-white/10"
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}