import { useState } from 'react';
import { notificationService } from '../../api/services';

export const ClubNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'members',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await notificationService.create({
        title: formData.title,
        message: formData.message,
        type: formData.type as 'info' | 'success' | 'warning' | 'error',
      });

      if (response.success) {
        alert('Notification sent successfully!');
        setFormData({
          title: '',
          message: '',
          type: 'info',
          targetAudience: 'members',
        });
      }
    } catch (error: any) {
      alert(error.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900">Send Notification</h1>
        <p className="text-gray-600 mt-1">Notify club members about important updates</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter notification title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter notification message..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience *
              </label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="members">Club Members</option>
                <option value="all">All Students</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
            <div className={`p-4 rounded-lg ${
              formData.type === 'info' ? 'bg-blue-50 border border-blue-200' :
              formData.type === 'success' ? 'bg-green-50 border border-green-200' :
              formData.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className={`h-5 w-5 ${
                    formData.type === 'info' ? 'text-blue-400' :
                    formData.type === 'success' ? 'text-green-400' :
                    formData.type === 'warning' ? 'text-yellow-400' :
                    'text-red-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {formData.type === 'success' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : formData.type === 'error' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : formData.type === 'warning' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-medium ${
                    formData.type === 'info' ? 'text-blue-800' :
                    formData.type === 'success' ? 'text-green-800' :
                    formData.type === 'warning' ? 'text-yellow-800' :
                    'text-red-800'
                  }`}>
                    {formData.title || 'Notification Title'}
                  </h3>
                  <div className={`mt-2 text-sm ${
                    formData.type === 'info' ? 'text-blue-700' :
                    formData.type === 'success' ? 'text-green-700' :
                    formData.type === 'warning' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    <p>{formData.message || 'Your notification message will appear here...'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
            <button
              type="button"
              onClick={() => setFormData({
                title: '',
                message: '',
                type: 'info',
                targetAudience: 'members',
              })}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
