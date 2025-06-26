import Badge from '@/components/atoms/Badge';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    planning: { variant: 'warning', label: 'Planning' },
    confirmed: { variant: 'success', label: 'Confirmed' },
    pending: { variant: 'accent', label: 'Pending' },
    completed: { variant: 'primary', label: 'Completed' },
    cancelled: { variant: 'error', label: 'Cancelled' },
    paid: { variant: 'success', label: 'Paid' },
    overdue: { variant: 'error', label: 'Overdue' },
    draft: { variant: 'default', label: 'Draft' }
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;