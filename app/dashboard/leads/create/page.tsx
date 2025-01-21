"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LeadForm } from "@/components/dashboard/leads/lead-form";
import type { Lead } from "@/hooks/use-leads";

export default function CreateLeadPage() {
  const router = useRouter();

  const handleSubmit = async (data: Partial<Lead>) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create lead");
      }

      router.push("/dashboard/leads");
      router.refresh();
    } catch (error) {
      console.error("Error creating lead:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="mb-6 flex items-center gap-4">
          <Link 
            href="/dashboard/leads"
            className="flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leads
          </Link>
          <div className="border-l border-white/10 h-6" />
          <h1 className="text-xl font-semibold">Create New Lead</h1>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <LeadForm
            mode="create"
            onSubmit={handleSubmit}
          />
        </div>
      </motion.div>
    </div>
  );
}