import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const QuickActions = () => {
  const actions = [
    {
      label: 'New Event',
      icon: 'Plus',
      color: 'primary',
      onClick: () => console.log('Create new event')
    },
    {
      label: 'View Calendar',
      icon: 'Calendar',
      color: 'accent',
      onClick: () => console.log('View calendar')
    },
    {
      label: 'Generate Invoice',
      icon: 'FileText',
      color: 'secondary',
      onClick: () => console.log('Generate invoice')
    },
    {
      label: 'View Reports',
      icon: 'BarChart3',
      color: 'success',
      onClick: () => console.log('View reports')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
<h3 className="text-base sm:text-lg font-heading font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
        
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
<Button
                variant={action.color}
                icon={action.icon}
                onClick={action.onClick}
                className="w-full justify-center sm:justify-start min-h-[48px]"
              >
                {action.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default QuickActions;