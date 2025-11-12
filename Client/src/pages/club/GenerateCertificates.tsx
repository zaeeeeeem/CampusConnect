import { useState, useEffect } from 'react';
import { eventService, certificateService } from '../../api/services';
import { Event } from '../../types';
import { LoadingSpinner, EmptyState } from '../../components/shared';
import { useAuth } from '../../context/AuthContext';

export const GenerateCertificates = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAll();
      if (response.success) {
        // Filter only club's past events
        const eventsData = Array.isArray(response.data) ? response.data : [];
        const clubEvents = eventsData.filter(
          e => e.clubId === user?.clubId && new Date(e.date) < new Date()
        );
        setEvents(clubEvents);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificates = async (eventId: string) => {
    if (!confirm('Generate certificates for all participants of this event?')) return;

    try {
      setGenerating(eventId);
      const response = await certificateService.generate(eventId);
      if (response.success) {
        alert('Certificates generated successfully!');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to generate certificates');
    } finally {
      setGenerating(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading events..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900">Generate Certificates</h1>
        <p className="text-gray-600 mt-1">Generate certificates for past events</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Certificates will be automatically generated for all participants who attended the event.
              Only past events are shown here.
            </p>
          </div>
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <EmptyState
          title="No past events found"
          description="Past events will appear here for certificate generation"
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
                  Participants
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
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
                    <div className="text-sm text-gray-900">
                      {event.participants?.length || 0} / {event.maxParticipants}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleGenerateCertificates(event.id)}
                      disabled={generating === event.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {generating === event.id ? 'Generating...' : 'Generate Certificates'}
                    </button>
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
