// app/culture/page.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe2, Users, Brain, Heart, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HoverBorderGradient } from "@/components/ui/cta-button";

const values = [
 {
   icon: Globe2,
   title: "Remote First", 
   description: "We embrace remote work and believe talent knows no borders. Our global team collaborates across time zones, fostering creativity and innovation."
 },
 {
   icon: Brain,
   title: "Growth Mindset",
   description: "We encourage continuous learning and experimentation. Every challenge is an opportunity to grow and innovate."
 },
 {
   icon: Users,
   title: "Collaborative Spirit",
   description: "Despite being remote, we maintain strong connections through open communication and regular virtual interactions."
 },
 {
   icon: Heart,
   title: "Work-Life Balance",
   description: "We respect personal time and promote flexible schedules that accommodate different lifestyles and time zones."
 }
];

export default function CulturePage() {
 return (
   <main className="min-h-screen pt-24">
     <div className="container mx-auto px-4">
       {/* Hero Section */}
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-center mb-32"
       >
         <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 inline-block">
           Our Culture
         </span>
         <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
           Building the <span className="text-brand-primary">Future</span> of Work
         </h1>
         <p className="text-white/70 max-w-2xl mx-auto text-lg mb-8">
           Remote-first company fostering innovation and collaboration across borders
         </p>
         <div className="w-full flex justify-center items-center">
          <Link href="/career">
            <HoverBorderGradient>
              <span className="flex items-center gap-2">
                Join Our Team <ArrowRight className="w-4 h-4" />
              </span>
            </HoverBorderGradient>
          </Link>
         </div>
       </motion.div>

       {/* Values Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
         {values.map((value, index) => (
           <motion.div
             key={value.title}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: index * 0.1 }}
             className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-8"
           >
             <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center mb-6">
               <value.icon className="w-6 h-6 text-brand-primary" />
             </div>
             <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
             <p className="text-white/70">{value.description}</p>
           </motion.div>
         ))}
       </div>

      {/* Remote Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl p-16 text-center mb-32"
      >
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-brand-primary/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-brand-to-brand-primaryLight/20 rounded-full blur-[100px]" />

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-brand-primary via-white to-brand-primaryLight bg-clip-text text-transparent"
        >
          Remote Work Benefits
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative mb-24">
          {[
            { icon: Globe2, value: "100%", label: "Remote First" },
            { icon: Clock, value: "Flexible", label: "Work Hours" },
            { icon: Users, value: "Global", label: "Community" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/50 to-emerald-300/50 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-50" />
                <div className="w-20 h-20 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl flex items-center justify-center relative">
                  <item.icon className="w-10 h-10 text-brand-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="text-3xl font-bold mt-6 mb-2 bg-gradient-to-r from-brand-primary to-brand-primaryLight bg-clip-text text-transparent">
                {item.value}
              </div>
              <p className="text-white/70">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Images Section */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
            <Image
              src="https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1470&auto=format&fit=crop"
              alt="Remote Team Meeting"
              fill
              className="object-cover"
            />
            
            {/* Floating Elements */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="absolute top-1/2 -translate-y-1/2 right-12 w-72 h-72"
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-primaryLight rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] blur-lg" />
                <div className="absolute inset-0 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] overflow-hidden border border-white/20">
                  <Image
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1470"
                    alt="Team Collaboration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Glass Cards */}
            <div className="absolute bottom-8 left-8 flex gap-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="px-6 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10"
              >
                <span className="text-brand-primary">Remote</span> Culture
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="px-6 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10"
              >
                <span className="text-brand-to-brand-primaryLight">Global</span> Team
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

       {/* Join Us CTA */}
       <motion.div
         initial={{ opacity: 0, y: 40 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className="text-center mb-16"
       >
         <h2 className="text-3xl md:text-4xl font-bold mb-6">
           Ready to Join Our Remote Team?
         </h2>
         <p className="text-white/70 mb-8 max-w-xl mx-auto">
           {"We're always looking for talented individuals who share our values and vision."}
         </p>
         <div className="w-full flex justify-center items-center">
          <Link href="/careers">
            <HoverBorderGradient>
              View Open Positions
            </HoverBorderGradient>
          </Link>
         </div>
       </motion.div>
     </div>
   </main>
 );
}