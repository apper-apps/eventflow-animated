import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subMonths } from 'date-fns';
import Chart from 'react-apexcharts';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import LoadingCard from '@/components/molecules/LoadingCard';
import ApperIcon from '@/components/ApperIcon';
import eventService from '@/services/api/eventService';
import invoiceService from '@/services/api/invoiceService';
import menuItemService from '@/services/api/menuItemService';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('6months');

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const [events, invoices, menuItems] = await Promise.all([
        eventService.getAll(),
        invoiceService.getAll(),
        menuItemService.getAll()
      ]);

      // Calculate date range
      const now = new Date();
      const monthsBack = dateRange === '6months' ? 6 : dateRange === '12months' ? 12 : 3;
      const startDate = subMonths(now, monthsBack);

      // Filter data by date range
const filteredInvoices = invoices.filter(inv =>
new Date(inv.date_issued) >= startDate
      );
      const filteredEvents = events.filter(event => 
        new Date(event.date) >= startDate
      );

      // Revenue by month
      const monthlyRevenue = {};
      filteredInvoices.forEach(invoice => {
const month = format(new Date(invoice.date_issued), 'MMM yyyy');
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + invoice.total;
      });

      // Events by status
      const eventsByStatus = {};
      filteredEvents.forEach(event => {
        eventsByStatus[event.status] = (eventsByStatus[event.status] || 0) + 1;
      });

      // Popular menu items
      const itemPopularity = {};
      filteredEvents.forEach(event => {
if (event.menu_items && Array.isArray(event.menu_items)) {
          event.menu_items.forEach(itemId => {
            const item = menuItems.find(m => m.Id === itemId);
            if (item) {
              itemPopularity[item.Name] = (itemPopularity[item.Name] || 0) + 1;
            }
          });
        }
      });

      const popularItems = Object.entries(itemPopularity)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

      setData({
        monthlyRevenue,
        eventsByStatus,
        popularItems,
        totalRevenue: filteredInvoices.reduce((sum, inv) => sum + inv.total, 0),
        totalEvents: filteredEvents.length,
        averageEventValue: filteredEvents.length > 0 ? 
          filteredInvoices.reduce((sum, inv) => sum + inv.total, 0) / filteredEvents.length : 0
      });
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#2E7D6B'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data ? Object.keys(data.monthlyRevenue) : [],
      labels: {
        style: { colors: '#64748b', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toLocaleString()}`,
        style: { colors: '#64748b', fontSize: '12px' }
      }
    },
    tooltip: {
      y: { formatter: (value) => `$${value.toLocaleString()}` }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    }
  };

  const statusChartOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    colors: ['#2E7D6B', '#F5A623', '#4A90E2', '#27AE60', '#E74C3C'],
    labels: data ? Object.keys(data.eventsByStatus) : [],
    legend: {
      position: 'bottom',
      labels: { colors: '#64748b' }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Events',
              formatter: () => data ? data.totalEvents : 0
            }
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 max-w-full"
      >
        <h1 className="text-3xl font-heading font-bold text-gray-900">Reports</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingCard key={i} lines={8} />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6 max-w-full"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">Reports</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Analytics and insights for your catering business</p>
        </div>
<div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          
          <Button variant="outline" icon="Download" className="min-h-[44px]">
            <span className="hidden xs:inline">Export Report</span>
            <span className="xs:hidden">Export</span>
          </Button>
        </div>
      </div>

{/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {[
          {
            label: 'Total Revenue',
            value: `$${data?.totalRevenue.toLocaleString()}`,
            icon: 'TrendingUp',
            color: 'success',
            change: '+12.5% vs previous period'
          },
          {
            label: 'Total Events',
            value: data?.totalEvents,
            icon: 'Calendar',
            color: 'primary',
            change: `${data?.totalEvents > 20 ? 'High' : 'Normal'} activity`
          },
          {
            label: 'Avg Event Value',
            value: `$${data?.averageEventValue.toFixed(0)}`,
            icon: 'DollarSign',
            color: 'accent',
            change: '+8.2% vs previous period'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <p className="text-sm text-gray-500 mt-2">{metric.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  metric.color === 'success' ? 'bg-success/10 text-success' :
                  metric.color === 'primary' ? 'bg-primary/10 text-primary' :
                  'bg-accent/10 text-accent'
                }`}>
                  <ApperIcon name={metric.icon} size={24} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

{/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
<Card className="overflow-hidden">
            <h3 className="text-base sm:text-lg font-heading font-semibold text-gray-900 mb-4 sm:mb-6">
              Monthly Revenue
            </h3>
            {data && (
              <Chart
                options={revenueChartOptions}
                series={[{ name: 'Revenue', data: Object.values(data.monthlyRevenue) }]}
                type="bar"
                height={350}
              />
            )}
          </Card>
        </motion.div>

        {/* Events by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
<Card className="overflow-hidden">
            <h3 className="text-base sm:text-lg font-heading font-semibold text-gray-900 mb-4 sm:mb-6">
              Events by Status
            </h3>
            {data && (
              <Chart
                options={statusChartOptions}
                series={Object.values(data.eventsByStatus)}
                type="donut"
                height={300}
              />
            )}
          </Card>
        </motion.div>
      </div>

      {/* Popular Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
<div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-heading font-semibold text-gray-900">
              Popular Menu Items
            </h3>
            <Button variant="ghost" size="sm" icon="MoreHorizontal" />
          </div>
          
          <div className="space-y-4">
            {data?.popularItems.map(([itemName, count], index) => (
              <motion.div
                key={itemName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg"
>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-primary">#{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{itemName}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <span className="text-xs sm:text-sm text-gray-600 hidden xs:inline">{count} orders</span>
                  <span className="text-xs text-gray-600 xs:hidden">{count}</span>
<div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${(count / Math.max(...data.popularItems.map(([,c]) => c))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Reports;