"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProjectForm } from "@/components/dashboard/projects/project-form";

interface Feature {
  type: 'toggle' | 'select' | 'tiers';
  value: boolean | string;
  cost: number;
  name?: string;
}

interface ProjectWithParsedFeatures {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  meetingTime: Date | null;
  planType: string;
  features: Record<string, Feature>;
  oneTimePrice: number;
  recurringPrice: number;
  recurringInterval: 'monthly' | 'annually';
  totalPrice: number;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CreateProjectPage() {
  const router = useRouter();

  const handleSubmit = async (data: Partial<ProjectWithParsedFeatures>) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create project");
      }

      router.push("/dashboard/projects");
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
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
            href="/dashboard/projects"
            className="flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <div className="border-l border-white/10 h-6" />
          <h1 className="text-xl font-semibold">Create New Project</h1>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <ProjectForm
            mode="create"
            onSubmit={handleSubmit}
          />
        </div>
      </motion.div>
    </div>
  );
}