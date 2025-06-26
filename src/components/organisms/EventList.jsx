import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/molecules/StatusBadge';
import LoadingCard from '@/components/molecules/LoadingCard';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import eventService from '@/services/api/eventService';

const EventList = ({ title = "Recent Events", limit, showActions = true }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      let result = await eventService.getAll();
      
      // Sort by date (newest first) and limit if specified
      result = result
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit || result.length);
      
      setEvents(result);
    } catch (err) {
      setError(err.message || 'Failed to load events');
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await eventService.update(eventId, { status: newStatus });
      setEvents(events.map(event => 
        event.Id === eventId ? { ...event, status: newStatus } : event
      ));
      toast.success('Event status updated');
    } catch (err) {
      toast.error('Failed to update event status');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold text-gray-900">{title}</h2>
        <div className="space-y-4">
          {Array.from({ length: limit || 3 }).map((_, i) => (
            <LoadingCard key={i} lines={3} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold text-gray-900">{title}</h2>
        <ErrorState message={error} onRetry={loadEvents} />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold text-gray-900">{title}</h2>
        <EmptyState
          icon="Calendar"
          title="No events found"
          description="Get started by creating your first event"
          actionLabel="Create Event"
          onAction={() => console.log('Navigate to create event')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-gray-900">{title}</h2>
        {limit && events.length > 0 && (
          <Button variant="ghost" size="sm" icon="ArrowRight">
            View All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {events.map((event, index) => (
            <motion.div
              key={event.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Calendar" size={20} className="text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Clock" size={14} />
                            {format(new Date(event.date), 'MMM dd, yyyy • h:mm a')}
                          </div>
                          <div className="flex items-center gap-1">
                            <ApperIcon name="MapPin" size={14} />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Users" size={14} />
                            {event.guestCount} guests
                          </div>
                        </div>
                        
                        {event.notes && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <StatusBadge status={event.status} />
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${event.totalCost?.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Total</p>
                    </div>
                    
                    {showActions && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" icon="Edit" />
                        <Button variant="ghost" size="sm" icon="MoreVertical" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventList;