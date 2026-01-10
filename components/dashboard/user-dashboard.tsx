"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  BarChart3,
  FolderKanban,
  Clock,
  AlertCircle,
  Zap,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { useServices } from "@/hooks/use-services";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { servicePlans } from "@/constants/services";
import { BillingInfo } from "./services/billing-info";
import type { UserService } from "@/types/service";

interface Project {
  id: string;
  name: string;
  status: string;
  meetingTime: Date | null;
  company: string | null;
  totalPrice: number;
}

const statuses = {
  pending: { color: "bg-yellow-500/20 text-yellow-500" },
  approved: { color: "bg-green-500/20 text-green-500" },
  rejected: { color: "bg-red-500/20 text-red-500" },
  completed: { color: "bg-blue-500/20 text-blue-500" },
};

export default function UserDashboard() {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { services, loading: servicesLoading } = useServices();
  const [upcomingMeetings, setUpcomingMeetings] = useState<Project[]>([]);

  // Filter active services
  const activeServices = services.filter(
    (service) => service.status === "active"
  ) as UserService[];
  const pendingServices = services.filter(
    (service) => service.status === "pending"
  ) as UserService[];

  // Get services needing attention (renewal within 7 days)
  const servicesNeedingAttention = activeServices.filter((service) => {
    if (service.billingPeriod) {
      return service.billingPeriod.daysRemaining <= 7;
    }
    return false;
  });

  useEffect(() => {
    if (projects.length > 0) {
      // Filter and sort upcoming meetings
      const now = new Date();
      const meetings = projects
        .filter(
          (project) => project.meetingTime && new Date(project.meetingTime) > now
        )
        .sort((a, b) => {
          return (
            new Date(a.meetingTime!).getTime() -
            new Date(b.meetingTime!).getTime()
          );
        })
        .slice(0, 3); // Get next 3 meetings
      setUpcomingMeetings(meetings);
    }
  }, [projects]);

  const stats = [
    {
      title: "Active Services",
      value: activeServices.length,
      icon: Zap,
      color: "text-brand-primary",
      bgColor: "bg-brand-primary/20",
    },
    {
      title: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Active Projects",
      value: projects.filter((p) => p.status === "approved").length,
      icon: BarChart3,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Upcoming Meetings",
      value: upcomingMeetings.length,
      icon: Calendar,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/20",
    },
  ];

  if (projectsLoading || servicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        <AlertCircle className="w-5 h-5 mr-2" />
        {projectsError}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-5"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-white/70 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Services Needing Attention */}
      {servicesNeedingAttention.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold text-yellow-400">
              Renewal Reminders
            </h2>
          </div>
          <div className="space-y-3">
            {servicesNeedingAttention.map((service) => {
              const servicePlan = servicePlans.find(
                (s) => s.id === service.serviceId
              );
              return (
                <div
                  key={service.id}
                  className="bg-black/40 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {servicePlan && (
                      <Image
                        src={servicePlan.icon}
                        alt={servicePlan.title}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    )}
                    <div>
                      <p className="font-medium">
                        {servicePlan?.title || service.serviceId}
                      </p>
                      <p className="text-sm text-yellow-400">
                        {service.billingPeriod?.daysRemaining === 0
                          ? "Renewal due today"
                          : service.billingPeriod?.daysRemaining === 1
                          ? "Renews tomorrow"
                          : `Renews in ${service.billingPeriod?.daysRemaining} days`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/services`}
                    className="text-brand-primary hover:text-brand-primaryLight text-sm"
                  >
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Active Services */}
      {activeServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-primary" />
              <h2 className="text-xl font-semibold">Active Services</h2>
            </div>
            <Link
              href="/dashboard/services"
              className="text-sm text-brand-primary hover:text-brand-primaryLight transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeServices.slice(0, 4).map((service) => {
              const servicePlan = servicePlans.find(
                (s) => s.id === service.serviceId
              );
              const price =
                servicePlan?.price[
                  service.billingInterval as "monthly" | "annually"
                ] || 0;

              return (
                <div
                  key={service.id}
                  className="bg-white/5 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {servicePlan && (
                        <Image
                          src={servicePlan.icon}
                          alt={servicePlan.title}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">
                          {servicePlan?.title || service.serviceId}
                        </h3>
                        <p className="text-xs text-white/50">
                          ${price.toLocaleString()}/{service.billingInterval}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                      Active
                    </span>
                  </div>
                  {service.billingPeriod && (
                    <BillingInfo
                      billingPeriod={service.billingPeriod}
                      billingInterval={
                        service.billingInterval as "monthly" | "annually"
                      }
                      compact
                    />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Pending Services */}
      {pendingServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-blue-400">
              Pending Services
            </h2>
          </div>
          <p className="text-sm text-white/70 mb-4">
            These services are awaiting activation. Our team will review your
            request shortly.
          </p>
          <div className="space-y-3">
            {pendingServices.slice(0, 3).map((service) => {
              const servicePlan = servicePlans.find(
                (s) => s.id === service.serviceId
              );
              return (
                <div
                  key={service.id}
                  className="bg-black/40 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {servicePlan && (
                      <Image
                        src={servicePlan.icon}
                        alt={servicePlan.title}
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    )}
                    <div>
                      <p className="font-medium">
                        {servicePlan?.title || service.serviceId}
                      </p>
                      <p className="text-xs text-white/50">
                        Requested {format(new Date(service.createdAt), "PP")}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                    Pending
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
          </div>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="block">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{meeting.name}</h3>
                      {meeting.company && (
                        <p className="text-sm text-white/70">{meeting.company}</p>
                      )}
                    </div>
                    {meeting.status && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          statuses[meeting.status as keyof typeof statuses].color
                        }`}
                      >
                        {meeting.status.charAt(0).toUpperCase() +
                          meeting.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-white/70">
                    <Calendar className="w-4 h-4 mr-2" />
                    {meeting.meetingTime &&
                      format(new Date(meeting.meetingTime), "PPp")}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl font-semibold">Recent Projects</h2>
          </div>
          <Link
            href="/dashboard/projects"
            className="text-sm text-brand-primary hover:text-brand-primaryLight transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {projects.slice(0, 5).map((project) => (
            <div key={project.id} className="block">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    {project.company && (
                      <p className="text-sm text-white/70">{project.company}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/70">
                      ${project.totalPrice.toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        statuses[project.status as keyof typeof statuses].color
                      }`}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/70">No projects yet.</p>
              <Link
                href="/pricing"
                className="text-brand-primary hover:text-brand-primaryLight transition-colors mt-2 inline-block"
              >
                Start a new project
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
