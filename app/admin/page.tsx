"use client";
import { useEffect, useState } from "react";
import { CalendarDays, FolderKanban, Image as ImageIcon, Mail } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    projects: 0,
    gallery: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, projectsRes, galleryRes, messagesRes] = await Promise.all([
          fetch("/api/admin/events"),
          fetch("/api/admin/projects"),
          fetch("/api/admin/gallery"),
          fetch("/api/admin/messages"),
        ]);
        
        const events = await eventsRes.json();
        const projects = await projectsRes.json();
        const gallery = await galleryRes.json();
        const messages = await messagesRes.json();

        setStats({
          events: events.data?.length || 0,
          projects: projects.data?.length || 0,
          gallery: gallery.data?.length || 0,
          messages: messages.data?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-navy mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Upcoming Events" value={stats.events} icon={<CalendarDays size={24} />} color="bg-blue-100 text-blue-600" loading={loading} />
        <StatCard title="Projects & Activities" value={stats.projects} icon={<FolderKanban size={24} />} color="bg-green-100 text-green-600" loading={loading} />
        <StatCard title="Gallery Images" value={stats.gallery} icon={<ImageIcon size={24} />} color="bg-purple-100 text-purple-600" loading={loading} />
        <StatCard title="Messages & Queries" value={stats.messages} icon={<Mail size={24} />} color="bg-orange-100 text-orange-600" loading={loading} />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, loading }: { title: string, value: number, icon: React.ReactNode, color: string, loading: boolean }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4">
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-navy mt-1">
          {loading ? "..." : value}
        </p>
      </div>
    </div>
  );
}
