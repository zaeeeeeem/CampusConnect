import { useState, useEffect } from 'react';
import { eventService, feedbackService } from '../../api/services';
import { Event } from '../../types';
import { LoadingSpinner, EmptyState, FeedbackStars } from '../../components/shared';

interface EventWithFeedback extends Event {
  feedbackCount?: number;
  averageRating?: number;
}

export const FeedbackOverview = () => {
  const [events, setEvents] = useState<EventWithFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEventsWithFeedback();
  }, []);

  const loadEventsWithFeedback = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAll();
      if (response.success) {
        // Ensure data is an array
        const eventsData = Array.isArray(response.data) ? response.data : [];

        // Filter only past events
        const pastEvents = eventsData.filter(e => new Date(e.date) < new Date());

        // Load feedback for each event
        const eventsWithFeedback = await Promise.all(
          pastEvents.map(async (event) => {
            try {
              const feedbackRes = await feedbackService.getByEventId(event.id);
              if (feedbackRes.success && feedbackRes.data) {
                return {
                  ...event,
                  feedbackCount: feedbackRes.data.count || 0,
                  averageRating: feedbackRes.data.averageRating || 0,
                };
              }
            } catch (error) {
              console.error(`Failed to load feedback for event ${event.id}:`, error);
            }
            return {
              ...event,
              feedbackCount: 0,
              averageRating: 0,
            };
          })
        );

        setEvents(eventsWithFeedback);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(
    event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading feedback..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900">Feedback Overview</h1>
        <p className="text-gray-600 mt-1">View feedback from all events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Events</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{events.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Feedback</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {events.reduce((sum, e) => sum + (e.feedbackCount || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {events.length > 0
                  ? (events.reduce((sum, e) => sum + (e.averageRating || 0), 0) / events.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search events..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No feedback found"
          description="Past events with feedback will appear here"
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.feedbackCount || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FeedbackStars rating={event.averageRating || 0} readonly />
                      <span className="ml-2 text-sm text-gray-600">
                        {(event.averageRating || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
