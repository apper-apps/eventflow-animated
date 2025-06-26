import { motion } from 'framer-motion';
import DashboardStats from '@/components/organisms/DashboardStats';
import EventList from '@/components/organisms/EventList';
import RevenueChart from '@/components/organisms/RevenueChart';
import QuickActions from '@/components/organisms/QuickActions';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-full"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Welcome back! Here's what's happening with your events.</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
{/* Left Column - Recent Events */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          <EventList 
            title="Upcoming Events" 
            limit={4} 
            showActions={false}
          />
          <RevenueChart />
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <QuickActions />
          
          {/* Recent Activity */}
<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-card shadow-card p-4 sm:p-6"
          >
            <h3 className="text-base sm:text-lg font-heading font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New event created', time: '2 hours ago', type: 'event' },
                { action: 'Invoice INV-2024-003 sent', time: '4 hours ago', type: 'invoice' },
                { action: 'Menu item updated', time: '1 day ago', type: 'menu' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;