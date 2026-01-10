"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Users,
  FolderKanban, 
  Clock, 
  AlertCircle,
  DollarSign,
  SearchCode
} from 'lucide-react';
import { useProjects } from '@/hooks/use-projects';
import { useClients } from '@/hooks/use-clients';
import { format } from 'date-fns';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Label,
  LabelList
} from 'recharts';
import { useInquiries } from '@/hooks/use-inquiries';

interface Project {
  id: string;
  name: string;
  status: string;
  meetingTime: Date | null;
  company: string | null;
  totalPrice: number;
  createdAt: Date;
}

interface ChartData {
  name: string;
  value: number;
}

interface ConversionData {
  source: string;
  conversionRate: number;
  total: number;
  converted: number;
}

interface ConversionMetric {
  label: string;
  value: string;
}

interface ProjectMetric {
  label: string;
  value: string;
}

const statuses = {
  pending: { color: 'bg-yellow-500/20 text-yellow-500' },
  approved: { color: 'bg-green-500/20 text-green-500' },
  rejected: { color: 'bg-red-500/20 text-red-500' },
  completed: { color: 'bg-blue-500/20 text-blue-500' },
};

export default function AdminDashboard() {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { clients, loading: clientsLoading, hasPermission: hasClientsPermission } = useClients();
  const [upcomingMeetings, setUpcomingMeetings] = useState<Project[]>([]);
  const [projectStatusData, setProjectStatusData] = useState<ChartData[]>([]);
  const { inquiries } = useInquiries();
  const [conversionData, setConversionData] = useState<ConversionData[]>([]);
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetric[]>([]);
  const [projectMetrics, setProjectMetrics] = useState<ProjectMetric[]>([]);


  useEffect(() => {
    if (projects.length > 0) {
      // Filter and sort upcoming meetings
      const now = new Date();
      const meetings = projects
        .filter(project => project.meetingTime && new Date(project.meetingTime) > now)
        .sort((a, b) => {
          return new Date(a.meetingTime!).getTime() - new Date(b.meetingTime!).getTime();
        })
        .slice(0, 3);
      setUpcomingMeetings(meetings);
  
      // Calculate project status distribution
      const statusCount = projects.reduce((acc: { [key: string]: number }, project) => {
        const status = project.status.charAt(0).toUpperCase() + project.status.slice(1);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const totalProjects = projects.length;
      const completionRate = (projects.filter(p => p.status === 'completed').length / totalProjects * 100).toFixed(1);
      const avgProjectValue = (projects.reduce((sum, p) => sum + p.totalPrice, 0) / totalProjects).toFixed(0);
  
      const projectMetrics: ProjectMetric[] = [
        { label: 'Total Projects', value: totalProjects.toString() },
        { label: 'Completion Rate', value: `${completionRate}%` },
        { label: 'Avg Project Value', value: `$${parseInt(avgProjectValue).toLocaleString()}` },
        { label: 'Active Projects', value: projects.filter(p => p.status === 'approved').length.toString() }
      ];
      
      setProjectMetrics(projectMetrics);

      const statusChartData = Object.entries(statusCount)
        .map(([name, value]) => ({ name, value }));
      setProjectStatusData(statusChartData);
    }

    if (inquiries.length > 0 && projects.length > 0) {
      // Group inquiries by source
      const sourceGroups = inquiries.reduce((acc: { [key: string]: number }, inquiry) => {
        const source = inquiry.origin || 'Direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});
  
      // Count converted inquiries (those that became projects)
      const convertedGroups = inquiries.reduce((acc: { [key: string]: number }, inquiry) => {
        const source = inquiry.origin || 'Direct';
        const hasProject = projects.some(project => 
          project.email === inquiry.email && 
          project.status !== 'rejected'
        );
        if (hasProject) {
          acc[source] = (acc[source] || 0) + 1;
        }
        return acc;
      }, {});
  
      // Calculate conversion rates
      const conversionRates = Object.entries(sourceGroups).map(([source, total]) => ({
        source: source.charAt(0).toUpperCase() + source.slice(1),
        total,
        converted: convertedGroups[source] || 0,
        conversionRate: (convertedGroups[source] || 0) / total * 100
      }));
  
      setConversionData(conversionRates);
  
      // Calculate overall metrics
      const totalInquiries = inquiries.length;
      const totalConverted = projects.filter(p => p.status !== 'rejected').length;
      const overallRate = (totalConverted / totalInquiries * 100).toFixed(1);

      const convertedProjects = projects.filter(p => p.status !== 'rejected');
      let totalConversionDays = 0;
      let validConversions = 0;

      convertedProjects.forEach(project => {
        // Find matching inquiry
        const matchingInquiry = inquiries.find(inq => inq.email === project.email);
        if (matchingInquiry) {
          const inquiryDate = new Date(matchingInquiry.createdAt);
          const projectDate = new Date(project.createdAt);
          const diffTime = Math.abs(projectDate.getTime() - inquiryDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          totalConversionDays += diffDays;
          validConversions++;
        }
      });

      const avgConversionTime = validConversions > 0 
        ? (totalConversionDays / validConversions).toFixed(1)
        : '0';
      
      const metrics: ConversionMetric[] = [
        { label: 'Total Inquiries', value: totalInquiries.toString() },
        { label: 'Converted', value: totalConverted.toString() },
        { label: 'Conversion Rate', value: `${overallRate}%` },
        { label: 'Avg. Convert Time', value: `${avgConversionTime} days` }
      ];
  
      setConversionMetrics(metrics);
    }
  }, [inquiries, projects]);

  const totalRevenue = projects.reduce((sum, project) => sum + project.totalPrice, 0);
  
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/20'
    },
    // Only show clients stat if user has permission
    ...(hasClientsPermission ? [{
      title: 'Total Clients',
      value: clients.length,
      icon: Users,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/20'
    }] : []),
    {
      title: 'Active Projects',
      value: projects.filter(p => p.status === 'approved').length,
      icon: FolderKanban,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/20'
    },
    {
      title: 'Upcoming Meetings',
      value: upcomingMeetings.length,
      icon: Calendar,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/20'
    }
  ];

  if (projectsLoading || clientsLoading) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Conversion Rate Chart */}
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <SearchCode className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl font-semibold">Lead Conversion</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="source" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70">
                  <Label
                    value="Conversion Rate (%)"
                    angle={-90}
                    position="insideLeft"
                    style={{ fill: '#ffffff70' }}
                  />
                </YAxis>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000cc',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem'
                  }}
                  labelStyle={{ color: '#ffffff' }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Conversion Rate']}
                />
                <Bar dataKey="conversionRate" fill="#3CB371">
                  <LabelList dataKey="conversionRate" position="top" formatter={(value: number) => `${value.toFixed(1)}%`} fill="#ffffff70" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {conversionMetrics.map((metric) => (
              <div key={metric.label} className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-white/70">{metric.label}</p>
                <p className="text-lg font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Project Status Chart */}
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FolderKanban className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl font-semibold">Project Status</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000cc',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem'
                  }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="value" fill="#3CB371" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {projectMetrics.map((metric) => (
              <div key={metric.label} className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-white/70">{metric.label}</p>
                <p className="text-lg font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
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
        <div className="flex items-center gap-2 mb-6">
          <FolderKanban className="w-5 h-5 text-brand-primary" />
          <h2 className="text-xl font-semibold">Recent Projects</h2>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}