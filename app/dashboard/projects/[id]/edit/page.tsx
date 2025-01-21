"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
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

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithParsedFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${params.id}`);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch project");
        }

        const { project } = await response.json();
        
        // Parse features if it's a string
        const parsedProject = {
          ...project,
          features: typeof project.features === 'string' 
            ? JSON.parse(project.features) 
            : project.features,
          meetingTime: project.meetingTime ? new Date(project.meetingTime) : null,
        };

        setProject(parsedProject);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch project");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const handleSubmit = async (data: Partial<ProjectWithParsedFeatures>) => {
    try {
      // Prepare features for submission
      const submissionData = {
        ...data,
        features: typeof data.features === 'string' 
          ? data.features 
          : JSON.stringify(data.features),
        meetingTime: data.meetingTime ? new Date(data.meetingTime).toISOString() : null,
      };

      console.log('Submitting to API:', submissionData);

      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update project");
      }

      const result = await response.json();
      console.log('API Response:', result);

      router.push("/dashboard/projects");
      router.refresh();
    } catch (error) {
      console.error("Error updating project:", error);
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

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <p className="text-red-500">{error || "Project not found"}</p>
        <Link 
          href="/dashboard/projects"
          className="flex items-center gap-2 text-white/70 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
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
            href="/dashboard/projects"
            className="flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <div className="border-l border-white/10 h-6" />
          <h1 className="text-xl font-semibold">Edit Project</h1>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <ProjectForm
            initialData={{...project, status: project.status || ''}}
            onSubmit={handleSubmit}
            mode="edit"
          />
        </div>
      </motion.div>
    </div>
  );
}