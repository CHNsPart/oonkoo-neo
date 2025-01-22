"use client";

import { motion } from "framer-motion";
import { Blocks, Brain, LucideIcon } from "lucide-react";
import {
 Collapsible,
 CollapsibleContent,
 CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import Image from "next/image";

interface Job {
  id: number;
  title: string;
  type: string;
  salary: string;
  experience: string;
  icon: LucideIcon;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

const jobs: Job[] = [
  {
    id: 1,
    title: "AR/VR Mobile App Developer",
    type: "Full-time · Remote",
    salary: "$80K - $120K",
    experience: "3+ years",
    icon: Blocks,
    description: "Join us in building next-generation AR/VR mobile applications using Unity, ARKit, and ARCore.",
    requirements: [
      "Experience with Unity3D and C#",
      "Expertise in ARKit and ARCore development",
      "Strong understanding of 3D graphics and mathematics",
      "iOS/Android mobile development experience",
    ],
    responsibilities: [
      "Develop AR/VR features for mobile applications",
      "Optimize performance for mobile devices",
      "Create immersive user experiences",
      "Collaborate with cross-functional teams",
    ]
  },
  {
    id: 2, 
    title: "LLM/AI App Developer",
    type: "Full-time · Remote",
    salary: "$90K - $130K",
    experience: "2+ years",
    icon: Brain,
    description: "Build innovative applications leveraging large language models and AI technologies.",
    requirements: [
      "Experience with LangChain, OpenAI API",
      "Python/TypeScript development expertise",
      "Understanding of LLM concepts and limitations",
      "Vector database experience (Pinecone, etc.)"
    ],
    responsibilities: [
      "Develop AI-powered applications",
      "Optimize LLM performance and costs", 
      "Implement conversational AI",
      "Ensure responsible AI practices",
    ]
  }
];

export default function CareersPage() {
 const [openJobId, setOpenJobId] = useState<number | null>(null);

 return (
   <main className="min-h-screen pt-24">
     <div className="container mx-auto px-4">
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-center mb-32"
       >
         <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 inline-block">
           Careers
         </span>
         <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
           Join Our <span className="text-brand-primary">Global</span> Team
         </h1>
         <p className="text-white/70 max-w-2xl mx-auto text-lg mb-8">
           Build the future of technology from anywhere in the world
         </p>
       </motion.div>

       <div className="max-w-3xl mx-auto space-y-6">
         {jobs.map((job) => (
           <motion.div
             key={job.id}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
             <Collapsible
               open={openJobId === job.id}
               onOpenChange={() => setOpenJobId(openJobId === job.id ? null : job.id)}
             >
               <CollapsibleTrigger className="w-full">
                 <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6 text-left hover:border-brand-primary/50 transition-colors">
                   <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-3">
                          <span className="text-white/70 text-sm">{job.type}</span>
                          <span className="text-white/70 text-sm">·</span>
                          <span className="text-white/70 text-sm">{job.experience}</span>
                          <span className="text-white/70 text-sm">·</span>
                          <span className="text-brand-primary text-sm">{job.salary}</span>
                        </div>
                      </div>
                     <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                       <job.icon className="w-6 h-6 text-brand-primary" />
                     </div>
                   </div>
                 </div>
               </CollapsibleTrigger>
               <CollapsibleContent>
                 <div className="mt-4 bg-black/20 rounded-3xl border border-white/10 p-6 space-y-6">
                   <p className="text-white/70">{job.description}</p>

                   <div>
                     <h4 className="text-lg font-semibold mb-2">Requirements</h4>
                     <ul className="list-disc list-inside text-white/70 space-y-1">
                       {job.requirements.map((req, i) => (
                         <li key={i}>{req}</li>
                       ))}
                     </ul>
                   </div>

                   <div>
                     <h4 className="text-lg font-semibold mb-2">Responsibilities</h4>
                     <ul className="list-disc list-inside text-white/70 space-y-1">
                       {job.responsibilities.map((resp, i) => (
                         <li key={i}>{resp}</li>
                       ))}
                     </ul>
                   </div>

                   <div>
                     <h4 className="text-lg font-semibold mb-2">How to Apply</h4>
                     <p className="text-white/70">
                       Send your resume and portfolio to{" "}
                       <a 
                         href="mailto:oonkoo.mail@gmail.com" 
                         className="text-brand-primary hover:text-brand-primaryLight"
                       >
                         oonkoo.mail@gmail.com
                       </a>
                     </p>
                   </div>
                 </div>
               </CollapsibleContent>
             </Collapsible>
           </motion.div>
         ))}
       </div>
     </div>
     <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-32 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-16">Our <span className="text-brand-primary">Culture</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              src: "https://images.unsplash.com/photo-1488229297570-58520851e868?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              title: "Innovation First",
              description: "We embrace cutting-edge technologies"
            },
            {
              src: "https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1470&auto=format&fit=crop",
              title: "Remote Culture",
              description: "Work from anywhere in the world"
            },
            {
              src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1470",
              title: "Growth Mindset",
              description: "Continuous learning and development"
            }
          ].map(({ src, title, description }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-square rounded-3xl overflow-hidden group"
            >
              <Image
                src={src}
                alt="Company Culture"
                fill
                className="object-cover filter grayscale hover:grayscale-0 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-left">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-white/70">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
   </main>
 );
}