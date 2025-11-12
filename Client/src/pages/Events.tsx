import { useEffect, useState } from 'react';
import { Card, Badge, Button } from '../components/ui';
import { Event } from '../types';
import { api } from '../api/api';

export const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'upcoming' | 'all'>('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const response = view === 'upcoming'
        ? await api.events.getUpcoming()
        : await api.events.getAll();
      if (response.success) {
        setEvents(response.data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, [view]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
      academic: 'primary',
      sports: 'success',
      cultural: 'warning',
      technical: 'info',
      social: 'primary',
    };
    return colors[category] || 'primary';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRSVP = async (eventId: string) => {
    const response = await api.events.rsvp(eventId, '1');
    if (response.success) {
      alert('RSVP successful!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <Button>Create Event</Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={view === 'upcoming' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setView('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          variant={view === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setView('all')}
        >
          All Events
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <Card key={event.id} padding="none" className="overflow-hidden hover:shadow-xl transition-shadow">
            {event.imageUrl && (
              <div className="h-48 bg-gray-200">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {event.title}
                </h3>
                <Badge variant={getCategoryColor(event.category)}>
                  {event.category}
                </Badge>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(event.startDate)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>

                {event.maxAttendees && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{event.attendees.length} / {event.maxAttendees} attendees</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleRSVP(event.id)}
                >
                  RSVP
                </Button>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
