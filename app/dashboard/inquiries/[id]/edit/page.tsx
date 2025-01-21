"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { InquiryForm } from "@/components/dashboard/inquiries/inquiry-form";
import type { ProjectInquiry } from "@/hooks/use-inquiries";

export default function EditInquiryPage() {
  const params = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<ProjectInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/project-inquiries/${params.id}`);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch inquiry");
        }

        const { inquiry } = await response.json();
        setInquiry(inquiry);
      } catch (err) {
        console.error("Error fetching inquiry:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch inquiry");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInquiry();
    }
  }, [params.id]);

  const handleSubmit = async (data: Partial<ProjectInquiry>) => {
    try {
      const response = await fetch(`/api/project-inquiries/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update inquiry");
      }

      router.push("/dashboard/inquiries");
      router.refresh();
    } catch (error) {
      console.error("Error updating inquiry:", error);
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

  if (error || !inquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <p className="text-red-500">{error || "Inquiry not found"}</p>
        <Link 
          href="/dashboard/inquiries"
          className="flex items-center gap-2 text-white/70 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inquiries
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
            href="/dashboard/inquiries"
            className="flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inquiries
          </Link>
          <div className="border-l border-white/10 h-6" />
          <h1 className="text-xl font-semibold">Edit Inquiry</h1>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <InquiryForm
            initialData={inquiry}
            onSubmit={handleSubmit}
            mode="edit"
          />
        </div>
      </motion.div>
    </div>
  );
}