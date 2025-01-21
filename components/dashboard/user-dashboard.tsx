"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, BarChart3, FolderKanban, Clock, AlertCircle } from 'lucide-react';
import { useProjects } from '@/hooks/use-projects';
import { format } from 'date-fns';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  status: string;
  meetingTime: Date | null;
  company: string | null;
  totalPrice: number;
}

const statuses = {
  pending: { color: 'bg-yellow-500/20 text-yellow-500' },
  approved: { color: 'bg-green-500/20 text-green-500' },
  rejected: { color: 'bg-red-500/20 text-red-500' },
  completed: { color: 'bg-blue-500/20 text-blue-500' },
};

export default function UserDashboard() {
  const { projects, loading, error } = useProjects();
  const [upcomingMeetings, setUpcomingMeetings] = useState<Project[]>([]);

  useEffect(() => {
    if (projects.length > 0) {
      // Filter and sort upcoming meetings
      const now = new Date();
      const meetings = projects
        .filter(project => project.meetingTime && new Date(project.meetingTime) > now)
        .sort((a, b) => {
          return new Date(a.meetingTime!).getTime() - new Date(b.meetingTime!).getTime();
        })
        .slice(0, 3); // Get next 3 meetings
      setUpcomingMeetings(meetings);
    }
  }, [projects]);

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Active Projects',
      value: projects.filter(p => p.status === 'approved').length,
      icon: BarChart3,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Upcoming Meetings',
      value: upcomingMeetings.length,
      icon: Calendar,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-white/70">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
          </div>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div 
                key={meeting.id}
                className="block"
              >
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
                      <span className={`px-2 py-1 rounded-full text-xs ${statuses[meeting.status as keyof typeof statuses].color}`}>
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-white/70">
                    <Calendar className="w-4 h-4 mr-2" />
                    {meeting.meetingTime && format(new Date(meeting.meetingTime), 'PPp')}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
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
            <div 
              key={project.id}
              className="block"
            >
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
                    <span className={`px-2 py-1 rounded-full text-xs ${statuses[project.status as keyof typeof statuses].color}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
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
      </div>
    </div>
  );
}