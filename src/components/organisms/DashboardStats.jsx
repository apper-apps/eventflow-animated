import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import invoiceService from "@/services/api/invoiceService";
import eventService from "@/services/api/eventService";
import LoadingCard from "@/components/molecules/LoadingCard";
import StatCard from "@/components/molecules/StatCard";
const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [events, invoices] = await Promise.all([
          eventService.getAll(),
          invoiceService.getAll()
        ]);

        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const upcomingEvents = events.filter(e => 
          new Date(e.date) >= new Date() && e.status !== 'cancelled'
        ).length;
        const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
        const completedEvents = events.filter(e => e.status === 'completed').length;

        setStats({
          totalRevenue,
          upcomingEvents,
          pendingInvoices,
          completedEvents
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);
if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingCard key={i} lines={2} />
        ))}
      </div>
    );
  }

const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      icon: 'DollarSign',
      color: 'success',
      change: '+12.5% from last month',
      changeType: 'positive'
    },
{
      title: 'Upcoming Events',
      value: stats?.upcomingEvents || 0,
      icon: 'Calendar',
      color: 'primary',
      change: `${(stats?.upcomingEvents || 0) > 5 ? 'High' : 'Normal'} activity`,
      changeType: (stats?.upcomingEvents || 0) > 5 ? 'positive' : 'neutral'
    },
    {
      title: 'Pending Invoices',
      value: stats?.pendingInvoices || 0,
      icon: 'FileText',
      color: 'warning',
      change: (stats?.pendingInvoices || 0) > 0 ? 'Requires attention' : 'All clear',
      changeType: (stats?.pendingInvoices || 0) > 0 ? 'negative' : 'positive'
    },
    {
      title: 'Completed Events',
      value: stats?.completedEvents || 0,
      icon: 'CheckCircle',
      color: 'accent',
      change: '+8 this month',
      changeType: 'positive'
    }
];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;