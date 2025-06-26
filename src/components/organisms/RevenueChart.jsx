import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import Card from '@/components/atoms/Card';
import LoadingCard from '@/components/molecules/LoadingCard';
import invoiceService from '@/services/api/invoiceService';

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const invoices = await invoiceService.getAll();
      
      // Group invoices by month
      const monthlyRevenue = {};
      invoices.forEach(invoice => {
        const month = new Date(invoice.dateIssued).toLocaleString('default', { 
          month: 'short', 
          year: 'numeric' 
        });
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + invoice.total;
      });

      const categories = Object.keys(monthlyRevenue).sort();
      const data = categories.map(month => monthlyRevenue[month]);

      setChartData({
        series: [{
          name: 'Revenue',
          data: data
        }],
        options: {
          chart: {
            type: 'area',
            height: 300,
            toolbar: { show: false },
            sparkline: { enabled: false }
          },
          colors: ['#2E7D6B'],
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.1,
              stops: [0, 100]
            }
          },
          dataLabels: { enabled: false },
          stroke: {
            curve: 'smooth',
            width: 3
          },
          xaxis: {
            categories: categories,
            labels: {
              style: {
                colors: '#64748b',
                fontSize: '12px'
              }
            }
          },
          yaxis: {
            labels: {
              formatter: (value) => `$${value.toLocaleString()}`,
              style: {
                colors: '#64748b',
                fontSize: '12px'
              }
            }
          },
          tooltip: {
            y: {
              formatter: (value) => `$${value.toLocaleString()}`
            }
          },
          grid: {
            borderColor: '#e2e8f0',
            strokeDashArray: 4
          }
        }
      });
    } catch (error) {
      console.error('Failed to load chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingCard lines={8} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-gray-900">Revenue Overview</h3>
          <p className="text-sm text-gray-600 mt-1">Monthly revenue trends</p>
        </div>
        
        {chartData && (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={300}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default RevenueChart;