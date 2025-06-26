import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import eventService from "@/services/api/eventService";
import ApperIcon from "@/components/ApperIcon";
import EmptyState from "@/components/molecules/EmptyState";
import SearchFilter from "@/components/molecules/SearchFilter";
import StatusBadge from "@/components/molecules/StatusBadge";
import ErrorState from "@/components/molecules/ErrorState";
import LoadingCard from "@/components/molecules/LoadingCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

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
      className="space-y-4 sm:space-y-6 max-w-full"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">Events</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your catering events and bookings</p>
        </div>
<div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              icon="List"
              onClick={() => setViewMode('list')}
              className="flex-1 xs:flex-none justify-center min-h-[40px]"
            >
              <span className="hidden xs:inline">List</span>
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'ghost'}
              size="sm"
              icon="Calendar"
              onClick={() => setViewMode('calendar')}
              className="flex-1 xs:flex-none justify-center min-h-[40px]"
            >
              <span className="hidden xs:inline">Calendar</span>
            </Button>
          </div>
<Button icon="Plus" className="min-h-[44px]">
            <span className="hidden xs:inline">New Event</span>
            <span className="xs:hidden">New</span>
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
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                        <ApperIcon name="Calendar" size={20} className="text-primary sm:w-6 sm:h-6" />
                      </div>
                      
<div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {event.title}
                          </h3>
                          <StatusBadge status={event.status} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
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
                  
<div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
<Button variant="ghost" size="sm" icon="Edit" className="min-h-[40px] w-10 p-0 sm:w-auto sm:px-3" />
                    <Button variant="ghost" size="sm" icon="FileText" className="min-h-[40px] w-10 p-0 sm:w-auto sm:px-3" />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon="Trash2"
                      onClick={() => handleDeleteEvent(event.Id)}
                      className="min-h-[40px] w-10 p-0 sm:w-auto sm:px-3"
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