import { useState, useEffect } from 'react';
import { eventService } from '../../api/services';
import { Event } from '../../types';
import { EventCard, LoadingSpinner, EmptyState } from '../../components/shared';

export const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      // TODO: Implement API endpoint for user's registered events
      const response = await eventService.getAll();
      if (response.success) {
        // Filter for events user is registered for
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    const now = new Date();

    if (filter === 'upcoming') {
      return eventDate > now;
    } else {
      return eventDate <= now;
    }
  });

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your events..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
        <p className="text-gray-600">Events you've registered for</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setFilter('upcoming')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                filter === 'upcoming'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                filter === 'past'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past
            </button>
          </nav>
        </div>

        <div className="p-6">
          {filteredEvents.length === 0 ? (
            <EmptyState
              title={`No ${filter} events`}
              description={
                filter === 'upcoming'
                  ? 'You haven\'t registered for any upcoming events'
                  : 'No past events found'
              }
              action={
                filter === 'upcoming'
                  ? {
                      label: 'Browse Events',
                      onClick: () => (window.location.href = '/student/events'),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} registered={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
