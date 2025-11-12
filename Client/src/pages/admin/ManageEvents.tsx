import { useState, useEffect } from 'react';
import { eventService } from '../../api/services';
import { Event } from '../../types';
import { EventCard, LoadingSpinner, EmptyState } from '../../components/shared';

export const ManageEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, categoryFilter, timeFilter, events]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAll();
      if (response.success) {
        // Ensure data is an array
        const eventsData = Array.isArray(response.data) ? response.data : [];
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    const now = new Date();
    if (timeFilter === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.date) >= now);
    } else if (timeFilter === 'past') {
      filtered = filtered.filter(event => new Date(event.date) < now);
    }

    setFilteredEvents(filtered);
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete event "${eventTitle}"?`)) return;

    try {
      const response = await eventService.delete(eventId);
      if (response.success) {
        alert('Event deleted successfully!');
        loadEvents();
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete event');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading events..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
        <p className="text-gray-600 mt-1">{events.length} total events</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="competition">Competition</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="technical">Technical</option>
              <option value="social">Social</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as 'all' | 'upcoming' | 'past')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Try adjusting your filters"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative">
              <EventCard event={event} />
              <div className="mt-4">
                <button
                  onClick={() => handleDeleteEvent(event.id, event.title)}
                  className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
