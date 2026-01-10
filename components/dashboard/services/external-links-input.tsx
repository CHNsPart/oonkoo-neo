"use client";

import { useState } from "react";
import { Plus, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import {
  ExternalLink as ExternalLinkType,
  ExternalLinkType as LinkType,
  EXTERNAL_LINK_TYPES,
} from "@/types/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExternalLinksInputProps {
  value: ExternalLinkType[];
  onChange: (links: ExternalLinkType[]) => void;
  maxLinks?: number;
  disabled?: boolean;
}

export function ExternalLinksInput({
  value = [],
  onChange,
  maxLinks = 10,
  disabled = false,
}: ExternalLinksInputProps) {
  const [newLink, setNewLink] = useState<Partial<ExternalLinkType>>({
    type: "github",
    url: "",
    label: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newLink.url || !newLink.label) {
      setError("URL and label are required");
      return;
    }

    try {
      new URL(newLink.url);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    if (value.length >= maxLinks) {
      setError(`Maximum ${maxLinks} links allowed`);
      return;
    }

    const link: ExternalLinkType = {
      type: newLink.type as LinkType,
      url: newLink.url,
      label: newLink.label,
    };

    onChange([...value, link]);
    setNewLink({ type: "github", url: "", label: "" });
    setError(null);
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Group link types by category
  const groupedTypes = Object.entries(EXTERNAL_LINK_TYPES).reduce(
    (acc, [key, meta]) => {
      if (!acc[meta.category]) {
        acc[meta.category] = [];
      }
      acc[meta.category].push({ key: key as LinkType, ...meta });
      return acc;
    },
    {} as Record<string, Array<{ key: LinkType; label: string; icon: string; category: string }>>
  );

  return (
    <div className="space-y-4">
      {/* Existing Links */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((link, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary">
                    {EXTERNAL_LINK_TYPES[link.type].label}
                  </span>
                  <span className="font-medium truncate">{link.label}</span>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/50 hover:text-brand-primary truncate block"
                >
                  {link.url}
                </a>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Link Form */}
      {!disabled && value.length < maxLinks && (
        <div className="space-y-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-sm font-medium flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-brand-primary" />
            Add External Link
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              value={newLink.type}
              onValueChange={(v) => setNewLink({ ...newLink, type: v as LinkType })}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Link type" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/10">
                {Object.entries(groupedTypes).map(([category, types]) => (
                  <div key={category}>
                    <div className="px-2 py-1 text-xs text-white/50 font-medium">
                      {category}
                    </div>
                    {types.map((type) => (
                      <SelectItem key={type.key} value={type.key}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Label (e.g., Project Repo)"
              value={newLink.label}
              onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
              className="bg-white/5 border-white/10"
            />

            <Input
              placeholder="URL"
              type="url"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="bg-white/5 border-white/10"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="w-full border-brand-primary/20 hover:bg-brand-primary/10 text-brand-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
      )}

      {/* Max links message */}
      {value.length >= maxLinks && !disabled && (
        <p className="text-sm text-white/50 text-center">
          Maximum {maxLinks} links reached
        </p>
      )}
    </div>
  );
}

interface ExternalLinksDisplayProps {
  links: ExternalLinkType[];
}

export function ExternalLinksDisplay({ links }: ExternalLinksDisplayProps) {
  if (!links || links.length === 0) {
    return (
      <p className="text-white/50 text-sm">No external links added</p>
    );
  }

  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors group"
        >
          <span className="text-xs px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary">
            {EXTERNAL_LINK_TYPES[link.type].label}
          </span>
          <span className="flex-1 truncate">{link.label}</span>
          <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-brand-primary transition-colors" />
        </a>
      ))}
    </div>
  );
}
