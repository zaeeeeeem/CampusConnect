import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, feedbackService } from '../../api/services';
import { Event, Feedback } from '../../types';
import { LoadingSpinner, FeedbackStars, Modal } from '../../components/shared';

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  useEffect(() => {
    if (id) {
      loadEventDetails();
    }
  }, [id]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const [eventRes, feedbackRes] = await Promise.all([
        eventService.getById(id!),
        feedbackService.getByEventId(id!),
      ]);

      if (eventRes.success) {
        setEvent(eventRes.data);
        // TODO: Check if user is registered
      }

      if (feedbackRes.success && feedbackRes.data.feedbacks) {
        setFeedback(feedbackRes.data.feedbacks);
      }
    } catch (error) {
      console.error('Failed to load event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await eventService.register(id!);
      if (response.success) {
        alert('Successfully registered!');
        setIsRegistered(true);
        loadEventDetails();
      }
    } catch (error: any) {
      alert(error.message || 'Registration failed');
    }
  };

  const handleSubmitFeedback = async () => {
    if (feedbackRating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const response = await feedbackService.submit(id!, {
        rating: feedbackRating,
        comment: feedbackComment,
      });

      if (response.success) {
        alert('Feedback submitted successfully!');
        setShowFeedbackModal(false);
        setFeedbackRating(0);
        setFeedbackComment('');
        loadEventDetails();
      }
    } catch (error: any) {
      alert(error.message || 'Failed to submit feedback');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
        <button
          onClick={() => navigate('/student/events')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Events
        </button>
      </div>
    );
  }

  const eventPassed = new Date(event.endDate) < new Date();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/events')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Events
      </button>

      {/* Event Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {event.imageUrl && (
          <div className="h-64 md:h-96 overflow-hidden">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${event.category === 'academic' ? 'blue' : event.category === 'sports' ? 'green' : 'purple'}-100 text-${event.category === 'academic' ? 'blue' : event.category === 'sports' ? 'green' : 'purple'}-800`}>
                  {event.category}
                </span>
                {isRegistered && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    Registered
                  </span>
                )}
              </div>
            </div>

            {!eventPassed && !isRegistered && (
              <button
                onClick={handleRegister}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Register Now
              </button>
            )}

            {eventPassed && isRegistered && (
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Give Feedback
              </button>
            )}
          </div>

          <p className="text-gray-700 text-lg mb-6">{event.description}</p>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(event.startDate).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(event.endDate).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="font-semibold text-gray-900">
                  {event.attendees?.length || 0}
                  {event.maxAttendees && ` / ${event.maxAttendees}`}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Section */}
      {feedback.length > 0 && (
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Feedback</h2>
          <div className="space-y-4">
            {feedback.map((fb) => (
              <div key={fb.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{fb.userName}</p>
                    <FeedbackStars rating={fb.rating} readonly size="sm" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-700">{fb.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="Submit Feedback"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitFeedback}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <FeedbackStars rating={feedbackRating} onRate={setFeedbackRating} size="lg" />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              id="comment"
              rows={4}
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Share your experience..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
