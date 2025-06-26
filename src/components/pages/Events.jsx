import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import StatusBadge from '@/components/molecules/StatusBadge';
import SearchFilter from '@/components/molecules/SearchFilter';
import LoadingCard from '@/components/molecules/LoadingCard';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import eventService from '@/services/api/eventService';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  const statusFilters = [
    { label: 'Planning', value: 'planning' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, activeFilters]);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await eventService.getAll();
      setEvents(result.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message || 'Failed to load events');
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.notes?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (activeFilters.length > 0) {
      filtered = filtered.filter(event => activeFilters.includes(event.status));
    }

    setFilteredEvents(filtered);
  };

  const handleFilterChange = (filterValue) => {
    setActiveFilters(prev =>
      prev.includes(filterValue)
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
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

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventService.delete(eventId);
      setEvents(events.filter(event => event.Id !== eventId));
      toast.success('Event deleted successfully');
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 max-w-full"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold text-gray-900">Events</h1>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingCard key={i} lines={4} />
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 max-w-full"
      >
        <h1 className="text-3xl font-heading font-bold text-gray-900">Events</h1>
        <ErrorState message={error} onRetry={loadEvents} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Manage your catering events and bookings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              icon="List"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'ghost'}
              size="sm"
              icon="Calendar"
              onClick={() => setViewMode('calendar')}
            >
              Calendar
            </Button>
          </div>
          
          <Button icon="Plus">
            New Event
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={statusFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        placeholder="Search events by title, location, or notes..."
      />

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon="Calendar"
          title={searchTerm || activeFilters.length > 0 ? "No events found" : "No events yet"}
          description={
            searchTerm || activeFilters.length > 0
              ? "Try adjusting your search or filters"
              : "Get started by creating your first event"
          }
          actionLabel={searchTerm || activeFilters.length > 0 ? undefined : "Create Event"}
          onAction={() => console.log('Navigate to create event')}
        />
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                        <ApperIcon name="Calendar" size={24} className="text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {event.title}
                          </h3>
                          <StatusBadge status={event.status} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Clock" size={16} />
                            <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ApperIcon name="MapPin" size={16} />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Users" size={16} />
                            <span>{event.guestCount} guests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ApperIcon name="DollarSign" size={16} />
                            <span>${event.totalCost?.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {event.notes && (
                          <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                            {event.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <Button variant="ghost" size="sm" icon="Edit" />
                    <Button variant="ghost" size="sm" icon="FileText" />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon="Trash2"
                      onClick={() => handleDeleteEvent(event.Id)}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Events;