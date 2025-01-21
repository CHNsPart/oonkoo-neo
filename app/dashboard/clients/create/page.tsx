"use client";

// app/dashboard/clients/create/page.tsx
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClientForm } from "@/components/dashboard/clients/client-form";
import type { ClientUser } from "@/types/client";

export default function CreateClientPage() {
  const router = useRouter();

  const handleSubmit = async (data: Partial<ClientUser>) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create client");
      }

      router.push("/dashboard/clients");
      router.refresh();
    } catch (error) {
      console.error("Error creating client:", error);
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
            href="/dashboard/clients"
            className="flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clients
          </Link>
          <div className="border-l border-white/10 h-6" />
          <h1 className="text-xl font-semibold">Create New Client</h1>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <ClientForm
            mode="create"
            onSubmit={handleSubmit}
          />
        </div>
      </motion.div>
    </div>
  );
}