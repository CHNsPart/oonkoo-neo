"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SaleForm } from "@/components/dashboard/sales/sale-form";
import type { SaleInquiry } from "@/hooks/use-sales";

export default function EditSalePage() {
  const params = useParams();
  const router = useRouter();
  const [sale, setSale] = useState<SaleInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sale-inquiries/${params.id}`);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch sale");
        }

        const { inquiry } = await response.json();
        setSale(inquiry);
      } catch (err) {
        console.error("Error fetching sale:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch sale");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSale();
    }
  }, [params.id]);

  const handleSubmit = async (data: Partial<SaleInquiry>) => {
    try {
      const response = await fetch(`/api/sale-inquiries/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update sale");
      }

      router.push("/dashboard/sales");
      router.refresh();
    } catch (error) {
      console.error("Error updating sale:", error);
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

  if (error || !sale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <p className="text-red-500">{error || "Sale not found"}</p>
        <Link 
          href="/dashboard/sales"
          className="flex items-center gap-2 text-white/70 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sales
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
            href="/dashboard/sales"
            className="flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sales
          </Link>
          <div className="border-l border-white/10 h-6" />
          <h1 className="text-xl font-semibold">Edit Sale</h1>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <SaleForm
            initialData={sale}
            onSubmit={handleSubmit}
            mode="edit"
          />
        </div>
      </motion.div>
    </div>
  );
}