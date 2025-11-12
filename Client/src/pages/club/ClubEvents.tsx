import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../api/services';
import { Event } from '../../types';
import { EventCard, LoadingSpinner, EmptyState } from '../../components/shared';

export const ClubEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, timeFilter, events]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAll();
      if (response.success) {
        // Filter only club's events
        const eventsData = Array.isArray(response.data) ? response.data : [];
        const clubEvents = eventsData.filter(e => e.clubId === user?.clubId);
        setEvents(clubEvents);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Time filter
    const now = new Date();
    if (timeFilter === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.date) >= now);
    } else if (timeFilter === 'past') {
      filtered = filtered.filter(event => new Date(event.date) < now);
    }

    setFilteredEvents(filtered);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Club Events</h1>
            <p className="text-gray-600 mt-1">{events.length} total events</p>
          </div>
          <Link
            to="/club/events/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Event
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
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
          description={
            events.length === 0
              ? "Create your first event to get started"
              : "Try adjusting your filters"
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative">
              <EventCard event={event} />
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/club/events/edit/${event.id}`}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-center text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </Link>
                <Link
                  to={`/club/events/${event.id}/participants`}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-center text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Participants
                </Link>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
