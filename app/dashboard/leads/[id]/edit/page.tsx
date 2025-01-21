"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LeadForm } from "@/components/dashboard/leads/lead-form";

interface Lead {
  id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leads/${params.id}`);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch lead");
        }

        const { lead } = await response.json();
        setLead(lead);
      } catch (err) {
        console.error("Error fetching lead:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch lead");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLead();
    }
  }, [params.id]);

  const handleSubmit = async (data: Partial<Lead>) => {
    try {
      const response = await fetch(`/api/leads/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update lead");
      }

      router.push("/dashboard/leads");
      router.refresh();
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <p className="text-red-500">{error || "Lead not found"}</p>
        <Link 
          href="/dashboard/leads"
          className="flex items-center gap-2 text-white/70 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </Link>
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold">Edit Lead</h1>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <LeadForm
            initialData={lead}
            onSubmit={handleSubmit}
            mode="edit"
          />
        </div>
      </motion.div>
    </div>
  );
}